# 🐍 Snake Game — Mr. Malik

<p align="center">
  <strong>A modern, responsive, arcade-style Snake experience built from scratch.</strong>
</p>

<p align="center">
  HTML5 · CSS3 · JavaScript · Canvas · Web Audio API · LocalStorage
</p>

---

## 🎮 About The Game

**Snake Game — Mr. Malik** is a modern interpretation of the classic Snake game, combining traditional arcade gameplay with a dark, responsive interface, progressive levels, multiple game modes, difficulty settings, audio feedback, bonus mechanics, and mobile-friendly controls.

The project is built entirely from scratch using **HTML5, CSS3, and vanilla JavaScript**, with gameplay rendered through the **HTML5 Canvas API**.

The goal is simple:

> **Collect food. Grow the snake. Increase your score. Survive. Progress.**

---

# ✨ Highlights

* 🎮 Multiple gameplay modes
* 🧱 Progressive Wall Levels
* ♾️ No Walls mode
* ⚡ Easy, Medium & Hard difficulty
* 🍎 Food and scoring system
* ⭐ Timed bonus food
* 📈 Progressive level system
* 🏆 Local high-score system
* 🔊 Background music and sound effects
* ⏸️ Pause & Resume
* ↻ Instant Restart
* ⌨️ Keyboard controls
* 📱 Swipe controls
* 🎮 Mobile D-pad controls
* 🌙 Modern dark interface
* 🎨 Premium visual experience
* ⚙️ Optimized production files
* 📦 Minified project assets
* 💻 Desktop & mobile support

---

# 🎯 Game Modes

## 🧱 Wall Levels

The main progressive Snake experience.

Players must navigate through increasingly challenging levels while avoiding walls, collecting food, growing the snake, and reaching the required score.

As progression continues, the gameplay becomes more demanding through increased speed and changing board conditions.

---

## ♾️ No Walls

A more relaxed arcade mode.

Instead of colliding with the edge of the board, the snake wraps around the screen and appears from the opposite side.

This creates a different gameplay style focused on movement, positioning, and score optimization.

---

# ⚡ Difficulty System

Choose your preferred challenge before starting a game.

| Difficulty    | Experience                    |
| ------------- | ----------------------------- |
| 🟢 **Easy**   | Relaxed and beginner-friendly |
| 🟡 **Medium** | Balanced arcade challenge     |
| 🔴 **Hard**   | Faster and more demanding     |

Difficulty affects gameplay speed and provides different levels of challenge for different play styles.

---

# 🍎 Food & Scoring

Regular food is the primary scoring mechanic.

Collecting food:

* Increases the score
* Grows the snake
* Helps meet level objectives
* Advances gameplay progression

The score system works together with the level progression system to create a continuous arcade-style challenge.

---

# ⭐ Bonus Food

Special bonus food can appear during gameplay.

Bonus food:

* Provides additional scoring opportunities
* Appears for a limited time
* Requires quick reactions
* Adds another strategic element to normal gameplay

Players must decide whether to take the opportunity while maintaining control of the snake.

---

# 📈 Level Progression

The **Wall Levels** mode is designed around progressive difficulty.

Each level can introduce:

* Increased gameplay speed
* Different board conditions
* New challenges
* Higher score requirements

The game interface keeps the player informed through:

* Current level
* Level name
* Current score
* High score
* Bonus status
* Bonus timer

---

# 🏆 High Score System

The game stores the player's highest score locally using the browser's **LocalStorage API**.

This means the best score can remain available between browser sessions without requiring:

* User accounts
* Databases
* External servers
* Online authentication

---

# 🔊 Audio Experience

The game includes an integrated audio system designed to provide feedback during gameplay.

### Audio includes:

* 🎵 Background music
* 🍎 Food collection sounds
* ⭐ Bonus food sounds
* 📈 Level completion sounds
* 💥 Game-over sound
* 🔊 Sound ON/OFF control

The player's sound preference is also stored locally.

---

# ⏸️ Pause & Resume

Players can pause the game whenever necessary.

During pause:

* Gameplay stops
* Background music pauses
* The interface enters a paused state

The game can then be resumed without restarting the current session.

---

# ↻ Restart System

The game includes quick restart functionality.

Players can:

* Restart the current game
* Restart after game over
* Begin a new session without refreshing the browser

---

# ⌨️ Keyboard Controls

Desktop players can use either arrow keys or WASD.

| Key     | Action          |
| ------- | --------------- |
| `↑`     | Move Up         |
| `↓`     | Move Down       |
| `←`     | Move Left       |
| `→`     | Move Right      |
| `W`     | Move Up         |
| `A`     | Move Left       |
| `S`     | Move Down       |
| `D`     | Move Right      |
| `Space` | Pause / Resume  |
| `Enter` | Start / Restart |

---

# 📱 Mobile Experience

The game is designed to work across modern mobile devices as well as desktop screens.

### Mobile controls include:

* 👆 Swipe gestures
* 🎮 On-screen directional D-pad
* 📱 Responsive game interface

The controls are designed for quick directional input while keeping the gameplay area clear.

---

# 🎨 Premium Visual Experience

The V3 development cycle introduces a stronger visual direction for the project.

The interface focuses on:

* Modern dark aesthetics
* Clear information hierarchy
* Arcade-style presentation
* Responsive UI components
* Clean game panels
* Focused gameplay layout
* Improved visual polish

The visual system is also structured to support future theme and presentation improvements.

---

# ⚙️ V3 — Optimization & Production Release

## `v3.0.0`

Version 3 represents an important transition toward a cleaner and more deployment-ready version of the project.

### 🚀 V3 Improvements

* Production-oriented project cleanup
* Minified HTML
* Minified CSS
* Minified JavaScript
* Reduced source-file overhead
* Cleaner production file structure
* Optimized asset delivery
* Existing gameplay preserved
* Existing controls preserved
* Existing audio system preserved
* Existing progression system preserved
* Existing mobile functionality preserved

Instead of keeping separate development and production copies inside the main project, the optimized files are used directly in the project structure.

This keeps the repository simple and makes the GitHub version closer to the files intended for actual deployment.

---

# 📦 Production Structure

```text
snake-game-mr-malik/
│
├── index.html
├── sn.css
├── sn.js
├── music.mp3
└── README.md
```

The production release keeps the core project structure lightweight and easy to understand.

---

# 🛠️ Technology Stack

### HTML5

Used for:

* Page structure
* Game interface
* Controls
* UI components

### CSS3

Used for:

* Responsive layouts
* Dark theme
* Animations
* Buttons
* Panels
* Mobile controls
* Visual effects
* UI styling

### JavaScript

Used for:

* Snake movement
* Game logic
* Collision detection
* Food generation
* Scoring
* Levels
* Difficulty
* Game modes
* Bonus mechanics
* Keyboard input
* Touch input
* Audio control
* Pause/resume
* Restart system
* Game state management

### HTML5 Canvas

Used for real-time Snake gameplay rendering.

### Web Audio API

Used for gameplay audio and sound effects.

### LocalStorage API

Used for persistent local data such as:

* High score
* Sound preferences
* Player settings

---

# 🚀 Getting Started

No package manager, framework, or build system is required.

## Clone the Repository

```bash
git clone https://github.com/xaadii-prog/snake-game-mr-malik.git
```

## Enter the Project

```bash
cd snake-game-mr-malik
```

## Run

Open:

```text
index.html
```

in a modern web browser.

For audio functionality, make sure:

```text
music.mp3
```

is located in the same directory as:

```text
index.html
```

---

# 🌐 Browser Compatibility

The game targets modern browsers with support for:

* HTML5 Canvas
* JavaScript
* Web Audio API
* LocalStorage
* Touch Events

The project is designed for both:

* 💻 Desktop browsers
* 📱 Mobile browsers

---

# 📊 Version History

## 🚀 v3.0.0 — Optimization & Production Release

**Current Release**

V3 focuses on moving the project toward a cleaner and more optimized production structure.

### Completed

* Premium visual direction
* Production cleanup
* HTML optimization
* CSS optimization
* JavaScript optimization
* Minification
* Reduced project overhead
* GitHub V3 release preparation
* Production-ready repository structure

---

## v2.0.0 — Feature Expansion

The second major development stage expanded the original Snake experience.

### Major Features

* Wall Levels
* No Walls mode
* Three difficulty levels
* Progressive gameplay
* Bonus food
* High scores
* Background music
* Sound effects
* Pause/resume
* Restart system
* Keyboard controls
* Swipe controls
* Mobile D-pad
* Responsive interface

---

## v1.0.0 — Core Snake Release

The initial version established the fundamental Snake gameplay system.

### Core Features

* Snake movement
* Food collection
* Score system
* Snake growth
* Collision detection
* Canvas rendering
* Basic game interface
* Keyboard controls

---

# 🗺️ Roadmap

The project is continuing to evolve beyond V3.

## 🎨 Premium Visual Effects

**Status: ⏳ Next**

Further visual enhancements planned to push the interface and gameplay presentation toward a more polished arcade experience.

---

## 🔊 Audio 2.0

**Status: ⏳ Planned**

A future audio upgrade focused on a richer and more refined sound experience.

Potential improvements include:

* Enhanced sound effects
* Improved audio feedback
* More polished music integration
* Better gameplay audio transitions

---

## 📱 Mobile 2.0

**Status: ⏳ Planned**

A dedicated mobile experience improvement phase focused on:

* Better touch interaction
* Improved D-pad experience
* Mobile UI refinement
* Better responsive behavior
* More comfortable gameplay on smaller screens

---

## 📊 Player Statistics

**Status: ⏳ Planned**

A future statistics system designed to provide deeper insight into player performance.

Potential statistics may include:

* Games played
* Best score
* Levels completed
* Food collected
* Bonus food collected
* Gameplay records

---

## 🧹 Final Polish & Testing

**Status: ⏳ Planned**

Final quality improvements covering:

* Bug testing
* Cross-browser testing
* Mobile testing
* UI refinement
* Gameplay balancing
* Performance checks
* Final production cleanup

---

## 📦 Minification

**Status: ✅ Completed**

Production HTML, CSS, and JavaScript files have been minified as part of the V3 optimization process.

---

## 🚀 GitHub v3.0.0 Release

**Status: ✅ Completed**

The V3 production release has been committed and pushed to the project's GitHub repository.

---

# 🔮 Future Vision

The long-term goal is to evolve this project from a simple Snake implementation into a polished browser-based arcade experience.

Future development may explore:

* 🎨 More visual themes
* 🏆 Advanced achievements
* 📊 Detailed player statistics
* 🔊 Expanded audio systems
* 📱 Improved mobile gameplay
* 🎮 Additional game modes
* ⚡ Further performance optimization
* 🧩 New gameplay mechanics

The core Snake experience will remain at the heart of the project.

---

# 📂 Repository

**GitHub Repository**

https://github.com/xaadii-prog/snake-game-mr-malik

---

# 👨‍💻 Author

**Mr. Malik**

GitHub: **[@xaadii-prog](https://github.com/xaadii-prog)**

---

# 📜 License

This project is maintained as a personal project by **Mr. Malik**.

© Mr. Malik — All rights reserved.

---

<p align="center">

### 🐍 Snake Game — Mr. Malik

**Built from scratch · Optimized for V3 · Designed for the arcade**

⭐ If you like the project, consider giving the repository a star.

</p>
