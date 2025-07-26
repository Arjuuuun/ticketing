import express from 'express';
import { body, validationResult } from "express-validator"
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@garagenew/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup',

    [
        body("email").isEmail().withMessage("email must be valid"),
        body("password").trim().isLength({ min: 4, max: 20 }).withMessage("invalid password")
    ],
    validateRequest

    , async (req: express.Request, res: express.Response):Promise<any> => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser){
            console.log("email in use")
            throw new BadRequestError("Email in use");
        }

        const user = User.build({ email, password });
        await user.save();
        //Generate JWT and store it in the session object
        const userJwt = jwt.sign({
           id: user.id,
           email: user.email 
        }, process.env.JWT_KEY!);

        //Store it on session object
        req.session = {
            jwt: userJwt
        };
       res.status(201).send(user);

    });
export { router as signupRouter };