import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Transaction, Vendor } from "../model";
import { GenerateSalt, hashPassword } from "../helper";

export const findVendor =async(id:string|undefined,email?:string) => {
    if(email)
    {
        return await Vendor.findOne({email});
    }
    return await Vendor.findById(id);
}

export const createVendor =async (req:Request,res:Response,next:NextFunction) => {
    const {name,address,email,foodType,ownerName,password,phone,pincode} = <CreateVendorInput>req.body;
    const existVendor = await findVendor(undefined,email);
    
    if(existVendor)
    {
        return res.json({message:'vendor already exist'})
    }

    // generate a salt
    const salt = await GenerateSalt();
    // generate a password hash with salt
    const hashedPassword = await hashPassword(password,salt);
    // create a vendor
    const createVendor =await  Vendor.create({
        name, address, email, foodType, ownerName, password:hashedPassword, phone, pincode,rating:0,salt:salt,serviceAvailable:false,coverImages:[],foods:[],lat:0,lng:0
    })
    return res.json(createVendor);
}

export const GetVendors = async(req:Request,res:Response,next:NextFunction) => {
    const vendors = await Vendor.find();
    if(vendors)
    {
        return res.json(vendors)
    }
    return res.json({message:'no vendor found'})
}

export const GetVendorById = async(req:Request,res:Response,next:NextFunction) => {
    const vendorId = req.params.id;
    const vendor = await findVendor(vendorId);
    if(vendor)
    {
        return res.json(vendor)
    }
    return res.json({message:'Vendor data not available'})
}


export const GetTransactionById = async(req:Request,res:Response,next:NextFunction) => {
    const txnId = req.params.id;
    const transaction = await Transaction.findById(txnId);
    if(transaction)
    {
        return res.json(transaction)
    }
    return res.json({message:'transaction data not available'})
}

export const GetTransactions = async(req:Request,res:Response,next:NextFunction) => {
    const transaction = await Transaction.find();
    if(transaction)
    {
        return res.json(transaction)
    }
    return res.json({message:'transaction data not available'})
}
