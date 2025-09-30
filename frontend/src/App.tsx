import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import DiagnosticList from './pages/DiagnosticList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/diagnostics"
            element={
              <ProtectedRoute>
                <DiagnosticList />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/diagnostics" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;