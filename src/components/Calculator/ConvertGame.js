import React, { useEffect, useState } from 'react';



const ConvertGame = () => {
    const [sourceGameInput, setSourceGameInput] = useState('');
    const [targetGameInput, setTargetGameInput] = useState('');
    const [sourceGameSuggestions, setSourceGameSuggestions] = useState([]);
    const [targetGameSuggestions, setTargetGameSuggestions] = useState([]);
    const [inputSensitivity, setInputSensitivity] = useState('');
    const [convertedSensitivity, setConvertedSensitivity] = useState('');
    const [error, setError] = useState('');
    const [games, setGames] = useState({});
    const [GameList, setGameList] = useState([]);




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
            const stringArray = Object.values(data).map((game) => game.game);
            setGameList(stringArray);
        } catch (error) {
            console.error('Error fetching games:', error);
            setError('Failed to fetch games. Please try again.');
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


    return (
        <fieldset className="mt-5" id="msform">
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
};

export default ConvertGame;