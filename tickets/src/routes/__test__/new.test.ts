// import request from "supertest";
// import {app} from "../../app";
// import { Ticket } from "../../models/tickets";


// it("it has a route handler listening to /api/tickets for post requests", async () => {
//     const response =  await request(app).post("/api/tickets").send({});
//     expect(response.status).not.toEqual(404);

// })

// it("can only be accessed if the user is signed in", async () => {
//     await request(app).post("/api/tickets").send({}).expect(401)

// })

// it("return a status other than 401 if the user is signed in", async () => {
//      const response =  await request(app).post("/api/tickets")
//      .set('Cookie', signin())
//      .send({});
//     expect(response.status).not.toEqual(401);
// })

// it("retturns an error if an invalid title is provided", async () => {
//      await request(app).post("/api/tickets")
//      .set('Cookie', signin())
//      .send({
//          title: "",
//          price: 10
//      }).expect(400);

// })

// it("retturns an error if an invalid price is provided", async () => {
//     await request(app).post("/api/tickets")
//      .set('Cookie', signin())
//      .send({
//          title: "aaaaaaaaa",
//          price: -10
//      }).expect(400);

// })

// it("creates a ticket with valid parameters", async () => {
//     await request(app).post("/api/tickets")
//      .set('Cookie', signin())
//      .send({
//          title: "aaaaaaaaa",
//          price: 10
//      }).expect(201);

// })