import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { auth } from "../../firebaseConfig";

const Suggestion = () => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({
        gameName: "",
        currentSensitivity: "",
        aimPreference: "",
    });
    const [gameList, setGameList] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [valorantSens, setValorantSens] = useState('');

    const [pros, setPros] = useState("");
    const [cons, setCons] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    useEffect(() => {
        fetchGameList();
    }, []);

    const fetchGameList = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3002/fetchGameList");
            setGameList(response.data);
            setFilteredGames(response.data);
        } catch (err) {
            console.error("Error fetching game list:", err);
            setError("Failed to fetch game list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAnswers(prevAnswers => ({ ...prevAnswers, [name]: value }));
        if (name === "gameName") {
            const filtered = gameList.filter(game =>
                game.game.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredGames(filtered);
        }
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSuggestion = async () => {
        setLoading(true);
        try {
            // Find game ID
            const selectedGame = gameList.find(game => game.game.toLowerCase() === answers.gameName.toLowerCase());
            if (!selectedGame) {
                setError("Invalid game name.");
                setLoading(false);
                return;
            }
            const gameId = selectedGame.gameid;

            // Calculate sensitivity
            const response = await axios.get("http://localhost:3002/calculateToValorantValue", {
                params: {
                    gameid1: gameId,
                    sens1: answers.currentSensitivity,
                },
            });

            const valorantSensitivity = response.data[0]?.sens1;
            setValorantSens(valorantSens)
            console.log(valorantSensitivity)

            // Determine the digit based on aim preference
            const sensitivityDigits = valorantSensitivity.split('.')[1];
            let digit = null;
            if (answers.aimPreference === 'arm') {
                digit = sensitivityDigits[0];
            } else if (answers.aimPreference === 'wrist') {
                digit = sensitivityDigits[1];
            } else if (answers.aimPreference === 'fingers') {
                digit = sensitivityDigits[2];
            }

            // Prepare GPT prompt
            const gptPrompt = `
                Based on the given aim preference and Valorant sensitivity, select the corresponding pros and cons:

                Game Data:
                - Game: ${answers.gameName}
                - Valorant Sensitivity: ${valorantSensitivity}
                - Aim Preference: ${answers.aimPreference}
                - Selected Digit: ${digit}

                Sensitivity Settings Analysis:
                0. Neutral/flat grip for balance
                   Pros: The aiming preference you selected may be your "anchor point". You can either select a new aiming preference or senstailor will tailor a new sensitivity based on your current aiming preference. 
                1. Fastest General Aim and Reaction Times
                   Pros: This sensitivity will have the fastest general aim and fastest reaction times as well as fastest precision.
                   Cons: This sensitivity will be bad for tracking and you may under shoot at times. It also will be biased to left hand side targets/shots and weaker at hitting right hand side targets/shots.
                2. Balanced control and precision
                   Pros: This sensitivity will have a balance between control, highest precision and even target selection on left and right.
                   Cons: This sensitivity has a low "range"/"field of aim" so it will undershoot and struggle with tracking.
                3. Best mouse control
                   Pros: This sensitivity will have the best mouse control. You will feel a strong grip and be able to to make high accuracy adjustments and 180s.
                   Cons: This sensitivity will be bad for tracking and will undershoot. It also will be biased to left hand side targets/shots and weaker at hitting right hand side targets/shots.
                4. Great for flick aim and spray transfers
                   Pros: This sensitivity is great for flick aim and spray transfers.
                   Cons: This sensitivity will look shaky and can be very inconsistent. 
                5. Best all-round aim
                   Pros: This sensitivity has the best all round aim. It's the most consistent for tracking, flicking and precision aim. It also have even target selection on left and right.
                   Cons: This sensitivity has a very high skill ceiling to master and get desired effects. It can look very shaky.
                6. Highest first shot accuracy and tracking
                   Pros: This sensitivity will have the highest first shot accuracy and tracking.
                   Cons: This sensitivity will feel extremely shaky and inconsistent. 
                7. Stable focus, good for movement and rhythm
                   Pros: The sensitivity has great focus/looks stable and is great for movement and rhythm based aiming. It also has a range/"field of aim" 
                   Cons: This sensitivity may cause you to overshoot. 
                8. Pencil aim
                   Pros: The sensitivity will have "pencil aim". It's amazing for prefiring, adjustments, tracking, flicking and has very high mouse control. It also has even target selection on left and right.
                   Cons: This sensitivity will cause you to overshoot. It can feel very shaky and inconsistent and the movement can be sloppy at times.
                9. Largest field of aim
                   Pros: This sensitivity will has the largest field of aim. It's very fast for adjustments and reaction time. It can also be great for movement and pre firing.
                   Cons: This sensitivity will be bad for micro adjustments/precision. At times it will feel inconsistent and shaky and overshoot a lot. 

                Based on the selected digit (${digit}), provide the corresponding pros and cons.
            `;


            const gptResponse = await axios.post("http://localhost:3002/translate_game", { prompt: gptPrompt });

            const data = gptResponse.data.translatedData;
            const prosMatch = data.match(/Pros:(.*)Cons:/s);
            const consMatch = data.match(/Cons:(.*)/s);

            console.log(gptResponse.data.translatedData)

            if (prosMatch) setPros(prosMatch[1].trim());
            if (consMatch) setCons(consMatch[1].trim());

            setError("");
        } catch (err) {
            console.error("Error translating game data:", err);
            setError("Failed to translate game data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <fieldset>
                        <h3 className='fs-subtitle'>Question # 1</h3>
                        <h2 className='fs-title'>What is your current game name?</h2>
                        <input
                            type='text'
                            name='gameName'
                            placeholder='Enter the game name'
                            value={answers.gameName}
                            onChange={handleInputChange}
                            list="gameSuggestions"
                        />
                        <datalist id="gameSuggestions">
                            {filteredGames.map((game, index) => (
                                <option key={index} value={game.game} />
                            ))}
                        </datalist>
                        <input
                            type='button'
                            className='next action-button'
                            value='Next'
                            onClick={handleNextStep}
                        />
                    </fieldset>
                );
            case 2:
                return (
                    <fieldset>
                        <h3 className='fs-subtitle'>Question # 2</h3>
                        <h2 className='fs-title'>What is your current sensitivity?</h2>
                        <input
                            type='text'
                            name='currentSensitivity'
                            placeholder='Enter the current sensitivity'
                            value={answers.currentSensitivity}
                            onChange={handleInputChange}
                        />
                        <input
                            type='button'
                            className='previous action-button'
                            value='Previous'
                            onClick={handlePrevStep}
                        />
                        <input
                            type='button'
                            className='next action-button'
                            value='Next'
                            onClick={handleNextStep}
                        />
                    </fieldset>
                );
            case 3:
                return (
                    <fieldset>
                        <h3 className='fs-subtitle'>Question # 3</h3>
                        <h2 className='fs-title'>What is your aim preference?</h2>
                        <label>
                            <input
                                type='radio'
                                name='aimPreference'
                                value='arm'
                                checked={answers.aimPreference === "arm"}
                                onChange={handleInputChange}
                            />{" "}
                            Arm
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='aimPreference'
                                value='wrist'
                                checked={answers.aimPreference === "wrist"}
                                onChange={handleInputChange}
                            />{" "}
                            Wrist
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='aimPreference'
                                value='fingers'
                                checked={answers.aimPreference === "fingers"}
                                onChange={handleInputChange}
                            />{" "}
                            Fingers
                        </label>
                        <input
                            type='button'
                            className='previous action-button'
                            value='Previous'
                            onClick={handlePrevStep}
                        />
                        <input
                            type='button'
                            className='next action-button'
                            value='Suggest Me'
                            onClick={handleSuggestion}
                        />
                    </fieldset>
                );
            default:
                return null;
        }
    };

    return (
        <div className='auth-wrapper'>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <ClipLoader size={50} color={"#123abc"} loading={true} />
                </div>
            ) : (
                <form id='msform'>{renderStep()}</form>
            )}
            {pros && (
                <div className='mt-3' style={{ color: "green" }}>
                    <h3>Pros</h3>
                    <p>{pros}</p>
                </div>
            )}
            {cons && (
                <div className='mt-3' style={{ color: "red" }}>
                    <h3>Cons</h3>
                    <p>{cons}</p>
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Suggestion;
