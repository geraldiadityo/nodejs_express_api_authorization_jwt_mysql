const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { role } = require("../model");
const db = require("../model");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token){
        return res.status(400).send({
            message:"no token provide"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err){
            res.status(401).send({
                message:"Unauthorized!"
            });
            return;
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++){
                if (roles[i].name === "admin"){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message:"Require Admin Role"
            });
            return;
        });
    });
};

isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++){
                if (roles[i].name === "moderator"){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message:"Require Moderator Role"
            });
            return;
        });
    });
};

isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++){
                if (roles[i].name === "moderator"){
                    next();
                    return;
                }

                if (roles[i].name === "admin"){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require Moderator or Admin Role"
            });
        });
    });
};

const authJwt = {
    verifyToken:verifyToken,
    isAdmin:isAdmin,
    isModerator:isModerator,
    isModeratorOrAdmin:isModeratorOrAdmin
};

module.exports = authJwt;