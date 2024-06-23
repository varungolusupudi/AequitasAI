import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PUb85FB4K1yJcTiPZDsRF1a39E2hNh6U4RXcDNzltGwmZf9mnnWrYfdriIuriBdyoQIXWm0Ushlescq2azWTlvJ00P49HPdIB');

const Subscribe = () => {
  const { priceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCheckout = async () => {
      const stripe = await stripePromise;

      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
        navigate('/dashboard'); // Redirect to dashboard if there's an error
      }
    };

    handleCheckout();
  }, [priceId, navigate]);

  return <div>Redirecting to Stripe checkout...</div>;
};

export default Subscribe;
