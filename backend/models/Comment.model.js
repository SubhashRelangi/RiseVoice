import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  // You might want to add a userId here if you have user authentication
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);