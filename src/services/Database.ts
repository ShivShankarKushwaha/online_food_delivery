import mongoose from "mongoose";
import { MongoUri } from "../config";

export default async()=>
{
    
    try {
        await mongoose.connect(MongoUri);
        console.log('database connected');
        
    } catch (error) {
        console.log('database error',error);
        
    }
}