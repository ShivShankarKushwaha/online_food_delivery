import Express, { Application } from 'express';
import path from 'path';
import { AdminRoute, CustomerRoute, ShoppingRouter, VendorRoute } from '../routes';

export default async(app:Application)=>
{
    app.use(Express.urlencoded({ extended: true }));
    app.use(Express.json());
    app.use('/images', Express.static(path.join(__dirname, '../images')));
    
    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use("/customer",CustomerRoute)
    app.use(ShoppingRouter)
    app.get('*',(req,res)=>{res.status(400).json({message:'page not found'})})
    return app;
}
