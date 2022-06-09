export { Keyboard };

class Keyboard {
  constructor() {
    window.addEventListener("keydown", (event) => {
      this[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      this[event.code] = false;
    });
  }

  isPressed(key) {
    return this[key];
  }
}
