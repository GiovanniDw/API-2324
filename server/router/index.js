import express from "express";

import {homeController} from '../controllers/index.js';
import {
  register,
  doRegister,
  login,
  doLogin,
  logout,
} from "../controllers/Auth.js";
const router = express.Router();

router.get("/", homeController);


router.get("/register", register);
router.post("/register", doRegister);

router.get("/login", login);
router.post("/login", doLogin);

router.get("/register", register);
router.post("/register", doRegister);

router.get("/logout", logout);
router.post("/logout", logout);

export default router;