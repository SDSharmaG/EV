import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../css/Login.css'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ move useNavigate to top level

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials : 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login Successfully');
        // Optionally store user info or token
          localStorage.setItem("token", data.token);
          console.log("Token saved:", data.token);

        // ✅ Navigate to home or dashboard
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again.');
    }
  };


  return (
    <div className="container col-4  p-4 rounded-3 align-items-center" id='login'>
      <h2 className="mb-4 text-center">Login</h2>

      {message && <div className="alert alert-success">{message}</div>}

      {/* ✅ Add form here */}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* <div className="d-flex justify-content-between"> */}
          <button type="submit" className="btn container btn-primary mt-2">Login</button>
        {/* </div> */}
      </form>
    </div>
  );
};

export default Login;
