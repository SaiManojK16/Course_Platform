// backend/routes/assignments.js
const express = require("express");
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const router = express.Router();

// Storage for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Create an assignment (Professor Only)
router.post("/create", [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("dueDate", "Valid due date is required").isISO8601(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, dueDate } = req.body;
    const assignment = new Assignment({ title, description, dueDate });
    await assignment.save();
    res.status(201).json({ msg: "Assignment created successfully", assignment });
  } catch (error) {
    console.error("Error creating assignment", error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});

// Get all assignments (Student View)
router.get("/student/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments", error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});

// Upload assignment submission (Student Submission)
router.post("/student/upload/:id", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });
    
    assignment.submissions.push({ studentId: req.body.studentId, file: req.file.filename, status: "Submitted" });
    await assignment.save();
    res.json({ msg: "Assignment submitted successfully" });
  } catch (error) {
    console.error("Error submitting assignment", error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});

// Get all submissions (Professor View)
router.get("/professor/submissions", async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("submissions.studentId", "name email");
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching submissions", error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});

// Grade an assignment submission
router.post("/professor/grade", async (req, res) => {
  try {
    const { assignmentId, studentId, grade } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });
    
    const submission = assignment.submissions.find(sub => sub.studentId.toString() === studentId);
    if (!submission) return res.status(404).json({ msg: "Submission not found" });
    
    submission.grade = grade;
    await assignment.save();
    res.json({ msg: "Grade submitted successfully" });
  } catch (error) {
    console.error("Error grading submission", error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
