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
        context: "",
    });
    const [explanation, setExplanation] = useState("");
    const [pros, setPros] = useState("");
    const [cons, setCons] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            fetchUserAnswers(user.email);
        }
    }, [user]);

    const fetchUserAnswers = async (email) => {
        console.log("Sending request to fetch answers for:", email); // Debug log
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3002/get_user_answers", { email });
            if (response.data.answers) {
                console.log("Answers fetched:", response.data.answers); // Debug log
                const answers = response.data.answers;
                setAnswers({
                    gameName: answers.game,
                    currentSensitivity: answers.currentSensitivity,
                    aimPreference: answers.aimPreference,
                    context: "",
                });
            } else {
                console.log("No answers found for the user"); // Debug log
                setError("No answers found for the user.");
            }
        } catch (err) {
            console.error("Error fetching user answers:", err);
            setError("Failed to fetch user answers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAnswers({ ...answers, [name]: value });
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
            const prompt = `
            Please explain the following game data first, and then provide the pros and cons of the current sensitivity settings.

            Game Data:
            - Game: ${answers.gameName}
            - Current Sensitivity: ${answers.currentSensitivity}
            - Aim Preference: ${answers.aimPreference}
            - Context: ${answers.context}

            Explanation:
            Please explain the meaning of the game data provided above in 2-3 lines.

            Pros and Cons Analysis:
            Below are different sensitivity settings. Choose one set of pros and cons and provide them separately as "Pros" and "Cons".

            0. Neutral/flat grip for balance
               The aiming preference you selected may be your "anchor point". You can either select a new aiming preference or senstailor will tailor a new sensitivity based on your current aiming preference. 

            1. Fastest General Aim and Reaction Times
               - Pros: Fastest general aim, fastest reaction times, fastest precision.
               - Cons: Bad for tracking, may undershoot, biased to left-hand targets, weaker at right-hand targets.

            2. Balanced control and precision
               - Pros: Balanced control, high precision, even target selection.
               - Cons: Low field of aim, may undershoot, struggles with tracking.

            3. Best mouse control
               - Pros: Strong grip, high accuracy adjustments, good for 180s.
               - Cons: Bad for tracking, may undershoot, biased to left-hand targets, weaker at right-hand targets.

            4. Great for flick aim and spray transfers
               - Pros: Excellent for flick aim and spray transfers.
               - Cons: Can be shaky, inconsistent.

            5. Best all-round aim
               - Pros: Consistent for tracking, flicking, precision aim, even target selection.
               - Cons: High skill ceiling, can look shaky.

            6. Highest first shot accuracy and tracking
               - Pros: Great first shot accuracy, good for tracking.
               - Cons: Feels shaky and inconsistent.

            7. Stable focus, good for movement and rhythm
               - Pros: Stable, good for movement and rhythm-based aiming, good field of aim.
               - Cons: May cause overshooting.

            8. Pencil aim
               - Pros: Excellent for prefiring, adjustments, tracking, flicking, high mouse control, even target selection.
               - Cons: May overshoot, can be shaky and inconsistent, movement can be sloppy.

            9. Largest field of aim
               - Pros: Very fast adjustments, quick reaction time, good for movement and prefiring.
               - Cons: Bad for micro-adjustments, can feel inconsistent and shaky, may overshoot.

            Please provide the explanation first, and then choose one set of pros and cons from the list above and provide them separately as "Pros" & "Cons".
            `;

            const response = await axios.post("http://localhost:3002/translate_game", { prompt });
            const data = response.data.translatedData;

            const explanationMatch = data.match(/Explanation:(.*)Pros and Cons Analysis:/s);
            const prosMatch = data.match(/Pros:(.*)Cons:/s);
            const consMatch = data.match(/Cons:(.*)/s);

            if (explanationMatch) setExplanation(explanationMatch[1].trim());
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
                        />
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
                            value='Next'
                            onClick={handleNextStep}
                        />
                    </fieldset>
                );
            case 4:
                return (
                    <fieldset>
                        <h3 className='fs-subtitle'>Question # 4</h3>
                        <h2 className='fs-title'>Provide any additional context for the game</h2>
                        <input
                            type='text'
                            name='context'
                            placeholder='Enter additional context'
                            list='contextSuggestions'
                            value={answers.context}
                            onChange={handleInputChange}
                        />
                        <datalist id='contextSuggestions'>
                            <option value='Neutral/flat grip for balance' />
                            <option value='Fastest General Aim and Reaction Times' />
                            <option value='Balanced control and precision' />
                            <option value='Best mouse control' />
                            <option value='Great for flick aim and spray transfers' />
                            <option value='Best all-round aim' />
                            <option value='Highest first shot accuracy and tracking' />
                            <option value='Stable focus, good for movement and rhythm' />
                            <option value='Pencil aim' />
                            <option value='Largest field of aim' />
                        </datalist>
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
            {explanation && (
                <div className='mt-3' style={{ color: "blue" }}>
                    <h3>Explanation</h3>
                    <p>{explanation}</p>
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
