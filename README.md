# 🧭 Pathfinding Visualizer

An interactive **Pathfinding Visualizer** built with **HTML, CSS, and JavaScript** that demonstrates how different graph traversal and shortest-path algorithms explore a grid.

<p align="center">
  <a href="https://ajunabia228.github.io/pathfinding-visualizer/">
    <img src="https://img.shields.io/badge/▶%20TEST%20IT%20LIVE-00ff88?style=for-the-badge&logoColor=black" alt="Test it live">
  </a>
</p>

Users can:
- 🟩 Set a start node
- 🟥 Set an end node
- ⬛ Draw walls
- ▶️ Visualize algorithms step-by-step
- ⏸️ Pause and resume animations
- 📖 Read instructions from the start menu

---

## ✨ Features

- 🗺️ Interactive grid-based board
- ⬛ Click and drag to create walls
- 🟩 Start node
- 🟥 End node
- 🎞️ Animated visited nodes and final path
- ⏸️ Pause / Resume support
- 📖 Start menu with instructions
- 📊 Status text updates during visualization
- 🚫 No-path detection message

---

## 🧠 Algorithms Included

- **BFS (Breadth-First Search)**
  Finds the shortest path in an unweighted grid.

- **DFS (Depth-First Search)**
  Explores deeply before backtracking. Does **not** guarantee the shortest path.

- **Dijkstra's Algorithm**
  Finds the shortest path in graphs with non-negative weights. In this project, all moves currently cost 1.

- **Greedy Best-First Search**
  Chooses nodes that appear closest to the goal using a heuristic. Fast, but not guaranteed shortest.

- **A\* Search**
  Combines path cost and heuristic distance for efficient shortest-path finding.

---

## 🛠️ Built With

- **HTML**
- **CSS**
- **JavaScript**

No frameworks or build tools required.

---

## 📁 Project Structure

```bash
pathfinding-visualizer/
├── index.html
├── style.css
├── script.js
├── algorithms/
│   ├── bfs.js
│   ├── dfs.js
│   ├── dijkstra.js
│   ├── greedy.js
│   └── astar.js
└── utils/
    └── grid.js
```

---

## 🚀 How to Run Locally

**Option 1: Open directly in browser**

Just open `index.html` in your browser.

**Option 2: Use VS Code Live Server**

If you want a smoother local experience:

1. Open the project in VS Code
2. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
3. Right-click `index.html`
4. Click **Open with Live Server**

---

## 🎮 How to Use

1. Open the app
2. Read the instructions in the start menu
3. Click **Start Visualizing**
4. Click or drag on the grid to place walls
5. Choose an algorithm from the dropdown
6. Click **Visualize**
7. Use **Pause** to stop the animation and **Resume** to continue
8. Use **Clear Path** to remove visited/path animations
9. Use **Reset Board** to restore the full board

---

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🟩 Green | Start node |
| 🟥 Red | End node |
| ⬛ Black | Wall |
| 🟦 Blue | Visited node |
| 🟨 Yellow | Final path |

---

## 📌 Current Behavior Notes

- BFS and Dijkstra may appear similar because all moves currently have equal cost
- DFS does not guarantee the shortest path
- Greedy Best-First Search may be fast, but may not find the optimal route
- A\* is generally more efficient while still finding the shortest path in this setup

---

## 🙌 Acknowledgments

Built as a learning project to better understand:

- Graph traversal
- Shortest-path algorithms
- Animation logic
- DOM manipulation
- Interactive UI design
