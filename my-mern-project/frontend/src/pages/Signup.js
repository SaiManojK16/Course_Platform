// frontend/src/pages/Signup.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
    university: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.map((uni) => uni.name));
        setIsFetching(false);
      })
      .catch((err) => {
        console.error("Error fetching universities:", err);
        setIsFetching(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "university") {
      const search = e.target.value.toLowerCase();
      setFilteredUniversities(universities.filter((uni) => uni.toLowerCase().includes(search)));
      setShowDropdown(true);
    }
  };

  const handleSelectUniversity = (uni) => {
    setFormData({ ...formData, university: uni });
    setShowDropdown(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUpper = /[A-Z]/;
    const hasNumber = /\d/;
    const hasSpecial = /[@$!%*?&]/;
    if (!minLength.test(password)) return "Password must be at least 8 characters long.";
    if (!hasUpper.test(password)) return "Password must contain at least one uppercase letter.";
    if (!hasNumber.test(password)) return "Password must contain at least one number.";
    if (!hasSpecial.test(password)) return "Password must contain at least one special character (@$!%*?&).";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (!formData.email.endsWith("@gmail.com")) {
      setError("Only Gmail addresses are allowed.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed.");
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address (Gmail only)" value={formData.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <div className="autocomplete-container">
            <input type="text" name="university" placeholder="Search for your university" value={formData.university} onChange={handleChange} required onFocus={() => setShowDropdown(true)} />
            {showDropdown && filteredUniversities.length > 0 && (
              <ul className="autocomplete-list">
                {filteredUniversities.slice(0, 5).map((uni, index) => (
                  <li key={index} onClick={() => handleSelectUniversity(uni)}>
                    {uni}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="password-container">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <label>Select Role:</label>
          <div className="role-container">
            <label>
              <input type="radio" name="role" value="student" checked={formData.role === "student"} onChange={handleChange} /> Student
            </label>
            <label>
              <input type="radio" name="role" value="professor" checked={formData.role === "professor"} onChange={handleChange} /> Professor
            </label>
          </div>
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default Signup;
