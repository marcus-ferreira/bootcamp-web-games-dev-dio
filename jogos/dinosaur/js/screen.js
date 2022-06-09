export { Screen };

class Screen {
  constructor(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawObj(obj, x, y) {
    this.ctx.drawImage(obj, x, y);
  }
}
