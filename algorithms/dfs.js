function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return visitedNodesInOrder;
    }

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        if (neighbor.previousNode === null) {
          neighbor.previousNode = currentNode;
        }
        stack.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
