import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/Student/StudentDashboard";
import ProfessorDashboard from "./pages/Professor/ProfessorDashboard";
import StudentAssignments from "./pages/Student/Assignments"; 
import ProfessorAssignments from "./pages/Professor/Assignments";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />

        {/* Professor Routes */}
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/assignments" element={<ProfessorAssignments />} />
      </Routes>
    </Router>
  );
}

export default App;