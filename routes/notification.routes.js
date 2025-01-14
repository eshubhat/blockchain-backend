import express from "express";
import {
  markAsNotified,
  getNotification,
} from "../controller/notification.controller.js";

const router = express.Router();

// router.post("/", createNotification);

router.put("/:requestId/:address", markAsNotified);

router.get("/:address", getNotification);

export default router;
