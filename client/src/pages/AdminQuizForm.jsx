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
  CheckCircleOutline as SuccessIcon,
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
  
  // Validation State
  const [errors, setErrors] = useState({});

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

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!title.trim()) tempErrors.title = "Title is required.";
    if (!genre.trim()) tempErrors.genre = "Genre is required.";
    if (!description.trim()) tempErrors.description = "Description is required.";

    questions.forEach((q, index) => {
      // 1. Check Question Text
      if (!q.question.trim()) {
        tempErrors[`q_${index}_question`] = "Question text is required.";
      }

      // 2. Check Correct Answer existence
      if (!q.correctAnswer.trim()) {
        tempErrors[`q_${index}_correct`] = "Correct answer is required.";
      }

      // 3. Specific Logic per Type
      if (q.type === "mcq") {
        // Check empty options
        q.options.forEach((opt, optIndex) => {
          if (!opt.trim()) {
            tempErrors[`q_${index}_opt_${optIndex}`] = "Option cannot be empty.";
          }
        });

        // Check if Correct Answer matches one of the options (Case sensitive usually, but depends on your backend)
        if (
          q.correctAnswer.trim() &&
          !q.options.some((opt) => opt.trim() === q.correctAnswer.trim())
        ) {
          tempErrors[`q_${index}_correct`] = "Answer must match one of the options exactly.";
        }
      } 
      
      else if (q.type === "truefalse") {
        const val = q.correctAnswer.toLowerCase();
        if (val !== "true" && val !== "false") {
          tempErrors[`q_${index}_correct`] = "Answer must be 'True' or 'False'.";
        }
      }
    });

    setErrors(tempErrors);
    isValid = Object.keys(tempErrors).length === 0;
    return isValid;
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;


        const updatedQuestion = { ...q, [field]: value };


        if (field === "type") {
          if (value === "mcq") {

            updatedQuestion.options = ["", "", "", ""];
          } else {

            updatedQuestion.options = [];
          }

          updatedQuestion.correctAnswer = "";
        }

        return updatedQuestion;
      })
    );


    if (errors[`q_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`q_${index}_${field}`]: null }));
    }
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
    

    if (errors[`q_${qIndex}_opt_${optIndex}`]) {
      setErrors((prev) => ({ ...prev, [`q_${qIndex}_opt_${optIndex}`]: null }));
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
    // Note: In a real app, you might want to cleanup errors for the deleted index here, 
    // but re-validating on submit handles it.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Optional: Scroll to top if validation fails
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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


  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
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
              onChange={handleChange(setTitle, "title")}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Genre"
              fullWidth
              value={genre}
              onChange={handleChange(setGenre, "genre")}
              placeholder="e.g. Programming, GK, DSA"
              error={!!errors.genre}
              helperText={errors.genre}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={handleChange(setDescription, "description")}
              error={!!errors.description}
              helperText={errors.description}
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
              border: errors[`q_${index}_question`] || errors[`q_${index}_correct`] ? "1px solid #d32f2f" : "none"
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
                  error={!!errors[`q_${index}_question`]}
                  helperText={errors[`q_${index}_question`]}
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
                        error={!!errors[`q_${index}_opt_${optIndex}`]}
                        helperText={errors[`q_${index}_opt_${optIndex}`]}
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
                  error={!!errors[`q_${index}_correct`]}
                  helperText={errors[`q_${index}_correct`]}
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