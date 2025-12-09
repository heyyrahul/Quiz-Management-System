import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { fetchQuizById } from "../services/quizService";

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // answers: { [questionId]: "user answer" }
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizById(quizId);
        console.log("Quiz from API:", data);
        setQuiz(data);
      } catch (err) {
        console.error("Failed to load quiz", err);
        setError("Unable to load this quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) load();
  }, [quizId]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quiz) return;

    const pointsPerQuestion = 10;
    const totalQuestions = quiz.questions.length;
    const totalPoints = totalQuestions * pointsPerQuestion;

    let score = 0;

    const details = quiz.questions.map((q, index) => {
      const qid = q._id?.toString() || index.toString();

      const rawUserAnswer = answers[qid] || "";
      const userAnswer = rawUserAnswer.trim().toLowerCase();
      const correctAnswer = (q.correctAnswer || "").trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) score += pointsPerQuestion;

      return {
        questionId: qid,
        question: q.question,
        userAnswer: rawUserAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    // Navigate to results page with all data
    navigate("/results", {
      state: {
        quiz,
        score,
        total: totalPoints,
        resultDetails: details,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 6 }}>
        <Typography>Loading quiz...</Typography>
      </Box>
    );
  }

  if (error || !quiz) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 6 }}>
        <Typography color="error">{error || "Quiz not found."}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {quiz.title}
          </Typography>
          <Chip
            label={quiz.genre}
            size="small"
            sx={{ ml: 1, textTransform: "uppercase" }}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Answer all questions and submit to see your score.
        </Typography>
      </Box>

      {/* Questions */}
      <Box component="form" onSubmit={handleSubmit}>
        {quiz.questions.map((q, index) => {
          const qid = q._id?.toString() || index.toString();

          return (
            <Card
              key={qid}
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  {index + 1}. {q.question}
                </Typography>

                {/* MCQ */}
                {q.type === "mcq" && (
                  <RadioGroup
                    value={answers[qid] || ""}
                    onChange={(e) => handleChange(qid, e.target.value)}
                  >
                    {q.options.map((opt) => (
                      <FormControlLabel
                        key={opt}
                        value={opt}
                        control={<Radio />}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                )}

                {/* True / False */}
                {q.type === "truefalse" && (
                  <RadioGroup
                    value={answers[qid] || ""}
                    onChange={(e) => handleChange(qid, e.target.value)}
                  >
                    <FormControlLabel
                      value="True"
                      control={<Radio />}
                      label="True"
                    />
                    <FormControlLabel
                      value="False"
                      control={<Radio />}
                      label="False"
                    />
                  </RadioGroup>
                )}

                {/* Text answer */}
                {q.type === "text" && (
                  <TextField
                    fullWidth
                    placeholder="Type your answer"
                    value={answers[qid] || ""}
                    onChange={(e) => handleChange(qid, e.target.value)}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}

        <Stack direction="row" sx={{ mt: 2, mb: 4 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 4,
              backgroundImage: "linear-gradient(90deg, #0fb8b0, #14b8ff)",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(90deg, #0aa59e, #0ea5e9)",
              },
            }}
          >
            Submit Quiz
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default QuizPage;
