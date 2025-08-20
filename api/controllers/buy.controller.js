// ✅ buy.controller.js

import prisma from "../prismaClient.js";

export const sendBuyRequest = async (req, res) => {
  const { postId, buyerId } = req.body;
  try {
    const existing = await prisma.buyRequest.findUnique({
      where: { postId_buyerId: { postId, buyerId } },
    });
    if (existing) return res.status(400).json({ error: "Already requested" });

    const request = await prisma.buyRequest.create({
      data: { postId, buyerId },
    });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send request" });
  }
};

export const getRequestsReceived = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const requests = await prisma.buyRequest.findMany({
      where: { post:{ userId: sellerId } },
      include: { buyer: true, post: true },
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};


// PATCH /buy-request/:id
export const updateBuyRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Get the request and include its postId
    const request = await prisma.buyRequest.findUnique({
      where: { id },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update the request status
    await prisma.buyRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "ACCEPTED") {
      // Mark the post as sold
      await prisma.post.update({
        where: { id: request.postId },
        data: { sold: true },
      });

      // Reject all other pending requests for the same post
      await prisma.buyRequest.updateMany({
        where: {
          postId: request.postId,
          id: { not: id },
          status: "AWAITED",
        },
        data: { status: "REJECTED" },
      });
    }

    res.status(200).json({ message: "Request updated", status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update request" });
  }
};



export const getBuyRequestStatus = async (req, res) => {
  const { postId, buyerId } = req.params;
  try {
    const request = await prisma.buyRequest.findUnique({
      where: { postId_buyerId: { postId, buyerId } },
    });
    if (!request) return res.status(404).json({ status: null });
    res.json({ status: request.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch request status" });
  }
};

export const cancelBuyRequest = async (req, res) => {
  const { postId, buyerId } = req.params;
  try {
    await prisma.buyRequest.delete({
      where: { postId_buyerId: { postId, buyerId } },
    });
    res.status(200).json({ message: "Request cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not cancel request" });
  }
};