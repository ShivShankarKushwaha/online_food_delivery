"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const fs_1 = __importDefault(require("fs"));
const imagesDir = path_1.default.join(__dirname, '../images');
if (!fs_1.default.existsSync(imagesDir)) {
    fs_1.default.mkdirSync(imagesDir, { recursive: true });
}
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() + '_' + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post("/login", controllers_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get("/profile", controllers_1.getVendorProfile);
router.patch("/coverimage", images, controllers_1.UpdateVendorCoverImage);
router.patch("/profile", controllers_1.UpdateVendorProfile);
router.patch("/service", controllers_1.UpdateVendorService);
router.post("/food", images, controllers_1.AddFood);
router.get('/foods', controllers_1.GetFoods);
// Orders
router.get("/orders", controllers_1.GetOrders);
router.put("/order/:id/process", controllers_1.ProcessOrder);
router.get("/order/:id", controllers_1.GetOrderDetails);
// Offers
router.get("/offers", controllers_1.GetOffers);
router.post("/offer", controllers_1.AddOffer);
router.put("/offer/:id", controllers_1.EditOffer);
//# sourceMappingURL=VendorRoute.js.map