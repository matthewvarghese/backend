const express = require("express");
const path = require("path");
const collection = require("./src/config");
const bcrypt = require('bcrypt');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51Q4W3pJg8Ivon8W3M3jS7fV29OjadfbrH1SzpbcROGLAQpz6lFoEvJzn8HGE7K5mcCkgeVgq4L2fChxl9nHME70E00AEucZaYM');


const app = express();
app.use(express.static('public'));

app.use(express.json());
app.use(cors({
    origin: 'https://artemis-shopping.netlify.app', 
    credentials: true 
}));

app.use(express.urlencoded({ extended: false }));


let loggedInEmail = null;

app.post("/api/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists. Please choose a different username.' });
    } else {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword; 

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        return res.status(201).json({ message: 'User registered successfully.' });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const check = await collection.findOne({ name: email });
        if (!check) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isPasswordMatch = await bcrypt.compare(password, check.password);
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Wrong password" });
        } else {
            loggedInEmail = email;
            console.log('Logged in user email:', loggedInEmail);
            return res.status(200).json({ message: 'Login successful' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/api/submit-data', async (req, res) => {
  const { email, firstName, lastName, phoneNumber, age, gender, state, school } = req.body;

  console.log("Received Data:", req.body);
  
  if (email !== loggedInEmail) {
    return res.status(400).json({ error: 'Please use the email you used to login.' });
  }

  try {
    const updatedUser = await collection.findOneAndUpdate(
      { name: email }, 
      { firstName, lastName, phoneNumber, age, gender, state, school }, 
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});


app.get("/api/profile", async (req, res) => {
    console.log("Profile endpoint ");
    console.log('Logged in user email:', loggedInEmail);
    if (!loggedInEmail) {
        return res.status(401).json({ message: "User not logged in." });
    }

    try {
        const userProfile = await collection.findOne({ name: loggedInEmail }); 
        if (!userProfile) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        console.log('Request body:', req.body); 
        
        const { priceId } = req.body; 
        if (!priceId) {
            return res.status(400).json({ error: 'Price ID is required.' }); 
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
            line_items: [
                {
                    price: priceId, 
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });

        res.json({ url: session.url }); 
    } catch (error) {
        console.error('Error creating checkout session:', error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  

  app.get('/api/products', async (req, res) => {
    try {
        const products = await stripe.products.list();
        const prices = await stripe.prices.list();
        
        const productsWithPrices = products.data.map(product => {
            const price = prices.data.find(price => price.product === product.id);
            return {
                id: product.id,
                name: product.name,
                image: product.images[0], 
                price: price.unit_amount,  
                priceId: price.id  
            };
        });

        res.json(productsWithPrices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching products');
    }
});

app.options('*', cors()); 
  // Start the server
  const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

  