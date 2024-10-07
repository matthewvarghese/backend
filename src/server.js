// const express = require("express");
// const path = require("path");
// const collection = require("./config");
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const stripe = require('stripe')('sk_test_51Q4W3pJg8Ivon8W3M3jS7fV29OjadfbrH1SzpbcROGLAQpz6lFoEvJzn8HGE7K5mcCkgeVgq4L2fChxl9nHME70E00AEucZaYM');

// const app = express();

// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3001', 
//     credentials: true 
// }));

// app.use(express.urlencoded({ extended: false }));

// app.post('/create-checkout-session', async (req, res) => {
//     try {
//       const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             price_data: {
//               currency: 'usd',
//               product_data: {
//                 name: 'T-shirt',
//               },
//               unit_amount: 2000,
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: 'http://localhost:3000/success',
//         cancel_url: 'http://localhost:3000/cancel',
//       });
  
//       res.redirect(303, session.url);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });

//   app.get('/test', (req, res) => {
//     res.send('Server is working!');
//   });

  
//   // Start the server
//   const port = 3000;
//   app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//   });
  