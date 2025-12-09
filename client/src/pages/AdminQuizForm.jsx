import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Add, 
  Delete, 
  CheckCircleOutline as SuccessIcon 
} from "@mui/icons-material";
import {
  createQuizApi,
  updateQuizApi,
  fetchQuizById,
} from "../services/quizService";

const emptyQuestion = {
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
};

const AdminQuizForm = ({ mode = "create" }) => {
  const isEdit = mode === "edit";
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion]);
  const [loading, setLoading] = useState(isEdit);

  // State for Success Modal
  const [showSuccess, setShowSuccess] = useState(false);

  // Load existing quiz for edit
  useEffect(() => {
    const loadQuiz = async () => {
      if (!isEdit || !quizId) return;
      try {
        setLoading(true);
        const data = await fetchQuizById(quizId);
        setTitle(data.title || "");
        setGenre(data.genre || "");
        setDescription(data.description || "");
        setQuestions(
          data.questions && data.questions.length > 0
            ? data.questions.map((q) => ({
                type: q.type,
                question: q.question,
                options: q.type === "mcq" ? q.options : ["", "", "", ""],
                correctAnswer: q.correctAnswer,
              }))
            : [emptyQuestion]
        );
      } catch (err) {
        console.error("Failed to load quiz for edit", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [isEdit, quizId]);

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]: value,
              ...(field === "type" && value !== "mcq" ? { options: [] } : {}),
            }
          : q
      )
    );
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === optIndex ? value : opt)),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      genre,
      description,
      questions: questions.map((q) => ({
        type: q.type,
        question: q.question,
        options: q.type === "mcq" ? q.options : [],
        correctAnswer: q.correctAnswer,
      })),
    };

    try {
      if (isEdit) {
        await updateQuizApi(quizId, payload);
      } else {
        await createQuizApi(payload);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error("Save quiz failed", err);
      alert("Something went wrong while saving.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/admin");
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
        <Typography>Loading quiz...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 3, mb: 5 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isEdit ? "Edit Quiz" : "Create New Quiz"}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin")}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Cancel
        </Button>
      </Stack>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Quiz Details
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Genre"
              fullWidth
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Programming, GK, DSA"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Questions */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
        Questions ({questions.length})
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {questions.map((q, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Question {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeQuestion(index)}
                  disabled={questions.length === 1}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Question"
                  fullWidth
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                />

                <TextField
                  select
                  label="Type"
                  value={q.type}
                  onChange={(e) =>
                    handleQuestionChange(index, "type", e.target.value)
                  }
                  sx={{ maxWidth: 240 }}
                >
                  <MenuItem value="mcq">Multiple Choice</MenuItem>
                  <MenuItem value="truefalse">True / False</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </TextField>

                {/* Options for MCQ */}
                {q.type === "mcq" && (
                  <Stack spacing={1}>
                    {q.options.map((opt, optIndex) => (
                      <TextField
                        key={optIndex}
                        label={`Option ${optIndex + 1}`}
                        fullWidth
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                      />
                    ))}
                  </Stack>
                )}

                <TextField
                  label="Correct Answer"
                  fullWidth
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(index, "correctAnswer", e.target.value)
                  }
                  placeholder={
                    q.type === "truefalse"
                      ? "True or False"
                      : "Must exactly match one of the options for MCQ"
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addQuestion}
        sx={{ mb: 3, textTransform: "none", borderRadius: 999 }}
      >
        Add Question
      </Button>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            px: 4,
            backgroundImage: "linear-gradient(90deg, #0fb8b0, #14b8ff)",
          }}
        >
          {isEdit ? "Save Changes" : "Create Quiz"}
        </Button>
      </Box>

      {/* SUCCESS MODAL */}
      <Dialog
        open={showSuccess}
        onClose={handleCloseSuccess}
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 2,
            minWidth: 320,
            textAlign: "center",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: "#dcfce7", 
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SuccessIcon sx={{ fontSize: 32, color: "#16a34a" }} />
          </Box>
        </Box>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748b" }}>
            Quiz <strong>{isEdit ? "updated" : "created"}</strong> successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleCloseSuccess}
            variant="contained"
            sx={{
              borderRadius: 50,
              textTransform: "none",
              px: 4,
              backgroundImage: "linear-gradient(90deg, #0fb8b0, #14b8ff)",
            }}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminQuizForm;