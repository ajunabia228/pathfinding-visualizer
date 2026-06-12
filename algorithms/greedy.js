// algorithms/greedy.js
// Greedy Best-First Search — heuristic only, fast but NOT guaranteed shortest path.

function greedy(grid, startNode, endNode) {
  const visitedInOrder = [];

  startNode.hScore = heuristic(startNode, endNode);
  const openSet = [startNode];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.hScore - b.hScore);
    const current = openSet.shift();

    if (current.visited) continue;
    current.visited = true;
    visitedInOrder.push(current);

    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.visited) {
        neighbor.previousNode = current;
        neighbor.hScore       = heuristic(neighbor, endNode);
        openSet.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}

function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
