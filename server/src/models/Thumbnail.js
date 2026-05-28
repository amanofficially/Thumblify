import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    style: {
      type: String,
      enum: ["Bold & Graphic", "Tech/Futuristic", "Minimalist", "Photorealistic", "Illustrated"],
      required: true,
    },
    aspect_ratio: {
      type: String,
      enum: ["16:9", "1:1", "9:16"],
      default: "16:9",
    },
    color_scheme: {
      type: String,
      enum: ["vibrant", "sunset", "forest", "neon", "purple", "monochrome", "ocean", "pastel"],
      default: "vibrant",
    },
    user_prompt: {
      type: String,
      trim: true,
      maxlength: [500, "Prompt cannot exceed 500 characters"],
      default: "",
    },
    prompt_used: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
    },
    isGenerating: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "generating", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user queries sorted by date
thumbnailSchema.index({ userId: 1, createdAt: -1 });

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);
export default Thumbnail;
