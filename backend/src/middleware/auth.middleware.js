import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = (req, res, next) => {
    
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token) return res.status(401).json({ message: "Access Denied" });

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = User.findById(decoded.id).select("-password");
        if(!user) return res.status(401).json({ message: "Token not valid" });

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware", error);
        res.status(500).json({ message: "Internal server error" });
    }
}