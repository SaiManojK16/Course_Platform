// frontend/src/pages/Professor/ProfessorAssignments.js
import React, { useEffect, useState } from "react";
import "../../styles/ProfessorAssignments.css";
import axios from "axios";
import { FiPlusCircle, FiEdit, FiTrash, FiUpload, FiCheckCircle } from "react-icons/fi";

function ProfessorAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "", file: null });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const response = await axios.get("http://localhost:5001/api/professor/assignments");
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments", error);
      }
    }
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newAssignment.title);
    formData.append("description", newAssignment.description);
    formData.append("dueDate", newAssignment.dueDate);
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5001/api/professor/assignments/create", formData);
      setNewAssignment({ title: "", description: "", dueDate: "", file: null });
      setSelectedFile(null);
      setShowForm(false);
      alert("Assignment created successfully!");
    } catch (error) {
      console.error("Error creating assignment", error);
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/professor/assignments/${id}`);
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
      alert("Assignment deleted successfully!");
    } catch (error) {
      console.error("Error deleting assignment", error);
    }
  };

  return (
    <div className="assignments-container">
      <header className="assignments-header">
        <h2>📂 Assignments</h2>
        <div className="actions">
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            <FiPlusCircle /> {showForm ? "Cancel" : "New Assignment"}
          </button>
          <button className="secondary-btn"><FiEdit /> Edit Categories</button>
          <button className="secondary-btn"><FiUpload /> More Actions</button>
        </div>
      </header>

      {/* Assignment Creation Form (Only Visible When showForm is true) */}
      {showForm && (
        <section className="assignment-form">
          <h3><FiPlusCircle /> Create New Assignment</h3>
          <form onSubmit={handleCreateAssignment}>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" name="title" value={newAssignment.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" value={newAssignment.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Due Date:</label>
              <input type="date" name="dueDate" value={newAssignment.dueDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Upload File:</label>
              <input type="file" onChange={handleFileChange} required />
            </div>
            <button type="submit" className="submit-btn"><FiCheckCircle /> Create Assignment</button>
          </form>
        </section>
      )}

      {/* Assignments Table */}
      <section className="assignments-list">
        <h3>Existing Assignments</h3>
        {assignments.length > 0 ? (
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Due Date</th>
                <th>New Submissions</th>
                <th>Completed</th>
                <th>Evaluated</th>
                <th>Feedback Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.dueDate}</td>
                  <td>{assignment.newSubmissions || 0}</td>
                  <td>{assignment.completed || 0}</td>
                  <td>{assignment.evaluated || 0}</td>
                  <td>{assignment.feedbackPublished || 0}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteAssignment(assignment._id)}>
                      <FiTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No assignments available.</p>
        )}
      </section>
    </div>
  );
}

export default ProfessorAssignments;