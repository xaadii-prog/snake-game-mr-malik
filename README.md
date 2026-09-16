# 🐍 Snake Game — Mr. Malik

A modern take on the classic Snake game, designed with a clean dark interface, responsive controls, progressive levels, and a focused arcade-style experience.

Built from scratch using **HTML5, CSS3, and JavaScript**, with the game rendered directly on an HTML5 Canvas.

---

## 🎮 Game Features

### 🧱 Wall Levels

Play through progressive levels where the walls become part of the challenge. Navigate carefully, collect food, increase your score, and reach the target required to advance.

### ♾️ No Walls

Prefer a more relaxed arcade experience?

In **No Walls** mode, the snake can pass through one side of the board and appear from the opposite side.

### ⚡ Three Difficulty Levels

Choose the speed that matches your play style:

* **Easy** — Relaxed gameplay
* **Medium** — Balanced challenge
* **Hard** — Faster and more demanding gameplay

Difficulty can be changed before starting a new game.

### 🍎 Food & Scoring

Collect regular food to increase your score and grow the snake.

As the game progresses, reaching the required score allows you to complete the current level and move forward.

### ⭐ Bonus Food

Special bonus food can appear during gameplay.

Bonus food provides an additional scoring opportunity and is available for a limited amount of time, making quick decisions and movement important.

### 📈 Level Progression

The Wall Levels mode contains multiple progressive levels.

Each level increases the challenge through faster gameplay and different board conditions.

The current level, level name, score, and high score are displayed throughout the game.

### 🏆 High Score

Your highest score is saved locally in the browser using `localStorage`, allowing the game to remember your best performance between sessions.

### 🔊 Sound & Music

The game includes:

* Background music
* Food collection sounds
* Bonus food sounds
* Level completion sounds
* Game-over sound
* Sound ON/OFF control

Music and game sounds are controlled through a single sound button for a simple and consistent experience.

The sound preference is also saved locally.

### ⏸️ Pause & Resume

Pause the game whenever you need a break.

When the game is paused:

* Gameplay stops
* Background music pauses
* The interface changes to a paused state

Resume the game to continue from where you left off.

### ↻ Restart

Restart the current game quickly without refreshing the page.

After a game over, the game can also be started again directly.

### ⌨️ Keyboard Controls

Desktop players can control the snake using:

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

### 📱 Mobile Controls

The game is designed to work on mobile devices as well.

Mobile players can use:

* Swipe gestures on the game board
* On-screen directional D-pad controls

The touch controls are designed specifically for quick directional input while keeping the game interface clean.

---

## 🎯 Game Modes

### Wall Levels

The classic challenge.

Walls are part of the level design, and the player must avoid collisions while progressing through increasingly difficult levels.

### No Walls

A different style of Snake gameplay where leaving one side of the board brings the snake back from the opposite side.

---

## 🖥️ Interface

The game uses a dark, modern interface with separate sections for:

* Game mode selection
* Difficulty selection
* Pause and restart controls
* Score
* Current level
* High score
* Level name
* Bonus status
* Bonus timer
* Game board
* Mobile controls

The interface is designed to remain clear while keeping the focus on gameplay.

---

## 🛠️ Built With

**HTML5**
Structure and game interface.

**CSS3**
Responsive layout, animations, buttons, panels, dark theme, mobile controls, and visual styling.

**JavaScript**
Game logic, movement, collision detection, scoring, levels, difficulty, controls, audio, bonus system, and game state management.

**HTML5 Canvas**
Used to render the Snake game board and gameplay.

**Web Audio API**
Used for game sound effects.

**LocalStorage**
Used to save player preferences and high score data locally in the browser.

---

## 📂 Project Structure

```text
snake-game-mr-malik/
│
├── index.html
├── sn.css
├── sn.js
├── music.mp3
└── README.md
```

---

## 🚀 Running the Game

No installation or build process is required.

Download or clone the project, then open:

```text
index.html
```

in a modern web browser.

For background music, make sure `music.mp3` is located in the same directory as `index.html`.

---

## 📱 Browser Support

The game is designed for modern browsers with support for:

* HTML5 Canvas
* JavaScript
* Web Audio API
* LocalStorage
* Touch events

Desktop and mobile browsers are supported.

---

## 🔄 Development Roadmap

### v1.0.0 — Stable Release

Current release featuring the core Snake experience, game modes, difficulty levels, scoring, levels, bonus food, audio, high scores, keyboard controls, swipe controls, and mobile D-pad controls.

### v2.0.0 — Themes

Planned visual theme system with multiple professional game environments and additional customization.

### v3.0.0 — Optimization

Planned performance and production improvements, including cleaner code, optimized assets, smoother mobile performance, and audio/touch optimization.

---

## 📌 Current Version

**v1.0.0**

The current version focuses on a complete and stable core gameplay experience.

Future versions will build on the existing system without changing the basic Snake gameplay.

---

## 👨‍💻 Author

**Mr. Malik**

GitHub: **@xaadii-prog**

---

## 📜 License

This project is currently maintained as a personal project by **Mr. Malik**.

© Mr. Malik — All rights reserved.
