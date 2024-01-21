import express from 'express'
import App from './services/ExpressApp'
import dbConnect from './services/Database'
import { port } from './config';

const startServer = async()=>
{
    const app= express();
    await dbConnect();
    await App(app);
    app.listen(port,()=>{console.log('listening on port'+port);})
}
startServer();