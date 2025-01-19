const express = require("express");
const { adminSignup, adminLogin, approveRequest, rejectRequest, deleteRequest, getAdminRequests } = require("../controllers/adminController");
const verifyRole = require("../middlewares/verifyRole");
const verifySuperUser = require("../middlewares/verifySuperUser");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/signup", verifySuperUser, adminSignup);
router.post("/login", verifySuperUser, adminLogin);

router.get("/requests", authenticateUser, verifyRole("admin"), getAdminRequests);
router.post("/approve-request", authenticateUser, verifyRole("admin"), approveRequest);
router.post("/reject-request", authenticateUser, verifyRole("admin"), rejectRequest);
router.post("/delete-request", authenticateUser, verifyRole("admin"), deleteRequest);

module.exports = router;
