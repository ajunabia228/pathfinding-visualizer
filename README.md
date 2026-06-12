# 🧭 Pathfinding Visualizer

An interactive **Pathfinding Visualizer** built with **HTML, CSS, and JavaScript** that demonstrates how different graph traversal and shortest-path algorithms explore a grid.

Users can:
- 🟩 set a start node
- 🟥 set an end node
- ⬛ draw walls
- ▶️ visualize algorithms step-by-step
- ⏸️ pause and resume animations
- 📖 read instructions from the start menu

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


## 🚀 How to Run Locally

Option 1: Open directly in browser
Just open index.html in your browser.

Option 2: Use VS Code Live Server
If you want a smoother local experience:

Open the project in VS Code
Install the Live Server extension
Right-click index.html
Click Open with Live Server

🎮 How to Use
Open the app
Read the instructions in the start menu
Click Start Visualizing
Click or drag on the grid to place walls
Choose an algorithm from the dropdown
Click Visualize
Use Pause to stop animation and Resume to continue
Use Clear Path to remove visited/path animations
Use Reset Board to restore the full board
🎨 Color Legend
🟩 Green = Start node
🟥 Red = End node
⬛ Black = Wall
🟦 Blue = Visited node
🟨 Yellow = Final path
📌 Current Behavior Notes
BFS and Dijkstra may appear similar because all moves currently have equal cost
DFS does not guarantee the shortest path
Greedy Best-First Search may be fast, but may not find the optimal route
A* is generally more efficient while still finding the shortest path in this setup

🙌 Acknowledgments
Built as a learning project to better understand:

graph traversal
shortest-path algorithms
animation logic
DOM manipulation
interactive UI design
