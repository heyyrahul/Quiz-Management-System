import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginAdminApi } from "../services/authService";
import { saveAuthToken } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!email || !password || loading) return;

    setLoading(true); 

    try {
      const data = await loginAdminApi(email, password);
      saveAuthToken(data.token);


      setNotification({
        open: true,
        message: "Login successful! Redirecting...",
        severity: "success",
      });


      setTimeout(() => {
        navigate("/admin");
      }, 1500);
      
    } catch (err) {
      console.error("Login error", err);
      const msg =
        err.response?.data?.message || "Login failed. Please check your credentials.";


      setNotification({
        open: true,
        message: msg,
        severity: "error",
      });
      
      setLoading(false);
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

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading} 
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading} 
                sx={{
                  borderRadius: 999,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundImage: "linear-gradient(90deg, #0fb8b0, #14b8ff)",

                  "&.Mui-disabled": {
                    backgroundImage: "linear-gradient(90deg, #0fb8b0, #14b8ff)",
                    opacity: 0.7,
                    color: "#fff"
                  },
                  "&:hover": {
                    backgroundImage: "linear-gradient(90deg, #0aa59e, #0ea5e9)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>


      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;