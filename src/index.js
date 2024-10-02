const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001', 
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



  
  // Start the server
  const port = 3000;
  app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
  });
  