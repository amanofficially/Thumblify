import { Router } from "express";
import {
  generateThumbnail,
  getUserThumbnails,
  getThumbnailById,
  deleteThumbnail,
} from "../controllers/thumbnailController.js";
import { protect } from "../middleware/auth.js";
import { thumbnailValidation } from "../middleware/validators.js";

const router = Router();

// All routes require authentication
router.use(protect);

router.post("/generate", thumbnailValidation, generateThumbnail);
router.get("/", getUserThumbnails);
router.get("/:id", getThumbnailById);
router.delete("/:id", deleteThumbnail);

export default router;
