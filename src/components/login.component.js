import React, { useState } from 'react';

import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: email,
        password: password
      });
      // Check if login was successful
      if (response.data.success) {
        console.log('Login successful');
       
       
      } else {
        // Handle unsuccessful login (e.g., display error message)
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <h3>Sign In</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
     
    
    </div>
  );
};

export default Login;
