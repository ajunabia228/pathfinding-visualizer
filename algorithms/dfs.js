// algorithms/dfs.js
// Depth-First Search — unweighted, does NOT guarantee shortest path.

function dfs(grid, startNode, endNode) {
  const visitedInOrder = [];

  function dfsHelper(node) {
    if (node.visited) return false;
    node.visited = true;
    visitedInOrder.push(node);
    if (node === endNode) return true;

    for (const neighbor of getNeighbors(node, grid)) {
      if (!neighbor.visited) {
        neighbor.previousNode = node;
        if (dfsHelper(neighbor)) return true;
      }
    }
    return false;
  }

  dfsHelper(startNode);
  return visitedInOrder;
}
