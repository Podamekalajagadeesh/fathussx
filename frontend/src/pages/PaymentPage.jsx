import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import api from '../services/api';

const stripePromise = loadStripe('pk_test_...your_public_key...');

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await api.post('/api/payments/create-payment-intent', {
          amount: 1000, // Example amount in cents
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error('Failed to create payment intent.');
      }
    };
    createPaymentIntent();
  }, []);

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;