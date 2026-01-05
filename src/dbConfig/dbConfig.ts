import mongoose from "mongoose";

export default function connection() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDb connection successfully');
        })
        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.' + err);
        })
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}