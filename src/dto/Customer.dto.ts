import { IsEmail, Length } from 'class-validator'
export class CreateCustomerInput{
    @IsEmail()
    email:string

    @Length(7,12)
    phone:string

    @Length(6,12)
    password:string
}


export class EditCustomerProfileInputs {
    @Length(3,16)
    firstName:string

    @Length(3,16)
    lastName:string
    
    @Length(6,30)
    address:string
}

export class UserLoginInputs{
    @IsEmail()
    email:string


    @Length(6,12)
    password:string
}

export interface CustomerPayload{
    _id:string
    email:string
    verified:boolean
}

export class CartInputs{
    _id:string
    unit:number
}

export class OrderInputs {
  txnId: string;
  amount: string;
  items: [CartInputs];
}