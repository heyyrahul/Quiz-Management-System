import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { AssignmentOutlined, PlayArrow, Edit as EditIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const QuizCard = ({ quiz, mode = "public" }) => {
  const questionsCount = quiz.questions?.length || 0;
  const points = questionsCount * 10;
  const isPublic = mode === "public";


  const quizId = quiz.id || quiz._id;

  const primaryLabel = isPublic ? "Start Quiz" : "Edit Quiz";
  const primaryTo = isPublic
    ? `/quiz/${quizId}`
    : `/admin/quizzes/${quizId}/edit`;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
        bgcolor: "white",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ pb: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Paper
            elevation={0}
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "#e0f7f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AssignmentOutlined sx={{ fontSize: 24, color: "#0fb8b0" }} />
          </Paper>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {quiz.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {quiz.description}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, fontSize: 13.5 }}
            >
              {questionsCount} questions • {points} points
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 2.5 }}>
          <Button
            fullWidth
            component={Link}
            to={primaryTo}
            startIcon={isPublic ? <PlayArrow /> : <EditIcon />}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              py: 1.1,
              fontSize: 15,
              backgroundImage: isPublic
                ? "linear-gradient(90deg, #0fb8b0, #14b8ff)"
                : "none",
              bgcolor: isPublic ? undefined : "#f3f4f6",
            }}
          >
            {primaryLabel}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
