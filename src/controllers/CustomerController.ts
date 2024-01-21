import express, { Request, Response } from 'express'
import {plainToClass} from 'class-transformer'
import { CartInputs, CreateCustomerInput, EditCustomerProfileInputs, OrderInputs, UserLoginInputs } from '../dto'
import { validate } from 'class-validator'
import { GenearteOtp, GenerateSalt, GenerateSignature, ValidatePassword, hashPassword, onRequestOtp } from '../helper'
import { Customer, Food, Offer, Transaction } from '../model'
import { Order } from '../model'
export const CustomerSignUp =async(req:Request,res:Response)=>
{
    const customerInput = plainToClass(CreateCustomerInput,req.body)
    const inputErrors = await validate(customerInput,{validationError:{target:true}})
    if(inputErrors.length>0)
    {
        return res.status(400).json(inputErrors)
    }
    const {email,password,phone} = customerInput
    const salt = await GenerateSalt();
    const userPassword = await hashPassword(password,salt)

    const {otp,expiry} =GenearteOtp();
    console.log('sent otp',otp);
    

    const ExistCustomer = await Customer.findOne({email:email})
    if(ExistCustomer)
    {
        return res.status(300).json({message:'User already exist'});
    }

    const result = await Customer.create({
      email,
      password: userPassword,
      salt,
      otp,
      otp_expiry: expiry,
      firstName: '',
      lastName: '',
      address: '',
      phone,
      verified: false,
      lat: 0,
      lng: 0,
      orders: [],
    });
    if(result)
    {
        // send the otp to customer
        const responce = await onRequestOtp(otp,phone)
        console.log(responce);
        
        // generate the signature
        const signature = await GenerateSignature({
            _id:result._id,
            email,
            verified:result.verified
        });

        // send the result ot client
        return res.status(200).json({signature:signature,verified:result.verified,email:result.email})
    }
    return res.status(400).json({message:'User not signed Up'})
    
}
export const CustomerLogin =async(req:Request,res:Response)=>
{
    const loginInputs = plainToClass(UserLoginInputs,req.body);
    const LoginErrors = await validate(loginInputs,{validationError:{target:true}});
    if (LoginErrors.length > 0) {
      return res.status(400).json(LoginErrors);
    }
    const {email,password} = loginInputs;
    const customer = await Customer.findOne({email:email});
    if(customer)
    {
        const validation = await ValidatePassword(password,customer.password,customer.salt);
        if(validation)
        {
            const signature = await GenerateSignature({
                _id:customer._id,
                email:customer.email,
                verified:customer.verified
            })

            // send the result to client
            return res.status(200).json({ signature: signature, verified: customer.verified, email: customer.email });
        }
        return res.status(400).json({message:'Invalid credentials'})
    }
    return res.status(404).json({message:'Customer not found'})
}
export const CustomerVerify =async(req:Request,res:Response)=>
{
    const {otp}= req.body;
    const customer = req.user;
    if(customer)
    {
        const profile = await Customer.findOne({_id:customer._id})
        if(profile)
        {
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date())
            {
                profile.verified = true;
                const updateCustomerResponce = await profile.save();

                const signature = await GenerateSignature({
                    _id:updateCustomerResponce._id,
                    email:updateCustomerResponce.email,
                    verified:updateCustomerResponce.verified
                })

                return res.status(200).json({signature:signature,verified:updateCustomerResponce.verified,email:updateCustomerResponce.email})
            }
            return res.status(400).json({message:'invalid otp'})
        }
        return res.status(400).json({message:'user not found'})
    }
    return res.status(400).json({message:'Customer not found'})
}
export const RequestOtp =async(req:Request,res:Response)=>
{
    const customer = req.user;
    if(customer)
    {
        const profile = await Customer.findOne({_id:customer._id})
        if(profile)
        {
            const {otp,expiry} = GenearteOtp();
            profile.otp=otp;
            profile.otp_expiry =expiry;
            await profile.save();
            await onRequestOtp(otp,profile.phone)
            return res.status(200).json({message:'otp sent to your registered phone number'})
        }
    }
    return res.status(400).json({message:'Error on request otp'})
}
export const GetCustomerProfile =async(req:Request,res:Response)=>
{
    const customer = req.user;
    if(customer)
    {
        const profile = await Customer.findOne({_id:customer._id})
        if(profile)
        {
            return res.status(200).json(profile)
        }
    }
    return res.status(400).json({message:'Error on get profile'})
}
export const EditCustomerProfile =async(req:Request,res:Response)=>
{
    const customer = req.user;
    const profileInputs = plainToClass(EditCustomerProfileInputs,req.body);
    const profileErrors = await validate(profileInputs,{validationError:{target:true}});
    if (profileErrors.length > 0) {
      return res.status(400).json(profileErrors);
    }
    
    const {firstName,lastName,address} = profileInputs
    if(customer)
    {
        const profile = await Customer.findOne({_id:customer._id})
        if(profile)
        {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save();
            return res.status(200).json(result)
        }
    }
    return res.status(400).json({message:'Error on edit profile'})

}

/******************************* Cart Section ************************************/

export const AddtoCart =async (req:Request,res:Response) => {
    const customer = req.user;
    
    if(customer)
    {
        const profile = await(await Customer.findOne({_id:customer._id})).populate('cart.food');
        
        let cartItems = Array();
        if(profile)
        {
            const {_id,unit} = <CartInputs>req.body;
            const food = await Food.findById(_id);
            console.log('food',food);
            
            if(food)
            {
                cartItems =profile.cart;
                if(cartItems.length>0)
                {
                    let existedFood = cartItems.filter((item)=>item.food._id.toString()==_id);
                    if(existedFood.length>0)
                    {
                        const index = cartItems.indexOf(existedFood[0]);
                        if(unit>0)
                        {
                            cartItems[index]= {food,unit}
                        }
                        else
                        {
                            cartItems.splice(index,1);
                        }
                    }
                    else
                    {
                        cartItems.push({food,unit})
                    }
                }
                else
                {
                    cartItems.push({food,unit})
                }
                if(cartItems)
                {
                    profile.cart = cartItems as any;
                    const result = await profile.save();
                    return res.status(200).json(result.cart)
                }
            }
        }
    }
    return res.status(400).json({message:'Error on add to cart'})
}

export const GetCart =async (req:Request,res:Response) => {
    const customer = req.user;
    
    if(customer)
    {
        const profile = await(await Customer.findOne({_id:customer._id})).populate('cart.food');
        if(profile)
        {
            return res.status(200).json(profile.cart)
        }
    }
    return res.status(400).json({message:'Cart is empty'})
}

export const DeleteCart =async (req:Request,res:Response) => {
    const customer = req.user;

    if (customer) {
        const profile = await(await Customer.findOne({ _id: customer._id })).populate('cart.food');
        if (profile) {
            profile.cart =[] as any;
            const cartResult = await profile.save();
            return res.status(200).json(cartResult);
        }
    }
    return res.status(400).json({ message: 'Cart is already empty' });
}

/*************************** create payment******************************/
export const CreatePayment = async (req: Request, res: Response) => {
  const customer = req.user;
  const { amount, paymentMode, offerId } = req.body;
  let payableAmount = Number(amount);
  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);
    if (appliedOffer && appliedOffer.isActive) {
      payableAmount = payableAmount - appliedOffer.offerAmount;
    }
  }
  // perform Payment gateway charge api call

  // right after payment gateway success / failure response

  // create record on transaction
  const transaction = await Transaction.create({
    customer: customer._id,
    vendorId: '',
    orderId: '',
    orderValue: payableAmount,
    offerUsed: offerId || 'NA',
    status: 'OPEN',
    paymentMode,
    paymentResponse: 'Payment is Cash on Delivery',
  });

  // return transaction ID
  return res.status(200).json(transaction);
};

/*************************** Delivery Notification ******************************/
const assignOrderForDelivery = async (orderId: string,vendorId:string) => {
    // find the vendor

    // find the available delivery person

    // check the nearest delivery person and assign the order

    // update deliveryId
}

/******************************** Order Section ***********************************/
const ValidateTransaction = async (txnId: string) => {
    const currentTransaction = await Transaction.findById(txnId);
    if(currentTransaction)
    {
        if(currentTransaction.status.toLowerCase()!=='failed')
        {
            return {status:true,currentTransaction}
        }
        return {status:false,currentTransaction}
    }
}

export const CreateOrder =async (req:Request,res:Response) => {
    
    // grab current customer login
    const customer = req.user;
    const {amount,items,txnId} = <OrderInputs>req.body;
    if(customer)
    {
        //  validate transaction
        const {status,currentTransaction} = await ValidateTransaction(txnId);
        if(!status)
        {
            return res.status(400).json({message:'Error with create order'});
        }
        // create an order id
        const orderId = `${Math.floor(Math.random()*8999)+1000}`;
        const profile = await Customer.findOne({_id:customer._id})

        // grab order items from request
        let cartItems = Array();
        let netAmount =0;
        let vendorId;
        // calculate order amount
        const foods = await Food.find().where('_id').in(items.map((item)=>item._id)).exec();

        foods.map((food)=>
        {
            items.map(({ _id, unit }) => {
              if (food.id == _id) {
                vendorId = food.vendorId;
                netAmount += food.price * unit;
                cartItems.push({ food, unit });
              }
            });
        })
        // create item with order description
        if(cartItems)
        {
            // create order
            const currentOrder = await Order.create({
                OrderId:orderId,
                vendorId:vendorId,
                items:cartItems,
                totalAmount:netAmount,
                paidAmount:amount,
                OrderDate:new Date(),
                paidThrough:'COD',
                paymentResponse:'',
                orderStatus:'Waiting',
                remarks:'',
                deliveryId:'',
                appliedOffers:false,
                offerId:null,
                readyTime:45
            })
            // Finally update orders to user account
            if(currentOrder)
            {
                profile.cart= [] as any;
                profile.orders.push(currentOrder.id);
                currentTransaction.vendorId=vendorId;
                currentTransaction.orderId=orderId;
                currentTransaction.status='CONFIRMED';
                await currentTransaction.save();

                // assign order for delivery
                assignOrderForDelivery(currentOrder._id.toString(),vendorId)

                const profileResponse=await profile.save();
                return res.status(200).json(currentOrder)
            }
        }
    }
    return res.status(400).json({message:'Error with order creation'})
}
export const GetOrders =async (req:Request,res:Response) => {
    const user = req.user;
    if(user)
    {
        const profile = await (await Customer.findById(user._id)).populate('orders');
        if(profile)
        {
            return res.status(200).json(profile.orders)
        }
    }
    return res.status(400).json({message:'Error on get orders'})
}
export const GetOrderById =async (req:Request,res:Response) => {
    const orderId = req.params.id;
    if(orderId)
    {
        const order= await  Order.findById(orderId).populate('items.food');
        return res.status(200).json(order)
    }
}

export const VeriFyOffer = async(req:Request,res:Response) => {
    const offerId = req.params.id;
    const customer = req.user;
    if(customer)
    {
        const appliedOffer = await Offer.findById(offerId);
        if(appliedOffer)
        {
            if(appliedOffer.isActive)
            {
                if(appliedOffer.promoType==='USER')
                {

                }  
                else
                {
                    return res.status(200).json({message:'Offer is valid',offer:appliedOffer})

                }
            }
            return res.status(300).json({message:'Offer expired'})
        }
    }
    return res.status(400).json({message:'Offer is not valid'})
}

