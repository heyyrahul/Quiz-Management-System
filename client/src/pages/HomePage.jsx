import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import QuizCard from "../components/QuizCard";
import { fetchQuizzes } from "../services/quizService";

const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchQuizzes();
        console.log("Fetched quizzes:", data); 
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
        setError("Could not load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const genres = Array.from(new Set(quizzes.map((q) => q.genre)));
  const filtered = genre ? quizzes.filter((q) => q.genre === genre) : quizzes;
  const total = filtered.length;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      {/* HERO SECTION – your existing nice UI */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
          <Chip
            label="Test Your Knowledge"
            size="small"
            sx={{
              bgcolor: "#e0f7f6",
              color: "#0f766e",
              borderRadius: 999,
              fontWeight: 500,
            }}
          />
        </Stack>

        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: 800, lineHeight: 1.1 }}
        >
          Master Any Subject with{" "}
          <Box component="span" sx={{ color: "#0fb8b0" }}>
            Interactive Quizzes
          </Box>
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mt: 2, maxWidth: 650, mx: "auto" }}
        >
          Challenge yourself with our curated collection of quizzes. Track your
          progress, learn from mistakes, and become an expert in your favorite
          topics.
        </Typography>
      </Box>

      {/* AVAILABLE QUIZZES */}
      <Box id="available-quizzes" sx={{ mt: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }} noWrap>
            Available Quizzes
          </Typography>

          <Typography variant="body2" color="text.secondary" noWrap>
            {total} {total === 1 ? "quiz" : "quizzes"} available
          </Typography>
        </Stack>

        {/* Genre filter */}
        <Box sx={{ maxWidth: 260, mb: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter by Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <MenuItem value="">
              <em>All genres</em>
            </MenuItem>
            {genres.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#f9fafb",
          }}
        >
          {loading ? (
            <Typography>Loading quizzes...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filtered.length === 0 ? (
            <Typography>No quizzes found.</Typography>
          ) : (
            filtered.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} mode="public" />
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
