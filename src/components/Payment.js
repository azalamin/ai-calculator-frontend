// Payment.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection
import './Payment.css'; // Import CSS module for scoped styles

const Payment = () => {
    const [plan, setPlan] = useState('dev');

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleRedirect = (selectedPlan) => {
        setPlan(selectedPlan);
        navigate(`/checkout?plan=${selectedPlan}`); // Redirect to the checkout page with the selected plan
    };

    return (
        <div>
            <h1>Choose the plan that fits you</h1>
            <p>You can choose plan from following pricing table!!</p>

            <div className="pricing">
                <div className="plan" onClick={() => handleRedirect('dev')}>
                    <h2>Dev</h2>
                    <div className="price">FREE</div>
                    <ul className="features">
                        <li><i className="fas fa-check-circle"></i> Unlimited Websites</li>
                        <li><i className="fas fa-check-circle"></i> 1 User</li>
                        <li><i className="fas fa-check-circle"></i> 100MB Space/website</li>
                        <li><i className="fas fa-check-circle"></i> Continuous deployment</li>
                        <li><i className="fas fa-times-circle"></i> No priority support</li>
                    </ul>
                    <button>Signup</button>
                </div>
                <div className="plan popular" onClick={() => handleRedirect('pro')}>
                    <span>Most Popular</span>
                    <h2>Pro</h2>
                    <div className="price">$10/month</div>
                    <ul className="features">
                        <li><i className="fas fa-check-circle"></i> Unlimited Websites</li>
                        <li><i className="fas fa-check-circle"></i> 5 Users</li>
                        <li><i className="fas fa-check-circle"></i> 512MB Space/website</li>
                        <li><i className="fas fa-check-circle"></i> Continuous deployment</li>
                        <li><i className="fas fa-check-circle"></i> Email Support</li>
                    </ul>
                    <button>Buy Now</button>
                </div>
                <div className="plan" onClick={() => handleRedirect('enterprise')}>
                    <h2>Enterprise</h2>
                    <div className="price">Custom Pricing</div>
                    <ul className="features">
                        <li><i className="fas fa-check-circle"></i> Unlimited Websites</li>
                        <li><i className="fas fa-check-circle"></i> Unlimited Users</li>
                        <li><i className="fas fa-check-circle"></i> Unlimited Space/website</li>
                        <li><i className="fas fa-check-circle"></i> Continuous deployment</li>
                        <li><i className="fas fa-check-circle"></i> 24/7 Email support</li>
                    </ul>
                    <button>Contact Us</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
