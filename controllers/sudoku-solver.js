function convertToArrays(puzzleString) {
  let arr = puzzleString.split("");
  let array = {
    row: new Array(9).fill(".").map(() => new Array(9).fill(".")),
    col: new Array(9).fill(".").map(() => new Array(9).fill(".")),
    region: new Array(9).fill(".").map(() => new Array(9).fill(".")),
  };
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      array.row[i - 1][j - 1] = arr[(i - 1) * 9 + j - 1];
      array.col[j - 1][i - 1] = arr[(i - 1) * 9 + j - 1];
      array.region[Math.floor((i - 1) / 3) * 3 + Math.floor((j - 1) / 3)][
        ((i % 3 || 3) - 1) * 3 + (j % 3 || 3) - 1
      ] = arr[(i - 1) * 9 + j - 1];
    }
  }
  return array;
}
class SudokuSolver {
  validate(puzzleString) {
    let arr = puzzleString.split[""];
    if (arr.length() != 81) return "Expected puzzle to be 81 characters long";
    if (/[^0-9\.]/.test(puzzleString)) return "Invalid characters in puzzle";
  }

  seeArray(puzzleString) {
    return convertToArrays(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    row = row.toLowerCase().charCodeAt(0) - 97;
    column--;
    return convertToArrays(puzzleString).row[row].includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    row = row.toLowerCase().charCodeAt(0) - 97;
    column--;
    return convertToArrays(puzzleString).col[column].includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    row = row.toLowerCase().charCodeAt(0) - 97 + 1;
    return convertToArrays(puzzleString).region[
      Math.floor((row - 1) / 3) * 3 + Math.floor((column - 1) / 3)
    ].includes(value);
  }

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
