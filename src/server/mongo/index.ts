/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose, { Mongoose } from "mongoose";

import { MONGO_URI } from "$env/static/private";

let cached: Mongoose = global.mongoose || { conn: null, promise: null };

export default async function () {
    console.log(MONGO_URI)
    if (cached.conn) {
        console.log("Cached mongodb is called!");
        return cached.conn;
    }

    if (!cached.promise) {
        mongoose.set("strictQuery", true);
        cached.promise = await mongoose.connect(MONGO_URI);
        console.log("connected to mongoDB!");
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
