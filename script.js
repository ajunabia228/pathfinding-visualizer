// script.js
// Main controller: grid rendering, interactions, animation, maze generation.

// ── Constants ──────────────────────────────────────────────────────────────
const WEIGHT_COST = 5;

const ALGO_INFO = {
  bfs:      { label: 'BFS',                   desc: 'Explores all neighbours equally. Guarantees the shortest path on unweighted grids. Ignores node weights.' },
  dfs:      { label: 'DFS',                   desc: 'Dives deep before backtracking. Fast but does NOT guarantee the shortest path. Best used for maze exploration.' },
  dijkstra: { label: "Dijkstra's Algorithm",  desc: 'Weighted shortest-path algorithm. Respects node weights — watch how it avoids heavy nodes compared to BFS.' },
  greedy:   { label: 'Greedy Best-First',     desc: 'Races toward the target using a heuristic. Very fast but NOT guaranteed to find the shortest path.' },
  astar:    { label: 'A* Search',             desc: 'Combines actual cost (g) and heuristic distance (h). Weighted-aware and guarantees the shortest path. Generally the best choice.' },
};

const SPEED_MAP = { '1': 60, '2': 20, '3': 5 }; // ms per step
const SPEED_LABELS = { '1': 'Slow', '2': 'Medium', '3': 'Fast' };

// ── State ──────────────────────────────────────────────────────────────────
let grid = [];
let startRow = 9,  startCol = 5;
let endRow   = 9,  endCol   = 39;
let isRunning    = false;
let isPaused     = false;
let animTimeout  = null;
let drawMode     = 'wall'; // 'wall' | 'weight'
let isMouseDown  = false;

// Drag state
let dragging      = null; // null | 'start' | 'end'
let draggedOver   = null; // last cell highlighted during drag

// ── DOM refs ───────────────────────────────────────────────────────────────
const gridEl         = document.getElementById('grid');
const algoSelect     = document.getElementById('algorithm-select');
const vizBtn         = document.getElementById('visualize-btn');
const pauseBtn       = document.getElementById('pause-btn');
const mazeBtn        = document.getElementById('maze-btn');
const clearPathBtn   = document.getElementById('clear-path-btn');
const resetBtn       = document.getElementById('reset-board-btn');
const instrBtn       = document.getElementById('show-instructions-btn');
const startMenuEl    = document.getElementById('start-menu');
const startAppBtn    = document.getElementById('start-app-btn');
const statusEl       = document.getElementById('status-text');
const statsEl        = document.getElementById('stats-text');
const algoDescEl     = document.getElementById('algo-description');
const speedSlider    = document.getElementById('speed-slider');
const speedLabelEl   = document.getElementById('speed-label');
const modeWallBtn    = document.getElementById('mode-wall-btn');
const modeWeightBtn  = document.getElementById('mode-weight-btn');

// ── Init ───────────────────────────────────────────────────────────────────
function init() {
  grid = createGrid();
  grid[startRow][startCol].isStart = true;
  grid[endRow][endCol].isEnd       = true;
  renderGrid();
  updateAlgoDescription();
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderGrid() {
  gridEl.style.gridTemplateColumns = `repeat(${COLS}, var(--cell))`;
  gridEl.innerHTML = '';

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      applyNodeClass(cell, node);
      gridEl.appendChild(cell);
    }
  }
  attachGridEvents();
}

function getCellEl(row, col) {
  return gridEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function applyNodeClass(cell, node) {
  cell.classList.remove('start','end','wall','weight','visited','path','drag-over');
  if (node.isStart)   cell.classList.add('start');
  else if (node.isEnd)    cell.classList.add('end');
  else if (node.isWall)   cell.classList.add('wall');
  else if (node.isWeight) cell.classList.add('weight');
}

function refreshCell(row, col) {
  const cell = getCellEl(row, col);
  if (cell) applyNodeClass(cell, grid[row][col]);
}

// ── Grid pointer events ────────────────────────────────────────────────────
function attachGridEvents() {
  // Mouse
  gridEl.addEventListener('mousedown',  onPointerDown);
  gridEl.addEventListener('mouseover',  onPointerMove);
  gridEl.addEventListener('mouseup',    onPointerUp);
  document.addEventListener('mouseup',  onPointerUp);

  // Touch
  gridEl.addEventListener('touchstart', onTouchStart, { passive: false });
  gridEl.addEventListener('touchmove',  onTouchMove,  { passive: false });
  gridEl.addEventListener('touchend',   onPointerUp);
}

function nodeFromEvent(e) {
  const el = e.target.closest('.cell');
  if (!el) return null;
  return { el, row: +el.dataset.row, col: +el.dataset.col };
}

function nodeFromTouch(e) {
  const touch = e.touches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!el || !el.classList.contains('cell')) return null;
  return { el, row: +el.dataset.row, col: +el.dataset.col };
}

function onPointerDown(e) {
  if (isRunning && !isPaused) return;
  const hit = nodeFromEvent(e);
  if (!hit) return;
  e.preventDefault();
  isMouseDown = true;

  const node = grid[hit.row][hit.col];
  if (node.isStart) { dragging = 'start'; return; }
  if (node.isEnd)   { dragging = 'end';   return; }

  toggleCell(hit.row, hit.col);
}

function onPointerMove(e) {
  if (!isMouseDown) return;
  const hit = nodeFromEvent(e);
  if (!hit) return;

  if (dragging) {
    handleDragOver(hit.row, hit.col);
    return;
  }
  toggleCell(hit.row, hit.col);
}

function onPointerUp() {
  if (dragging && draggedOver) {
    commitDrag(draggedOver.row, draggedOver.col);
  }
  dragging    = null;
  draggedOver = null;
  isMouseDown = false;
  // Remove any lingering drag-over highlight
  gridEl.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function onTouchStart(e) {
  e.preventDefault();
  if (isRunning && !isPaused) return;
  isMouseDown = true;
  const hit = nodeFromTouch(e);
  if (!hit) return;
  const node = grid[hit.row][hit.col];
  if (node.isStart) { dragging = 'start'; return; }
  if (node.isEnd)   { dragging = 'end';   return; }
  toggleCell(hit.row, hit.col);
}

function onTouchMove(e) {
  e.preventDefault();
  if (!isMouseDown) return;
  const hit = nodeFromTouch(e);
  if (!hit) return;
  if (dragging) { handleDragOver(hit.row, hit.col); return; }
  toggleCell(hit.row, hit.col);
}

// ── Drag helpers ───────────────────────────────────────────────────────────
function handleDragOver(row, col) {
  const node = grid[row][col];
  if (node.isStart || node.isEnd) return;

  // Clear previous highlight
  if (draggedOver) {
    const prev = getCellEl(draggedOver.row, draggedOver.col);
    if (prev) {
      prev.classList.remove('drag-over');
      // Restore previous visual
      applyNodeClass(prev, grid[draggedOver.row][draggedOver.col]);
    }
  }
  draggedOver = { row, col };
  const el = getCellEl(row, col);
  if (el) {
    el.classList.remove('start','end','wall','weight','visited','path');
    el.classList.add(dragging === 'start' ? 'start' : 'end');
    el.classList.add('drag-over');
  }
}

function commitDrag(row, col) {
  const node = grid[row][col];
  if (node.isStart || node.isEnd) return;

  if (dragging === 'start') {
    grid[startRow][startCol].isStart = false;
    node.isWall   = false;
    node.isWeight = false;
    node.weight   = 1;
    node.isStart  = true;
    refreshCell(startRow, startCol);
    startRow = row; startCol = col;
  } else {
    grid[endRow][endCol].isEnd = false;
    node.isWall   = false;
    node.isWeight = false;
    node.weight   = 1;
    node.isEnd    = true;
    refreshCell(endRow, endCol);
    endRow = row; endCol = col;
  }
  refreshCell(row, col);
}

// ── Cell toggle ────────────────────────────────────────────────────────────
function toggleCell(row, col) {
  const node = grid[row][col];
  if (node.isStart || node.isEnd) return;

  if (drawMode === 'wall') {
    if (node.isWeight) { node.isWeight = false; node.weight = 1; }
    node.isWall = !node.isWall;
  } else {
    // weight mode
    if (node.isWall) node.isWall = false;
    node.isWeight = !node.isWeight;
    node.weight   = node.isWeight ? WEIGHT_COST : 1;
  }

  const cell = getCellEl(row, col);
  if (cell) {
    applyNodeClass(cell, node);
    cell.classList.add('wall-animate');
    cell.addEventListener('animationend', () => cell.classList.remove('wall-animate'), { once: true });
  }
}

// ── Mode buttons ───────────────────────────────────────────────────────────
modeWallBtn.addEventListener('click', () => {
  drawMode = 'wall';
  modeWallBtn.classList.add('active');
  modeWeightBtn.classList.remove('active');
});

modeWeightBtn.addEventListener('click', () => {
  drawMode = 'weight';
  modeWeightBtn.classList.add('active');
  modeWallBtn.classList.remove('active');
});

// ── Algorithm description ──────────────────────────────────────────────────
function updateAlgoDescription() {
  const key = algoSelect.value;
  const info = ALGO_INFO[key];
  algoDescEl.textContent = `${info.label}: ${info.desc}`;
}

algoSelect.addEventListener('change', updateAlgoDescription);

// ── Speed slider ───────────────────────────────────────────────────────────
speedSlider.addEventListener('input', () => {
  speedLabelEl.textContent = SPEED_LABELS[speedSlider.value];
});

// ── Visualize ──────────────────────────────────────────────────────────────
vizBtn.addEventListener('click', startVisualization);

function startVisualization() {
  if (isRunning && !isPaused) return;

  // 1. Reset node data, then re-apply weights on weight nodes
  resetPathData(grid);
  for (const row of grid) {
    for (const n of row) {
      if (n.isWeight) n.weight = WEIGHT_COST;
    }
  }

  // 2. Clear visited/path colours from the DOM
  clearPathVisuals();

  const startNode = grid[startRow][startCol];
  const endNode   = grid[endRow][endCol];

  // 3. Seed start so distance-based algorithms work
  startNode.distance = 0;
  startNode.gScore   = 0;
  startNode.fScore   = 0;

  // 4. Run algorithm — every algo now includes endNode in visitedInOrder
  //    when found, and always sets previousNode on each step
  const algoFns = { bfs, dfs, dijkstra, greedy, astar };
  const visitedNodes = algoFns[algoSelect.value](grid, startNode, endNode);

  // 5. Trace path — endNode.previousNode will be set if a path exists
  const lastVisited = visitedNodes[visitedNodes.length - 1];
  const foundEnd    = lastVisited === endNode;
  const pathNodes   = foundEnd ? getNodesInShortestPath(endNode) : [];

  isRunning = true;
  isPaused  = false;
  vizBtn.disabled   = true;
  pauseBtn.disabled = false;
  mazeBtn.disabled  = true;
  setStatus('Visualizing\u2026');
  statsEl.textContent = '';

  animateAlgorithm(visitedNodes, pathNodes, startNode, endNode);
}

// ── Animation ──────────────────────────────────────────────────────────────
let animQueue = [];
let animIndex = 0;

function animateAlgorithm(visitedNodes, pathNodes, startNode, endNode) {
  animQueue = visitedNodes;
  animIndex = 0;
  stepAnimation(visitedNodes, pathNodes, startNode, endNode);
}

function stepAnimation(visitedNodes, pathNodes, startNode, endNode) {
  if (isPaused) return;

  if (animIndex >= visitedNodes.length) {
    // Done visiting — animate path if one exists
    if (pathNodes.length === 0) {
      setStatus('No path found!');
      statsEl.textContent = `Visited: ${visitedNodes.length} nodes`;
      finishAnimation();
      return;
    }
    animatePath(pathNodes, visitedNodes.length);
    return;
  }

  const node = visitedNodes[animIndex];
  if (!node.isStart && !node.isEnd) {
    const cell = getCellEl(node.row, node.col);
    if (cell) {
      cell.classList.remove('wall','weight');
      cell.classList.add('visited');
    }
  }
  animIndex++;
  animTimeout = setTimeout(
    () => stepAnimation(visitedNodes, pathNodes, startNode, endNode),
    SPEED_MAP[speedSlider.value]
  );
}

function animatePath(pathNodes, visitedCount) {
  let i = 0;
  function step() {
    if (i >= pathNodes.length) {
      setStatus('Done!');
      statsEl.textContent = `Visited: ${visitedCount} nodes  |  Path: ${pathNodes.length} steps`;
      finishAnimation();
      return;
    }
    const node = pathNodes[i];
    if (!node.isStart && !node.isEnd) {
      const cell = getCellEl(node.row, node.col);
      if (cell) {
        cell.classList.remove('visited');
        cell.classList.add('path');
      }
    }
    i++;
    animTimeout = setTimeout(step, SPEED_MAP[speedSlider.value] * 1.5);
  }
  step();
}

function finishAnimation() {
  isRunning = false;
  isPaused  = false;
  vizBtn.disabled   = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = '⏸ Pause';
  mazeBtn.disabled  = false;
}

// ── Pause / Resume ─────────────────────────────────────────────────────────
pauseBtn.addEventListener('click', togglePause);

function togglePause() {
  if (!isRunning) return;
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
  setStatus(isPaused ? 'Paused' : 'Visualizing…');

  if (!isPaused) {
    // Re-fetch queued state and resume
    const startNode = grid[startRow][startCol];
    const endNode   = grid[endRow][endCol];
    const algoFns   = { bfs, dfs, dijkstra, greedy, astar };
    const visitedNodes = animQueue;
    const pathNodes    = getNodesInShortestPath(endNode);
    stepAnimation(visitedNodes, pathNodes, startNode, endNode);
  } else {
    clearTimeout(animTimeout);
  }
}

// ── Clear path ─────────────────────────────────────────────────────────────
clearPathBtn.addEventListener('click', () => {
  stopAnimation();
  clearPathVisuals();
  setStatus('Path cleared');
  statsEl.textContent = '';
});

function clearPathVisuals() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = getCellEl(r, c);
      if (!cell) continue;
      cell.classList.remove('visited','path');
      applyNodeClass(cell, grid[r][c]);
    }
  }
}

// ── Reset board ────────────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  stopAnimation();
  init();
  setStatus('Board reset');
  statsEl.textContent = '';
});

// ── Stop helper ────────────────────────────────────────────────────────────
function stopAnimation() {
  clearTimeout(animTimeout);
  isRunning = false;
  isPaused  = false;
  vizBtn.disabled   = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = '⏸ Pause';
  mazeBtn.disabled  = false;
}

// ── Maze Generation (Recursive Division) ──────────────────────────────────
mazeBtn.addEventListener('click', generateMaze);

function generateMaze() {
  stopAnimation();
  // Clear walls first
  for (const row of grid) {
    for (const node of row) {
      if (!node.isStart && !node.isEnd) {
        node.isWall = false;
        node.isWeight = false;
        node.weight = 1;
      }
    }
  }

  // Add border walls
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
        const node = grid[r][c];
        if (!node.isStart && !node.isEnd) node.isWall = true;
      }
    }
  }

  // Recursive division
  recursiveDivision(1, ROWS - 2, 1, COLS - 2, chooseOrientation(ROWS - 2, COLS - 2));

  // Animate walls appearing in batches
  const walls = [];
  for (const row of grid) for (const node of row) if (node.isWall) walls.push(node);

  let i = 0;
  function revealWall() {
    if (i >= walls.length) { setStatus('Maze generated!'); return; }
    const node = walls[i];
    const cell = getCellEl(node.row, node.col);
    if (cell) {
      cell.classList.add('wall', 'wall-animate');
      cell.addEventListener('animationend', () => cell.classList.remove('wall-animate'), { once: true });
    }
    i += 3; // batch
    setTimeout(revealWall, 8);
  }
  revealWall();
  statsEl.textContent = '';
  setStatus('Generating maze…');
}

function recursiveDivision(rStart, rEnd, cStart, cEnd, horizontal) {
  if (rEnd - rStart < 2 || cEnd - cStart < 2) return;

  if (horizontal) {
    // Choose a random even row to place a wall
    const possibleRows = range(rStart + 1, rEnd - 1).filter(r => r % 2 === 0);
    if (!possibleRows.length) return;
    const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
    // Choose a random odd col for the passage
    const possibleCols = range(cStart, cEnd).filter(c => c % 2 !== 0);
    const passCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    for (let c = cStart; c <= cEnd; c++) {
      const node = grid[wallRow][c];
      if (!node.isStart && !node.isEnd && c !== passCol) node.isWall = true;
    }
    recursiveDivision(rStart, wallRow - 1, cStart, cEnd, chooseOrientation(wallRow - 1 - rStart, cEnd - cStart));
    recursiveDivision(wallRow + 1, rEnd,   cStart, cEnd, chooseOrientation(rEnd - wallRow - 1, cEnd - cStart));
  } else {
    const possibleCols = range(cStart + 1, cEnd - 1).filter(c => c % 2 === 0);
    if (!possibleCols.length) return;
    const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
    const possibleRows = range(rStart, rEnd).filter(r => r % 2 !== 0);
    const passRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    for (let r = rStart; r <= rEnd; r++) {
      const node = grid[r][wallCol];
      if (!node.isStart && !node.isEnd && r !== passRow) node.isWall = true;
    }
    recursiveDivision(rStart, rEnd, cStart, wallCol - 1, chooseOrientation(rEnd - rStart, wallCol - 1 - cStart));
    recursiveDivision(rStart, rEnd, wallCol + 1, cEnd,   chooseOrientation(rEnd - rStart, cEnd - wallCol - 1));
  }
}

function chooseOrientation(height, width) {
  if (width < height) return true;   // horizontal
  if (height < width) return false;  // vertical
  return Math.random() < 0.5;
}

function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

// ── Instructions modal ─────────────────────────────────────────────────────
instrBtn.addEventListener('click', () => {
  startMenuEl.style.display = 'flex';
});

startAppBtn.addEventListener('click', () => {
  startMenuEl.style.display = 'none';
});

// ── Keyboard shortcut: Space = visualize / pause / resume ─────────────────
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return;
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
  e.preventDefault();

  if (isRunning) {
    togglePause();
  } else {
    startVisualization();
  }
});

// ── Status helper ──────────────────────────────────────────────────────────
function setStatus(msg) {
  statusEl.textContent = msg;
}

// ── Start ──────────────────────────────────────────────────────────────────
init();