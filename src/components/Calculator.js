import React from 'react';
import { NavLink, Outlet } from "react-router-dom";
import './Calculator.css';

const Calculator = () => {

    return (
        <>
            <div className="calculator-container">
                <div className="robot-container">
                    <img src={process.env.PUBLIC_URL + '/bot.gif'} alt="Robot GIF" className="robot-gif" />
                </div>
                <div className="navigate-container">
                    <div className="d-flex mt-5 justify-content-center">
                        <NavLink
                            className={({ isActive }) => isActive ? "route-item active" : "route-item"}
                            to='/calculator/calculate-sensitivity'
                        >
                            Calculate Sensitivity
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => isActive ? "route-item active" : "route-item"}
                            to='/calculator/convert-game'
                        >
                            Convert a Game
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => isActive ? "route-item active" : "route-item"}
                            to='/calculator/chat'
                        >
                            Get a Suggestion
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => isActive ? "route-item active" : "route-item"}
                            to='/calculator/translate-game'
                        >
                            Translate Game
                        </NavLink>
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Calculator;
