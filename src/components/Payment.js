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

            <div class="pricing">
                <div class="plan">
                    <h2>Dev</h2>
                    <div class="price">FREE</div>
                    <ul class="features">
                        <li><i class="fas fa-check-circle"></i> Unlimited Websites</li>
                        <li><i class="fas fa-check-circle"></i> 1 User</li>
                        <li><i class="fas fa-check-circle"></i> 100MB Space/website</li>
                        <li><i class="fas fa-check-circle"></i> Continuous deployment</li>
                        <li><i class="fas fa-times-circle"></i> No priority support</li>
                    </ul>
                    <button>Signup</button>
                </div>
                <div class="plan popular">
                    <span>Most Popular</span>
                    <h2>Pro</h2>
                    <div class="price">$10/month</div>
                    <ul class="features">
                        <li><i class="fas fa-check-circle"></i> Unlimited Websites</li>
                        <li><i class="fas fa-check-circle"></i> 5 Users</li>
                        <li><i class="fas fa-check-circle"></i> 512MB Space/website</li>
                        <li><i class="fas fa-check-circle"></i> Continuous deployment</li>
                        <li><i class="fas fa-check-circle"></i> Email Support</li>
                    </ul>
                    <button>Buy Now</button>
                </div>
                <div class="plan">
                    <h2>Enterprise</h2>
                    <div class="price">Custom Pricing</div>
                    <ul class="features">
                        <li><i class="fas fa-check-circle"></i> Unlimited Websites</li>
                        <li><i class="fas fa-check-circle"></i> Unlimited Users</li>
                        <li><i class="fas fa-check-circle"></i> Unlimited Space/website</li>
                        <li><i class="fas fa-check-circle"></i> Continuous deployment</li>
                        <li><i class="fas fa-check-circle"></i> 24/7 Email support</li>
                    </ul>
                    <button>Contact Us</button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
