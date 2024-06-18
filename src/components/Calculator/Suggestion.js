import React, { useEffect, useState } from 'react';
import '../Calculator.css';

const CalculateSensitivity = () => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [games, setGames] = useState({});
    const [GameList, setGameList] = useState([]);
    const [request, setRequest] = useState({});
    const [sens1Value, setSens1Value] = useState(null);
    const [aimPreference, setAimPreference] = useState('');
    const [sensitivityFeedback, setSensitivityFeedback] = useState('');
    const [currentSensitivity, setCurrentSensitivity] = useState('');
    const [gptSuggestion, setGptSuggestion] = useState('');
    const [userQuery, setUserQuery] = useState('');
    const [gptPros, setGptPros] = useState('');
    const [gptCons, setGptCons] = useState('');
    const [originalGameSensitivity, setOriginalGameSensitivity] = useState('');


    useEffect(() => {
        fetchGames();
    }, []);

    useEffect(() => {
        if (sens1Value !== null) {
            convertToOriginalGame();
        }
    }, [sens1Value]);

    const fetchGames = async () => {
        try {
            const response = await fetch('http://localhost:3002/fetchGameNames?gameName=random');
            if (!response.ok) {
                throw new Error('Failed to fetch games.');
            }
            const data = await response.json();
            setGames(data);
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


    const handleUserQueryChange = (event) => {
        setUserQuery(event.target.value);
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
        const sens1min = 0.01;
        const sens1max = 100;
        if (answer < sens1min || answer > sens1max) {
            setError(`Invalid sensitivity range. Valid values are ${sens1min} to ${sens1max}`);
            return false;
        }
        setError('');
        return true;
    };

    const fetchGptSuggestion = async () => {
        try {
            const response = await fetch('http://localhost:3002/gptSuggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userQuery, aimPreference, currentSensitivity: sens1Value }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch GPT suggestion.');
            }

            const data = await response.json();
            setGptSuggestion(data.suggestion);
            setGptPros(data.pros);
            setGptCons(data.cons);
            setSens1Value(data.newSensitivity);
        } catch (error) {
            console.error('Error fetching GPT suggestion:', error);
            setError('Failed to fetch GPT suggestion. Please try again.');
        }
    };

    const convertToOriginalGame = async () => {
        console.log('New Sensitivity Value from Original', sens1Value)
        try {
            const response = await fetch('http://localhost:3002/convertToOriginalGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newSensitivity: sens1Value, originalGameId: request.gameid }),
            });

            if (!response.ok) {
                throw new Error('Failed to convert sensitivity to original game.');
            }

            const data = await response.json();
            setOriginalGameSensitivity(data.originalGameSensitivity);
        } catch (error) {
            console.error('Error converting sensitivity to original game:', error);
            setError('Failed to convert sensitivity to original game. Please try again.');
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
            console.log(data[0]?.sens1);
            setSens1Value(data[0]?.sens1);
        } catch (error) {
            console.error('Error calculating value:', error);
            setError('Failed to calculate value. Please try again.');
        }
    };

    const fetchSensitivityFeedback = async (calculatedSens) => {
        try {
            const response = await fetch('http://localhost:3002/convertSensitivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ calculatedSens: Number(calculatedSens), aimPreference, dpi: 800 }), // Use calculatedSens as a number
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sensitivity feedback.');
            }

            const data = await response.json();
            setSensitivityFeedback(data.feedback);
        } catch (error) {
            console.error('Error fetching sensitivity feedback:', error);
            setError('Failed to fetch sensitivity feedback. Please try again.');
        }
    };

    const handleQuestionThree = (preference) => {
        setAimPreference(preference);
        fetchSensitivityFeedback(sens1Value); // Fetch sensitivity feedback using calculated sensitivity
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
                                    setCurrentSensitivity(answer); // Set the current sensitivity value
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
                        <h2 className="fs-title">Do you prefer aiming with your arm, wrist, or fingers?</h2>
                        <label>
                            <input type="radio" name="aimPreference" value="arm" onClick={() => setAimPreference('arm')} /> Arm
                        </label>
                        <label>
                            <input type="radio" name="aimPreference" value="wrist" onClick={() => setAimPreference('wrist')} /> Wrist
                        </label>
                        <label>
                            <input type="radio" name="aimPreference" value="finger" onClick={() => setAimPreference('finger')} /> Finger
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
                            onClick={() => handleQuestionThree(aimPreference)}
                        />
                    </fieldset>
                );
            case 4:
                return (
                    <fieldset>
                        <p>Get a Suggestion</p>

                        <div>
                            <input
                                type="text"
                                placeholder="Ask me for suggestions"
                                value={userQuery}
                                onChange={handleUserQueryChange}
                            />
                            <button type="button" className="btn btn-primary mt-2" onClick={fetchGptSuggestion}>Get Suggestion</button>
                            {gptSuggestion && (
                                <div className="gpt-suggestion mt-3">
                                    {/* <p ><strong>Suggested Sensitivity Value is: </strong> {sens1Value}</p> */}
                                    <p><strong>Senstailor Recommendation:</strong> {originalGameSensitivity}</p>
                                    <p ><strong>Suggestion:</strong> {gptSuggestion}</p>
                                    <p className="text-success"><strong>Pros:</strong> {gptPros}</p>
                                    <p className="text-danger"><strong>Cons:</strong> {gptCons}</p>
                                </div>
                            )}
                        </div>

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

        <form id="msform" className="pb-5">
            {renderStep(step)}
        </form>


    );
};

export default CalculateSensitivity;