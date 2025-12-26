import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../redux/slices/authSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Auth.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const { name, email, phone, password, password2 } = formData;
  const [errors, setErrors] = useState({});
  const nameRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Map common server errors to form fields and show inline
      const err = {};
      if (message && /name/i.test(message)) err.name = message;
      else if (message && /email/i.test(message)) err.email = message;
      else err.form = message;
      setErrors(err);
      if (err.name) nameRef.current?.focus();
    }

    if (isSuccess || user) {
      navigate("/comments");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    const { name: field, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "", form: "" }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!name || !email || !phone || !password || !password2) {
      setErrors({ form: "Please fill in all fields" });
      return;
    }

    // Basic phone validation (digits only, min 7 digits)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setErrors({ phone: "Please enter a valid phone number" });
      return;
    }

    if (password !== password2) {
      setErrors({ password2: "Passwords do not match" });
      return;
    }

    const userData = {
      name,
      email,
      phone,
      password,
    };

    dispatch(register(userData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        <p className="auth-subtitle">Create a new account</p>

        <form onSubmit={onSubmit} className="auth-form">
          {errors.form && <div className="form-error">{errors.form}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
            {errors.name && (
              <small className="field-error">{errors.name}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <small className="field-error">{errors.email}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              placeholder="Enter your phone number (e.g. +1234567890)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type={showPassword2 ? "text" : "password"}
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword2((s) => !s)}
              aria-pressed={showPassword2}
              title={showPassword2 ? "Hide password" : "Show password"}
            >
              {showPassword2 ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
