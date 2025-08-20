import express from "express";
import {
  getNotifications,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.patch("/mark-read/:userId", markAllNotificationsRead);

export default router;
