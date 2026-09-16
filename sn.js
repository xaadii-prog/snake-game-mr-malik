const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highScoreEl = document.getElementById("highScore");
const levelNameEl = document.getElementById("levelName");
const bonusStatusEl = document.getElementById("bonusStatus");
const modeTextEl = document.getElementById("modeText");
const bonusTimerEl = document.getElementById("bonusTimer");

const messageBox = document.getElementById("messageBox");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const startBtn = document.getElementById("startBtn");

const wallModeBtn = document.getElementById("wallModeBtn");
const freeModeBtn = document.getElementById("freeModeBtn");

const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");

const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const soundBtn = document.getElementById("soundBtn");
const bgMusic = document.getElementById("bgMusic");


/* =========================
   GAME SETTINGS
========================= */

const grid = 25;
const levelTarget = 200;


/*
    Lower number = faster snake.

    Easy   = slow
    Medium = medium
    Hard   = fast
*/

const difficultySettings = {
    easy: {
        name: "Easy",
        speeds: [
            165,
            152,
            139,
            126,
            113
        ],
        freeSpeed: 145
    },

    medium: {
        name: "Medium",
        speeds: [
            125,
            112,
            99,
            86,
            74
        ],
        freeSpeed: 105
    },

    hard: {
        name: "Hard",
        speeds: [
            95,
            85,
            76,
            67,
            58
        ],
        freeSpeed: 82
    }
};


/* =========================
   GAME VARIABLES
========================= */

let cellSize = 20;

let snake = [];
let food = null;
let bonusFood = null;
let walls = [];

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let directionQueue = [];

let score = 0;
let levelScore = 0;
let level = 1;

let highScore =
    Number(
        localStorage.getItem(
            "malikSnakeHighScore"
        )
    ) || 0;


/* =========================
   GAME STATE
========================= */

let gameRunning = false;

let paused = false;

let levelCompleted = false;

let gameMode = "wall";

let difficulty =
    localStorage.getItem(
        "malikSnakeDifficulty"
    ) || "medium";

/* =========================================================
   GAME SOUND + BACKGROUND MUSIC SYSTEM
   ONE SOUND BUTTON CONTROLS EVERYTHING
========================================================= */


/* =========================================================
   AUDIO ELEMENT
   HTML mein ye hona zaroori hai:

   <audio id="bgMusic" loop preload="auto">
       <source src="music.mp3" type="audio/mpeg">
   </audio>
========================================================= */




/* =========================================================
   SOUND BUTTON
   HTML mein ye hona zaroori hai:

   <button id="soundBtn" type="button">
       🔊 Sound ON
   </button>
========================================================= */


/* =========================================================
   SOUND ON / OFF STATE

   Agar pehle OFF save hai to OFF rahega.
   Warna default ON hoga.
========================================================= */

let soundEnabled =
    localStorage.getItem("malikSnakeSound") !== "off";


/* =========================================================
   MUSIC STATE

   Music bhi Sound Button ke saath connected hai.
========================================================= */

let musicEnabled = soundEnabled;


/* =========================================================
   SAVE MUSIC STATE
========================================================= */

localStorage.setItem(
    "malikSnakeMusic",
    musicEnabled ? "on" : "off"
);


/* =========================================================
   BACKGROUND MUSIC SETTINGS
========================================================= */

if (bgMusic) {

    bgMusic.loop = true;

    bgMusic.volume = 0.25;
}


/* =========================================================
   START BACKGROUND MUSIC
========================================================= */

function startBackgroundMusic() {

    if (!bgMusic || !soundEnabled) {
        return;
    }

    musicEnabled = true;


    const playPromise =
        bgMusic.play();


    if (playPromise !== undefined) {

        playPromise.catch(() => {

            /*
                Browser autoplay restriction
                ko silently handle karega.
            */

        });
    }
}


/* =========================================================
   STOP BACKGROUND MUSIC
========================================================= */

function stopBackgroundMusic() {

    if (!bgMusic) {
        return;
    }

    musicEnabled = false;

    bgMusic.pause();
}


/* =========================================================
   AUDIO CONTEXT
   Game ke sound effects ke liye.
========================================================= */

let audioContext = null;


/* =========================================================
   CREATE / GET AUDIO CONTEXT
========================================================= */

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        /*
            Agar browser Web Audio support nahi karta
            to error nahi aayega.
        */

        if (!AudioContext) {
            return null;
        }


        audioContext =
            new AudioContext();
    }


    /*
        Agar AudioContext suspended hai
        to resume karne ki koshish karega.
    */

    if (
        audioContext.state === "suspended"
    ) {

        audioContext
            .resume()
            .catch(() => {});

    }


    return audioContext;
}


/* =========================================================
   BASIC GAME SOUND
   Ye function saare game sound effects ke liye use hota hai.
========================================================= */

function playSound(
    frequency = 600,
    duration = 0.10,
    type = "sine",
    volume = 0.05
) {

    /*
        Agar Sound OFF hai
        to koi sound nahi chalega.
    */

    if (!soundEnabled) {
        return;
    }


    const audio =
        getAudioContext();


    if (!audio) {
        return;
    }


    const oscillator =
        audio.createOscillator();


    const gain =
        audio.createGain();


    /* Sound type */
    oscillator.type = type;


    /* Sound frequency */
    oscillator.frequency.setValueAtTime(
        frequency,
        audio.currentTime
    );


    /* Starting volume */
    gain.gain.setValueAtTime(
        volume,
        audio.currentTime
    );


    /*
        Sound ko smoothly fade out karo.
        Isse click/pop type noise nahi aayega.
    */

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + duration
    );


    /* Connect sound */
    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );


    /* Start */
    oscillator.start();


    /* Stop */
    oscillator.stop(
        audio.currentTime + duration
    );
}


/* =========================================================
   FOOD SOUND
   Snake food khane par chalega.
========================================================= */

function playFoodSound() {

    playSound(
        620,
        0.08,
        "square",
        0.06
    );


    setTimeout(() => {

        playSound(
            820,
            0.09,
            "square",
            0.05
        );

    }, 55);
}


/* =========================================================
   BONUS SOUND
   Bonus milne par chalega.
========================================================= */

function playBonusSound() {

    playSound(
        520,
        0.10,
        "triangle",
        0.07
    );


    setTimeout(() => {

        playSound(
            720,
            0.10,
            "triangle",
            0.07
        );

    }, 80);


    setTimeout(() => {

        playSound(
            980,
            0.16,
            "triangle",
            0.07
        );

    }, 160);
}


/* =========================================================
   LEVEL COMPLETE SOUND
   Level complete hone par chalega.
========================================================= */

function playLevelCompleteSound() {

    playSound(
        523,
        0.12,
        "triangle",
        0.07
    );


    setTimeout(() => {

        playSound(
            659,
            0.12,
            "triangle",
            0.07
        );

    }, 120);


    setTimeout(() => {

        playSound(
            784,
            0.18,
            "triangle",
            0.08
        );

    }, 240);
}


/* =========================================================
   GAME OVER SOUND
   Game Over hone par chalega.
========================================================= */

function playGameOverSound() {

    playSound(
        300,
        0.16,
        "sawtooth",
        0.06
    );


    setTimeout(() => {

        playSound(
            220,
            0.22,
            "sawtooth",
            0.06
        );

    }, 160);
}


/* =========================================================
   SOUND BUTTON TEXT
   Sound ON  = 🔊 Sound ON
   Sound OFF = 🔇 Sound OFF
========================================================= */

function updateSoundButton() {

    if (!soundBtn) {
        return;
    }


    if (soundEnabled) {

        soundBtn.textContent =
            "🔊 Sound ON";

    } else {

        soundBtn.textContent =
            "🔇 Sound OFF";
    }
}


/* =========================================================
   SOUND BUTTON
   YE EK BUTTON MUSIC + GAME SOUNDS DONO CONTROL KAREGA.
========================================================= */

function toggleSound() {

    /*
        Sound ki state change karo.
    */

    soundEnabled =
        !soundEnabled;


    /*
        Music ko bhi same state do.
    */

    musicEnabled =
        soundEnabled;


    /*
        Sound setting save karo.
    */

    localStorage.setItem(
        "malikSnakeSound",
        soundEnabled
            ? "on"
            : "off"
    );


    /*
        Music setting bhi save karo.
    */

    localStorage.setItem(
        "malikSnakeMusic",
        musicEnabled
            ? "on"
            : "off"
    );


    /* =====================================================
       AGAR SOUND ON HAI
       TO MUSIC START KARO.
    ===================================================== */

    if (soundEnabled) {

        startBackgroundMusic();

    } else {

        /*
            Agar Sound OFF hai
            to music bhi stop.
        */

        stopBackgroundMusic();
    }


    /*
        Button ka text update karo.
    */

    updateSoundButton();


    /*
        Sound ON karte waqt
        chhota sa confirmation sound.
    */

    if (soundEnabled) {

        playSound(
            700,
            0.10,
            "sine",
            0.05
        );
    }
}


/* =========================================================
   SOUND BUTTON EVENT
========================================================= */

if (soundBtn) {

    soundBtn.addEventListener(
        "click",
        toggleSound
    );
}


/* =========================================================
   INITIAL SOUND BUTTON STATE
   Page load hote hi correct text show hoga.
========================================================= */

updateSoundButton();




/* =========================
   GAME LOOP
========================= */

let lastTime = 0;
let accumulator = 0;
let animationId = null;


/* =========================
   BONUS
========================= */

let bonusEndTime = 0;
let bonusInterval = null;
let bonusMessageTimer = null;


/* =========================
   THEMES
========================= */

const themes = [

    {
        name: "Emerald Forest",
        bg: "#081c13",
        grid: "#123a27",
        snake: "#22c55e",
        head: "#b7ffca",
        food: "#ff3157",
        sideWall: "#047857",
        middleWall: "#34d399"
    },

    {
        name: "Ocean Storm",
        bg: "#061827",
        grid: "#0d3550",
        snake: "#06b6d4",
        head: "#b8f5ff",
        food: "#ff4f7b",
        sideWall: "#075985",
        middleWall: "#22d3ee"
    },

    {
        name: "Purple Galaxy",
        bg: "#180b29",
        grid: "#34204d",
        snake: "#a855f7",
        head: "#eed7ff",
        food: "#fb4775",
        sideWall: "#6b21a8",
        middleWall: "#d946ef"
    },

    {
        name: "Crimson Arena",
        bg: "#27080d",
        grid: "#50151c",
        snake: "#f43f5e",
        head: "#ffd0d8",
        food: "#facc15",
        sideWall: "#991b1b",
        middleWall: "#fb7185"
    },

    {
        name: "Golden Fire",
        bg: "#241703",
        grid: "#493208",
        snake: "#f59e0b",
        head: "#fff0a8",
        food: "#22d3ee",
        sideWall: "#b45309",
        middleWall: "#fbbf24"
    }

];


/* =========================
   CANVAS RESIZE
========================= */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const size =
        Math.floor(
            Math.min(
                rect.width,
                rect.height
            )
        );

    if (!size) {
        return;
    }

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        Math.floor(size * dpr);

    canvas.height =
        Math.floor(size * dpr);

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    cellSize =
        size / grid;

    draw();
}


/* =========================
   RANDOM CELL
========================= */

function randomCell() {

    return {
        x: Math.floor(
            Math.random() * grid
        ),

        y: Math.floor(
            Math.random() * grid
        )
    };
}


/* =========================
   SAME CELL
========================= */

function sameCell(a, b) {

    return Boolean(
        a &&
        b &&
        a.x === b.x &&
        a.y === b.y
    );
}


/* =========================
   CELL BLOCKED
========================= */

function cellBlocked(cell) {

    if (
        walls.some(wall =>
            sameCell(wall, cell)
        )
    ) {
        return true;
    }

    if (
        snake.some(part =>
            sameCell(part, cell)
        )
    ) {
        return true;
    }

    if (
        sameCell(food, cell)
    ) {
        return true;
    }

    if (
        sameCell(bonusFood, cell)
    ) {
        return true;
    }

    return false;
}


/* =========================
   FREE CELL
========================= */

function getFreeCell() {

    for (
        let i = 0;
        i < 1500;
        i++
    ) {

        const cell =
            randomCell();

        if (
            !cellBlocked(cell)
        ) {
            return cell;
        }
    }


    for (
        let y = 0;
        y < grid;
        y++
    ) {

        for (
            let x = 0;
            x < grid;
            x++
        ) {

            const cell = {
                x,
                y
            };

            if (
                !cellBlocked(cell)
            ) {
                return cell;
            }
        }
    }


    return {
        x: 0,
        y: 0
    };
}


/* =========================
   CREATE SNAKE
========================= */

function createSnake() {

    snake = [

        {
            x: 12,
            y: 12
        },

        {
            x: 11,
            y: 12
        },

        {
            x: 10,
            y: 12
        },

        {
            x: 9,
            y: 12
        }

    ];


    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    directionQueue = [];
}


/* =========================
   WALL HELPERS
========================= */

function addHorizontalWall(
    y,
    start,
    end,
    gaps,
    type
) {

    for (
        let x = start;
        x <= end;
        x++
    ) {

        if (
            !gaps.includes(x)
        ) {

            walls.push({
                x,
                y,
                type
            });
        }
    }
}


function addVerticalWall(
    x,
    start,
    end,
    gaps,
    type
) {

    for (
        let y = start;
        y <= end;
        y++
    ) {

        if (
            !gaps.includes(y)
        ) {

            walls.push({
                x,
                y,
                type
            });
        }
    }
}


/* =========================
   CREATE WALLS
========================= */

function createWalls() {

    walls = [];


    if (
        gameMode !== "wall"
    ) {
        return;
    }


    if (
        level === 1
    ) {
        return;
    }


    if (
        level === 2
    ) {

        addHorizontalWall(
            6,
            3,
            21,
            [12],
            "middle"
        );

        addHorizontalWall(
            18,
            3,
            21,
            [12],
            "middle"
        );

        addVerticalWall(
            1,
            3,
            21,
            [12],
            "side"
        );

        addVerticalWall(
            23,
            3,
            21,
            [12],
            "side"
        );
    }


    if (
        level === 3
    ) {

        addHorizontalWall(
            5,
            2,
            22,
            [6, 18],
            "middle"
        );

        addHorizontalWall(
            19,
            2,
            22,
            [6, 18],
            "middle"
        );

        addVerticalWall(
            1,
            2,
            22,
            [8, 16],
            "side"
        );

        addVerticalWall(
            23,
            2,
            22,
            [8, 16],
            "side"
        );

        addVerticalWall(
            12,
            8,
            16,
            [12],
            "middle"
        );
    }


    if (
        level === 4
    ) {

        addHorizontalWall(
            5,
            2,
            22,
            [5, 12, 19],
            "middle"
        );

        addHorizontalWall(
            19,
            2,
            22,
            [5, 12, 19],
            "middle"
        );

        addVerticalWall(
            5,
            6,
            18,
            [9, 15],
            "middle"
        );

        addVerticalWall(
            19,
            6,
            18,
            [9, 15],
            "middle"
        );

        addVerticalWall(
            1,
            2,
            22,
            [6, 12, 18],
            "side"
        );

        addVerticalWall(
            23,
            2,
            22,
            [6, 12, 18],
            "side"
        );
    }


    if (
        level === 5
    ) {

        addHorizontalWall(
            4,
            2,
            22,
            [5, 12, 19],
            "middle"
        );

        addHorizontalWall(
            20,
            2,
            22,
            [5, 12, 19],
            "middle"
        );

        addVerticalWall(
            5,
            5,
            19,
            [8, 12, 16],
            "middle"
        );

        addVerticalWall(
            19,
            5,
            19,
            [8, 12, 16],
            "middle"
        );

        addHorizontalWall(
            9,
            8,
            16,
            [12],
            "middle"
        );

        addHorizontalWall(
            15,
            8,
            16,
            [12],
            "middle"
        );

        addVerticalWall(
            1,
            2,
            22,
            [5, 12, 19],
            "side"
        );

        addVerticalWall(
            23,
            2,
            22,
            [5, 12, 19],
            "side"
        );
    }
}


/* =========================
   SIDE GATES
========================= */

function getSideGateRows() {

    if (
        level === 2
    ) {
        return [12];
    }

    if (
        level === 3
    ) {
        return [8, 16];
    }

    if (
        level === 4
    ) {
        return [6, 12, 18];
    }

    if (
        level === 5
    ) {
        return [5, 12, 19];
    }

    return [];
}


function isSideGate(y) {

    return getSideGateRows()
        .includes(y);
}


/* =========================
   FOOD
========================= */

function createFood() {

    food =
        getFreeCell();
}


/* =========================
   BONUS FOOD
========================= */

function createBonusFood() {

    if (
        bonusFood ||
        levelCompleted ||
        !gameRunning
    ) {
        return;
    }


    let position = {
        x: 12,
        y: 12
    };


    if (
        cellBlocked(position)
    ) {

        position =
            getFreeCell();
    }


    bonusFood =
        position;


    bonusEndTime =
        Date.now() + 7000;


    clearInterval(
        bonusInterval
    );


    bonusTimerEl.style.display =
        "block";

    bonusTimerEl.textContent =
        "7";

    bonusStatusEl.textContent =
        "2X BONUS";


    bonusInterval =
        setInterval(() => {

            if (
                !bonusFood ||
                !gameRunning ||
                levelCompleted
            ) {

                clearInterval(
                    bonusInterval
                );

                bonusInterval =
                    null;

                return;
            }


            const remaining =
                Math.max(
                    0,
                    bonusEndTime -
                        Date.now()
                );


            bonusTimerEl.textContent =
                Math.ceil(
                    remaining / 1000
                );


            if (
                remaining <= 0
            ) {

                clearInterval(
                    bonusInterval
                );

                bonusInterval =
                    null;


                bonusFood =
                    null;


                bonusTimerEl.style.display =
                    "none";


                bonusStatusEl.textContent =
                    "Bonus Ready";


                draw();
            }

        }, 100);


    draw();
}


/* =========================
   CLEAR BONUS
========================= */

function clearBonus() {

    clearInterval(
        bonusInterval
    );

    bonusInterval = null;


    clearTimeout(
        bonusMessageTimer
    );

    bonusMessageTimer = null;


    bonusFood = null;
    bonusEndTime = 0;


    bonusTimerEl.style.display =
        "none";


    bonusStatusEl.textContent =
        "Bonus Ready";
}


/* =========================
   PREPARE LEVEL
========================= */

function prepareLevel() {

    createSnake();

    createWalls();

    createFood();


    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    directionQueue = [];
}


/* =========================
   RESET GAME
========================= */

function resetGame() {

    stopGameLoop();

    clearBonus();


    score = 0;
    levelScore = 0;
    level = 1;


    gameRunning = false;
    paused = false;
    levelCompleted = false;


    prepareLevel();


    pauseBtn.textContent =
        "Pause";


    updateUI();

    draw();


    showMessage(
        "Snake Game",
        gameMode === "wall"
            ? "Start Level 1"
            : "No Walls Mode",
        "Start Game"
    );
}


/* =========================
   RESTART
========================= */

function restartFromGameOver() {

    startBackgroundMusic();

    stopGameLoop();

    clearBonus();


    score = 0;
    levelScore = 0;
    level = 1;


    gameRunning = false;
    paused = false;
    levelCompleted = false;


    prepareLevel();


    pauseBtn.textContent =
        "Pause";


    updateUI();

    draw();


    startCurrentLevel();
}


/* =========================
   START GAME
========================= */

function startGame() {
    startBackgroundMusic();

    if (
        levelCompleted
    ) {

        if (
            gameMode === "wall" &&
            level < 5
        ) {

            nextLevel();

        } else {

            restartFromGameOver();
        }

        return;
    }


    if (
        gameRunning &&
        !paused
    ) {
        return;
    }


    if (
        !gameRunning
    ) {

        startCurrentLevel();

        return;
    }


    paused = false;


    messageBox.style.display =
        "none";


    pauseBtn.textContent =
        "Pause";


    lastTime =
        performance.now();

    accumulator = 0;
}


/* =========================
   START CURRENT LEVEL
========================= */

function startCurrentLevel() {

    stopGameLoop();


    gameRunning = true;
    paused = false;
    levelCompleted = false;


    messageBox.style.display =
        "none";


    pauseBtn.textContent =
        "Pause";


    lastTime =
        performance.now();

    accumulator = 0;


    startGameLoop();
}


/* =========================
   PAUSE
========================= */

function pauseGame() {

    if (
        !gameRunning ||
        levelCompleted
    ) {
        return;
    }


    paused =
        !paused;


    if (
        paused
    ) {

        bgMusic.pause();

        messageTitle.textContent =
            "Paused";

        messageText.textContent =
            "Press Resume to continue";

        startBtn.textContent =
            "Resume";

        messageBox.style.display =
            "flex";

        pauseBtn.textContent =
            "Resume";


    } else {

        startBackgroundMusic();

        messageBox.style.display =
            "none";

        pauseBtn.textContent =
            "Pause";


        lastTime =
            performance.now();

        accumulator = 0;
    }
}


/* =========================
   COMPLETE LEVEL
========================= */

function completeLevel() {

    gameRunning = false;
    paused = false;
    levelCompleted = true;

    playLevelCompleteSound();

    stopGameLoop();

    clearBonus();


    saveHighScore();


    updateUI();


    if (
        level < 5
    ) {

        showMessage(
            "Level " +
                level +
                " Complete!",

            "Score " +
                score +
                " • Level " +
                (level + 1) +
                " is ready",

            "Next Level"
        );

    } else {

        showMessage(
            "You Win!",

            "All 5 levels completed • Score " +
                score,

            "Play Again"
        );
    }
}


/* =========================
   NEXT LEVEL
========================= */

function nextLevel() {

    if (
        level >= 5
    ) {

        restartFromGameOver();

        return;
    }


    stopGameLoop();

    clearBonus();


    level++;

    levelScore = 0;


    gameRunning = false;
    paused = false;
    levelCompleted = false;


    prepareLevel();


    pauseBtn.textContent =
        "Pause";


    updateUI();

    draw();


    startCurrentLevel();
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    gameRunning = false;
    paused = false;
    levelCompleted = false;

    stopBackgroundMusic();
    
    playGameOverSound();


    stopGameLoop();

    clearBonus();


    saveHighScore();


    updateUI();


    showMessage(
        "Game Over",

        "Score: " +
            score +
            " • Level: " +
            level,

        "Restart Game"
    );
}


/* =========================
   HIGH SCORE
========================= */

function saveHighScore() {

    if (
        score > highScore
    ) {

        highScore = score;

        localStorage.setItem(
            "malikSnakeHighScore",
            highScore
        );
    }
}


/* =========================
   MOVE SNAKE
========================= */

function moveSnake() {

    /*
        Take only the next queued
        direction. This makes quick
        controls responsive while
        preventing instant 180° turns.
    */

    if (
        directionQueue.length > 0
    ) {

        const queuedDirection =
            directionQueue.shift();


        if (
            !(
                queuedDirection.x ===
                    -direction.x &&
                queuedDirection.y ===
                    -direction.y
            )
        ) {

            direction =
                queuedDirection;
        }

    } else {

        direction =
            nextDirection;
    }


    nextDirection =
        direction;


    let head = {

        x:
            snake[0].x +
            direction.x,

        y:
            snake[0].y +
            direction.y
    };


    /* =====================
       FREE MODE WRAPPING
    ===================== */

    if (
        gameMode === "free"
    ) {

        if (
            head.x < 0
        ) {
            head.x = grid - 1;
        }

        if (
            head.x >= grid
        ) {
            head.x = 0;
        }

        if (
            head.y < 0
        ) {
            head.y = grid - 1;
        }

        if (
            head.y >= grid
        ) {
            head.y = 0;
        }

    } else {

        /* =================
           WALL MODE
        ================= */

        if (
            head.x < 0
        ) {

            if (
                direction.x === -1 &&
                isSideGate(head.y)
            ) {

                head.x =
                    grid - 1;

            } else {

                gameOver();
                return;
            }
        }


        if (
            head.x >= grid
        ) {

            if (
                direction.x === 1 &&
                isSideGate(head.y)
            ) {

                head.x = 0;

            } else {

                gameOver();
                return;
            }
        }


        if (
            head.y < 0 ||
            head.y >= grid
        ) {

            gameOver();
            return;
        }
    }


    /* =====================
       WALL COLLISION
    ===================== */

    if (
        walls.some(wall =>
            sameCell(wall, head)
        )
    ) {

        gameOver();

        return;
    }


    /* =====================
       FOOD CHECK
    ===================== */

    const eatingFood =
        sameCell(head, food);

    const eatingBonus =
        sameCell(
            head,
            bonusFood
        );


    /*
        If snake eats food,
        tail stays for one extra
        frame because the snake grows.
    */

    const bodyToCheck =
        eatingFood ||
        eatingBonus
            ? snake
            : snake.slice(0, -1);


    /* =====================
       SELF COLLISION
    ===================== */

    if (
        bodyToCheck.some(part =>
            sameCell(part, head)
        )
    ) {

        gameOver();

        return;
    }


    /* =====================
       ADD HEAD
    ===================== */

    snake.unshift(head);


    let ate = false;


    /* =====================
       NORMAL FOOD
    ===================== */

if (
    eatingFood
) {

    score += 10;

    levelScore += 10;

    ate = true;

    playFoodSound();

    createFood();
}


    /* =====================
       BONUS FOOD
    ===================== */

    if (
        eatingBonus
    ) {

        score += 20;

        levelScore += 20;

        ate = true;

        playBonusSound();


        clearBonus();


        bonusStatusEl.textContent =
            "Bonus Collected";


        bonusMessageTimer =
            setTimeout(() => {

                if (
                    !levelCompleted &&
                    !bonusFood
                ) {

                    bonusStatusEl.textContent =
                        "Bonus Ready";
                }

            }, 900);
    }


    /* =====================
       NORMAL MOVEMENT
    ===================== */

    if (
        !ate
    ) {

        snake.pop();
    }


    saveHighScore();


    /* =====================
       LEVEL COMPLETE
    ===================== */

    if (
        gameMode === "wall" &&
        levelScore >= levelTarget
    ) {

        completeLevel();

        return;
    }


    /* =====================
       BONUS SPAWN
    ===================== */

    if (
        levelScore > 0 &&
        levelScore % 50 === 0 &&
        !bonusFood
    ) {

        createBonusFood();
    }


    updateUI();
}


/* =========================
   GET SPEED
========================= */

function getSpeed() {

    const settings =
        difficultySettings[
            difficulty
        ];


    if (
        gameMode === "free"
    ) {

        return settings.freeSpeed;
    }


    return settings.speeds[
        level - 1
    ];
}


/* =========================
   GAME LOOP
========================= */

function startGameLoop() {

    stopGameLoop();


    lastTime =
        performance.now();

    accumulator = 0;


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


function stopGameLoop() {

    if (
        animationId !== null
    ) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }
}


/* =========================
   SMOOTH GAME LOOP
========================= */

function gameLoop(timestamp) {

    if (
        !gameRunning
    ) {

        animationId = null;

        return;
    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );


    if (
        paused
    ) {

        lastTime =
            timestamp;

        return;
    }


    let delta =
        timestamp - lastTime;


    /*
        Prevent huge jumps when
        browser tab becomes inactive.
    */

    if (
        delta > 250
    ) {

        delta = 250;
    }


    lastTime =
        timestamp;


    accumulator += delta;


    const speed =
        getSpeed();


    let steps = 0;


    /*
        Maximum 3 movements per
        animation frame prevents
        browser lag from causing
        extreme jumps.
    */

    while (
        accumulator >= speed &&
        gameRunning &&
        !paused &&
        steps < 3
    ) {

        accumulator -= speed;

        moveSnake();

        steps++;
    }


    /*
        If too much time accumulated,
        discard the old time instead
        of making the snake teleport.
    */

    if (
        accumulator >
        speed * 2
    ) {

        accumulator = 0;
    }


    draw();
}


/* =========================
   DRAW BACKGROUND
========================= */

function drawBackground(theme) {

    const size =
        canvas.clientWidth;


    ctx.fillStyle =
        theme.bg;


    ctx.fillRect(
        0,
        0,
        size,
        size
    );


    ctx.strokeStyle =
        theme.grid;


    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= grid;
        i++
    ) {

        const p =
            i * cellSize;


        ctx.beginPath();

        ctx.moveTo(
            p,
            0
        );

        ctx.lineTo(
            p,
            size
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            0,
            p
        );

        ctx.lineTo(
            size,
            p
        );

        ctx.stroke();
    }
}


/* =========================
   ROUNDED RECT
========================= */

function roundedRect(
    x,
    y,
    width,
    height,
    radius
) {

    const r =
        Math.min(
            radius,
            width / 2,
            height / 2
        );


    ctx.beginPath();


    ctx.moveTo(
        x + r,
        y
    );


    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r
    );


    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r
    );


    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        r
    );


    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        r
    );


    ctx.closePath();
}


/* =========================
   DRAW WALLS
========================= */

function drawWalls(theme) {

    walls.forEach(wall => {

        const x =
            wall.x * cellSize;

        const y =
            wall.y * cellSize;


        ctx.fillStyle =
            wall.type === "side"
                ? theme.sideWall
                : theme.middleWall;


        roundedRect(
            x + 1,
            y + 1,
            cellSize - 2,
            cellSize - 2,
            Math.max(
                3,
                cellSize * 0.2
            )
        );


        ctx.fill();


        ctx.globalAlpha =
            0.18;


        ctx.fillStyle =
            "#ffffff";


        roundedRect(
            x + 3,
            y + 3,
            cellSize - 6,
            Math.max(
                2,
                cellSize * 0.18
            ),
            2
        );


        ctx.fill();


        ctx.globalAlpha =
            1;
    });


    if (
        gameMode === "wall" &&
        level > 1
    ) {

        const rows =
            getSideGateRows();


        ctx.globalAlpha =
            0.28;


        ctx.fillStyle =
            theme.head;


        rows.forEach(y => {

            ctx.fillRect(
                0,
                y * cellSize,
                cellSize * 1.2,
                cellSize
            );


            ctx.fillRect(
                canvas.clientWidth -
                    cellSize * 1.2,
                y * cellSize,
                cellSize * 1.2,
                cellSize
            );
        });


        ctx.globalAlpha =
            1;
    }
}


/* =========================
   DRAW FOOD
========================= */

function drawFood(theme) {

    if (
        !food
    ) {
        return;
    }


    const x =
        food.x * cellSize +
        cellSize / 2;


    const y =
        food.y * cellSize +
        cellSize / 2;


    const radius =
        cellSize * 0.34;


    ctx.shadowBlur = 10;

    ctx.shadowColor =
        theme.food;


    ctx.fillStyle =
        theme.food;


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    ctx.fillStyle =
        "rgba(255,255,255,0.7)";


    ctx.beginPath();


    ctx.arc(
        x - radius * 0.3,
        y - radius * 0.3,
        radius * 0.22,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


/* =========================
   DRAW BONUS FOOD
========================= */

function drawBonusFood() {

    if (
        !bonusFood
    ) {
        return;
    }


    const x =
        bonusFood.x * cellSize +
        cellSize / 2;


    const y =
        bonusFood.y * cellSize +
        cellSize / 2;


    const pulse =
        1 +
        Math.sin(
            Date.now() / 90
        ) *
            0.13;


    const radius =
        cellSize *
        0.43 *
        pulse;


    ctx.shadowBlur = 18;

    ctx.shadowColor =
        "#ffd166";


    ctx.fillStyle =
        "#ffd166";


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth =
        Math.max(
            2,
            cellSize * 0.08
        );


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        radius + 2,
        0,
        Math.PI * 2
    );


    ctx.stroke();


    ctx.fillStyle =
        "#7c4600";


    ctx.font =
        "bold " +
        Math.max(
            9,
            cellSize * 0.35
        ) +
        "px Arial";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        "2X",
        x,
        y
    );
}


/* =========================
   DRAW SNAKE
========================= */

function drawSnake(theme) {

    snake.forEach(
        (part, index) => {

            const x =
                part.x * cellSize;

            const y =
                part.y * cellSize;


            ctx.fillStyle =
                index === 0
                    ? theme.head
                    : theme.snake;


            if (
                index === 0
            ) {

                ctx.shadowBlur =
                    10;

                ctx.shadowColor =
                    theme.snake;
            }


            roundedRect(
                x + 1.5,
                y + 1.5,
                cellSize - 3,
                cellSize - 3,
                Math.max(
                    4,
                    cellSize * 0.22
                )
            );


            ctx.fill();


            ctx.shadowBlur = 0;


            if (
                index === 0
            ) {

                drawEyes(
                    x,
                    y
                );
            }
        }
    );
}


/* =========================
   DRAW EYES
========================= */

function drawEyes(
    x,
    y
) {

    ctx.fillStyle =
        "#101010";


    const eyeSize =
        Math.max(
            2,
            cellSize * 0.1
        );


    let eye1;
    let eye2;


    if (
        direction.x === 1
    ) {

        eye1 = {
            x:
                x +
                cellSize *
                    0.68,

            y:
                y +
                cellSize *
                    0.3
        };


        eye2 = {
            x:
                x +
                cellSize *
                    0.68,

            y:
                y +
                cellSize *
                    0.7
        };

    } else if (
        direction.x === -1
    ) {

        eye1 = {
            x:
                x +
                cellSize *
                    0.32,

            y:
                y +
                cellSize *
                    0.3
        };


        eye2 = {
            x:
                x +
                cellSize *
                    0.32,

            y:
                y +
                cellSize *
                    0.7
        };

    } else if (
        direction.y === -1
    ) {

        eye1 = {
            x:
                x +
                cellSize *
                    0.3,

            y:
                y +
                cellSize *
                    0.32
        };


        eye2 = {
            x:
                x +
                cellSize *
                    0.7,

            y:
                y +
                cellSize *
                    0.32
        };

    } else {

        eye1 = {
            x:
                x +
                cellSize *
                    0.3,

            y:
                y +
                cellSize *
                    0.68
        };


        eye2 = {
            x:
                x +
                cellSize *
                    0.7,

            y:
                y +
                cellSize *
                    0.68
        };
    }


    ctx.beginPath();


    ctx.arc(
        eye1.x,
        eye1.y,
        eyeSize,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(
        eye2.x,
        eye2.y,
        eyeSize,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


/* =========================
   DRAW
========================= */

function draw() {

    if (
        !canvas.clientWidth
    ) {
        return;
    }


    const theme =
        themes[level - 1];


    drawBackground(theme);

    drawWalls(theme);

    drawFood(theme);

    drawBonusFood();

    drawSnake(theme);
}


/* =========================
   UPDATE UI
========================= */

function updateUI() {

    scoreEl.textContent =
        score;


    levelEl.textContent =
        level;


    highScoreEl.textContent =
        highScore;


    levelNameEl.textContent =
        "Level " +
        level +
        " • " +
        themes[level - 1].name;


    modeTextEl.textContent =
        gameMode === "wall"
            ? "Wall Levels • " +
              difficultySettings[
                  difficulty
              ].name

            : "No Walls • " +
              difficultySettings[
                  difficulty
              ].name;
}


/* =========================
   SHOW MESSAGE
========================= */

function showMessage(
    title,
    text,
    buttonText
) {

    messageTitle.textContent =
        title;


    messageText.textContent =
        text;


    startBtn.textContent =
        buttonText;


    messageBox.style.display =
        "flex";
}


/* =========================
   SET DIRECTION
========================= */

function setDirection(dir) {

    const dirs = {

        up: {
            x: 0,
            y: -1
        },

        down: {
            x: 0,
            y: 1
        },

        left: {
            x: -1,
            y: 0
        },

        right: {
            x: 1,
            y: 0
        }

    };


    const newDir =
        dirs[dir];


    if (
        !newDir
    ) {
        return;
    }


    /*
        Compare against the last
        requested direction so quick
        inputs remain responsive.
    */

    const lastDir =
        directionQueue.length
            ? directionQueue[
                  directionQueue.length - 1
              ]
            : nextDirection;


    /* Prevent 180° turn */

    if (
        newDir.x === -lastDir.x &&
        newDir.y === -lastDir.y
    ) {
        return;
    }


    /* Ignore duplicate input */

    if (
        newDir.x === lastDir.x &&
        newDir.y === lastDir.y
    ) {
        return;
    }


    /*
        Maximum 2 queued inputs.
        This keeps controls responsive
        without allowing accidental
        direction spam.
    */

    if (
        directionQueue.length < 2
    ) {

        directionQueue.push(
            newDir
        );
    }
}


/* =========================
   CHANGE MODE
========================= */

function changeMode(mode) {

    if (
        gameMode === mode
    ) {
        return;
    }


    gameMode =
        mode;


    wallModeBtn.classList.toggle(
        "active",
        mode === "wall"
    );


    freeModeBtn.classList.toggle(
        "active",
        mode === "free"
    );


    resetGame();
}


/* =========================
   CHANGE DIFFICULTY
========================= */

function changeDifficulty(
    newDifficulty
) {

    if (
        !difficultySettings[
            newDifficulty
        ]
    ) {
        return;
    }


    if (
        difficulty ===
        newDifficulty
    ) {
        return;
    }


    difficulty =
        newDifficulty;


    localStorage.setItem(
        "malikSnakeDifficulty",
        difficulty
    );


    updateDifficultyButtons();


    /*
        Reset the game so the new
        speed starts cleanly.
    */

    resetGame();
}


/* =========================
   DIFFICULTY BUTTON UI
========================= */

function updateDifficultyButtons() {

    easyBtn.classList.toggle(
        "active",
        difficulty === "easy"
    );


    mediumBtn.classList.toggle(
        "active",
        difficulty === "medium"
    );


    hardBtn.classList.toggle(
        "active",
        difficulty === "hard"
    );
}


/* =========================
   START BUTTON
========================= */

startBtn.addEventListener(
    "click",
    () => {

        if (
            levelCompleted
        ) {

            if (
                gameMode === "wall" &&
                level < 5
            ) {

                nextLevel();

            } else {

                restartFromGameOver();
            }

            return;
        }


        if (
            messageTitle.textContent ===
            "Game Over"
        ) {

            restartFromGameOver();

            return;
        }


        if (
            messageTitle.textContent ===
            "Paused"
        ) {

            startGame();

            return;
        }


        startGame();
    }
);


/* =========================
   PAUSE
========================= */

pauseBtn.addEventListener(
    "click",
    pauseGame
);

if (soundBtn) {

    soundBtn.addEventListener(
        "click",
        toggleSound
    );
}

/* =========================
   RESTART
========================= */

restartBtn.addEventListener(
    "click",
    restartFromGameOver
);


/* =========================
   MODE BUTTONS
========================= */

wallModeBtn.addEventListener(
    "click",
    () => {

        changeMode("wall");
    }
);


freeModeBtn.addEventListener(
    "click",
    () => {

        changeMode("free");
    }
);


/* =========================
   DIFFICULTY BUTTONS
========================= */

easyBtn.addEventListener(
    "click",
    () => {

        changeDifficulty(
            "easy"
        );
    }
);


mediumBtn.addEventListener(
    "click",
    () => {

        changeDifficulty(
            "medium"
        );
    }
);


hardBtn.addEventListener(
    "click",
    () => {

        changeDifficulty(
            "hard"
        );
    }
);


/* =========================
   MOBILE D-PAD CONTROLS
========================= */

document
    .querySelectorAll(".dpad-btn")
    .forEach(button => {

        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                const direction =
                    button.dataset.dir;

                if (direction) {
                    setDirection(direction);
                }
            }
        );

    });


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
    "keydown",
    event => {

        const keys = {

            ArrowUp: "up",
            w: "up",
            W: "up",

            ArrowDown: "down",
            s: "down",
            S: "down",

            ArrowLeft: "left",
            a: "left",
            A: "left",

            ArrowRight: "right",
            d: "right",
            D: "right"

        };


        if (
            keys[event.key]
        ) {

            event.preventDefault();


            setDirection(
                keys[event.key]
            );
        }


        if (
            event.key === " " &&
            gameRunning &&
            !levelCompleted
        ) {

            event.preventDefault();

            pauseGame();
        }
    }
);


/* =========================
   SWIPE CONTROLS
========================= */

let touchStartX = 0;
let touchStartY = 0;


canvas.style.touchAction =
    "none";


canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];


        touchStartX =
            touch.clientX;


        touchStartY =
            touch.clientY;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];


        const dx =
            touch.clientX -
            touchStartX;


        const dy =
            touch.clientY -
            touchStartY;


        const distance =
            Math.max(
                Math.abs(dx),
                Math.abs(dy)
            );


        if (
            distance < 18
        ) {
            return;
        }


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            setDirection(
                dx > 0
                    ? "right"
                    : "left"
            );

        } else {

            setDirection(
                dy > 0
                    ? "down"
                    : "up"
            );
        }

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchmove",
    event => {

        event.preventDefault();

    },
    {
        passive: false
    }
);


/* =========================
   WINDOW RESIZE
========================= */

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================
   INITIAL SETUP
========================= */

wallModeBtn.classList.add(
    "active"
);

/* =========================
   ENTER KEY CONTROL
========================= */

document.addEventListener("keydown", function (e) {

    if (e.key !== "Enter") {
        return;
    }

    e.preventDefault();


    /* GAME OVER */

    if (
        !gameRunning &&
        !paused &&
        !levelCompleted
    ) {
        restartFromGameOver();
        return;
    }


    /* PAUSED */

    if (paused) {
        pauseGame();
        return;
    }


    /* START GAME */

    if (!gameRunning) {
        startGame();
        return;
    }

});


updateDifficultyButtons();

updateUI();

resetGame();

resizeCanvas();

updateSoundButton();