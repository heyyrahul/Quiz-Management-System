require("dotenv").config();
const connectDB = require("../config/db");
const Quiz = require("../models/Quiz");
const AdminUser = require("../models/AdminUser");

const seedQuizzes = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "rahul@test.com";
    const admin = await AdminUser.findOne({ email: adminEmail });

    if (!admin) {
      console.log(
        `No admin found with email ${adminEmail}. Create admin first, then re-run.`
      );
      process.exit(1);
    }

    // Make sure we actually loaded a model:
    // console.log("Quiz typeof:", typeof Quiz); // should be 'function'

    const quizzes = [
      {
        title: "JavaScript Basics",
        genre: "Programming",
        description:
          "Test your knowledge of JavaScript basics including variables, data types, and functions.",
        createdBy: admin._id,
        questions: [
          {
            type: "mcq",
            question: "Which company created JavaScript?",
            options: ["Google", "Netscape", "Microsoft", "Mozilla"],
            correctAnswer: "Netscape",
          },
          {
            type: "truefalse",
            question: "JavaScript is the same as Java.",
            options: [],
            correctAnswer: "False",
          },
          {
            type: "text",
            question: "What does ES6 stand for?",
            options: [],
            correctAnswer: "ECMAScript 6",
          },
        ],
      },
      {
        title: "General Knowledge",
        genre: "GK",
        description: "A quick general knowledge quiz.",
        createdBy: admin._id,
        questions: [
          {
            type: "mcq",
            question: "What is the capital of France?",
            options: ["Berlin", "Paris", "Madrid", "Rome"],
            correctAnswer: "Paris",
          },
          {
            type: "mcq",
            question: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Venus"],
            correctAnswer: "Mars",
          },
          {
            type: "truefalse",
            question:
              "The Pacific Ocean is the largest ocean on Earth.",
            options: [],
            correctAnswer: "True",
          },
        ],
      },
    ];

    const created = await Quiz.insertMany(quizzes);

    console.log(`✅ Inserted ${created.length} quizzes.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding quizzes:", err);
    process.exit(1);
  }
};

seedQuizzes();
