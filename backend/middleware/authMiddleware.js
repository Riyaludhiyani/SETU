const jwt = require("jsonwebtoken");

module.exports = (roles=[]) => {
    return (req,res,next)=>{
        const token = req.headers.authorization;
        if(!token) return res.status(401).json("No token");

        const decoded = jwt.verify(token,"SECRET");

        if(roles.length && !roles.includes(decoded.role))
            return res.status(403).json("Access denied");

        req.user = decoded;
        next();
    }
}
