import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Forbidden from "./pages/Forbidden";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forbidden" element={<Forbidden />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            element={<ProtectedRoute requiredPermission={["READ:USERS"]} />}
          >
            <Route
              path="/users"
              element={<Users />}
            />
          </Route>
          <Route
            element={<ProtectedRoute requiredPermission={["READ:PAYMENTS"]} />}
          >
            <Route
              path="/payments"
              element={<Payments />}
            />
          </Route>

          <Route
            element={<ProtectedRoute requiredPermission={["READ:REPORTS"]} />}
          >
            <Route
              path="/reports"
              element={<Reports />}
            />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
