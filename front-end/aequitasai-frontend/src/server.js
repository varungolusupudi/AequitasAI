require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51PUb85FB4K1yJcTi0GyGOMLvawR71ZYg7ZdNclzrz8C1Hd7VghbH5FEyWmJMzK4dPF7lOQi5YSSEXgzpAcgI2zvi005pzvhFDb');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/dashboard',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(4242, () => console.log('Running on port 4242'));
