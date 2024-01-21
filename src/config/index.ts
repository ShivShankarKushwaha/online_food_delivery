require('dotenv').config();

export const MongoUri = process.env.MongoUri as string;
export const App_Secret = process.env.App_Secret;
export const AccountSid = process.env.AccountSid;
export const AuthToken = process.env.AuthToken;
export const PhoneNumber = process.env.PhoneNumber;
export const VERIFYSID = process.env.VERIFYSID;
export const port = process.env.PORT || 5500;