import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const problemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    unique: true,
    default: () => "PB-" + uuidv4().slice(0, 8),
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Road", "Water", "Electricity", "Waste", "Health", "Education", "Other"],
    required: true,
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  image: {
    url: String,
    public_id: String,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  assignedTo: { type: String, default: "Not Assigned" },
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);
