const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifySuperUser = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if (token !== process.env.SUPER_ADMIN_TOKEN) {
            return res
                .status(403)
                .json({ message: "You are not authorized to access this route!" });
        }
        next()
    }catch(e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = verifySuperUser;