import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { VendorPayload,AuthPayload } from '../dto';
import { App_Secret } from '../config';
import { Request } from 'express';
export const GenerateSalt = async() => {
    const salt = await bcrypt.genSalt(10)
    return salt;
}

export const hashPassword = async(password:string,salt:string) => {
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

export const ValidatePassword = async(password:string,hashedPassword:string,salt:string) => {
    return await hashPassword(password,salt) === hashedPassword;
}

export const GenerateSignature = async(payload:AuthPayload) => {
    return await jwt.sign(payload,App_Secret as string,{expiresIn:'1d'})
}

export const ValidateSignature = async(req:Request) => {
    const signature = req.get('Authorization');
    if(signature)
    {
        const payload = await jwt.verify(signature.split(' ')[1],App_Secret as string) as AuthPayload;
        req.user = payload;
        return true;
    }
    return false;
}