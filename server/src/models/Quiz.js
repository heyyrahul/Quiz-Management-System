const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["mcq", "truefalse", "text"],
      required: true,
    },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String, required: true },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);


module.exports = Quiz;
