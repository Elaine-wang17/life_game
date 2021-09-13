import { memory } from "@bezos/wasm-game-of-life/wasm_game_of_life_bg";
import { Universe } from '@bezos/wasm-game-of-life'

//每个方格子的像素尺寸
const CELL_SIZE = 5;
//格子的默认颜色
const GRID_COLOR = "#CCCCCC";
//细胞死亡的颜色
const DEAD_COLOR = "#FFFFFF";
//细胞存活的颜色
const ALIVE_COLOR = "#000000";

const universe = Universe.new()
universe.set_width(64)
universe.set_height(64)
universe.init()

const width = universe.width()
const height = universe.height()
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = (CELL_SIZE + 1) * width + 1
canvas.height = (CELL_SIZE + 1) * height + 1

function drawGrid() {
  //清空绘制状态
  ctx.beginPath();

  //设置颜色
  ctx.strokeStyle = GRID_COLOR;

  //绘制垂直线
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  //绘制水平线
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1)
  }

  //填充线的颜色
  ctx.stroke();
}

drawGrid();

function getIndex(row, column) {
  return row * width + column;
}

const bitInSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

function drawCells() {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);
  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      ctx.fillStyle = bitInSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;
      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
}

let animationId;

function renderLoop() {
  // fps.render();
  universe.tick();
  drawCells();
  animationId = requestAnimationFrame(renderLoop);
}

const btn1 = document.getElementById("play-pause");

btn1.addEventListener("click", function (event) {
  if (event.target.innerHTML === "开始") { 
    event.target.innerHTML = "暂停"; 
    renderLoop(); 
  }else{
    event.target.innerHTML = "开始"; 
    cancelAnimationFrame(animationId);
  }
})