import express from "express";
import {
  sendBuyRequest,
  getRequestsReceived,
  updateBuyRequest,
  getBuyRequestStatus,
  cancelBuyRequest,
} from "../controllers/buy.controller.js";
const router = express.Router();
router.post("/", sendBuyRequest);
router.get("/received/:sellerId", getRequestsReceived);
router.get("/status/:postId/:buyerId", getBuyRequestStatus);
router.patch("/:id", updateBuyRequest);
router.delete("/:postId/:buyerId", cancelBuyRequest);
export default router;