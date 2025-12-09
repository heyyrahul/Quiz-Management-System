const express = require("express");
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getQuizzes);
router.get("/:id", getQuizById);

// Admin (protected)
router.post("/", protect, createQuiz);
router.put("/:id", protect, updateQuiz);
router.delete("/:id", protect, deleteQuiz);

module.exports = router;
 