import mongoose from "mongoose";

const flashCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    starred: {
      type: Boolean,
      default: false,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    lastReviewed: {
      type: Date,
      default: null,
    },

    nextReview: {
      type: Date,
      default: null,
    },

    masteryLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FlashCard", flashCardSchema);