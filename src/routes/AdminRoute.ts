import express from 'express';
import { GetTransactionById, GetTransactions, GetVendorById, GetVendors, createVendor } from '../controllers';
const router = express.Router();

router.post('/vendor',createVendor)

router.get('/vendors',GetVendors);

router.get('/vendor/:id',GetVendorById);

router.get('/transactions',GetTransactions);

router.get('/transaction/:id',GetTransactionById);

export {router as AdminRoute}