"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OfferSchema = new mongoose_1.Schema({
    offerType: {
        type: String,
        required: true,
    },
    vendors: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'Vendor',
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    minValue: {
        type: Number,
    },
    offerAmount: {
        type: Number,
        required: true,
    },
    startValidity: Date,
    endValidity: Date,
    promocode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [String],
    bins: [String],
    pincode: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
    },
    timestamps: true,
});
const Offer = mongoose_1.default.model('Offer', OfferSchema);
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map