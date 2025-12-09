import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginAdminApi } from "../services/authService";
import { saveAuthToken } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginAdminApi(email, password);
      saveAuthToken(data.token);
      navigate("/admin");
    } catch (err) {
      console.error("Login error", err);
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", pt: 10 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Lock sx={{ fontSize: 36, color: "#0fb8b0" }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Admin Login
        </Typography>
      </Stack>

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
          bgcolor: "white",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Sign in to continue
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 1, fontSize: 14 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  borderRadius: 999,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundImage:
                    "linear-gradient(90deg, #0fb8b0, #14b8ff)",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(90deg, #0aa59e, #0ea5e9)",
                  },
                }}
              >
                Login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
