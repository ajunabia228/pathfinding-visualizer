// algorithms/bfs.js
// Breadth-First Search — unweighted, guarantees shortest path.

function bfs(grid, startNode, endNode) {
  const visitedInOrder = [];
  const queue = [startNode];
  startNode.visited = true;

  while (queue.length > 0) {
    const current = queue.shift();
    visitedInOrder.push(current);

    if (current === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.visited) {
        neighbor.visited      = true;
        neighbor.previousNode = current;
        queue.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}
