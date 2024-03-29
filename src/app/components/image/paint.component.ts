import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { PointsModel } from '../../models/points.model';
import { LinesModel } from '../../models/lines.model';

@Component({
  selector: 'app-paint',
  templateUrl: 'paint.component.html',
  styleUrls: ['paint.component.scss']
})
export class PaintComponent implements AfterViewInit {

  @ViewChild('canvasEl') canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('container') container: ElementRef<HTMLDivElement> | undefined;
  private context: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;
  private startPoint: PointsModel | null = null;
  private midPoint: PointsModel | null = null;
  private backgroundImage: HTMLImageElement | null = null;
  private lines: LinesModel[] = [];

  ngAfterViewInit() :void {
    const canvas = this.canvas?.nativeElement;
    if (canvas) {
      this.context = canvas.getContext('2d');
      this.resizeCanvas();
      this.loadBackgroundImage();
    }
  }

  @HostListener('window:resize')
  onResize():void {
    this.resizeCanvas();
    this.loadBackgroundImage();
    this.draw();
  }

  public resizeCanvas() :void {
    const canvas = this.canvas?.nativeElement;
    const container = this.container?.nativeElement;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  }

  private loadBackgroundImage() :void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.context) return;
    const image = new Image();
    image.onload = (): void => {
      this.backgroundImage = image;
      this.draw();
    };
    image.src = 'assets/media/img.png';
  }

  public startDrawing(event: MouseEvent) :void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.context) return;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = event.clientX - rect.left;
    const mouseY: number = event.clientY - rect.top;

    if (this.midPoint && this.isInsideCircle(mouseX, mouseY, this.midPoint.x, this.midPoint.y, 5)) {
      this.isDrawing = false;
    } else {
      this.isDrawing = true;
      this.startPoint = { x: mouseX, y: mouseY };
      this.midPoint = { x: mouseX, y: mouseY };
    }
  }

  public draw(event?: MouseEvent): void {
    if (!this.context || !this.backgroundImage) return;
    const canvas = this.canvas?.nativeElement;
    if (canvas) {
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);

      for (const line of this.lines) {
        this.context.beginPath();
        this.context.moveTo(line.start.x, line.start.y);
        this.context.lineTo(line.end.x, line.end.y);
        this.context.stroke();
        this.drawMidPoint(line.start, line.end);
      }

      if (this.isDrawing && event && this.startPoint) {
        const currentPoint: PointsModel = { x: event.offsetX, y: event.offsetY };
        this.context.beginPath();
        this.context.moveTo(this.startPoint.x, this.startPoint.y);
        this.context.lineTo(currentPoint.x, currentPoint.y);
        this.context.stroke();
        this.drawMidPoint(this.startPoint, currentPoint);
      }
    }
  }

  public stopDrawing(event: MouseEvent): void {
    if (this.isDrawing && event && this.startPoint) {
      const canvas = this.canvas?.nativeElement;
      if (canvas) {
        const endPoint = { x: event.offsetX, y: event.offsetY };
        this.lines.push({ start: this.startPoint, end: endPoint });
        this.startPoint = null;
        this.isDrawing = false;
        this.draw();
      }
    }
  }

  public drawMidPoint(startPoint: PointsModel, endPoint: PointsModel): void {
    const midPoint: PointsModel = this.calculateMidPoint(startPoint, endPoint);
    if (this.context) {
      this.context.beginPath();
      this.context.arc(midPoint.x, midPoint.y, 5, 0, 2 * Math.PI);
      this.context.fillStyle = 'red';
      this.context.fill();
    }
  }

  public handleClick(event: MouseEvent) :void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.context) return;
    const rect :DOMRect = canvas.getBoundingClientRect();
    const mouseX :number = event.clientX - rect.left;
    const mouseY :number = event.clientY - rect.top;

    if (this.midPoint && this.isInsideCircle(mouseX, mouseY, this.midPoint.x, this.midPoint.y, 5)) {
      this.startDrawing(event);
    }
  }

  public calculateMidPoint(startPoint: PointsModel, endPoint: PointsModel): PointsModel {
    return {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };
  }

  public isInsideCircle(x: number, y: number, centerX: number, centerY: number, radius: number): boolean {
    const dx :number = x - centerX;
    const dy :number = y - centerY;
    return dx * dx + dy * dy <= radius * radius;
  }

}
