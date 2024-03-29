"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRouter = router;
/***************** Food Availability ******************* */
router.get("/:pincode", controllers_1.GetFoodAvailability);
/***************** Top Restaurants ******************* */
router.get("/top-restaurants/:pincode", controllers_1.GetTopRestaurants);
/***************** Food available in 30 minutes ******************* */
router.get("/foods-in-30-min/:pincode", controllers_1.GetFoodsIn30Min);
/***************** Search Food ******************* */
router.get("/search/:pincode", controllers_1.SearchFood);
/***************** Find Restaurant by Id ******************* */
router.get("/restaurant/:id", controllers_1.RestaurantById);
/***************** Find Offers ******************* */
router.get("/offers/:pincode", controllers_1.FindOffers);
//# sourceMappingURL=ShoppingRoute.js.map