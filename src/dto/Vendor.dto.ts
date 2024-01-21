import { ExplainVerbosity } from "mongodb"

export interface CreateVendorInput{
    name:string,
    ownerName:string,
    foodType:[string],
    pincode:string,
    address:string,
    phone:string,
    email:string,
    password:string
}

export interface VendorLoginInputs{
    email:string,
    password:string
}

export interface VendorPayload{
    _id:string,
    name:string,
    email:string
    foodType:[string],
}

export interface EditVendorInput{
    name:string,
    foodType:[string],
    phone:string,
    address:string

}

export interface CreateOfferInputs{
    offerType:string,
    title:string,
    description:string,
    minValue:number,
    offerAmount:number,
    startValidity:Date,
    endValidity:Date,
    promocode:string,
    promoType:string,
    bank:[string],
    bins:[string],
    pincode:string,
    isActive:boolean
}