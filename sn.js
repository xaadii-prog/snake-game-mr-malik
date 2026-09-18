const canvas=document.getElementById("gameCanvas");const ctx=canvas.getContext("2d");const scoreEl=document.getElementById("score");const levelEl=document.getElementById("level");const highScoreEl=document.getElementById("highScore");const gamesPlayedStatEl=document.getElementById("gamesPlayedStat");const gamesWonStatEl=document.getElementById("gamesWonStat");const gamesOverStatEl=document.getElementById("gamesOverStat");const foodCollectedStatEl=document.getElementById("foodCollectedStat");const highestLevelStatEl=document.getElementById("highestLevelStat");const bestComboStatEl=document.getElementById("bestComboStat");const comboEl=document.getElementById("combo");const bestComboEl=document.getElementById("bestCombo");const levelNameEl=document.getElementById("levelName");const bonusStatusEl=document.getElementById("bonusStatus");const modeTextEl=document.getElementById("modeText");const bonusTimerEl=document.getElementById("bonusTimer");const messageBox=document.getElementById("messageBox");const messageTitle=document.getElementById("messageTitle");const messageText=document.getElementById("messageText");const startBtn=document.getElementById("startBtn");const wallModeBtn=document.getElementById("wallModeBtn");const freeModeBtn=document.getElementById("freeModeBtn");const easyBtn=document.getElementById("easyBtn");const mediumBtn=document.getElementById("mediumBtn");const hardBtn=document.getElementById("hardBtn");const pauseBtn=document.getElementById("pauseBtn");const restartBtn=document.getElementById("restartBtn");const soundBtn=document.getElementById("soundBtn");const bgMusic=document.getElementById("bgMusic");const themeBtn=document.getElementById("themeBtn");const themePanel=document.getElementById("themePanel");const closeThemeBtn=document.getElementById("closeThemeBtn");const comboPopup=document.getElementById("comboPopup");const comboPopupText=document.getElementById("comboPopupText");const levelCompleteEffect=document.getElementById("levelCompleteEffect");const levelCompleteText=document.getElementById("levelCompleteText");const gameOverEffect=document.getElementById("gameOverEffect");const gameOverEffectText=document.getElementById("gameOverEffectText");const grid=25;const levelTarget=200;const difficultySettings={easy:{name:"Easy",speeds:[165,152,139,126,113],freeSpeed:145},medium:{name:"Medium",speeds:[125,112,99,86,74],freeSpeed:105},hard:{name:"Hard",speeds:[95,85,76,67,58],freeSpeed:82}};let cellSize=20;let snake=[];let particles=[];const maxParticles=80;let snakeSet=new Set();let food=null;let bonusFood=null;let walls=[];let wallSet=new Set();let direction={x:1,y:0};let nextDirection={x:1,y:0};let directionQueue=[];let score=0;let levelScore=0;let level=1;let combo=0;let bestCombo=Number(localStorage.getItem("malikSnakeBestCombo"))||0;let comboTimer=0;const comboDuration=5000;let foodsSinceBonus=0;const bonusFoodInterval=5;let highScore=Number(localStorage.getItem("malikSnakeHighScore"))||0;let gameRunning=!1;let paused=!1;let levelCompleted=!1;let gameMode="wall";let difficulty=localStorage.getItem("malikSnakeDifficulty")||"medium";let gamesPlayed=Number(localStorage.getItem("malikSnakeGamesPlayed"))||0;let gamesWon=Number(localStorage.getItem("malikSnakeGamesWon"))||0;let gamesOver=Number(localStorage.getItem("malikSnakeGamesOver"))||0;let foodCollected=Number(localStorage.getItem("malikSnakeFoodCollected"))||0;let highestLevel=Number(localStorage.getItem("malikSnakeHighestLevel"))||1;let statsGameStarted=!1;let soundEnabled=localStorage.getItem("malikSnakeSound")!=="off";let musicEnabled=soundEnabled;localStorage.setItem("malikSnakeMusic",musicEnabled?"on":"off");if(bgMusic){bgMusic.loop=!0;bgMusic.volume=0.25}
function startBackgroundMusic(){if(!bgMusic||!soundEnabled){return}
musicEnabled=!0;const playPromise=bgMusic.play();if(playPromise!==undefined){playPromise.catch(()=>{})}}
function stopBackgroundMusic(){if(!bgMusic){return}
musicEnabled=!1;bgMusic.pause()}
let audioContext=null;function getAudioContext(){if(!audioContext){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext){return null}
audioContext=new AudioContext()}
if(audioContext.state==="suspended"){audioContext.resume().catch(()=>{})}
return audioContext}
function playSound(frequency=600,duration=0.10,type="sine",volume=0.05){if(!soundEnabled){return}
const audio=getAudioContext();if(!audio){return}
const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,audio.currentTime);gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audio.currentTime+duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+duration)}
function playFoodSound(){if(!soundEnabled){return}
const audio=getAudioContext();if(!audio){return}
const now=audio.currentTime;const notes=[{frequency:660,start:0,duration:0.07,volume:0.045},{frequency:880,start:0.055,duration:0.09,volume:0.055}];notes.forEach(note=>{const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type="sine";oscillator.frequency.setValueAtTime(note.frequency,now+note.start);gain.gain.setValueAtTime(0.001,now+note.start);gain.gain.exponentialRampToValueAtTime(note.volume,now+note.start+0.012);gain.gain.exponentialRampToValueAtTime(0.001,now+note.start+note.duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(now+note.start);oscillator.stop(now+note.start+note.duration)})}
function playBonusSound(){if(!soundEnabled){return}
const audio=getAudioContext();if(!audio){return}
const now=audio.currentTime;const notes=[{frequency:523,start:0,duration:0.10,volume:0.055},{frequency:659,start:0.09,duration:0.11,volume:0.065},{frequency:1047,start:0.19,duration:0.20,volume:0.075}];notes.forEach(note=>{const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type="triangle";oscillator.frequency.setValueAtTime(note.frequency,now+note.start);gain.gain.setValueAtTime(0.001,now+note.start);gain.gain.exponentialRampToValueAtTime(note.volume,now+note.start+0.015);gain.gain.exponentialRampToValueAtTime(0.001,now+note.start+note.duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(now+note.start);oscillator.stop(now+note.start+note.duration)})}
function playComboSound(){if(!soundEnabled){return}
const audio=getAudioContext();if(!audio){return}
const now=audio.currentTime;const notes=[{frequency:660,start:0,duration:0.08,volume:0.045},{frequency:784,start:0.07,duration:0.09,volume:0.055},{frequency:988,start:0.14,duration:0.13,volume:0.065}];notes.forEach(note=>{const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type="sine";oscillator.frequency.setValueAtTime(note.frequency,now+note.start);gain.gain.setValueAtTime(0.001,now+note.start);gain.gain.exponentialRampToValueAtTime(note.volume,now+note.start+0.012);gain.gain.exponentialRampToValueAtTime(0.001,now+note.start+note.duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(now+note.start);oscillator.stop(now+note.start+note.duration)})}
function playLevelCompleteSound(){if(!soundEnabled){return}
const audio=getAudioContext();if(!audio){return}
const now=audio.currentTime;const notes=[{frequency:523,start:0,duration:0.12,volume:0.05},{frequency:659,start:0.11,duration:0.12,volume:0.055},{frequency:784,start:0.22,duration:0.14,volume:0.06},{frequency:1047,start:0.35,duration:0.28,volume:0.075}];notes.forEach(note=>{const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type="triangle";oscillator.frequency.setValueAtTime(note.frequency,now+note.start);gain.gain.setValueAtTime(0.001,now+note.start);gain.gain.exponentialRampToValueAtTime(note.volume,now+note.start+0.018);gain.gain.exponentialRampToValueAtTime(0.001,now+note.start+note.duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(now+note.start);oscillator.stop(now+note.start+note.duration)})}
function playGameOverSound(){if(!soundEnabled){return}
const audio=getAudioContext();if(!audio){return}
const now=audio.currentTime;const notes=[{frequency:392,start:0,duration:0.12,volume:0.055},{frequency:330,start:0.11,duration:0.14,volume:0.06},{frequency:262,start:0.24,duration:0.22,volume:0.065}];notes.forEach(note=>{const oscillator=audio.createOscillator();const gain=audio.createGain();oscillator.type="sine";oscillator.frequency.setValueAtTime(note.frequency,now+note.start);gain.gain.setValueAtTime(0.001,now+note.start);gain.gain.exponentialRampToValueAtTime(note.volume,now+note.start+0.015);gain.gain.exponentialRampToValueAtTime(0.001,now+note.start+note.duration);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(now+note.start);oscillator.stop(now+note.start+note.duration)})}
function updateSoundButton(){if(!soundBtn){return}
if(soundEnabled){soundBtn.textContent="🔊 Sound ON"}else{soundBtn.textContent="🔇 Sound OFF"}}
function toggleSound(){soundEnabled=!soundEnabled;musicEnabled=soundEnabled;localStorage.setItem("malikSnakeSound",soundEnabled?"on":"off");localStorage.setItem("malikSnakeMusic",musicEnabled?"on":"off");if(soundEnabled){startBackgroundMusic()}else{stopBackgroundMusic()}
updateSoundButton();if(soundEnabled){playSound(700,0.10,"sine",0.05)}}
updateSoundButton();let lastTime=0;let accumulator=0;let animationId=null;let lastBonusDisplaySecond=-1;let backgroundCache=null;let backgroundCacheTheme=null;let backgroundCacheSize=0;document.addEventListener("visibilitychange",function(){if(document.hidden){if(gameRunning&&!paused&&!levelCompleted){pauseGame()}}});let bonusEndTime=0;let bonusMessageTimer=null;const themes=[{id:"forest",name:"Emerald Forest",bg:"#06140d",grid:"#103522",snake:"#22c55e",head:"#c7f9d4",food:"#ff3157",sideWall:"#047857",middleWall:"#34d399"},{id:"ocean",name:"Ocean Storm",bg:"#04131f",grid:"#0b3048",snake:"#06b6d4",head:"#c5f7ff",food:"#ff477e",sideWall:"#075985",middleWall:"#22d3ee"},{id:"space",name:"Purple Galaxy",bg:"#10051d",grid:"#2b1742",snake:"#a855f7",head:"#f0dcff",food:"#fb4775",sideWall:"#6b21a8",middleWall:"#d946ef"},{id:"volcano",name:"Crimson Arena",bg:"#1c0509",grid:"#46121a",snake:"#f43f5e",head:"#ffd4dc",food:"#facc15",sideWall:"#991b1b",middleWall:"#fb7185"},{id:"frozen",name:"Frozen",bg:"#061522",grid:"#12384f",snake:"#67e8f9",head:"#e0faff",food:"#f472b6",sideWall:"#0369a1",middleWall:"#7dd3fc"}];const savedTheme=localStorage.getItem("malikSnakeTheme");let selectedThemeId=themes.some(theme=>theme.id===savedTheme)?savedTheme:"forest";function getCurrentTheme(){return(themes.find(theme=>theme.id===selectedThemeId)||themes[0])}
function resizeCanvas(){const rect=canvas.getBoundingClientRect();const size=Math.floor(Math.min(rect.width,rect.height));if(!size){return}
const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.floor(size*dpr);canvas.height=Math.floor(size*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);cellSize=size/grid;backgroundCache=null;backgroundCacheTheme=null;backgroundCacheSize=0;draw()}
function randomCell(){return{x:Math.floor(Math.random()*grid),y:Math.floor(Math.random()*grid)}}
function sameCell(a,b){return Boolean(a&&b&&a.x===b.x&&a.y===b.y)}
function cellBlocked(x,y){const key=x+","+y;if(wallSet.has(key)){return!0}
if(snakeSet.has(key)){return!0}
if(food&&food.x===x&&food.y===y){return!0}
if(bonusFood&&bonusFood.x===x&&bonusFood.y===y){return!0}
return!1}
function getFreeCell(){const maxAttempts=300;for(let attempt=0;attempt<maxAttempts;attempt++){const x=Math.floor(Math.random()*grid);const y=Math.floor(Math.random()*grid);if(!cellBlocked(x,y)){return{x,y}}}
for(let y=0;y<grid;y++){for(let x=0;x<grid;x++){if(!cellBlocked(x,y)){return{x,y}}}}
return null}
function createSnake(){snake=[{x:12,y:12},{x:11,y:12},{x:10,y:12},{x:9,y:12}];snakeSet=new Set(snake.map(part=>part.x+","+part.y));direction={x:1,y:0};nextDirection={x:1,y:0};directionQueue=[]}
function addHorizontalWall(y,start,end,gaps,type){for(let x=start;x<=end;x++){if(!gaps.includes(x)){walls.push({x,y,type})}}}
function addVerticalWall(x,start,end,gaps,type){for(let y=start;y<=end;y++){if(!gaps.includes(y)){walls.push({x,y,type})}}}
function createWalls(){walls=[];if(gameMode!=="wall"){return}
if(level===1){return}
if(level===2){addHorizontalWall(6,3,21,[12],"middle");addHorizontalWall(18,3,21,[12],"middle");addVerticalWall(1,3,21,[12],"side");addVerticalWall(23,3,21,[12],"side")}
if(level===3){addHorizontalWall(5,2,22,[6,18],"middle");addHorizontalWall(19,2,22,[6,18],"middle");addVerticalWall(1,2,22,[8,16],"side");addVerticalWall(23,2,22,[8,16],"side");addVerticalWall(12,8,16,[12],"middle")}
if(level===4){addHorizontalWall(5,2,22,[5,12,19],"middle");addHorizontalWall(19,2,22,[5,12,19],"middle");addVerticalWall(5,6,18,[9,15],"middle");addVerticalWall(19,6,18,[9,15],"middle");addVerticalWall(1,2,22,[6,12,18],"side");addVerticalWall(23,2,22,[6,12,18],"side")}
if(level===5){addHorizontalWall(4,2,22,[5,12,19],"middle");addHorizontalWall(20,2,22,[5,12,19],"middle");addVerticalWall(5,5,19,[8,12,16],"middle");addVerticalWall(19,5,19,[8,12,16],"middle");addHorizontalWall(9,8,16,[12],"middle");addHorizontalWall(15,8,16,[12],"middle");addVerticalWall(1,2,22,[5,12,19],"side");addVerticalWall(23,2,22,[5,12,19],"side")}}
function getSideGateRows(){if(level===2){return[12]}
if(level===3){return[8,16]}
if(level===4){return[6,12,18]}
if(level===5){return[5,12,19]}
return[]}
function isSideGate(y){return getSideGateRows().includes(y)}
function createFood(){let newFood=null;do{newFood=getFreeCell()}while(newFood&&bonusFood&&sameCell(newFood,bonusFood));food=newFood}
function createBonusFood(){if(bonusFood||levelCompleted||!gameRunning){return}
let position={x:12,y:12};if(cellBlocked(position.x,position.y)){position=getFreeCell()}
if(!position){return}
bonusFood=position;bonusEndTime=Date.now()+7000;bonusTimerEl.style.display="block";bonusTimerEl.textContent="7";bonusStatusEl.textContent="2X BONUS";lastBonusDisplaySecond=7;draw()}
function clearBonus(){clearTimeout(bonusMessageTimer);bonusMessageTimer=null;bonusFood=null;bonusEndTime=0;lastBonusDisplaySecond=-1;bonusTimerEl.style.display="none";bonusStatusEl.textContent="Bonus Ready"}
function prepareLevel(){createSnake();createWalls();wallSet=new Set(walls.map(wall=>wall.x+","+wall.y));createFood();direction={x:1,y:0};nextDirection={x:1,y:0};directionQueue=[]}
function resetGame(){stopGameLoop();clearBonus();score=0;levelScore=0;level=1;foodsSinceBonus=0;nextBonusScore=30;gameRunning=!1;paused=!1;levelCompleted=!1;prepareLevel();pauseBtn.textContent="Pause";updateUI();draw();showMessage("Snake Game",gameMode==="wall"?"Start Level 1":"No Walls Mode","Start Game")}
function restartFromGameOver(){stopGameLoop();clearBonus();score=0;levelScore=0;level=1;foodsSinceBonus=0;combo=0;comboTimer=0;gameRunning=!1;paused=!1;levelCompleted=!1;prepareLevel();pauseBtn.textContent="Pause";updateUI();draw();startGame()}
function startGame(){startBackgroundMusic();if(levelCompleted){if(gameMode==="wall"&&level<5){nextLevel()}else{restartFromGameOver()}
return}
if(gameRunning&&!paused){return}
if(!gameRunning){startCurrentLevel();return}
paused=!1;messageBox.style.display="none";pauseBtn.textContent="Pause";lastTime=performance.now();accumulator=0}
function startCurrentLevel(){stopGameLoop();gameRunning=!0;paused=!1;levelCompleted=!1;if(!statsGameStarted){gamesPlayed+=1;localStorage.setItem("malikSnakeGamesPlayed",gamesPlayed);statsGameStarted=!0}
messageBox.style.display="none";pauseBtn.textContent="Pause";lastTime=performance.now();accumulator=0;startGameLoop()}
function pauseGame(){if(!gameRunning||levelCompleted){return}
paused=!paused;if(paused){bgMusic.pause();messageTitle.textContent="Paused";messageText.textContent="Press Resume to continue";startBtn.textContent="Resume";messageBox.style.display="flex";pauseBtn.textContent="Resume"}else{startBackgroundMusic();messageBox.style.display="none";pauseBtn.textContent="Pause";lastTime=performance.now();accumulator=0}}
function completeLevel(){gameRunning=!1;paused=!1;levelCompleted=!0;playLevelCompleteSound();showLevelComplete();stopGameLoop();clearBonus();saveHighScore();updateUI();if(level<5){showMessage("Level "+level+" Complete!","Score "+score+" • Level "+(level+1)+" is ready","Next Level")}else{gamesWon+=1;localStorage.setItem("malikSnakeGamesWon",gamesWon);showMessage("You Win!","All 5 levels completed • Score "+score,"Play Again")}}
function nextLevel(){if(level>=5){restartFromGameOver();return}
stopGameLoop();clearBonus();level++;levelScore=0;highestLevel=Math.max(highestLevel,level);localStorage.setItem("malikSnakeHighestLevel",highestLevel);gameRunning=!1;paused=!1;levelCompleted=!1;prepareLevel();pauseBtn.textContent="Pause";updateUI();draw();startCurrentLevel()}
function gameOver(){gameRunning=!1;paused=!1;levelCompleted=!1;stopBackgroundMusic();playGameOverSound();showGameOverEffect();stopGameLoop();clearBonus();saveHighScore();gamesOver+=1;localStorage.setItem("malikSnakeGamesOver",gamesOver);updateUI();showMessage("Game Over","Score: "+score+" • Level: "+level,"Restart Game")}
function saveHighScore(){if(score>highScore){highScore=score;localStorage.setItem("malikSnakeHighScore",highScore)}}
function moveSnake(){if(directionQueue.length>0){const queuedDirection=directionQueue.shift();if(!(queuedDirection.x===-direction.x&&queuedDirection.y===-direction.y)){direction=queuedDirection}}else{direction=nextDirection}
nextDirection=direction;let head={x:snake[0].x+direction.x,y:snake[0].y+direction.y};if(gameMode==="free"){if(head.x<0){head.x=grid-1}
if(head.x>=grid){head.x=0}
if(head.y<0){head.y=grid-1}
if(head.y>=grid){head.y=0}}else{if(head.x<0){if(direction.x===-1&&isSideGate(head.y)){head.x=grid-1}else{gameOver();return}}
if(head.x>=grid){if(direction.x===1&&isSideGate(head.y)){head.x=0}else{gameOver();return}}
if(head.y<0||head.y>=grid){gameOver();return}}
if(wallSet.has(head.x+","+head.y)){gameOver();return}
const eatingFood=sameCell(head,food);const eatingBonus=sameCell(head,bonusFood);const headKey=head.x+","+head.y;const tail=snake[snake.length-1];const tailKey=tail.x+","+tail.y;const hitsSnake=snakeSet.has(headKey)&&(eatingFood||eatingBonus||headKey!==tailKey);if(hitsSnake){gameOver();return}
snake.unshift(head);let ate=!1;if(eatingFood){score+=10;levelScore+=10;foodsSinceBonus+=1;foodCollected+=1;localStorage.setItem("malikSnakeFoodCollected",foodCollected);combo+=1;comboTimer=comboDuration;if(combo>=2){showComboPopup(combo);playComboSound()}
if(combo>bestCombo){bestCombo=combo;localStorage.setItem("malikSnakeBestCombo",bestCombo)}
if(combo===2){score+=5;levelScore+=5}else if(combo===3){score+=10;levelScore+=10}else if(combo>=5){score+=20;levelScore+=20}
ate=!0;playFoodSound();createParticles(head.x*cellSize+cellSize/2,head.y*cellSize+cellSize/2,"#ffd166",18);createFood()}
if(eatingBonus){score+=20;levelScore+=20;ate=!0;playBonusSound();clearBonus();bonusStatusEl.textContent="Bonus Collected";bonusMessageTimer=setTimeout(()=>{if(!levelCompleted&&!bonusFood){bonusStatusEl.textContent="Bonus Ready"}},900)}
if(!ate){const removedTail=snake.pop();snakeSet.delete(removedTail.x+","+removedTail.y)}
snakeSet.add(headKey);if(gameMode==="wall"&&levelScore>=levelTarget){completeLevel();return}
if(foodsSinceBonus>=bonusFoodInterval&&!bonusFood){createBonusFood();if(bonusFood){foodsSinceBonus=0}}
if(ate){updateUI()}}
function getSpeed(){const settings=difficultySettings[difficulty];if(gameMode==="free"){return settings.freeSpeed}
return settings.speeds[level-1]}
function startGameLoop(){stopGameLoop();lastTime=performance.now();accumulator=0;animationId=requestAnimationFrame(gameLoop)}
function stopGameLoop(){if(animationId===null){return}
cancelAnimationFrame(animationId);animationId=null}
function gameLoop(timestamp){if(!gameRunning){animationId=null;return}
animationId=requestAnimationFrame(gameLoop);if(bonusFood&&!levelCompleted){const remaining=Math.max(0,bonusEndTime-Date.now());const currentSecond=Math.ceil(remaining/1000);if(currentSecond!==lastBonusDisplaySecond){lastBonusDisplaySecond=currentSecond;bonusTimerEl.textContent=currentSecond}
if(remaining<=0){bonusFood=null;bonusEndTime=0;lastBonusDisplaySecond=-1;bonusTimerEl.style.display="none";bonusStatusEl.textContent="Bonus Ready"}}
if(paused){lastTime=timestamp;return}
let delta=timestamp-lastTime;if(delta>250){delta=250}
lastTime=timestamp;accumulator+=delta;if(combo>0){comboTimer-=delta;if(comboTimer<=0){combo=0;comboTimer=0;updateUI()}}
const speed=getSpeed();let steps=0;while(accumulator>=speed&&gameRunning&&!paused&&steps<3){accumulator-=speed;moveSnake();steps++}
if(accumulator>speed*2){accumulator=0}
draw();updateParticles()}
function drawBackground(theme){const size=canvas.clientWidth;if(backgroundCache&&backgroundCacheTheme===theme.id&&backgroundCacheSize===size){ctx.drawImage(backgroundCache,0,0);return}
backgroundCache=document.createElement("canvas");backgroundCache.width=size;backgroundCache.height=size;const cacheCtx=backgroundCache.getContext("2d");cacheCtx.fillStyle=theme.bg;cacheCtx.fillRect(0,0,size,size);cacheCtx.strokeStyle=theme.grid;cacheCtx.lineWidth=1;for(let i=0;i<=grid;i++){const p=i*cellSize;cacheCtx.beginPath();cacheCtx.moveTo(p,0);cacheCtx.lineTo(p,size);cacheCtx.stroke();cacheCtx.beginPath();cacheCtx.moveTo(0,p);cacheCtx.lineTo(size,p);cacheCtx.stroke()}
backgroundCacheTheme=theme.id;backgroundCacheSize=size;ctx.drawImage(backgroundCache,0,0)}
function roundedRect(x,y,width,height,radius){const r=Math.min(radius,width/2,height/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+width,y,x+width,y+height,r);ctx.arcTo(x+width,y+height,x,y+height,r);ctx.arcTo(x,y+height,x,y,r);ctx.arcTo(x,y,x+width,y,r);ctx.closePath()}
function drawWalls(theme){walls.forEach(wall=>{const x=wall.x*cellSize;const y=wall.y*cellSize;ctx.fillStyle=wall.type==="side"?theme.sideWall:theme.middleWall;roundedRect(x+1,y+1,cellSize-2,cellSize-2,Math.max(3,cellSize*0.2));ctx.fill();ctx.save();ctx.globalAlpha=0.18;ctx.fillStyle="#ffffff";roundedRect(x+3,y+3,cellSize-6,Math.max(2,cellSize*0.18),2);ctx.fill();ctx.restore()});if(gameMode==="wall"&&level>1){const rows=getSideGateRows();ctx.save();ctx.globalAlpha=0.28;ctx.fillStyle=theme.head;rows.forEach(y=>{ctx.fillRect(0,y*cellSize,cellSize*1.2,cellSize);ctx.fillRect(canvas.clientWidth-cellSize*1.2,y*cellSize,cellSize*1.2,cellSize)});ctx.restore()}}
function drawFood(theme){if(!food){return}
const x=food.x*cellSize+cellSize/2;const y=food.y*cellSize+cellSize/2;const pulse=1+Math.sin(performance.now()/140)*0.08;const radius=cellSize*0.34*pulse;ctx.shadowBlur=10;ctx.shadowColor=theme.food;ctx.fillStyle=theme.food;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.shadowColor="transparent";ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(x-radius*0.3,y-radius*0.3,radius*0.22,0,Math.PI*2);ctx.fill()}
function drawBonusFood(){if(!bonusFood){return}
const x=bonusFood.x*cellSize+cellSize/2;const y=bonusFood.y*cellSize+cellSize/2;const time=performance.now();const pulse=1+Math.sin(time/90)*0.13;const radius=cellSize*0.43*pulse;const ringPulse=1+Math.sin(time/180)*0.18;const ringRadius=cellSize*0.55*ringPulse;ctx.save();ctx.shadowBlur=18;ctx.shadowColor="#ffd166";ctx.fillStyle="#ffd166";ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="rgba(255, 209, 102, 0.45)";ctx.lineWidth=Math.max(1.5,cellSize*0.06);ctx.beginPath();ctx.arc(x,y,ringRadius,0,Math.PI*2);ctx.stroke();ctx.strokeStyle="#ffffff";ctx.lineWidth=Math.max(2,cellSize*0.08);ctx.beginPath();ctx.arc(x,y,radius+2,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#7c4600";ctx.font="900 "+Math.max(9,cellSize*0.35)+"px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("2X",x,y);ctx.restore()}
function drawSnake(theme){snake.forEach((part,index)=>{const x=part.x*cellSize;const y=part.y*cellSize;const isHead=index===0;ctx.fillStyle=isHead?theme.head:theme.snake;if(isHead){ctx.shadowBlur=10;ctx.shadowColor=theme.snake}
roundedRect(x+1.5,y+1.5,cellSize-3,cellSize-3,Math.max(4,cellSize*0.22));ctx.fill();if(isHead){ctx.shadowBlur=0;ctx.shadowColor="transparent";drawEyes(x,y)}})}
function drawEyes(x,y){ctx.fillStyle="#101010";const eyeSize=Math.max(2,cellSize*0.1);let eye1;let eye2;if(direction.x===1){eye1={x:x+cellSize*0.68,y:y+cellSize*0.3};eye2={x:x+cellSize*0.68,y:y+cellSize*0.7}}else if(direction.x===-1){eye1={x:x+cellSize*0.32,y:y+cellSize*0.3};eye2={x:x+cellSize*0.32,y:y+cellSize*0.7}}else if(direction.y===-1){eye1={x:x+cellSize*0.3,y:y+cellSize*0.32};eye2={x:x+cellSize*0.7,y:y+cellSize*0.32}}else{eye1={x:x+cellSize*0.3,y:y+cellSize*0.68};eye2={x:x+cellSize*0.7,y:y+cellSize*0.68}}
ctx.beginPath();ctx.arc(eye1.x,eye1.y,eyeSize,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(eye2.x,eye2.y,eyeSize,0,Math.PI*2);ctx.fill()}
function draw(){if(!canvas.clientWidth){return}
const theme=getCurrentTheme();drawBackground(theme);drawWalls(theme);drawFood(theme);drawBonusFood();drawSnake(theme)}
let comboPopupTimer=null;function showComboPopup(comboValue){if(!comboPopup||!comboPopupText){return}
comboPopupText.textContent="COMBO x"+comboValue;comboPopup.classList.remove("show","premium");if(comboValue>=5){comboPopup.classList.add("premium")}
void comboPopup.offsetWidth;comboPopup.classList.add("show");clearTimeout(comboPopupTimer);comboPopupTimer=setTimeout(()=>{comboPopup.classList.remove("show","premium")},850)}
let levelCompleteTimer=null;function showLevelComplete(){if(!levelCompleteEffect||!levelCompleteText){return}
levelCompleteText.textContent="GET READY FOR LEVEL "+(level+1);levelCompleteEffect.classList.remove("show");void levelCompleteEffect.offsetWidth;levelCompleteEffect.classList.add("show");clearTimeout(levelCompleteTimer);levelCompleteTimer=setTimeout(()=>{levelCompleteEffect.classList.remove("show")},1800)}
let gameOverEffectTimer=null;function showGameOverEffect(){if(!gameOverEffect||!gameOverEffectText){return}
gameOverEffectText.textContent="SCORE "+score;gameOverEffect.classList.remove("show");void gameOverEffect.offsetWidth;gameOverEffect.classList.add("show");clearTimeout(gameOverEffectTimer);gameOverEffectTimer=setTimeout(()=>{gameOverEffect.classList.remove("show")},1500)}
function createParticles(x,y,color,count=8){const amount=Math.min(count,maxParticles-particles.length);for(let i=0;i<amount;i++){const angle=Math.random()*Math.PI*2;const speed=0.8+Math.random()*1.8;particles.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,decay:0.025+Math.random()*0.025,size:2+Math.random()*2.5,color:color})}}
function updateParticles(){if(particles.length===0){return}
for(let i=particles.length-1;i>=0;i--){const particle=particles[i];particle.x+=particle.vx;particle.y+=particle.vy;particle.vy+=0.025;particle.life-=particle.decay;if(particle.life<=0){particles.splice(i,1);continue}
ctx.save();ctx.globalAlpha=Math.max(0,particle.life);ctx.fillStyle=particle.color;ctx.beginPath();ctx.arc(particle.x,particle.y,particle.size,0,Math.PI*2);ctx.fill();ctx.restore()}}
function updateUI(){scoreEl.textContent=score;levelEl.textContent=level;highScoreEl.textContent=highScore;comboEl.textContent=combo;bestComboEl.textContent=bestCombo;gamesPlayedStatEl.textContent=gamesPlayed;gamesWonStatEl.textContent=gamesWon;gamesOverStatEl.textContent=gamesOver;foodCollectedStatEl.textContent=foodCollected;highestLevelStatEl.textContent=highestLevel;bestComboStatEl.textContent=bestCombo;comboEl.classList.toggle("combo-active",combo>=2);const currentTheme=getCurrentTheme();levelNameEl.textContent="Level "+level+" • "+currentTheme.name;modeTextEl.textContent=gameMode==="wall"?"Wall Levels • "+difficultySettings[difficulty].name:"No Walls • "+difficultySettings[difficulty].name}
function showMessage(title,text,buttonText){messageTitle.textContent=title;messageText.textContent=text;startBtn.textContent=buttonText;messageBox.style.display="flex"}
function setDirection(dir){const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};const newDir=dirs[dir];if(!newDir){return}
const lastDir=directionQueue.length?directionQueue[directionQueue.length-1]:nextDirection;if(newDir.x===-lastDir.x&&newDir.y===-lastDir.y){return}
if(newDir.x===lastDir.x&&newDir.y===lastDir.y){return}
if(directionQueue.length<2){directionQueue.push(newDir)}}
function changeMode(mode){if(gameMode===mode){return}
gameMode=mode;wallModeBtn.classList.toggle("active",mode==="wall");freeModeBtn.classList.toggle("active",mode==="free");resetGame()}
function changeDifficulty(newDifficulty){if(!difficultySettings[newDifficulty]){return}
if(difficulty===newDifficulty){return}
difficulty=newDifficulty;localStorage.setItem("malikSnakeDifficulty",difficulty);updateDifficultyButtons();resetGame()}
function updateDifficultyButtons(){easyBtn.classList.toggle("active",difficulty==="easy");mediumBtn.classList.toggle("active",difficulty==="medium");hardBtn.classList.toggle("active",difficulty==="hard")}
startBtn.addEventListener("click",()=>{if(levelCompleted){if(gameMode==="wall"&&level<5){nextLevel()}else{restartFromGameOver()}
return}
if(messageTitle.textContent==="Game Over"){restartFromGameOver();return}
if(messageTitle.textContent==="Paused"){startGame();return}
startGame()});pauseBtn.addEventListener("click",pauseGame);if(soundBtn){soundBtn.addEventListener("click",toggleSound)}
restartBtn.addEventListener("click",restartFromGameOver);wallModeBtn.addEventListener("click",()=>{changeMode("wall")});freeModeBtn.addEventListener("click",()=>{changeMode("free")});easyBtn.addEventListener("click",()=>{changeDifficulty("easy")});mediumBtn.addEventListener("click",()=>{changeDifficulty("medium")});hardBtn.addEventListener("click",()=>{changeDifficulty("hard")});document.querySelectorAll(".dpad-btn").forEach(button=>{button.addEventListener("pointerdown",event=>{event.preventDefault();if(event.pointerType!=="mouse"&&button.setPointerCapture){button.setPointerCapture(event.pointerId)}
const direction=button.dataset.dir;if(direction){setDirection(direction)}});button.addEventListener("pointercancel",event=>{if(button.hasPointerCapture&&button.hasPointerCapture(event.pointerId)){button.releasePointerCapture(event.pointerId)}})});document.addEventListener("keydown",event=>{const keys={ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};if(keys[event.key]){event.preventDefault();setDirection(keys[event.key])}
if(event.key===" "&&gameRunning&&!levelCompleted){event.preventDefault();pauseGame()}});let touchStartX=0;let touchStartY=0;canvas.style.touchAction="none";canvas.addEventListener("touchstart",event=>{const touch=event.changedTouches[0];touchStartX=touch.clientX;touchStartY=touch.clientY},{passive:!0});canvas.addEventListener("touchend",event=>{const touch=event.changedTouches[0];const dx=touch.clientX-touchStartX;const dy=touch.clientY-touchStartY;const distance=Math.max(Math.abs(dx),Math.abs(dy));if(distance<18){return}
if(Math.abs(dx)>Math.abs(dy)){setDirection(dx>0?"right":"left")}else{setDirection(dy>0?"down":"up")}},{passive:!0});canvas.addEventListener("touchmove",event=>{event.preventDefault()},{passive:!1});window.addEventListener("resize",resizeCanvas);wallModeBtn.classList.add("active");document.addEventListener("keydown",function(e){if(e.key!=="Enter"){return}
e.preventDefault();if(!gameRunning&&!paused&&!levelCompleted){restartFromGameOver();return}
if(paused){pauseGame();return}
if(!gameRunning){startGame();return}});if(themeBtn&&themePanel){themeBtn.addEventListener("click",function(){if(themePanel.style.display==="block"){themePanel.style.display="none"}else{themePanel.style.display="block"}})}
if(closeThemeBtn&&themePanel){closeThemeBtn.addEventListener("click",function(){themePanel.style.display="none"})}
const themeOptions=document.querySelectorAll(".theme-option");function applySelectedTheme(themeId){const themeExists=themes.some(theme=>theme.id===themeId);if(!themeExists){return}
selectedThemeId=themeId;localStorage.setItem("malikSnakeTheme",selectedThemeId);updateThemeSelection();updateUI();draw()}
function updateThemeSelection(){themeOptions.forEach(option=>{const isActive=option.dataset.theme===selectedThemeId;option.classList.toggle("active",isActive)})}
themeOptions.forEach(option=>{option.addEventListener("click",function(){const themeId=option.dataset.theme;applySelectedTheme(themeId);if(themePanel){themePanel.style.display="none"}})});updateThemeSelection();updateDifficultyButtons();updateUI();resetGame();resizeCanvas();updateSoundButton()