export interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

export type KeyActionHandler = (action: "interact" | "close-panel") => void;

/**
 * Tracks raw WASD/Arrow key state and raises semantic actions (E / Escape)
 * via a callback — isolates DOM event wiring from movement/physics logic.
 */
export class KeyboardInput {
  readonly keys: KeyState = { w: false, a: false, s: false, d: false };

  constructor(private readonly onAction: KeyActionHandler) {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  attach(): void {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  detach(): void {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.w = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.a = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.s = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.d = true;
        break;
      case "KeyE":
        this.onAction("interact");
        break;
      case "Escape":
        this.onAction("close-panel");
        break;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.w = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.a = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.s = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.d = false;
        break;
    }
  }
}
