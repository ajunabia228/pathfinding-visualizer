// utils/grid.js
// Creates and manages the grid data structure.

const ROWS = 20;
const COLS = 45;

function createGrid() {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(createNode(r, c));
    }
    grid.push(row);
  }
  return grid;
}

function createNode(row, col) {
  return {
    row,
    col,
    isStart:   false,
    isEnd:     false,
    isWall:    false,
    isWeight:  false,
    weight:    1,          // default cost; weighted nodes use 5
    distance:  Infinity,
    fScore:    Infinity,
    gScore:    Infinity,
    hScore:    0,
    visited:   false,
    previousNode: null,
  };
}

function resetPathData(grid) {
  for (const row of grid) {
    for (const node of row) {
      node.distance     = Infinity;
      node.fScore       = Infinity;
      node.gScore       = Infinity;
      node.hScore       = 0;
      node.visited      = false;
      node.previousNode = null;
    }
  }
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0)           neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1)    neighbors.push(grid[row + 1][col]);
  if (col > 0)           neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1)    neighbors.push(grid[row][col + 1]);
  return neighbors.filter(n => !n.isWall);
}

function getNodesInShortestPath(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}