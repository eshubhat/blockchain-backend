import express from "express";
import { assert, ethers } from "ethers";
import mongoose from "mongoose";
import cors from "cors";
import { configDotenv } from "dotenv";
import Notification from "./db/notifications.js";
import notificationRoute from "./routes/notification.routes.js";
// import abi from "./MedicalBlockchain.json" assert { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const abi = require("./MedicalBlockchain.json");

configDotenv({ path: "./.env" });
const app = express();

app.use(express.json());
app.use(cors());
console.log("Hello");
console.log(process.env.WSS_SEPOLIA_RPC_URL);

const provider = new ethers.WebSocketProvider(process.env.WSS_SEPOLIA_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
// const contractABI = [
//   "event AccessRequested(uint256 indexed requestId, address indexed hospital, uint256 indexed recordId, address patient, address uploadingHospital)",
// ];

const contract = new ethers.Contract(contractAddress, abi.abi, provider);

contract.on(
  "AccessRequested",
  async (requestId, hospital, recordId, patient, uploadingHospital, event) => {
    console.log("New Access Request Detected!");
    console.log(`Request ID: ${requestId.toString()}`);
    console.log(`Hospital: ${hospital}`);
    console.log(`Record ID: ${recordId.toString()}`);
    console.log(`Patient: ${patient}`);
    console.log(`Uploading Hospital: ${uploadingHospital}`);

    // Handle the event as needed
    await handleAccessRequest({
      requestId: requestId.toString(),
      hospital,
      recordId: recordId.toString(),
      patient,
      uploadingHospital,
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    });
  }
);

async function handleAccessRequest({
  requestId,
  hospital,
  recordId,
  patient,
  uploadingHospital,
}) {
  try {
    // Prepare recipients
    const recipients = [
      { address: patient, role: "Patient", notified: false },
      { address: uploadingHospital, role: "Hospital", notified: false },
    ];

    // Create a new notification
    const newNotification = new Notification();
    newNotification.requestId = requestId;
    newNotification.recipients = recipients;
    newNotification.requestingHospital = hospital;
    newNotification.message = `Access request for record ID ${recordId} by hospital ${hospital}`;
    newNotification.timestamp = new Date();

    // Save notification to the database
    await newNotification.save();
    console.log("Notification saved successfully.");
  } catch (error) {
    console.error("Error saving notification:", error);
  }
}

app.use("/notifications", notificationRoute);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
