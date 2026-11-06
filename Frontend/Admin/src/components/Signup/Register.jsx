import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [error ,setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registration Successful!');
        setForm({ name: '', email: '', password: '' }); // clear form
      } else {
        setError(data.message || 'Already User Exists');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server Error. Please try again later.');
    }
  };
      const navigate = useNavigate(); 
        const getback = () =>{
        navigate('/');
    }

  return (
    <div className="container mt-5 col-4 border border-secondary p-4 rounded-3">
      <h2 className="mb-4 text-center">Sign Up</h2>

      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            id="name"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email </label>
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
        <div className='d-flex justify-content-between' >
        <button type="submit" className="btn btn-primary">Sign Up</button>
        <button type="button" className='btn btn-secondary ms-auto' onClick={getback}>Back</button></div>
      </form>
    </div>
  );
};

export default Register
