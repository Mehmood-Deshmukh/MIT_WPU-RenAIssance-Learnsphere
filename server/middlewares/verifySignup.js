const User = require("../models/userModel");

const verifySignup = async (req, res, next) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            res.status(404).json({ message: "User not found" });
        }
    
        const role = user.role;
        if(role == "teacher" && user.isApproved === false) {
            res.status(403).json({ message: "Your request has not been approved yet!" });
        }
        next();
    }catch(e) {
        console.log(e);
        res.status(500).json({ message: "An error occured, please try again later" });
    }
}

module.exports = verifySignup;