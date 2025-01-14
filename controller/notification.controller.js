import mongoose from "mongoose";
import Notification from "../db/notifications.js";

export const markAsNotified = async (req, res) => {
  const { requestId, address } = req.params;
  console.log("Request received:", { requestId, address });
  const notification = await Notification.findOne({ requestId });
  if (!notification) throw new Error("Notification not found");

  const recipient = notification.recipients.find(
    (r) =>
      r.address.toLowerCase() === address.toLowerCase() && r.notified === false
  );

  if (recipient) {
    recipient.notified = true;
    await notification.save();
    res.status(200).json(`Notification marked as sent for ${address}`);
  } else {
    console.log("Recipient not found in notification");
  }
};

export const getNotification = async (req, res) => {
  const { address } = req.params;
  console.log("Request received:", { address });
  try {
    // Fetch notifications where the address is a recipient
    const notifications = await Notification.find({
      "recipients.address": { $regex: new RegExp(`^${address}$`, "i") },
    });

    console.log("Notifications fetched:", notifications);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
