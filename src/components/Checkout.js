// Checkout.js

import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Checkout.css'; // Import CSS module for scoped styles

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ plan }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:3002/create-payment-intent', { plan });
            const clientSecret = data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
                setLoading(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    setSuccess(true);
                    setLoading(false);
                } else if (result.paymentIntent.status === 'requires_action') {
                    // Handle additional authentication (3D Secure) here if needed
                    setError('Payment requires additional authentication.');
                    setLoading(false);
                } else {
                    setError('Payment failed. Please try again.');
                    setLoading(false);
                }
            }
        } catch (error) {
            setError('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const handleDone = () => {
        navigate('/'); // Redirect to the home page or another appropriate page
    };

    return (
        <form className="checkout-form" onSubmit={handleSubmit}>
            <CardElement />
            {error && <div>{error}</div>}
            <button className="pay-btn" type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
            {success && (
                <div className="checkout-status">
                    <div>Payment Successful!</div>
                    <button className="pay-btn" type="button" onClick={handleDone}>Done</button>
                </div>
            )}
        </form>
    );
};

const Checkout = () => {
    const [plan, setPlan] = useState('dev');

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const selectedPlan = query.get('plan');
        setPlan(selectedPlan || 'dev');
    }, []);

    return (
        <div>
            <h1>Complete your purchase</h1>
            <Elements stripe={stripePromise}>
                <CheckoutForm plan={plan} />
            </Elements>
        </div>
    );
};

export default Checkout;
