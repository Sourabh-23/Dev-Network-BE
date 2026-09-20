const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {

    try {
        validateSignupData(req);

        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);  //1

        const user = new User({ //2
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("User cannot be created : " + err.message);
    }
});


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; //3

        const user = await User.findOne({ email });   
        if (!user) {
            return res.status(404).send("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);  //4
        
        if (isPasswordValid) {

        const token = await user.getJwt();  //6
     

        //8
          res.cookie("token", token, { 
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
         });
          res.send(user);
        } else {
            res.status(404).send("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
}); 

authRouter.post("/logout", async(req, res) => {
    res.clearCookie("token");
    res.send("Logout successful");
});


// authRouter.post("/logout", async(req, res) => {
//     res.cookie("token",null, {
//         expires: new Date(Date.now()),
//     });
//     res.send("Logout successful");
// });



module.exports = authRouter;