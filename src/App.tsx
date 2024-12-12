import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import Manager from "./pages/Manager";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="super-admin/*" element={<SuperAdmin />} />
          <Route path="manager/*" element={<Manager />} />
          <Route path="/" element={<Navigate to="/super-admin/login" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;