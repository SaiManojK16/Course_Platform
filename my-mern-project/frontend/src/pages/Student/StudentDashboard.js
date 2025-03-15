// frontend/src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import "/workspaces/Course_Platform/my-mern-project/frontend/src/styles/StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBook, FiUsers, FiCalendar, FiClock, FiBell, FiEdit, FiStar, FiUpload, FiMessageCircle } from "react-icons/fi";

function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const assignmentsRes = await axios.get("http://localhost:5001/api/student/assignments");
        const projectsRes = await axios.get("http://localhost:5001/api/student/projects");
        const deadlinesRes = await axios.get("http://localhost:5001/api/student/deadlines");
        setAssignments(assignmentsRes.data);
        setProjects(projectsRes.data);
        setDeadlines(deadlinesRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Course Portal</h2>
        <ul className="sidebar-menu">
  <li onClick={() => navigate("/student/assignments")}><FiBook /> Assignments</li>
  <li onClick={() => navigate("/student/team-projects")}><FiUsers /> Team Projects</li>
  <li onClick={() => navigate("/student/announcements")}><FiBell /> Announcements</li>
  <li onClick={() => navigate("/student/quizzes")}><FiEdit /> Quizzes</li>
  <li onClick={() => navigate("/student/grades")}><FiStar /> Grades</li>
  <li onClick={() => navigate("/student/submissions")}><FiUpload /> Submissions</li>
  <li onClick={() => navigate("/student/calendar")}><FiCalendar /> Calendar</li>
  <li onClick={() => navigate("/student/discussions")}><FiMessageCircle /> Discussions</li>
</ul>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h2>Advanced Computer Science | Prof. ABC</h2>
        </header>
        <section className="dashboard-section">
          <div className="dashboard-cards">
            <div className="card">
              <h3><FiBook /> Upcoming Assignments</h3>
              {assignments.length > 0 ? assignments.map((assignment, index) => (
                <p key={index}>{assignment.title} (Due: {assignment.dueDate})</p>
              )) : <p>No upcoming assignments</p>}
            </div>
            <div className="card">
              <h3><FiUsers /> Active Team Projects</h3>
              {projects.length > 0 ? projects.map((project, index) => (
                <p key={index}>{project.name} - {project.status}</p>
              )) : <p>No active projects</p>}
            </div>
          </div>
          <div className="dashboard-cards">
            <div className="card">
              <h3><FiCalendar /> Calendar</h3>
              <p>Assignments: 🔵 | Exams: 🔴 | Team Meetings: 🟢</p>
            </div>
            <div className="card">
              <h3><FiClock /> Upcoming Deadlines</h3>
              {deadlines.length > 0 ? deadlines.map((deadline, index) => (
                <p key={index}>{deadline.title}: {deadline.date} - {deadline.time}</p>
              )) : <p>No upcoming deadlines</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;