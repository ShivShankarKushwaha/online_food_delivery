"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOtp = exports.GenearteOtp = void 0;
const config_1 = require("../config");
// Email
// Notification
// Otp
function GenearteOtp() {
    const pinReturn = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp: pinReturn, expiry: expiry };
}
exports.GenearteOtp = GenearteOtp;
const onRequestOtp = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const twilio = require('twilio');
    const client = new twilio(config_1.AccountSid, config_1.AuthToken);
    console.log('phonenumber', config_1.PhoneNumber);
    try {
        const responce = yield client.messages.create({
            body: `Your otp is ${otp}`,
            from: config_1.PhoneNumber,
            to: `+91${toPhoneNumber}`,
        });
        return { responce, error: false };
    }
    catch (error) {
        return { responce: error, error: true };
    }
});
exports.onRequestOtp = onRequestOtp;
// Payment notification or emails
//# sourceMappingURL=NotificationUtility.js.map