import prisma from "../prismaClient.js";

// GET /notifications/:userId
export const getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /notifications/mark-read/:userId
export const markAllNotificationsRead = async (req, res) => {
  const { userId } = req.params;
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
};
