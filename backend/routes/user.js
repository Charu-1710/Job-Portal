import express from "express";
import { logout, register } from "../controllers/user.js";
import { login } from "../controllers/user.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import  {updateProfile} from "../controllers/user.js";
import { singleUpload , upload } from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(singleUpload,register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/update').post(isAuthenticated,upload,updateProfile)

export default router;