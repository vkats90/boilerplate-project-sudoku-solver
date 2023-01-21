const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzle = require("../controllers/puzzle-strings.js");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function () {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: puzzle.puzzlesAndSolutions[1][0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.error);
        assert.isString(res.body.solution);
        assert.isNotOk(res.body.solution.includes("."));
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function () {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: undefined })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.error);
        assert.isNotOk(res.body.solution);
        assert.equal(res.body.error, "Required field missing");
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function () {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: puzzle.puzzlesAndSolutions[5][0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.error);
        assert.isNotOk(res.body.solution);
        assert.equal(res.body.error, "Invalid characters in puzzle");
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function () {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: puzzle.puzzlesAndSolutions[6][0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.error);
        assert.isNotOk(res.body.solution);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function () {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: puzzle.puzzlesAndSolutions[7][0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.error);
        assert.isNotOk(res.body.solution);
        assert.equal(res.body.error, "Puzzle cannot be solved");
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "C1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.valid);
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "C1",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.valid);
        assert.equal(res.body.conflict[0], "row");
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "C1",
        value: "3",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.valid);
        assert.isOk(res.body.conflict.includes("column"));
        assert.isOk(res.body.conflict.includes("region"));
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "C1",
        value: "5",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.valid);
        assert.isOk(res.body.conflict.includes("column"));
        assert.isOk(res.body.conflict.includes("region"));
        assert.isOk(res.body.conflict.includes("row"));
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "C1",
        value: undefined,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.valid);
        assert.isOk(res.body.error);
        assert.equal(res.body.error, "Required field(s) missing");
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[5][0],
        coordinate: "C1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.error);
        assert.isNotOk(res.body.solution);
        assert.equal(res.body.error, "Invalid characters in puzzle");
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[6][0],
        coordinate: "C1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isOk(res.body.error);
        assert.isNotOk(res.body.solution);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "11",
        value: "4",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.valid);
        assert.isOk(res.body.error);
        assert.equal(res.body.error, "Invalid coordinate");
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function () {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: puzzle.puzzlesAndSolutions[1][0],
        coordinate: "C1",
        value: "F",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isNotOk(res.body.valid);
        assert.isOk(res.body.error);
        assert.equal(res.body.error, "Invalid value");
      });
  });
});
