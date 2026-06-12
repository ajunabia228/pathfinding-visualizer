let grid = createGrid();
let mouseIsPressed = false;
let isAnimating = false;
let isPaused = false;

let animationSteps = [];
let currentStepIndex = 0;
let pathFound = false;
let animationTimer = null;

const gridElement = document.getElementById("grid");
const algorithmSelect = document.getElementById("algorithm-select");
const visualizeBtn = document.getElementById("visualize-btn");
const pauseBtn = document.getElementById("pause-btn");
const clearPathBtn = document.getElementById("clear-path-btn");
const resetBoardBtn = document.getElementById("reset-board-btn");
const statusText = document.getElementById("status-text");

const startMenu = document.getElementById("start-menu");
const startAppBtn = document.getElementById("start-app-btn");
const showInstructionsBtn = document.getElementById("show-instructions-btn");

function renderGrid() {
  gridElement.innerHTML = "";

  for (const row of grid) {
    const rowElement = document.createElement("div");
    rowElement.className = "grid-row";

    for (const node of row) {
      const nodeElement = document.createElement("div");
      nodeElement.className = getNodeClassName(node);
      nodeElement.id = `node-${node.row}-${node.col}`;

      nodeElement.addEventListener("mousedown", () => handleMouseDown(node.row, node.col));
      nodeElement.addEventListener("mouseenter", () => handleMouseEnter(node.row, node.col));
      nodeElement.addEventListener("mouseup", handleMouseUp);

      rowElement.appendChild(nodeElement);
    }

    gridElement.appendChild(rowElement);
  }
}

function getNodeClassName(node) {
  let className = "node";

  if (node.isStart) className += " node-start";
  else if (node.isEnd) className += " node-end";
  else if (node.isWall) className += " node-wall";

  return className;
}

function handleMouseDown(row, col) {
  if (isAnimating) return;

  const node = grid[row][col];
  if (!node.isStart && !node.isEnd) {
    node.isWall = !node.isWall;
    renderGrid();
  }

  mouseIsPressed = true;
}

function handleMouseEnter(row, col) {
  if (!mouseIsPressed || isAnimating) return;

  const node = grid[row][col];
  if (!node.isStart && !node.isEnd) {
    node.isWall = true;
    renderGrid();
  }
}

function handleMouseUp() {
  mouseIsPressed = false;
}

document.body.addEventListener("mouseup", handleMouseUp);

function clearPath() {
  if (isAnimating) return;

  resetGridState(grid);
  statusText.textContent = "Path cleared";

  for (const row of grid) {
    for (const node of row) {
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (element) {
        element.classList.remove("node-visited", "node-path");
      }
    }
  }
}

function resetBoard() {
  if (isAnimating) return;

  grid = createGrid();
  statusText.textContent = "Board reset";
  renderGrid();
}

function visualizeAlgorithm() {
  if (isAnimating) return;

  clearPath();

  const startNode = grid[START_NODE_ROW][START_NODE_COL];
  const endNode = grid[END_NODE_ROW][END_NODE_COL];
  const algorithm = algorithmSelect.value;

  let visitedNodesInOrder = [];

  if (algorithm === "bfs") {
    visitedNodesInOrder = bfs(grid, startNode, endNode);
    statusText.textContent = "Running BFS...";
  } else if (algorithm === "dfs") {
    visitedNodesInOrder = dfs(grid, startNode, endNode);
    statusText.textContent = "Running DFS...";
  } else if (algorithm === "dijkstra") {
    visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    statusText.textContent = "Running Dijkstra...";
  } else if (algorithm === "greedy") {
    visitedNodesInOrder = greedyBestFirst(grid, startNode, endNode);
    statusText.textContent = "Running Greedy Best-First Search...";
  } else if (algorithm === "astar") {
    visitedNodesInOrder = astar(grid, startNode, endNode);
    statusText.textContent = "Running A* Search...";
  }

  const pathNodes = getNodesInPathOrder(endNode);
  pathFound = endNode === startNode || endNode.previousNode !== null;

  buildAnimationSteps(visitedNodesInOrder, pathNodes, endNode);
  runAnimation();
}

function buildAnimationSteps(visitedNodesInOrder, pathNodes, endNode) {
  animationSteps = [];
  currentStepIndex = 0;

  for (const node of visitedNodesInOrder) {
    animationSteps.push({
      type: "visited",
      node,
    });
  }

  if (endNode.previousNode !== null || endNode.isStart) {
    for (const node of pathNodes) {
      animationSteps.push({
        type: "path",
        node,
      });
    }
  }
}

function runAnimation() {
  if (currentStepIndex >= animationSteps.length) {
    isAnimating = false;
    isPaused = false;
    pauseBtn.textContent = "Pause";

    if (pathFound) {
      statusText.textContent = "Visualization complete";
    } else {
      statusText.textContent = "Visualization complete - no path found!";
    }

    return;
  }

  if (isPaused) return;

  isAnimating = true;

  const step = animationSteps[currentStepIndex];
  const { node, type } = step;

  if (!node.isStart && !node.isEnd) {
    const element = document.getElementById(`node-${node.row}-${node.col}`);
    if (element) {
      if (type === "visited") {
        element.classList.add("node-visited");
      } else if (type === "path") {
        element.classList.add("node-path");
      }
    }
  }

  currentStepIndex++;

  const delay = type === "visited" ? 15 : 40;

  animationTimer = setTimeout(() => {
    runAnimation();
  }, delay);
}

function togglePause() {
  if (!isAnimating && currentStepIndex === 0) return;

  isPaused = !isPaused;

  if (isPaused) {
    clearTimeout(animationTimer);
    pauseBtn.textContent = "Resume";
    statusText.textContent = "Paused";
  } else {
    pauseBtn.textContent = "Pause";
    statusText.textContent = "Resumed";
    runAnimation();
  }
}

function closeStartMenu() {
  startMenu.classList.add("hidden");
}

function openStartMenu() {
  startMenu.classList.remove("hidden");
}

startAppBtn.addEventListener("click", closeStartMenu);
showInstructionsBtn.addEventListener("click", openStartMenu);

visualizeBtn.addEventListener("click", visualizeAlgorithm);
pauseBtn.addEventListener("click", togglePause);
clearPathBtn.addEventListener("click", clearPath);
resetBoardBtn.addEventListener("click", resetBoard);

renderGrid();
