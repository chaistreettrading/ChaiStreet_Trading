import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./auth/ProtectedRoute";
import Landing from "./pages/Landing";
import IntroLoader from "./components/Loading";

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatePresence mode="wait">
          {!introComplete ? (
            <IntroLoader
              key="intro"
              onComplete={() => setIntroComplete(true)}
            />
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ minHeight: "100vh" }}
            >
              <AppRoutes />
            </motion.div>
          )}
        </AnimatePresence>
      </AuthProvider>
    </BrowserRouter>
  );
}