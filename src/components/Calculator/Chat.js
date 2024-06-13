import React, { useState } from 'react';
import "./Chat.CSS";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const prompt = `${input}`

        const userMessage = { text: prompt, sender: "user" };


        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const response = await fetch('http://localhost:3002/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const gptMessage = { text: data.response, sender: "gpt" };
            setMessages([...messages, userMessage, gptMessage]);
            console.log(gptMessage)
        } catch (error) {
            console.error("Error fetching GPT response:", error);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
