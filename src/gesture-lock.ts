import {Component, OnInit} from 'angular2/core';
import {Painter} from './lock-painter';
import {Point, IndexPoint} from './interface';

@Component({
  selector: 'gesture-lock',
  template: '<canvas id="lock-canvas"></canvas>',
  providers: [Painter]
})
export class GestureLock implements OnInit{
  protected _touchFlag: boolean;
  protected _canvas:any;

  constructor(
    private _painter:Painter
  ) {
    this._touchFlag = false;
  }

  ngOnInit() {
    this._init();
  }

 protected _init() {
    this._canvas = document.getElementById('lock-canvas');
    let canvasHeight = Math.min(window.innerHeight * 0.5, window.innerWidth * 0.8, 300);
    this._canvas.width = this._canvas.height = canvasHeight;
    this._painter.init(this._canvas);
    this._bindEvent();
 }

  protected _bindEvent() {
    let _self = this;

    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);

    this._canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      _self._touchStart(e);
    }, false);

    this._canvas.addEventListener("touchmove", function (e) {
      if (_self._touchFlag) {
        _self._touchMoving(e);
      }
    }, false);

    this._canvas.addEventListener("touchend", function (e) {
      _self._touchEnd(e);
    }, false);
  }

  protected _touchStart(e): void {
    let touchPointer: Point = this._getTouchPos(e);
    this._touchFlag = true; //外层控制
    this._painter.drawFirstTouchPoint(touchPointer);
  }

  protected _touchMoving(e): void {
    let touchPointer: Point = this._getTouchPos(e);
    this._painter.drawTouchMoving(touchPointer);
  }

  protected _touchEnd(e) {
    if (this._touchFlag) {
      this._touchFlag = false;
      this._painter.drawTouchEnd();
    }
  }

  //获取触点相对位置
  protected _getTouchPos(e): Point {
    let rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
}