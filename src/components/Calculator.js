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
    const [currentSensitivity, setCurrentSensitivity] = useState('');
    const [gptSuggestion, setGptSuggestion] = useState('');
    const [userQuery, setUserQuery] = useState('');
    const [improvementType, setImprovementType] = useState('');
    const [gptPros, setGptPros] = useState('');
    const [gptCons, setGptCons] = useState('');
    const [originalGameSensitivity, setOriginalGameSensitivity] = useState('');
    const [zigzagImageUrl, setZigzagImageUrl] = useState('');
    const [sourceGame, setSourceGame] = useState('');
    const [targetGame, setTargetGame] = useState('');
    const [sourceGameInput, setSourceGameInput] = useState('');
    const [targetGameInput, setTargetGameInput] = useState('');
    const [sourceGameSuggestions, setSourceGameSuggestions] = useState([]);
    const [targetGameSuggestions, setTargetGameSuggestions] = useState([]);
    const [inputSensitivity, setInputSensitivity] = useState('');
    const [convertedSensitivity, setConvertedSensitivity] = useState('');



    useEffect(() => {
        fetchGames();
    }, []);

    useEffect(() => {
        if (sourceGameInput) {
            fetchGameSuggestions(sourceGameInput, setSourceGameSuggestions);
        }
    }, [sourceGameInput]);

    useEffect(() => {
        if (targetGameInput) {
            fetchGameSuggestions(targetGameInput, setTargetGameSuggestions);
        }
    }, [targetGameInput]);



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

    const fetchGameSuggestions = async (gameName, setSuggestions) => {
        try {
            const response = await fetch(`http://localhost:3002/fetchGameNames?gameName=${encodeURIComponent(gameName)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game suggestions.');
            }
            const data = await response.json();
            setSuggestions(Object.values(data).map(game => game.game));
        } catch (error) {
            console.error('Error fetching game suggestions:', error);
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

    const fetchPersonalizedMessage = async () => {
        const { game } = request;
        const sens1 = currentSensitivity; // Use currentSensitivity instead of answer

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
            // Fetch and set the new zigzag image URL
            fetchZigzagImage(data.newSensitivity);
        } catch (error) {
            console.error('Error fetching GPT suggestion:', error);
            setError('Failed to fetch GPT suggestion. Please try again.');
        }
    };

    const convertToOriginalGame = async () => {
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
        fetchPersonalizedMessage(); // Fetch personalized message before moving to next step
        fetchSensitivityFeedback(sens1Value); // Fetch sensitivity feedback using calculated sensitivity
        nextStep();
    };

    const handleImprovementRequest = async () => {
        const { gameid } = request;
        try {
            const response = await fetch('http://localhost:3002/adjustSensitivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sensitivity: sens1Value, aimPreference, improvement: improvementType, gameid }),
            });

            if (!response.ok) {
                throw new Error('Failed to adjust sensitivity.');
            }

            const data = await response.json();
            setSens1Value(data[0]?.sens1);
            console.log(data)
            setError('');
        } catch (error) {
            console.error('Error adjusting sensitivity:', error);
            setError('Failed to adjust sensitivity. Please try again.');
        }
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

    const fetchZigzagImage = async (sensitivity) => {
        const url = `http://localhost:3002/generateZigzag?width=200&height=250&sensitivity=${sensitivity}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch zigzag image.');
            }

            const blob = await response.blob();
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);
            setZigzagImageUrl(imageUrl);

        } catch (error) {
            console.error('Error fetching zigzag image:', error);
            setError('Failed to fetch zigzag image. Please try again.');
        }
    };


    const handleConvertSensitivity = async () => {
        const sourceGame = games.find(game => game.game === sourceGameInput);
        const targetGame = games.find(game => game.game === targetGameInput);

        if (!sourceGame || !targetGame) {
            setError('Invalid game selection. Please select valid games.');
            return;
        }

        const url = `http://localhost:3002/calculateValue?gameid1=${sourceGame.gameid}&sens1=${inputSensitivity}&gameid2=${targetGame.gameid}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to convert sensitivity.');
            }

            const data = await response.json();
            setConvertedSensitivity(data[0]?.sens1);
        } catch (error) {
            console.error('Error converting sensitivity:', error);
            setError('Failed to convert sensitivity. Please try again.');
        }
    };



    useEffect(() => {
        if (step === 4) {
            fetchZigzagImage(sens1Value);
        }
    }, [step]);

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
                        <h3 className="fs-subtitle">Summary</h3>
                        <h2 className="fs-title">Here is your personalized sensitivity recommendation:</h2>
                        <p>Game: {request.game}</p>
                        <p>Current Sensitivity: {currentSensitivity}</p> {/* Display the current sensitivity */}
                        <p>Calculated Sensitivity Value: {sens1Value}</p>
                        <p className="text-primary">Personalized Message: {personalizedMessage}</p>

                        <div className="text-primary">
                            <span>Sensitivity Feedback: </span><br /> <br /> <span className="text-secondary form-text">Pros: {sensitivityFeedback.pros}</span>
                            <br /> <br />
                            <span className="text-danger form-text">Cons: {sensitivityFeedback.cons}</span>
                        </div>
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
                                    <p ><strong>ASK for Suggestion: <br /></strong> Suggested Sensitivity Value is: {sens1Value} <br /> {gptSuggestion}</p>
                                    <p className="text-success"><strong>Pros:</strong> {gptPros}</p>
                                    <p className="text-danger"><strong>Cons:</strong> {gptCons}</p>

                                    <button className="mt-3 btn btn-primary " type="button" onClick={convertToOriginalGame}>Convert to Original Game</button>
                                    {originalGameSensitivity && (
                                        <p className="mt-3"><strong>Original Game Sensitivity:</strong> {originalGameSensitivity}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* <div className="form-group mt-3">
                            <label className="font-weight-bold">Select Improvement Type:</label><br />
                            <div className="d-flex justify-content-center">
                                <div className="form-check">
                                    <input
                                        className=""
                                        type="radio"
                                        name="improvementType"
                                        value="tracking"
                                        id="tracking"
                                        onClick={() => setImprovementType('tracking')}
                                    />
                                    <label className="form-check-label" htmlFor="tracking">Tracking</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className=""
                                        type="radio"
                                        name="improvementType"
                                        value="pencil"
                                        id="pencil"
                                        onClick={() => setImprovementType('pencil')}
                                    />
                                    <label className="form-check-label" htmlFor="pencil">Pencil Aim</label>
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary mt-2" onClick={handleImprovementRequest}>
                                Adjust Sensitivity
                            </button>
                        </div>
                        <img id="zigzagImage" alt="Zigzag Pattern" />
                        */}

                        {zigzagImageUrl && <img src={zigzagImageUrl} alt="Zigzag Pattern" />}

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


    const renderConversionInterface = () => (
        <fieldset className="mt-5">
            <h3 className="fs-subtitle">Convert Game Sensitivity</h3>
            <h2 className="fs-title">Source Game</h2>
            <input
                type="text"
                name="sourceGame"
                placeholder="Enter source game name"
                value={sourceGameInput}
                onChange={(e) => setSourceGameInput(e.target.value)}
                list="sourceGameSuggestions"
            />
            <datalist id="sourceGameSuggestions">
                {sourceGameSuggestions.map((game, index) => (
                    <option key={index} value={game} />
                ))}
            </datalist>
            <h2 className="fs-title">Input Sensitivity</h2>
            <input
                type="number"
                name="inputSensitivity"
                placeholder="Enter sensitivity value"
                value={inputSensitivity}
                onChange={(e) => setInputSensitivity(e.target.value)}
            />
            <h2 className="fs-title">Target Game</h2>
            <input
                type="text"
                name="targetGame"
                placeholder="Enter target game name"
                value={targetGameInput}
                onChange={(e) => setTargetGameInput(e.target.value)}
                list="targetGameSuggestions"
            />
            <datalist id="targetGameSuggestions">
                {targetGameSuggestions.map((game, index) => (
                    <option key={index} value={game} />
                ))}
            </datalist>
            <input
                type="button"
                className="btn btn-primary"
                value="Convert Sensitivity"
                onClick={handleConvertSensitivity}
            />
            {convertedSensitivity && (
                <p>Converted Sensitivity for {targetGameInput}: {convertedSensitivity}</p>
            )}
            {error && <p className="error">{error}</p>}
        </fieldset>
    );



    return (
        <div className="calculator-container">
            <form id="msform" className="pb-5">
                {renderStep(step)}
                {renderConversionInterface()}
            </form>
            <div className="robot-container">
                <img src={process.env.PUBLIC_URL + '/bot.gif'} alt="Robot GIF" className="robot-gif" />
            </div>
        </div>
    );
};

export default Calculator;
