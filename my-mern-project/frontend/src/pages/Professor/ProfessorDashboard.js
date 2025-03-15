// frontend/src/pages/ProfessorDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ProfessorDashboard.css";
import {
  FiBook,
  FiUsers,
  FiCalendar,
  FiMessageCircle,
  FiBell,
  FiClipboard,
  FiEdit,
  FiPlusCircle,
} from "react-icons/fi";

function ProfessorDashboard() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const studentsRes = await axios.get("http://localhost:5001/api/professor/students");
        const assignmentsRes = await axios.get("http://localhost:5001/api/professor/assignments");
        const projectsRes = await axios.get("http://localhost:5001/api/professor/projects");
        const discussionsRes = await axios.get("http://localhost:5001/api/professor/discussions");
        const announcementsRes = await axios.get("http://localhost:5001/api/professor/announcements");
        const quizzesRes = await axios.get("http://localhost:5001/api/professor/quizzes");
        const eventsRes = await axios.get("http://localhost:5001/api/professor/events");

        setStudents(studentsRes.data);
        setAssignments(assignmentsRes.data);
        setProjects(projectsRes.data);
        setDiscussions(discussionsRes.data);
        setAnnouncements(announcementsRes.data);
        setQuizzes(quizzesRes.data);
        setEvents(eventsRes.data);
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
          <li onClick={() => navigate("/professor/students")}><FiUsers /> Students</li>
          <li onClick={() => navigate("/professor/assignments")}><FiBook /> Assignments</li>
          <li onClick={() => navigate("/professor/projects")}><FiUsers /> Team Projects</li>
          <li onClick={() => navigate("/professor/announcements")}><FiBell /> Announcements</li>
          <li onClick={() => navigate("/professor/quizzes")}><FiEdit /> Quizzes</li>
          <li onClick={() => navigate("/professor/calendar")}><FiCalendar /> Calendar</li>
          <li onClick={() => navigate("/professor/discussions")}><FiMessageCircle /> Discussions</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>Professor Dashboard</h2>
        </header>

        {/* Student Overview Card */}
        <section className="dashboard-overview">
          <div className="student-card">
            <h3><FiUsers /> Students</h3>
            <p>Total Students: {students.length}</p>
          </div>
        </section>

        {/* 2x2 Grid Layout for Assignments, Announcements, Events */}
        <section className="dashboard-grid">
          <div className="dashboard-card">
            <h3><FiClipboard /> Assignments</h3>
            <p><strong>Total:</strong> {assignments.length}</p>
            <p><strong>Submissions:</strong> {assignments.reduce((sum, a) => sum + a.submissions, 0)}</p>
            <p><strong>Upcoming Deadlines:</strong> {assignments.filter(a => new Date(a.dueDate) > new Date()).length}</p>
            <button className="add-btn" onClick={() => navigate("/professor/assignments/create")}>+ Add Assignment</button>
          </div>

          <div className="dashboard-card">
            <h3><FiBell /> Announcements</h3>
            {announcements.length > 0 ? <p><strong>Latest:</strong> {announcements[0].title}</p> : <p>No announcements yet.</p>}
            <button className="add-btn" onClick={() => navigate("/professor/announcements/create")}>+ Add Announcement</button>
          </div>

          <div className="dashboard-card">
            <h3><FiCalendar /> Upcoming Events</h3>
            {events.length > 0 ? <p><strong>Next Event:</strong> {events[0].title} on {events[0].date}</p> : <p>No upcoming events.</p>}
            <button className="add-btn" onClick={() => navigate("/professor/events/create")}>+ Add Event</button>
          </div>

          <div className="dashboard-card">
            <h3><FiBook /> Quizzes</h3>
            <p><strong>Total Quizzes:</strong> {quizzes.length}</p>
            <button className="add-btn" onClick={() => navigate("/professor/quizzes/create")}>+ Add Quiz</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfessorDashboard;