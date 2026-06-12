function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const queue = [];

  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return visitedNodesInOrder;
    }

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
