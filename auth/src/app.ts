import express from 'express';
import {json} from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from '@garagenew/common';
// import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';  //To set cookies in the browser

const app = express();
app.set('trust proxy', true); //Trust the proxy to get the real IP address of the client
// This is required because we are using ingress-nginx in kubernetes to route the traffic
// to our service, and we need to trust the proxy to get the real IP address of the client
app.use(json());
app.use(
  cookieSession({
    signed: false, //We are not signing the cookie   	Prevents the cookie from being encrypted	So it’s readable across all microservices (and JWT is already tamper-proof)
    secure: false, //We are not using https in development, so we set it to false
  }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

// app.all("*", (req,res) => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export { app };
