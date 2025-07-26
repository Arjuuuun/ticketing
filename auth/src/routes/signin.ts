import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@garagenew/common';
import { User } from '../models/user';
import { BadRequestError } from '@garagenew/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage(" password required")
], validateRequest, async (req: Request, res: Response) => {

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }
  console.log(existingUser.password, "existingUser.password")
  const passwordMatch = await Password.compare(existingUser.password, password);
  console.log(passwordMatch, "passwordMatch")
  if (!passwordMatch) {
    throw new BadRequestError("Invalid credenyials")
  };

  //Generate JWT and store it in the session object
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!);

  //Store it on session object
  req.session = {
    jwt: userJwt
  };
  res.status(200).send(existingUser);


  res.send('hi there!');
});

export { router as signinRouter };