import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Button,
  IconButton,
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from "@mui/material";
import {
  Settings,
  AssignmentOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  WarningAmberRounded as WarningIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes, deleteQuizApi } from "../services/quizService";

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const navigate = useNavigate();

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      // Simulate network delay (optional)
      // await new Promise(resolve => setTimeout(resolve, 800)); 
      const data = await fetchQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce(
    (sum, q) => sum + (q.questions?.length || 0),
    0
  );
  const totalPoints = totalQuestions * 10;

  // --- LOGOUT HANDLERS ---
  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- DELETE HANDLERS ---
  const initiateDelete = (id, title) => {
    setDeleteTarget({ id, title });
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteQuizApi(deleteTarget.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      handleCloseDelete();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/quizzes/${id}/edit`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafd", py: 4 }}>
      <Container maxWidth="lg">
        {/* --- HEADER --- */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{ mb: 5 }}
          spacing={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Paper
              elevation={0}
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: "#e0f7f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0fb8b0",
              }}
            >
              <Settings fontSize="medium" />
            </Paper>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                Admin Panel
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, edit, and manage your quizzes
              </Typography>
            </Box>
          </Stack>

          {/* Action Buttons Stack */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
              sx={{
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderColor: "#ef4444",
                color: "#ef4444",
                "&:hover": {
                  borderColor: "#dc2626",
                  bgcolor: "#fef2f2",
                },
              }}
            >
              Logout
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/quizzes/new")}
              sx={{
                borderRadius: 50,
                textTransform: "none",
                px: 4,
                py: 1.2,
                fontWeight: 700,
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                backgroundImage: "linear-gradient(90deg, #0fb8b0, #14b8ff)",
              }}
            >
              Create New Quiz
            </Button>
          </Stack>
        </Stack>

        {/* --- STATS SECTION --- */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {loading
            ? // Loading State
              [1, 2, 3].map((_, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "none",
                      border: "1px solid #f1f5f9",
                      height: "100%",
                    }}
                  >
                    <Skeleton variant="text" width="40%" height={60} sx={{ mb: 0 }} />
                    <Skeleton variant="text" width="70%" height={30} />
                  </Card>
                </Grid>
              ))
            : // Real Data
              [
                { label: "Total Quizzes", value: totalQuizzes },
                { label: "Total Questions", value: totalQuestions },
                { label: "Total Points", value: totalPoints },
              ].map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "none",
                      border: "1px solid #f1f5f9",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 800, mb: 1, color: "#334155" }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {/* --- QUIZ LIST --- */}
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
          Your Quizzes
        </Typography>

        {loading ? (
          // --- SKELETON LOADER FOR QUIZ LIST ---
          <Stack spacing={2}>
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  boxShadow: "none",
                  border: "1px solid #f1f5f9",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={3}
                >
                  <Skeleton variant="rounded" width={60} height={60} sx={{ borderRadius: 3 }} />
                  <Box sx={{ flexGrow: 1, width: "100%" }}>
                    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="20%" height={20} />
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", md: "auto" }, justifyContent: "flex-end" }}>
                    <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: 50 }} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        ) : quizzes.length === 0 ? (
          <Typography color="text.secondary">
            You haven’t created any quizzes yet.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {quizzes.map((quiz) => {
              const count = quiz.questions?.length || 0;
              const points = count * 10;

              return (
                <Card
                  key={quiz.id}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.02)",
                    border: "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 12px 24px rgba(0,0,0,0.05)",
                    },
                  }}
                  onClick={() => handleEdit(quiz.id)}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={3}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        width: 60,
                        height: 60,
                        flexShrink: 0,
                        borderRadius: 3,
                        bgcolor: "#e0f7f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0fb8b0",
                      }}
                    >
                      <AssignmentOutlined sx={{ fontSize: 28 }} />
                    </Paper>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {quiz.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {quiz.description || "No description provided"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: "#64748b" }}
                      >
                        {count} questions • {points} points
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        width: { xs: "100%", md: "auto" },
                        justifyContent: { xs: "flex-end", md: "flex-start" },
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon sx={{ fontSize: 18 }} />}
                        onClick={() => handleEdit(quiz.id)}
                        sx={{
                          borderRadius: 50,
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: "#e2e8f0",
                          color: "#3b82f6",
                          px: 3,
                          "&:hover": {
                            borderColor: "#3b82f6",
                            bgcolor: "rgba(59, 130, 246, 0.04)",
                          },
                        }}
                      >
                        Edit Quiz
                      </Button>

                      <IconButton
                        onClick={() => initiateDelete(quiz.id, quiz.title)}
                        sx={{
                          bgcolor: "#ffe4e6",
                          color: "#ef4444",
                          width: 42,
                          height: 42,
                          "&:hover": { bgcolor: "#fee2e2" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}

        {/* --- DELETE CONFIRMATION MODAL --- */}
        <Dialog
          open={!!deleteTarget}
          onClose={handleCloseDelete}
          PaperProps={{
            sx: { borderRadius: 4, padding: 1, maxWidth: 400 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: "#fee2e2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <WarningIcon sx={{ fontSize: 32, color: "#dc2626" }} />
            </Box>
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Delete Quiz?</DialogTitle>
          </Box>
          <DialogContent>
            <DialogContentText sx={{ textAlign: "center", color: "#64748b" }}>
              Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>?
              <br />
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
            <Button
              onClick={handleCloseDelete}
              variant="outlined"
              sx={{
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                color: "#64748b",
                borderColor: "#cbd5e1",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              disableElevation
              sx={{
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Delete Quiz
            </Button>
          </DialogActions>
        </Dialog>

        {/* --- LOGOUT CONFIRMATION MODAL --- */}
        <Dialog
          open={logoutOpen}
          onClose={handleLogoutClose}
          PaperProps={{
            sx: { borderRadius: 4, padding: 1, maxWidth: 400 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                bgcolor: "#fee2e2", // Light red bg
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <LogoutIcon sx={{ fontSize: 32, color: "#dc2626" }} />
            </Box>
            <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Log Out</DialogTitle>
          </Box>
          
          <DialogContent>
            <DialogContentText sx={{ textAlign: "center", color: "#64748b" }}>
              Are you sure you want to log out of the admin panel?
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
            <Button
              onClick={handleLogoutClose}
              variant="outlined"
              sx={{
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                color: "#64748b",
                borderColor: "#cbd5e1",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              variant="contained"
              color="error"
              disableElevation
              sx={{
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Yes, Logout
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default AdminDashboard;