import React, { useEffect, useState } from 'react';
import './Calculator.css';

const Calculator = () => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [games, setGames] = useState({});
    const [GameList, setGameList] = useState([]);
    const [request, setRequest] = useState({});
    const [sens1Value, setSens1Value] = useState(null);
    const [personalizedMessage, setPersonalizedMessage] = useState('');
    const [aimPreference, setAimPreference] = useState('');
    const [sensitivityFeedback, setSensitivityFeedback] = useState('');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await fetch('http://localhost:3002/fetchGameNames?gameName=random');
            if (!response.ok) {
                throw new Error('Failed to fetch games.');
            }
            const data = await response.json();
            setGames(data);
            console.log(data);
            const stringArray = Object.values(data).map((game) => game.game);
            setGameList(stringArray);
        } catch (error) {
            console.error('Error fetching games:', error);
            setError('Failed to fetch games. Please try again.');
        }
    };

    const handleInputChange = (event) => {
        setAnswer(event.target.value);
    };

    const verifyGame = () => {
        const foundGame = Object.values(games).find((game) => game.game === answer);
        if (!foundGame) {
            setError('Invalid game name! Please enter a valid game name.');
            return false;
        }
        setRequest(foundGame);
        setError('');
        return true;
    };

    const verifyRange = () => {
        const { sens1min, sens1max } = request;
        if (answer < sens1min || answer > sens1max) {
            setError(`Invalid sensitivity range for this game. Valid values are ${sens1min} to ${sens1max}`);
            return false;
        }
        setError('');
        return true;
    };

    const fetchPersonalizedMessage = async () => {
        const { game } = request;
        const sens1 = answer;

        const prompt = `Based on the game ${game} and the sensitivity ${sens1}, provide a personalized message for the user who prefers aiming with their ${aimPreference}.`;

        console.log(prompt);

        try {
            const response = await fetch('http://localhost:3002/generateMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch personalized message.');
            }

            const data = await response.json();
            setPersonalizedMessage(data?.message?.content);
        } catch (error) {
            console.error('Error fetching personalized message:', error);
            setError('Failed to fetch personalized message. Please try again.');
        }
    };

    const calculateValue = async () => {
        const { gameid } = request;
        const sens1 = answer;
        const url = `http://localhost:3002/calculateValue?gameid1=${gameid}&sens1=${sens1}&gameid2=2347`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to calculate value.');
            }

            const data = await response.json();
            setSens1Value(data[0]?.sens1);

            console.log(data);
        } catch (error) {
            console.error('Error calculating value:', error);
            setError('Failed to calculate value. Please try again.');
        }
    };

    const fetchSensitivityFeedback = async () => {
        try {
            const response = await fetch('http://localhost:3002/convertSensitivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ overWatchSens: answer, aimPreference, dpi: 800 }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sensitivity feedback.');
            }

            const data = await response.json();
            console.log('Sensitivity feedback received:', data);
            setSensitivityFeedback(`Pros: ${data.feedback.pros}\nCons: ${data.feedback.cons}`);
        } catch (error) {
            console.error('Error fetching sensitivity feedback:', error);
            setError('Failed to fetch sensitivity feedback. Please try again.');
        }
    };

    const handleQuestionThree = (preference) => {
        setAimPreference(preference);
        fetchPersonalizedMessage(); // Fetch personalized message before moving to next step
        fetchSensitivityFeedback(); // Fetch sensitivity feedback before moving to next step
        nextStep();
    };

    const clearInput = () => {
        setAnswer('');
    };

    const nextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const renderStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                return (
                    <fieldset>
                        <h3 className="fs-subtitle">Question # 1</h3>
                        <h2 className="fs-title">What game are you playing?</h2>
                        <input
                            type="text"
                            name="answer"
                            placeholder="Write your answer here!!"
                            value={answer}
                            onChange={handleInputChange}
                            list="suggestion"
                        />
                        <datalist id="suggestion">
                            {GameList.map((game, index) => (
                                <option key={index} value={game} />
                            ))}
                        </datalist>
                        <input
                            type="button"
                            className="next action-button"
                            value="Next"
                            onClick={() => {
                                const isValid = verifyGame();
                                if (isValid) {
                                    clearInput();
                                    nextStep();
                                }
                            }}
                        />
                        {error && <p className="error">{error}</p>}
                    </fieldset>
                );
            case 2:
                return (
                    <fieldset>
                        <h3 className="fs-subtitle">Question # 2</h3>
                        <h2 className="fs-title">What is your current sensitivity?</h2>
                        <input
                            type="number"
                            name="answer"
                            placeholder="Write your answer here!!"
                            value={answer}
                            onChange={handleInputChange}
                        />
                        <input
                            type="button"
                            className="previous action-button"
                            value="Previous"
                            onClick={() => {
                                prevStep();
                                clearInput();
                            }}
                        />
                        <input
                            type="button"
                            className="next action-button"
                            value="Next"
                            onClick={() => {
                                const isValid = verifyRange();
                                if (isValid) {
                                    calculateValue();
                                    clearInput();
                                    nextStep();
                                }
                            }}
                        />
                        {error && <p className="error">{error}</p>}
                    </fieldset>
                );
            case 3:
                return (
                    <fieldset>
                        <h3 className="fs-subtitle">Question # 3</h3>
                        <h2 className="fs-title">Do you prefer aiming with your arm, wrist or fingers?</h2>
                        <label>
                            <input type="radio" name="aimPreference" value="arm" /> Arm
                        </label>
                        <label>
                            <input type="radio" name="aimPreference" value="wrist" /> Wrist
                        </label>
                        <label>
                            <input type="radio" name="aimPreference" value="fingers" /> Fingers
                        </label>
                        <input
                            type="button"
                            className="previous action-button"
                            value="Previous"
                            onClick={() => {
                                prevStep();
                                clearInput();
                            }}
                        />
                        <input
                            type="button"
                            className="next action-button"
                            value="Next"
                            onClick={() =>
                                handleQuestionThree(
                                    document.querySelector('input[name="aimPreference"]:checked').value
                                )
                            }
                        />
                    </fieldset>
                );
            case 4:
                return (
                    <fieldset>
                        <h3 className="fs-subtitle">Summary</h3>
                        <h2 className="fs-title">Here is your personalized sensitivity recommendation:</h2>
                        <p>Game: {request.game}</p>
                        <p>Current Sensitivity: {answer}</p>
                        <p>Calculated Sensitivity Value: {sens1Value}</p>
                        <p className="text-primary">Personalized Message: {personalizedMessage}</p>
                        <p className="text-primary">Sensitivity Feedback: {sensitivityFeedback}</p>
                        <input
                            type="button"
                            className="previous action-button"
                            value="Previous"
                            onClick={prevStep}
                        />
                    </fieldset>
                );
            default:
                return null;
        }
    };

    return (
        <div className="calculator-container">
            <form id="msform">{renderStep(step)}</form>
            <div className="robot-container">
                <img src={process.env.PUBLIC_URL + '/bot.gif'} alt="Robot GIF" className="robot-gif" />
            </div>
        </div>
    );
};

export default Calculator;
