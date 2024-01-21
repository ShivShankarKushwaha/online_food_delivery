import express from 'express'
import { AddFood, AddOffer, EditOffer, GetFoods, GetOffers, GetOrderDetails, GetOrders, ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin, getVendorProfile } from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';
import path from 'path';
const router = express.Router();
import fs from 'fs';

const imagesDir = path.join(__dirname, '../images');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,path.join(__dirname,'../images'))
    },
    filename:function(req,file,cb)
    {
        cb(null,new Date().toDateString()+'_'+file.originalname)
    }
})
const images = multer({storage:imageStorage}).array('images',10)


router.post("/login",VendorLogin);

router.use(Authenticate);
router.get("/profile",getVendorProfile);
router.patch("/coverimage",images,UpdateVendorCoverImage);
router.patch("/profile",UpdateVendorProfile);
router.patch("/service",UpdateVendorService);

router.post("/food",images,AddFood);
router.get('/foods',GetFoods);

// Orders
router.get("/orders",GetOrders)
router.put("/order/:id/process",ProcessOrder)
router.get("/order/:id",GetOrderDetails)

// Offers
router.get("/offers",GetOffers);
router.post("/offer",AddOffer);
router.put("/offer/:id",EditOffer);


export {router as VendorRoute}