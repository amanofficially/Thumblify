import Thumbnail from "../models/Thumbnail.js";
import User from "../models/User.js";
import { generateThumbnailUrl } from "../utils/imageGenerator.js";

// POST /api/thumbnails/generate  (protected)
export const generateThumbnail = async (req, res, next) => {
  try {
    const {
      title,
      style,
      aspect_ratio = "16:9",
      color_scheme = "vibrant",
      user_prompt = "",
    } = req.body;

    // Check user credits
    const user = await User.findById(req.user._id);
    if (user.credits <= 0) {
      return res.status(402).json({
        success: false,
        message: "Insufficient credits. Please upgrade your plan.",
      });
    }

    // Build prompt and fetch image from Pollinations server-side
    const { imageUrl, promptUsed } = await generateThumbnailUrl({
      title,
      style,
      colorScheme: color_scheme,
      aspectRatio: aspect_ratio,
      userPrompt: user_prompt,
    });

    // Deduct one credit
    user.credits -= 1;
    await user.save();

    // Persist the thumbnail record
    const thumbnail = await Thumbnail.create({
      userId: req.user._id,
      title,
      style,
      aspect_ratio,
      color_scheme,
      user_prompt,
      prompt_used: promptUsed,
      image_url: imageUrl,
      isGenerating: false,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Thumbnail generated successfully.",
      thumbnail,
      remainingCredits: user.credits,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/thumbnails  (protected) — paginated list for the logged-in user
export const getUserThumbnails = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const [thumbnails, total] = await Promise.all([
      Thumbnail.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Thumbnail.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      thumbnails,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/thumbnails/:id  (protected)
export const getThumbnailById = async (req, res, next) => {
  try {
    const thumbnail = await Thumbnail.findOne({
      _id: req.params.id,
      userId: req.user._id, // ownership check
    });

    if (!thumbnail) {
      return res
        .status(404)
        .json({ success: false, message: "Thumbnail not found." });
    }

    res.json({ success: true, thumbnail });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/thumbnails/:id  (protected)
export const deleteThumbnail = async (req, res, next) => {
  try {
    const thumbnail = await Thumbnail.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // ownership check
    });

    if (!thumbnail) {
      return res
        .status(404)
        .json({ success: false, message: "Thumbnail not found." });
    }

    res.json({ success: true, message: "Thumbnail deleted successfully." });
  } catch (error) {
    next(error);
  }
};
