import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from headers
        const authHeader = req.headers.authorization || req.headers['Authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: "No Authorization header found" });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : authHeader;

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "Token not valid" });

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware:", error.message);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}