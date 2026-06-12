function astar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const openSet = [];

  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(startNode, endNode);
  startNode.totalCost = startNode.distance + startNode.heuristic;

  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.totalCost - b.totalCost);
    const currentNode = openSet.shift();

    if (currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return visitedNodesInOrder;
    }

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (neighbor.isWall || neighbor.isVisited) continue;

      const tentativeDistance = currentNode.distance + 1;

      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = manhattanDistance(neighbor, endNode);
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;
        neighbor.previousNode = currentNode;
        openSet.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
