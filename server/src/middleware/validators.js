import { body, validationResult } from "express-validator";

// Middleware: halt request if validation errors exist
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth validators ──────────────────────────────────────────────────────────
export const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  validate,
];

export const loginValidation = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// ── Thumbnail validators ─────────────────────────────────────────────────────
export const thumbnailValidation = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title max 100 chars"),
  body("style")
    .isIn(["Bold & Graphic", "Tech/Futuristic", "Minimalist", "Photorealistic", "Illustrated"])
    .withMessage("Invalid style"),
  body("aspect_ratio").optional().isIn(["16:9", "1:1", "9:16"]).withMessage("Invalid aspect ratio"),
  body("color_scheme")
    .optional()
    .isIn(["vibrant", "sunset", "forest", "neon", "purple", "monochrome", "ocean", "pastel"])
    .withMessage("Invalid color scheme"),
  body("user_prompt").optional().isLength({ max: 500 }).withMessage("Prompt max 500 chars"),
  validate,
];
