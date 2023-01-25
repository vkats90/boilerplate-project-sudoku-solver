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

function checkRow(puzzleString, row, column, value) {
  row = row.toLowerCase().charCodeAt(0) - 97;
  column--;
  let arr = convertToArrays(puzzleString).row[row];
  arr[column] = ".";
  return arr.includes(value);
}

function checkCol(puzzleString, row, column, value) {
  row = row.toLowerCase().charCodeAt(0) - 97;
  column--;
  let arr = convertToArrays(puzzleString).col[column];
  arr[row] = ".";
  return arr.includes(value);
}

function checkRegion(puzzleString, row, column, value) {
  row = row.toLowerCase().charCodeAt(0) - 97 + 1;
  let arr =
    convertToArrays(puzzleString).region[
      Math.floor((row - 1) / 3) * 3 + Math.floor((column - 1) / 3)
    ];
  arr[((row % 3 || 3) - 1) * 3 + (column % 3 || 3) - 1] = ".";
  return arr.includes(value);
}

function findOptions(puzzleString, i) {
  let possible = [];
  for (let j = 1; j < 10; j++) {
    let row = (i - (i % 9)) / 9 + 1;
    row = String.fromCharCode(96 + row);
    let col = (i % 9) + 1;
    if (
      !checkRow(puzzleString, row, col, j.toString()) &&
      !checkCol(puzzleString, row, col, j.toString()) &&
      !checkRegion(puzzleString, row, col, j.toString())
    )
      possible.push(j);
  }
  return possible;
}

function lowestIndex(puzzleString) {
  let arr = puzzleString.split("");
  let best = { possible: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9], index: 100 };
  let possible = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != ".") continue;
    possible = findOptions(arr.join(""), i);
    if (possible.length < best.possible.length) {
      best.possible = possible;
      best.index = i;
    }
  }
  return best;
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
    return checkRow(puzzleString, row, column, value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    return checkCol(puzzleString, row, column, value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    return checkRegion(puzzleString, row, column, value);
  }

  solve(puzzleString) {
    if (/[^0-9\.]/.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    if (puzzleString.length != 81)
      return { error: "Expected puzzle to be 81 characters long" };
    if (!sudokuSolver(puzzleString))
      return { error: "Puzzle cannot be solved" };
    else return { solution: puzzleString };

    function sudokuSolver(arr) {
      arr = arr.split("");
      let possible = [1];
      let i = 0;
      let index;
      while (possible.length != 0) {
        index = lowestIndex(arr.join(""));
        i = index.index;
        possible = index.possible;
        if (possible.length == 10) break;
        if (possible.length == 1) {
          arr[i] = possible[0];
          continue;
        }
        if (possible.length == 0) return false;
        for (let x of possible) {
          arr[i] = x;
          if (sudokuSolver(arr.join(""))) return true;
          else arr[i] = ".";
        }
        return false;
      }
      console.log(arr.join(""));
      puzzleString = arr.join("");
      return true;
    }
  }
  /*
  solve(puzzleString) {
    // innitial string chacks
    if (/[^0-9\.]/.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    let arr = puzzleString.split("");
    if (arr.length != 81)
      return { error: "Expected puzzle to be 81 characters long" };

    // getting possabilities
    let possible = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] != ".") continue;
      possible = this.findOptions(arr.join(""), i);
      if (possible.length == 1) arr[i] = possible[0];
      possible = [];
    }

    // check if sudoku is solved
    if (arr.join("") == puzzleString && !arr.includes("."))
      return { solution: arr.join("") };
    // if no progress was made start inputting the first available option
    else if (arr.join("") == puzzleString) {
      let i = arr.indexOf(".");
      possible = this.findOptions(arr.join(""), i);
      if (possible.length != 0) arr[i] = possible[0];
      else return { error: "Puzzle cannot be solved" };
      return this.solve(arr.join(""));
    } else return this.solve(arr.join("")); // else = iterate
  } */
}

module.exports = SudokuSolver;
