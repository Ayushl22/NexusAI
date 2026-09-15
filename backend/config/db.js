import mongoose from "mongoose";

const globalCache = globalThis;

if (!globalCache.__nexusMongoose) {
    globalCache.__nexusMongoose = { connection: null, promise: null };
}

const connectDB = async () => {
    const cache = globalCache.__nexusMongoose;

    if (cache.connection && mongoose.connection.readyState === 1) {
        return cache.connection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }

    if (!cache.promise) {
        cache.promise = mongoose
            .connect(process.env.MONGODB_URI, {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000,
            })
            .then((mongooseInstance) => {
                console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
                return mongooseInstance;
            })
            .catch((error) => {
                cache.promise = null;
                throw error;
            });
    }

    cache.connection = await cache.promise;
    return cache.connection;
};

export default connectDB;
