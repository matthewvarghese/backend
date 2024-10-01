// // This is your test secret API key
// const stripe = require('stripe')('sk_test_51Q4W3pJg8Ivon8W3M3jS7fV29OjadfbrH1SzpbcROGLAQpz6lFoEvJzn8HGE7K5mcCkgeVgq4L2fChxl9nHME70E00AEucZaYM');
// const express = require('express');
// const app = express();
// app.use(express.static('public'));

// const YOUR_DOMAIN = 'http://localhost:3000';

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     ui_mode: 'embedded',
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
//     automatic_tax: {enabled: true},
//   });

//   res.send({clientSecret: session.client_secret});
// });

// app.get('/session-status', async (req, res) => {
//   const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

//   res.send({
//     status: session.status,
//     customer_email: session.customer_details.email
//   });
// });

// app.listen(3000, () => console.log('Running on port 3000'));

// // // API endpoint to fetch the profile data of the logged-in user
// // app.get('/api/profile', async (req, res) => {
// //     // Assume you have a global variable or mechanism to get the logged-in user's email
// //     const email = loggedInEmail; // Use the global variable for the email
    
// //     // Log the email for debugging
// //     console.log("Fetching data for email:", email);
    
// //     try {
// //       // Find user by email
// //       const user = await collection.findOne({ name: email });
  
// //       // If user is not found
// //       if (!user) {
// //         console.log("User not found for email:", email);
// //         return res.status(404).json({ message: 'User not found' });
// //       }
  
// //       // Return the entire user data
// //       res.status(200).json(user); // Send back all user data
// //     } catch (error) {
// //       // Log any errors for debugging
// //       console.error("Error fetching user data:", error);
// //       res.status(500).json({ message: 'Server error occurred' });
// //     }
// //   });