import { IScreenPosition, IXDirection, IYDirection } from "./interfaces";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './config';

import { isFunctionTypeNode } from "typescript";

const PLAYER_SPEED = 10;

class Player {
  private _name: string;
  private _id: string;
  private _screenPosition: IScreenPosition;
  private _x: number;
  private _y: number;
  private _moveToLeft: boolean;
  private _moveToRight: boolean;
  private _moveToTop: boolean;
  private _moveToBottom: boolean;

  constructor(name = 'Anonyme', xPosition = 0, yPosition = 0) {
    this._name = name;
    this._id = null;
    this._screenPosition = 'LEFT';
    this._x = xPosition;
    this._y = yPosition;
    this._moveToLeft = false
    this._moveToRight = false
    this._moveToTop = false
    this._moveToBottom = false
  }

  public getScreenPosition(): IScreenPosition {
    return this._screenPosition;
  }

  setScreenPosition(position: IScreenPosition) {
    this._screenPosition = position;
  }

  getId() {
    return this._id;
  }

  setId(id) {
    this._id = id;
  }

  setName(name) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  getX() {
    return this._x;
  }

  setX(x) {
    this._x = x;
  }

  getY() {
    return this._y;
  }

  setY(y) {
    this._y = y;
  }
  
    getMoveX(): IXDirection {
      if (this._moveToRight) {
        return 'RIGHT';
      } else if (this._moveToLeft) {
        return 'LEFT';
      } else{
        return 'STOP'
      }
    }
  
    getMoveY(): IYDirection {
      if (this._moveToTop) {
        return 'TOP';
      } else if (this._moveToBottom) {
        return 'BOTTOM';
      } else{
        return 'STOP'
      }
    }

  moveX(move) {
    if (move === 'RIGHT') {
      this._moveToRight = true
      this._moveToLeft = false
    } else if (move === 'LEFT') {
      this._moveToLeft = true
      this._moveToRight = false
    } else if (move === 'STOP_LEFT') {
      this._moveToLeft = false
    } else if (move === 'STOP_RIGHT') {
      this._moveToRight = false
    }
  }

  moveY(move) {
    if (move === 'TOP') {
      this._moveToTop = true
      this._moveToBottom = false
    } else if (move === 'BOTTOM') {
      this._moveToTop = false
      this._moveToBottom = true
    } else if (move === 'STOP_TOP') {
      this._moveToTop = false
    } else if (move === 'STOP_BOTTOM') {
      this._moveToBottom = false
    }
    return
  }

  update() {
    if (this._moveToRight) {
      const newValue = this._x + PLAYER_SPEED;
      if (newValue <= SCREEN_WIDTH - 60 - 30) {
        this._x = newValue
      }
    } else if (this._moveToLeft) {
      const newValue = this._x - PLAYER_SPEED
      if (newValue >= 0 +30) {
        this._x = newValue;
      }
    }

  console.log('position y: ', this._y);

    if (this._moveToTop) {
      const newValue = this._y - PLAYER_SPEED;
      if (newValue >= 0 +30) {
        this._y = newValue
      }
    } 
    else if (this._moveToBottom) {
      const newValue = this._y + PLAYER_SPEED
      console.log('newValue: ', newValue);
      if (newValue <= SCREEN_HEIGHT - 60 - 30) {
        this._y = newValue
      }
    }
  }
}

export default Player