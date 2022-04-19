const express = require("express");
const { register, login } = require("../../controllers/authController");
const { validateLoginData } = require("./loginValidation");
const { validateRegisterData } = require("./registerValidation");
const router = express.Router();



//,passport.authenticate('jwt',{session:false})

router.route('/register').post(validateRegisterData, register);
router.route('/login').post(validateLoginData, login);

module.exports = router;