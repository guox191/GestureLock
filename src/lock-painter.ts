import {Injectable} from 'angular2/core';
import {Point, IndexPoint} from './interface';

@Injectable()
export class Painter {
  public _context2d: any;
  public originalPoints: Array<IndexPoint>;
  public activityPoints: Array<IndexPoint>;
  public selectedPoints: Array<IndexPoint>;

  protected _attributes: {
    matrix:number
    radius:number
  };

  constructor() {
    this._attributes = {
      matrix: 3,
      radius: 0
    };
    this.originalPoints = [];
    this.activityPoints = [];
    this.selectedPoints = [];
  }

  public init(canvas: any) {
    this._context2d = canvas.getContext('2d');
    this._attributes.radius = canvas.width / ( 4 * this._attributes.matrix);
    this._drawBoard();
  }

  protected _drawBoard(): void {
    let matrix = this._attributes.matrix;
    let count = 0;
    let r = this._attributes.radius;

    if (this.originalPoints.length !== Math.pow(this._attributes.matrix, 2)) {
      this.originalPoints = [];
      for (let i = 0; i < matrix; i++) {
        for (let j = 0; j < matrix; j++) {
          count++;
          let point = {
            x: 4 * j  * r + 2 * r,
            y: 4 * i * r + 2 * r,
            index: count
          };
          this.originalPoints.push(point);
        }
      }
    }

    this.activityPoints = this.originalPoints.concat();
    this.clearCanvas();
    this.originalPoints.forEach(ele => {
      this.drawCircle(ele);
    });
  }

  //清除面板
  public clearCanvas(): void {
    this._context2d.clearRect(0, 0, this._context2d.canvas.width, this._context2d.canvas.height);
  }

  //绘制原始点
  public drawCircle(point: Point, strokeStyle: string = 'rgba(0,0,0,.5)', lineWidth: number = 1): void {
    this._context2d.strokeStyle = strokeStyle;
    this._context2d.lineWidth = lineWidth;
    this._context2d.beginPath();
    this._context2d.arc(point.x, point.y, 6, 0, Math.PI * 2, true);
    this._context2d.closePath();
    this._context2d.fillStyle = 'rgba(0,0,0,.5)';
    this._context2d.fill();
    this._context2d.stroke();
  }

  //绘制选中点
  public drawSelectCircle(point: IndexPoint): void {
    this._context2d.strokeStyle = '#fff';
    this._context2d.lineWidth = 1;
    this._context2d.beginPath();
    this._context2d.arc(point.x, point.y, this._attributes.radius / 2, 0, Math.PI * 2, true);
    this._context2d.closePath();
    this._context2d.stroke();

    this._context2d.fillStyle = 'rgba(255,255,255,.8)';
    this._context2d.beginPath();
    this._context2d.arc(point.x, point.y, 6.5, 0, Math.PI * 2, true);
    this._context2d.closePath();
    this._context2d.fill();
  }

  //绘制线段
  public drawLine(pointGroup: Point[] ,lineWidth: number = 1, strokeStyle: string = '#fff'): void {
    this._context2d.beginPath();
    this._context2d.lineWidth = lineWidth;
    this._context2d.strokeStyle = strokeStyle;

    for (let i = 0, n = pointGroup.length; i < n; i++) {
      if (i > 0) {
        this._context2d.lineTo(pointGroup[i].x, pointGroup[i].y);
      } else {
        this._context2d.moveTo(pointGroup[0].x, pointGroup[0].y);
      }
    }
    this._context2d.stroke();
    this._context2d.closePath();
  }

  //绘制touch start的point
  public drawFirstTouchPoint(touchPoint: Point): void {
    for (let i = 0; i < this.activityPoints.length; i++) {
      if (this._canSelect(touchPoint, i)) {
        this.selectedPoints.push(this.activityPoints[i]);
        this.activityPoints.splice(i, 1);
        this.drawLine(this.selectedPoints);
        this._drawSelectedPoints();
        break;
      }
    }
  }

  //touch过程中绘制
  public drawTouchMoving(touchPoint: Point): void {
    for (let i = 0; i < this.activityPoints.length; i++) {
      if (this._canSelect(touchPoint, i)) {
        this.selectedPoints.push(this.activityPoints[i]);
        this.activityPoints.splice(i, 1);
        break;
      }
    }
    this._drawBoard();
    this.drawLine(this.selectedPoints.concat(touchPoint));
    this._drawSelectedPoints();
  }

  //touch结束
  public drawTouchEnd() {
    this._drawBoard();
    this.drawLine(this.selectedPoints);
    this._drawSelectedPoints();
  }

  //判断是否选中
  protected _canSelect(touchPoint: Point, i:number): boolean{
    return Math.abs(touchPoint.x - this.activityPoints[i].x) < this._attributes.radius
    && Math.abs(touchPoint.y - this.activityPoints[i].y) < this._attributes.radius
  }

  protected _drawSelectedPoints(): void {
    this.selectedPoints.forEach( ele => {
      this.drawSelectCircle(ele);
    })
  }
}