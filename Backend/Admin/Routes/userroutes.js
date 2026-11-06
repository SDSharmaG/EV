const express = require("express");
const Usercontroller = require("../controller/usercontroller");
const router = express.Router();
const upload = require("../Config/usermulter");
const { UserAuth } = require("../Middleware/userauthMiddleware");
const { AdminAuth } = require("../Middleware/authMiddleware");

// REGISTER (NO AUTH)
router.post(
  "/register",
  upload.single("profileImage"),
  Usercontroller.userRegister
);

// LOGIN (NO AUTH)
router.post("/login", Usercontroller.userLogin);

// LOGOUT (NO AUTH REQUIRED)
router.post("/logout", Usercontroller.userLogout);

// GET ALL USERS (ADMIN)
router.get("/allusers", AdminAuth, Usercontroller.getalluser);

// GET USER BY ID
router.get("/getuserbyid/:id", UserAuth, Usercontroller.getuserbyid);

// UPDATE USER WITH IMAGE
router.put(
  "/updateuser/:id",
  UserAuth,
  upload.single("profileImage"),
  Usercontroller.updateuser
);

//View user for Admin
router.get("/viewuser/:id", AdminAuth, Usercontroller.getuserbyid);

// DELETE USER
router.delete("/deleteuser/:id", AdminAuth, Usercontroller.deleteuser);

//Total user count
router.get("/user/total", Usercontroller.userTotal);

module.exports = router;
