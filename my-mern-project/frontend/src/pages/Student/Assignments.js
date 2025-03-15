// frontend/src/pages/Assignments.js
import React, { useEffect, useState } from "react";
import "../../styles/Assignments.css";
import axios from "axios";
import { FiUpload, FiClock, FiCheckCircle } from "react-icons/fi";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const response = await axios.get("http://localhost:5001/api/student/assignments");
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments", error);
      }
    }
    fetchAssignments();
  }, []);

  const handleFileChange = (event, id) => {
    setSelectedFile({ ...selectedFile, [id]: event.target.files[0] });
  };

  const handleUpload = async (id) => {
    if (!selectedFile[id]) return;
    const formData = new FormData();
    formData.append("file", selectedFile[id]);
    try {
      await axios.post(`http://localhost:5001/api/student/upload/${id}`, formData);
      setUploadStatus({ ...uploadStatus, [id]: "Uploaded" });
    } catch (error) {
      console.error("Error uploading file", error);
      setUploadStatus({ ...uploadStatus, [id]: "Failed" });
    }
  };

  return (
    <div className="assignments-container">
      <h2>📂 Assignments</h2>
      <div className="assignments-list">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div className="assignment-card" key={assignment.id}>
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p><FiClock /> Due: {assignment.dueDate}</p>
              <input type="file" onChange={(e) => handleFileChange(e, assignment.id)} />
              <button onClick={() => handleUpload(assignment.id)}>
                <FiUpload /> Submit
              </button>
              {uploadStatus[assignment.id] && (
                <p className={uploadStatus[assignment.id] === "Uploaded" ? "success" : "error"}>
                  {uploadStatus[assignment.id] === "Uploaded" ? <FiCheckCircle /> : "❌"} {uploadStatus[assignment.id]}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No assignments available.</p>
        )}
      </div>
    </div>
  );
}

export default Assignments;
