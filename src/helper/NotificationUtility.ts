import { AuthToken, AccountSid, PhoneNumber, VERIFYSID } from '../config';

// Email

// Notification

// Otp

export function GenearteOtp() {
  const pinReturn: number = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp: pinReturn, expiry: expiry };
}

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const twilio = require('twilio');
  const client = new twilio(AccountSid, AuthToken);
  console.log('phonenumber',PhoneNumber);
  try {
    const responce = await client.messages.create({
      body: `Your otp is ${otp}`,
      from: PhoneNumber,
      to: `+91${toPhoneNumber}`,
    });
    return { responce, error: false };
  } catch (error) {
    return { responce: error, error: true };
  }
};

// Payment notification or emails
