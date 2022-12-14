const db = require("../model");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({
        where: {
            username:req.body.username
        }
    }).then((user) => {
        if (user){
            res.status(400).send({
                message:"Failed! username is already in use"
            });
            return;
        }
        User.findOne({
            where:{
                email:req.body.email
            }
        }).then(user => {
            if (user){
                res.status(400).send({
                    message:"Failed! email is already in use"
                });
                return;
            }
            next();
        });
    });

};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles){
        for (let i = 0; i < req.body.roles.length; i++){
            if (!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    message:"Failed! role does not exist = "+req.body.roles[i]
                })
                return;
            }
        }
    }
    next();
};

const verifySingUp = {
    checkDuplicateUsernameOrEmail:checkDuplicateUsernameOrEmail,
    checkRolesExisted:checkDuplicateUsernameOrEmail
};

module.exports = verifySingUp;
