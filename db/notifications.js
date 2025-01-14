import mongoose, { isObjectIdOrHexString } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    requestId: {
      type: Number,
      required: true,
      unique: true, // Ensure each requestId is stored only once
    },
    recipients: [
      {
        address: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true, // e.g., "Hospital", "Patient", "Admin"
        },
        notified: {
          type: Boolean,
          default: false, // Track whether notification has been sent
        },
      },
    ],
    requestingHospital: {
      type: String,
      required: true, // The hospital requesting access
    },
    message: {
      type: String,
      required: true, // The notification message to be sent
    },
    timestamp: {
      type: Date,
      default: Date.now, // Time of notification creation
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
