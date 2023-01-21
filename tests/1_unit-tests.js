const chai = require("chai");
const assert = chai.assert;

const puzzles = require("../controllers/puzzle-strings.js");
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function () {
    assert.isObject(solver.solve(puzzles.puzzlesAndSolutions[0][0]));
    assert.isNotOk(solver.solve(puzzles.puzzlesAndSolutions[0][0]).error);
    assert.isString(solver.solve(puzzles.puzzlesAndSolutions[0][0]).solution);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    assert.isObject(solver.solve(puzzles.puzzlesAndSolutions[5][0]));
    assert.isOk(solver.solve(puzzles.puzzlesAndSolutions[5][0]).error);
    assert.isNotOk(solver.solve(puzzles.puzzlesAndSolutions[5][0]).solution);
    assert.equal(
      solver.solve(puzzles.puzzlesAndSolutions[5][0]).error,
      "Invalid characters in puzzle"
    );
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    assert.isObject(solver.solve(puzzles.puzzlesAndSolutions[6][0]));
    assert.isOk(solver.solve(puzzles.puzzlesAndSolutions[6][0]).error);
    assert.isNotOk(solver.solve(puzzles.puzzlesAndSolutions[6][0]).solution);
    assert.equal(
      solver.solve(puzzles.puzzlesAndSolutions[6][0]).error,
      "Expected puzzle to be 81 characters long"
    );
  });

  test("Logic handles a valid row placement", function () {
    assert.isNotOk(
      solver.checkRowPlacement(puzzles.puzzlesAndSolutions[1][0], "C", "1", "1")
    );
  });

  test("Logic handles an invalid row placement", function () {
    assert.isOk(
      solver.checkRowPlacement(puzzles.puzzlesAndSolutions[1][0], "C", "1", "9")
    );
  });

  test("Logic handles a valid column placement", function () {
    assert.isNotOk(
      solver.checkColPlacement(puzzles.puzzlesAndSolutions[1][0], "C", "1", "1")
    );
  });

  test("Logic handles an invalid column placement", function () {
    assert.isOk(
      solver.checkColPlacement(puzzles.puzzlesAndSolutions[1][0], "C", "1", "6")
    );
  });

  test("Logic handles a valid region (3x3 grid) placement", function () {
    assert.isNotOk(
      solver.checkRegionPlacement(
        puzzles.puzzlesAndSolutions[1][0],
        "C",
        "1",
        "1"
      )
    );
  });

  test("Logic handles an invalid region (3x3 grid) placement", function () {
    assert.isOk(
      solver.checkRegionPlacement(
        puzzles.puzzlesAndSolutions[1][0],
        "C",
        "1",
        "9"
      )
    );
  });

  test("Valid puzzle strings pass the solver", function () {
    assert.isObject(solver.solve(puzzles.puzzlesAndSolutions[3][0]));
    assert.isNotOk(solver.solve(puzzles.puzzlesAndSolutions[3][0]).error);
    assert.isString(solver.solve(puzzles.puzzlesAndSolutions[3][0]).solution);
    assert.isNotOk(
      solver.solve(puzzles.puzzlesAndSolutions[3][0]).solution.includes(".")
    );
  });

  test("Invalid puzzle strings fail the solver", function () {
    assert.isObject(solver.solve(puzzles.puzzlesAndSolutions[7][0]));
    assert.isOk(solver.solve(puzzles.puzzlesAndSolutions[7][0]).error);
    assert.isNotOk(solver.solve(puzzles.puzzlesAndSolutions[7][0]).solution);
    assert.equal(
      solver.solve(puzzles.puzzlesAndSolutions[7][0]).error,
      "Puzzle cannot be solved"
    );
  });

  test("Solver returns the expected solution for an incomplete puzzle", function () {
    assert.isObject(solver.solve(puzzles.puzzlesAndSolutions[8][0]));
    assert.isNotOk(solver.solve(puzzles.puzzlesAndSolutions[8][0]).error);
    assert.isString(solver.solve(puzzles.puzzlesAndSolutions[8][0]).solution);
    assert.isNotOk(
      solver.solve(puzzles.puzzlesAndSolutions[8][0]).solution.includes(".")
    );
  });
});
