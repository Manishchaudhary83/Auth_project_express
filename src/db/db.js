const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Failed to connect database", error.message);
        process.exit(1);
    }
};
module.exports =  connectDb ;
