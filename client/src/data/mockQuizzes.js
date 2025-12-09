export const mockQuizzes = [
  {
    id: "1",
    title: "JavaScript Basics",
    genre: "Programming",
    description: "Test your fundamentals of JS.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["Number", "String", "Boolean", "Character"],
        correctAnswer: "Character",
      },
      {
        id: "q2",
        type: "truefalse",
        question: "JavaScript is a compiled language.",
        correctAnswer: "False",
      },
      {
        id: "q3",
        type: "text",
        question: "What does ES6 stand for?",
        correctAnswer: "ECMAScript 6",
      },
    ],
  },
  {
    id: "2",
    title: "General Knowledge",
    genre: "GK",
    description: "A quick GK quiz.",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "The capital of India is:",
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        correctAnswer: "New Delhi",
      },
    ],
  },
];
