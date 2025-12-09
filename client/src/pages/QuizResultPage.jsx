import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";

const QuizResultPage = () => {
  const { state } = useLocation();

  if (!state) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography>No result to display.</Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Box>
    );
  }

  const { quiz, score, total, resultDetails } = state;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {quiz.title} — Results
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Score: {score} / {total}
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Review Answers
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {resultDetails.map((d, index) => (
          <Card
            key={d.questionId}
            sx={{
              borderRadius: 3,
              boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {index + 1}. {d.question}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1 }}
                color={d.isCorrect ? "success.main" : "error.main"}
              >
                Your answer: {d.userAnswer || <em>(blank)</em>}{" "}
                {d.isCorrect ? "(Correct)" : "(Incorrect)"}
              </Typography>

              {!d.isCorrect && (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ mt: 0.5 }}
                >
                  Correct answer: {d.correctAnswer}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Button variant="outlined" component={Link} to="/">
        Back to Home
      </Button>
    </Box>
  );
};

export default QuizResultPage;
