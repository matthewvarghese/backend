const mongoose = require('mongoose');

// Connect to the MongoDB databa
const connect = mongoose.connect("mongodb+srv://MattVarghese:Thumbtack123@cluster0.mx5en.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0");

// Check if the database is connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.error("Database connection error:", err);
});

const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Email is required'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },

    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']  
    },
    age: {
        type: Number,
        required: false,
        min: 0  
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], 
        required: false
    },
    state: {
        type: String,
        required: false
    },
    school: {
        type: String,
        required: false
    }
    
});





const collection = mongoose.model("users", Loginschema);

module.exports = collection
