// Payment.js

import React from 'react';
import styles from './Payment.css'; // Import CSS module for scoped styles

function Payment() {
    return (
        <div>
            <h1>Choose the plan that fits you</h1>
            <p>
                You can choose plan from following pricing table!!
            </p>

            <div className="pricing">
                <div className="plan">
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
                <div className="plan popular">
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
                <div className="plan">
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
}

export default Payment;
