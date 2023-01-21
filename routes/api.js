"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    if (!req.body.coordinate || !req.body.value)
      res.json({ error: "Required field(s) missing" });
    else if (!/^[a-zA-Z][1-9]$/g.test(req.body.coordinate))
      res.json({ error: "Invalid coordinate" });
    else if (!/^[1-9]$/g.test(req.body.value))
      res.json({ error: "Invalid value" });
    else {
      let row = req.body.coordinate.split("")[0];
      let col = req.body.coordinate.split("")[1];
      let conflict = [];
      !solver.checkRowPlacement(req.body.puzzle, row, col, req.body.value)
        ? undefined
        : conflict.push("row");

      !solver.checkColPlacement(req.body.puzzle, row, col, req.body.value)
        ? undefined
        : conflict.push("column");

      !solver.checkRegionPlacement(req.body.puzzle, row, col, req.body.value)
        ? undefined
        : conflict.push("region");

      res.json({
        valid: conflict.length == 0,
        conflict: conflict.length == 0 ? undefined : conflict,
      });
    }
  });

  app.route("/api/solve").post((req, res) => {
    res.json(solver.solve(req.body.puzzle));
  });
};
