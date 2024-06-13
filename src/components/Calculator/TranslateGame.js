import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig';

const TranslateGame = () => {
    const [gameData, setGameData] = useState('');
    const [translatedData, setTranslatedData] = useState('');
    const [error, setError] = useState('');
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            fetchUserAnswers(user.email);
        }
    }, [user]);

    const fetchUserAnswers = async (email) => {
        console.log('Sending request to fetch answers for:', email); // Debug log
        try {
            const response = await axios.post('http://localhost:3002/get_user_answers', { email });
            if (response.data.answers) {
                console.log('Answers fetched:', response.data.answers); // Debug log
                const answers = response.data.answers;
                const formattedAnswers = formatAnswers(answers);
                setGameData(formattedAnswers);
            } else {
                console.log('No answers found for the user'); // Debug log
                setError('No answers found for the user.');
            }
        } catch (err) {
            console.error('Error fetching user answers:', err);
            setError('Failed to fetch user answers. Please try again.');
        }
    };


    const formatAnswers = (answers) => {
        return `Game: ${answers.game}, Current Sensitivity: ${answers.currentSensitivity}, Aim Preference: ${answers.aimPreference}, Mouse: ${answers.mouse}, DPI: ${answers.dpi}, Handedness: ${answers.handedness}, Desk Space: ${answers.deskSpace}, Aim Feel: ${answers.aimFeel}, Game Look: ${answers.gameLook}, Sensitivity Goal: ${answers.sensitivityGoal}`;
    };

    const handleTranslate = async () => {
        try {
            const response = await axios.post('http://localhost:3002/translate_game', { gameData });
            setTranslatedData(response.data.translatedData);
            setError('');
        } catch (err) {
            console.error('Error translating game data:', err);
            setError('Failed to translate game data. Please try again.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <h1>Translate Game</h1>
                <div className="mb-3">
                    <label>Game Data</label>
                    <textarea
                        className="form-control"
                        value={gameData}
                        readOnly
                    />
                </div>
                <div className="d-grid">
                    <button onClick={handleTranslate} className="btn btn-primary">
                        Translate
                    </button>
                </div>
                {translatedData && (
                    <div className="mt-3">
                        <h3>Translated Data</h3>
                        <p>{translatedData}</p>
                    </div>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default TranslateGame;
