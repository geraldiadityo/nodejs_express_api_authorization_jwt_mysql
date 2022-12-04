const { verifySingUp } = require("../middleware");
const controller = require("../controller/auth.controller.js");

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signup",[
        verifySingUp.checkDuplicateUsernameOrEmail,
        verifySingUp.checkRolesExisted
    ],
    controller.singup
    );

    app.post("/api/auth/signin",controller.singin);
};

