function greedyBestFirst(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const openSet = [];

  startNode.heuristic = manhattanDistance(startNode, endNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.heuristic - b.heuristic);
    const currentNode = openSet.shift();

    if (currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return visitedNodesInOrder;
    }

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.heuristic = manhattanDistance(neighbor, endNode);

        if (neighbor.previousNode === null) {
          neighbor.previousNode = currentNode;
        }

        openSet.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
