import express from 'express';
import {json} from 'body-parser';
import { errorHandler , currentUser} from '@garagenew/common';
// import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';  //To set cookies in the browser
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update'; 

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

app.use(currentUser); //To get the current user from the cookie and set it in the request object

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// app.all("*", (req,res) => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export { app };
