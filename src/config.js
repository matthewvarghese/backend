const mongoose = require('mongoose');

// Connect to the MongoDB databa
const connect = mongoose.connect("mongodb+srv://MattVarghese:Thumbtack123@cluster0.mx5en.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0");

// Check if the database is connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.error("Database connection error:", err);
});

// Create the user schema
const Loginschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        //required: true
    },

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']  
    },
    age: {
        type: Number,
        required: true,
        min: 0  
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], 
        required: true
    },
    state: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    }
});


// Create the user model based on the schema
const collection = mongoose.model("users", Loginschema);

module.exports = collection
