import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { auth } from "../../firebaseConfig";

const TranslateGame = () => {
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

    const handleTranslate = async () => {
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

            // Prepare GPT prompt
            const gptPrompt = `
                Choose the correct pros and cons provide it based on aim preference with the current sensitivity settings.

                Game Data:
                - Game: ${answers.gameName}
                - Valorant Sensitivity: ${valorantSensitivity}
                - Aim Preference: ${answers.aimPreference}

                Here, aim preference has a setting, valorant sensitivity has value like this 0.932, after the decimal, first value is 9 right? so, here 9 is arm, then 3 right? 3 is wrist, then 2 right? 2 is finger.

                Sensitivity Breakdown:
                After the decimal:
                First Value: Arm
                Second Value: Wrist
                Third Value: Finger

                Example Explanation:
                For a sensitivity setting of 0.932:
                First Value (9) = Arm
                Second Value (3) = Wrist
                Third Value (2) = Finger

                Every pros and cons has its base number 0 to 9, If user choose arm then it will be the first digit after decimal, the first digit has it value right? Let's say the first digit is 9, then it will choose the number 9 pros and cons. This is how it should work.

                Sensitivity Settings Analysis:
                Select a value from 0 to 9 based on user preference. Each value has specific pros and cons as outlined below:

                0.
                The aiming preference you selected may be your "anchor point". You can either select a new aiming preference or senstailor will tailor a new sensitivity based on your current aiming preference. 

                1.
                - Pros: Fastest general aim, fastest reaction times, fastest precision.
                - Cons: Bad for tracking, may undershoot, biased to left-hand targets, weaker at right-hand targets.

                2.
                - Pros: Balanced control, high precision, even target selection.
                - Cons: Low field of aim, may undershoot, struggles with tracking.

                3.
                - Pros: Strong grip, high accuracy adjustments, good for 180s.
                - Cons: Bad for tracking, may undershoot, biased to left-hand targets, weaker at right-hand targets.

                4.
                - Pros: Excellent for flick aim and spray transfers.
                - Cons: Can be shaky, inconsistent.

                5.
                - Pros: Consistent for tracking, flicking, precision aim, even target selection.
                - Cons: High skill ceiling, can look shaky.

                6.
                - Pros: Great first shot accuracy, good for tracking.
                - Cons: Feels shaky and inconsistent.

                7.
                - Pros: Stable, good for movement and rhythm-based aiming, good field of aim.
                - Cons: May cause overshooting.

                8.
                - Pros: Excellent for prefiring, adjustments, tracking, flicking, high mouse control, even target selection.
                - Cons: May overshoot, can be shaky and inconsistent, movement can be sloppy.

                9.
                - Pros: Very fast adjustments, quick reaction time, good for movement and prefiring.
                - Cons: Bad for micro-adjustments, can feel inconsistent and shaky, may overshoot.


                Choose the correct pros and cons based on aim preference. Do not modify the text. Just give me the pros and cons
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
                            value='Submit'
                            onClick={handleTranslate}
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
            {valorantSens && (
                <div className='mt-3' style={{ color: "green" }}>
                    <h3>Sensitivity</h3>
                    <p>{valorantSens}</p>
                </div>
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

export default TranslateGame;
