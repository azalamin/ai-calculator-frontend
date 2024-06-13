// src/components/Questions.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../firebaseConfig';

const Questions = () => {
    const [answers, setAnswers] = useState({});
    const { setIsNewUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;
            if (user) {
                const email = user.email;
                await axios.post('http://localhost:3001/save_user_data', { email, answers });
                console.log('User data saved successfully');
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }

        setIsNewUser(false); // Mark user as not new
        navigate('/calculator/calculate-sensitivity'); // Redirect to calculate sensitivity route
    };

    const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    const questions = [
        { label: 'What game are you playing?', name: 'game' },
        { label: 'What is your current sensitivity?', name: 'currentSensitivity' },
        { label: 'Do you prefer aiming with your arm, wrist or fingers?', name: 'aimPreference' },
        { label: 'Which mouse are you using?', name: 'mouse' },
        { label: 'What is your dpi?', name: 'dpi' },
        { label: 'Are you left handed or right handed?', name: 'handedness' },
        { label: 'How much desk space do you have?', name: 'deskSpace' },
        { label: 'How does your aim currently feel?', name: 'aimFeel' },
        { label: 'On screen, how does your game look?', name: 'gameLook' },
        { label: 'What do you want your new sensitivity to be better at?', name: 'sensitivityGoal' }
    ];

    return (
        <div className="auth-wrapper pt-5 pb-5 mt-5">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h3>Questions</h3>
                    {questions.map((question, index) => (
                        <div className="mb-3" key={index}>
                            <label>{question.label}</label>
                            <input
                                type="text"
                                className="form-control"
                                name={question.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
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

export default Questions;
