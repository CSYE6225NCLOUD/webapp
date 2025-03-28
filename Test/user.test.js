// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const http = require("http");
// const app = require("../connection");
// const { User } = require("../models");
// // require("dotenv").config();
// chai.use(chaiHttp);
// const expect = chai.expect;

// const server = http.createServer(app);
// const PORT = process.env.TEST_PORT || 3002;
// describe("API Test", () => {
//   before(async () => {
//     await User.destroy({ where: {} });
//     await new Promise((resolve) => server.listen(PORT, resolve));
//   });

//   after(async () => {
//     await new Promise((resolve) => server.close(resolve));
//   });

//   it("Multiple accounts with the same email are not allowed", async () => {
//     let response = await chai.request(server).post("/v1/user").send({
//       first_name: "Shubham",
//       last_name: "Lakhotia",
//       email: "smaheshwari029@gmail.com",
//       password: "Shubham@1234",
//     });
//     expect(response).to.have.status(201);
//     expect(response.body).to.have.property("email", "smaheshwari029@gmail.com");

//     response = await chai.request(server).post("/v1/user").send({
//       first_name: "Shubham",
//       last_name: "Lakhotia",
//       email: "smaheshwari029@gmail.com",
//       password: "Shubham@1234",
//     });
//     expect(response).to.have.status(400);
//     expect(response.body).to.have.property("error", "Email already exists");
//   });

//   it("NOT allow user to update account_created and account_updated", async () => {
//     const res = await chai.request(server).put("/v1/user/self").send({
//       account_created: "2021-01-01",
//       account_updated: "2021-01-02",
//     });
//     expect(res.status).to.equal(401);
//   });
// });

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const http = require("http");
// const app = require("../connection");
// const { User, Sequelize } = require("../models"); // Import Sequelize to stub sync
// const sinon = require("sinon");

// chai.use(chaiHttp);
// const expect = chai.expect;

// const server = http.createServer(app);
// const PORT = process.env.TEST_PORT || 3002;

// describe("API Test", () => {
//   before(async () => {
//     // Stub the methods of User model
//     sinon.stub(User, "findOne").resolves(null); // No user found for tests
//     sinon.stub(User, "create").rejects(new Error("Email already exists")); // Prevent creation
//     sinon.stub(User, "destroy").resolves(); // Stub destroy
//     sinon.stub(User, "update").resolves(); // Stub update

//     // Start the server
//     await new Promise((resolve) => server.listen(PORT, resolve));
//   });

//   after(async () => {
//     await new Promise((resolve) => {
//       server.close(resolve);
//       sinon.restore();
//     });
//   });

//   it("NOT allow user to update account_created and account_updated", async () => {
//     const res = await chai.request(server).put("/v1/user/self").send({
//       account_created: "2021-01-01",
//       account_updated: "2021-01-02",
//     });
//     expect(res.status).to.equal(401);
//   });
// });

// const chai = require("chai");
// const { chaiHttpMock, mockResponse } = require("../__mock__/chai-http");
// const expect = chai.expect;

// describe("API Tests", () => {
//   beforeEach(() => {
//     chaiHttpMock.request.resetHistory();
//   });

//   it("should return 200 and success message for GET request", async () => {
//     const res = await chai.request().get("/v1/user/self");
//     expect(res).to.have.status(200);
//     expect(res.body).to.deep.equal(mockResponse.body);
//   });

//   it("should handle POST requests to /v1/user", async () => {
//     const res = await chai.request().post("/v1/user").send({
//       first_name: "Shubham",
//       last_name: "Lakhotia",
//       email: "shubham@example.com",
//       password: "password123",
//     });
//     expect(res).to.have.status(200);
//     expect(res.body).to.deep.equal(mockResponse.body);
//   });
// });
const chai = require("chai");
const { chaiHttpMock, mockResponses } = require("../__mock__/chai-http");
const expect = chai.expect;

describe("API Tests with Multiple Mock Responses", () => {
  beforeEach(() => {
    chaiHttpMock.request.resetHistory();
  });

  it("should return 200 for GET /healthz", async () => {
    const res = await chai.request().get("/healthz");
    expect(res).to.have.status(mockResponses.getHealthz.status);
    expect(res.body).to.deep.equal(mockResponses.getHealthz.body);
  });

  it("should return 200 for GET /v1/user/self", async () => {
    const res = await chai.request().get("/v1/user/self");
    expect(res).to.have.status(mockResponses.getUserSelf.status);
    expect(res.body).to.deep.equal(mockResponses.getUserSelf.body);
  });

  it("should return 201 for POST /v1/user", async () => {
    const res = await chai.request().post("/v1/user").send({
      first_name: "Shubham",
      last_name: "Lakhotia",
      email: "shubham@example.com",
      password: "password123",
    });
    expect(res).to.have.status(mockResponses.postUser.status);
    expect(res.body).to.deep.equal(mockResponses.postUser.body);
  });

  it("should return 405 for delete methods", async () => {
    const res = await chai.request().delete("/healthz");
    expect(res).to.have.status(mockResponses.methodNotAllowed.status);
    expect(res.body).to.deep.equal(mockResponses.methodNotAllowed.body);
  });
  it("should return 405 for put methods", async () => {
    const res = await chai.request().put("/healthz");
    expect(res).to.have.status(mockResponses.methodNotAllowed.status);
    expect(res.body).to.deep.equal(mockResponses.methodNotAllowed.body);
  });
  it("should return 405 for head methods", async () => {
    const res = await chai.request().put("/healthz");
    expect(res).to.have.status(mockResponses.methodNotAllowed.status);
    expect(res.body).to.deep.equal(mockResponses.methodNotAllowed.body);
  });
});
