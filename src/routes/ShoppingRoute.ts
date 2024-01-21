import  Express from "express";
import { FindOffers, GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFood } from "../controllers";

const router =Express.Router();

/***************** Food Availability ******************* */
router.get("/:pincode",GetFoodAvailability)

/***************** Top Restaurants ******************* */
router.get("/top-restaurants/:pincode",GetTopRestaurants)

/***************** Food available in 30 minutes ******************* */
router.get("/foods-in-30-min/:pincode",GetFoodsIn30Min)

/***************** Search Food ******************* */
router.get("/search/:pincode",SearchFood)

/***************** Find Restaurant by Id ******************* */
router.get("/restaurant/:id",RestaurantById)

/***************** Find Offers ******************* */
router.get("/offers/:pincode",FindOffers)
export {router as ShoppingRouter}