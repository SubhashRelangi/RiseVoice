import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: {
    name: { type: String, default: 'Anonymous' },
    role: { type: String, default: 'User' },
  }
});

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
    resource_type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected", "Resloved"],
    default: "Pending",
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);
