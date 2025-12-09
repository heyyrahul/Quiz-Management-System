// App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";

const QuizPage = lazy(() => import("./pages/QuizPage"));
const QuizResultPage = lazy(() => import("./pages/QuizResultPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminQuizForm = lazy(() => import("./pages/AdminQuizForm"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/results" element={<QuizResultPage />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute> 
            }
          />
          <Route
            path="/admin/quizzes/new"
            element={
              <ProtectedRoute>
                <AdminQuizForm mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/:quizId/edit"
            element={
              <ProtectedRoute>
                <AdminQuizForm mode="edit" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
