const Quiz = require("../models/Quiz");

// Public: list quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("getQuizzes error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: get quiz by id
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    console.error("getQuizById error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: create quiz
const createQuiz = async (req, res) => {
  try {
    const { title, genre, description, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      genre,
      description,
      questions,
      createdBy: req.admin._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("createQuiz error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: update quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    console.error("updateQuiz error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted" });
  } catch (error) {
    console.error("deleteQuiz error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
  