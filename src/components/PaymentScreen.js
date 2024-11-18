import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CustomCardElement = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [formErrors, setFormErrors] = useState({
        name: '',
        addressLine1: '',
        addressLine2: '',
    });

    const cardStyle = {
        style: {
            base: {
                color: '#303238',
                fontSize: '1rem',
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                    color: 'indigo',
                },
            },
            invalid: {
                color: '#e5424d',
            },
        },
    };

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!addressLine1) errors.addressLine1 = 'Address Line 1 is required';
        if (!addressLine2) errors.addressLine2 = 'Address Line 2 is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);

        // on submitting a payment method is created with the card details
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                name: name,
                address: {
                    line1: addressLine1,
                    line2: addressLine2,
                },
            },
        });

        setLoading(false);

        if (error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage('');
            console.log('PaymentMethod created:', paymentMethod);

            // Get client secret from the backend (from PaymentIntent creation)
            const CLIENT_SECRET = localStorage.getItem("CLIENT_SECRET");

            // Confirm the PaymentIntent with the created payment method
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                CLIENT_SECRET,
                {
                    payment_method: paymentMethod.id,
                }
            );

            if (confirmError) {
                setErrorMessage(confirmError.message);
                return;
            }

            // Handle 3D Secure authentication if required
            if (paymentIntent.status === 'requires_action') {
                // If 3D Secure authentication is required
                console.log('3D Secure authentication is required');
                
                // Use stripe.handleCardAction to handle the action
                const { error: actionError } = await stripe.handleCardAction(paymentIntent.client_secret);
                
                if (actionError) {
                    setErrorMessage(actionError.message);
                    return;
                }

                // Now reattempt confirming the payment after 3D Secure authentication
                const { paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
                    CLIENT_SECRET,
                    {
                        payment_method: paymentMethod.id,
                    }
                );

                if (confirmedPaymentIntent.status === 'succeeded') {
                    console.log('Payment succeeded!');
                    // Proceed to success page or show confirmation
                } else {
                    setErrorMessage('Payment failed.');
                }
            } else if (paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded!');
                // Proceed to success page or show confirmation
            } else {
                setErrorMessage('Payment failed.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <label style={labelStyle}>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                style={inputStyle}
            />
            {formErrors.name && <div style={errorStyle}>{formErrors.name}</div>}

            <label style={labelStyle}>Address Line 1</label>
            <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Address Line 1"
                style={inputStyle}
            />
            {formErrors.addressLine1 && <div style={errorStyle}>{formErrors.addressLine1}</div>}

            <label style={labelStyle}>Address Line 2</label>
            <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Address Line 2"
                style={inputStyle}
            />
            {formErrors.addressLine2 && <div style={errorStyle}>{formErrors.addressLine2}</div>}

            <label style={labelStyle}>Card Details</label>
            <div style={cardElementContainerStyle}>
                <CardElement options={cardStyle}  />
            </div>

            {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

            <button type="submit" disabled={!stripe || loading} style={buttonStyle}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
        </form>
    );
};

// Inline styles for better readability
const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '40px',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '8rem',
};

const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #eaeaea',
};

const cardElementContainerStyle = {
    border: '1px solid #eaeaea',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '20px',
};

const errorStyle = {
    color: '#e5424d',
    marginBottom: '10px',
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign: 'center',
};

export default CustomCardElement;
