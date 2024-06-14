import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const ConvertGame = () => {
    const [sourceGameInput, setSourceGameInput] = useState('');
    const [targetGameInput, setTargetGameInput] = useState('');
    const [inputSensitivity, setInputSensitivity] = useState('');
    const [convertedSensitivity, setConvertedSensitivity] = useState('');
    const [error, setError] = useState('');
    const [games, setGames] = useState([]);
    const [filteredSourceGames, setFilteredSourceGames] = useState([]);
    const [filteredTargetGames, setFilteredTargetGames] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3002/fetchGameNames?gameName=random');
            if (!response.ok) {
                throw new Error('Failed to fetch games.');
            }
            const data = await response.json();
            setGames(Object.values(data));
        } catch (error) {
            console.error('Error fetching games:', error);
            setError('Failed to fetch games. Please try again.');
        } finally {
            setLoading(false);
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

    const handleInputChange = (event, setInput, setFilteredGames) => {
        const value = event.target.value;
        setInput(value);
        const filtered = games.filter(game =>
            game.game.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredGames(filtered);
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
                <fieldset className="mt-5" id="msform">
                    <h3 className="fs-subtitle">Convert Game Sensitivity</h3>
                    <h2 className="fs-title">Source Game</h2>
                    <input
                        type="text"
                        name="sourceGame"
                        placeholder="Enter source game name"
                        value={sourceGameInput}
                        onChange={(e) => handleInputChange(e, setSourceGameInput, setFilteredSourceGames)}
                        list="sourceGameSuggestions"
                    />
                    <datalist id="sourceGameSuggestions">
                        {filteredSourceGames.map((game, index) => (
                            <option key={index} value={game.game} />
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
                        onChange={(e) => handleInputChange(e, setTargetGameInput, setFilteredTargetGames)}
                        list="targetGameSuggestions"
                    />
                    <datalist id="targetGameSuggestions">
                        {filteredTargetGames.map((game, index) => (
                            <option key={index} value={game.game} />
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
            )}
        </div>
    );
};

export default ConvertGame;
