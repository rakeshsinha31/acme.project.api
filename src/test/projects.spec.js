const chai = require("chai");
const { request } = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const {
  uniqueNamesGenerator,
  colors,
  animals,
} = require("unique-names-generator");

const TEST_SRVER_URL = process.env.TEST_SRVER_URL || "http://localhost:3000";

chai.use(chaiHttp);

describe("Test Project APIs", () => {
  before(() => {
    this.projectName = uniqueNamesGenerator({
      dictionaries: [animals, colors],
    });
  });

  /**
   * Test GET: /projects
   */

  describe("GET /api/V1", () => {
    it("It should throw Resource Not Found Error", async () => {
      const response = await chai.request(TEST_SRVER_URL).get("/projects");
      expect(response.status).to.equal(404);
    });

    it("It should GET all the existing Projects", async () => {
      const response = await chai
        .request(TEST_SRVER_URL)
        .get("/api/V1/projects");
      expect(response.status).to.equal(200);
      expect(response.body).to.has.property("count");
    });
  });

  /**
   * Test POST: /projects
   */

  //
  describe("POST /api/V1/projects", () => {
    it("It should creat a new Project", async () => {
      const payload = {
        name: this.projectName,
        owner: "f4587606-4504-453c-8e7b-fe6029847d41",
      };
      const response = await chai
        .request(TEST_SRVER_URL)
        .post("/api/V1/projects")
        .send(payload);
      expect(response.status).to.equal(201);
      expect(response.body.project)
        .to.have.property("name")
        .eq(this.projectName);
      expect(response.body.project)
        .to.have.property("owner")
        .to.eq("f4587606-4504-453c-8e7b-fe6029847d41");
      expect(response.body.project).to.have.property("state").to.eq("Planned");
      expect(response.body.project).to.have.property("progress").to.eq(0);
    });

    it("It should NOT creat a project, with existing name", async () => {
      const payload = {
        name: this.projectName,
        owner: "f4587606-4504-453c-8e7b-fe6029847d41",
      };
      const response = await chai
        .request(TEST_SRVER_URL)
        .post("/api/V1/projects")
        .send(payload);
      expect(response.status).to.equal(400);
      expect(response.body.error).to.be.eq("A Project with same name exists");
    });

    it("It should NOT creat a new Project, Owner is not Authorized", async () => {
      const payload = {
        name: "This Prject should not be created",
        owner: "cb7df63c-9dcd-4b22-8f35-63f48d74bf26", // NOT a manager
      };

      const response = await chai
        .request(TEST_SRVER_URL)
        .post("/api/V1/projects")
        .send(payload);
      expect(response.status).to.equal(403);
    });

    it("It should NOT creat a new Project, payload is missing required field (name/owner)", async () => {
      const payload = {
        name: "This Prject should not be created",
      };

      const response = await chai
        .request(TEST_SRVER_URL)
        .post("/api/V1/projects")
        .send(payload);
      expect(response.status).to.equal(400);
    });
  });

  /**
   * Test PUT: /projects/:projectId
   */
  describe("PUT /api/V1/projects", () => {
    it("It should NOT update the project, as projectId is not valid", async () => {
      const payload = {
        state: "Active", // allowed values = [Planned, Active, Done, Failed]
        progress: 80, // allowed range = 1 to 100
      };

      const response = await chai
        .request(TEST_SRVER_URL)
        .put(`/api/V1/projects/5438f192cd775532d606d000`)
        .send(payload);
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("error");
    });

    it("It should NOT update the project, as payload has invalid values", async () => {
      const payload = {
        state: "Inactive", // allowed values = [Planned, Active, Done, Failed]
        progress: 110, // allowed range = 1 to 100
      };

      const projects = await chai
        .request(TEST_SRVER_URL)
        .get("/api/V1/projects");
      const projectId = projects.body["0"]._id;
      const response = await chai
        .request(TEST_SRVER_URL)
        .put(`/api/V1/projects/${projectId}`)
        .send(payload);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error");
    });

    it("It should update the project, as per payload", async () => {
      const payload = {
        state: "Active", // allowed values = [Planned, Active, Done, Failed]
        progress: 60, // allowed range = 1 to 100
      };

      const projects = await chai
        .request(TEST_SRVER_URL)
        .get("/api/V1/projects");
      const projectId = projects.body["0"]._id;
      const response = await chai
        .request(TEST_SRVER_URL)
        .put(`/api/V1/projects/${projectId}`)
        .send(payload);
      expect(response.status).to.equal(200);
    });
  });
  /**
   * Test PATCH: /projects/assign/:projectId
   */
  describe("PATCH /projects/assign/:projectId", () => {
    it("It should assign participant to project", async () => {
      const payload = {
        participant: "760aabce-3a62-41be-a5a5-8dc6fc4c3abd",
        owner: "f4587606-4504-453c-8e7b-fe6029847d41",
      };

      const projects = await chai
        .request(TEST_SRVER_URL)
        .get("/api/V1/projects");
      const projectId = projects.body[projects.body.count - 1]._id;
      const response = await chai
        .request(TEST_SRVER_URL)
        .patch(`/api/V1/projects/assign/${projectId}`)
        .send(payload);
      expect(response.status).to.equal(200);
    });
  });
});
