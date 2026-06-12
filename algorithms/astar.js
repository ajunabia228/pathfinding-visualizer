// algorithms/astar.js
// A* Search — weighted, guarantees shortest path using g + h cost.

function astar(grid, startNode, endNode) {
  const visitedInOrder = [];

  startNode.gScore = 0;
  startNode.fScore = heuristicA(startNode, endNode);
  const openSet = [startNode];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();

    if (current.visited) continue;
    current.visited = true;
    visitedInOrder.push(current);

    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current, grid)) {
      if (neighbor.visited) continue;
      const tentativeG = current.gScore + neighbor.weight;
      if (tentativeG < neighbor.gScore) {
        neighbor.previousNode = current;
        neighbor.gScore       = tentativeG;
        neighbor.hScore       = heuristicA(neighbor, endNode);
        neighbor.fScore       = neighbor.gScore + neighbor.hScore;
        openSet.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}

function heuristicA(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}