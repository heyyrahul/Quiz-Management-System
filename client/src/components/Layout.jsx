import React from "react";

import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import { AssignmentOutlined } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");



  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f7fb" }}>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(243,247,251,0.9)",
          backdropFilter: "blur(10px)",
          color: "inherit",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            width: "100%",
            mx: "auto",
            px: 2,
          }}
        >

          <Stack direction="row" alignItems="center" spacing={1}>
            <Paper
              elevation={2}
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "#0fb8b0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssignmentOutlined sx={{ fontSize: 20, color: "white" }} />
            </Paper>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                textDecoration: "none",
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              QuizMaster
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />


          <Button
            component={Link}
            to={isAdmin ? "/" : "/admin"}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.5,
              borderColor: "#d1d5db",
              bgcolor: "white",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
            startIcon={
              <AssignmentOutlined sx={{ fontSize: 18, color: "#0f172a" }} />
            }
          >
            {isAdmin ? "Take Quiz" : "Admin Panel"}
          </Button>
        </Toolbar>
      </AppBar>


      <Toolbar />


      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
