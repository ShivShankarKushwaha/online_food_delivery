"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.VERIFYSID = exports.PhoneNumber = exports.AuthToken = exports.AccountSid = exports.App_Secret = exports.MongoUri = void 0;
require('dotenv').config();
exports.MongoUri = process.env.MongoUri;
exports.App_Secret = process.env.App_Secret;
exports.AccountSid = process.env.AccountSid;
exports.AuthToken = process.env.AuthToken;
exports.PhoneNumber = process.env.PhoneNumber;
exports.VERIFYSID = process.env.VERIFYSID;
exports.port = process.env.PORT || 5500;
//# sourceMappingURL=index.js.map