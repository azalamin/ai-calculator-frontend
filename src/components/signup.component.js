import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { auth } from '../firebaseConfig';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Save user data to database
      await axios.post('http://localhost:3002/save_user_data', { email, firstName, lastName });

      console.log('Sign-up successful');
      setError('');
      navigate('/login'); // Redirect to login or other page after successful sign-up
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Sign-up failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="auth-wrapper mt-5 pt-5">
      <div className="auth-inner">
        <form onSubmit={handleSignUp}>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <ClipLoader size={20} color={"#fff"} loading={true} /> : 'Sign Up'}
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <p className="forgot-password text-right">
          Already registered <a href="/login">sign in?</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;