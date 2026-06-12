// algorithms/dijkstra.js
// Dijkstra's Algorithm — weighted, guarantees shortest path.

function dijkstra(grid, startNode, endNode) {
  const visitedInOrder = [];
  startNode.distance = 0;

  // Min-heap style: only track unvisited reachable nodes
  const openSet = [startNode];

  while (openSet.length > 0) {
    // Sort only the open set (much smaller than all nodes)
    openSet.sort((a, b) => a.distance - b.distance);
    const closest = openSet.shift();

    if (closest.visited) continue;
    if (closest.distance === Infinity) break; // unreachable

    closest.visited = true;
    visitedInOrder.push(closest);

    if (closest === endNode) return visitedInOrder;

    for (const neighbor of getNeighbors(closest, grid)) {
      if (neighbor.visited) continue;
      const newDist = closest.distance + neighbor.weight;
      if (newDist < neighbor.distance) {
        neighbor.distance     = newDist;
        neighbor.previousNode = closest;
        openSet.push(neighbor);
      }
    }
  }
  return visitedInOrder;
}
