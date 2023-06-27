import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-paint',
  templateUrl: 'paint.component.html',
  styleUrls: ['paint.component.scss']
})
export class PaintComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasEl') canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('container') container: ElementRef<HTMLDivElement> | undefined;
  private context: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;
  private startPoint: { x: number; y: number } | null = null;
  private midPoint: { x: number; y: number } | null = null;
  private backgroundImage: HTMLImageElement | null = null;
  private lines: { start: { x: number, y: number }, end: { x: number, y: number } }[] = [];

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.canvas?.nativeElement;
    if (canvas) {
      this.context = canvas.getContext('2d');
      this.resizeCanvas();
      this.loadBackgroundImage();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.loadBackgroundImage();
    this.draw();
  }

  private resizeCanvas() {
    const canvas = this.canvas?.nativeElement;
    const container = this.container?.nativeElement;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
  }

  private loadBackgroundImage() {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.context) return;
    const image = new Image();
    image.onload = () => {
      this.backgroundImage = image;
      this.draw();
    };
    image.src = 'assets/media/img.png';
  }

  startDrawing(event: MouseEvent) {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.context) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.midPoint && this.isInsideCircle(mouseX, mouseY, this.midPoint.x, this.midPoint.y, 5)) {
      this.isDrawing = false;
    } else {
      this.isDrawing = true;
      this.startPoint = { x: mouseX, y: mouseY };
      this.midPoint = { x: mouseX, y: mouseY };
    }
  }

  draw(event?: MouseEvent) {
    if (!this.context || !this.backgroundImage) return;
    const canvas = this.canvas?.nativeElement;
    if (canvas) {
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
      this.drawLines();
      if (this.isDrawing && event && this.startPoint) {
        this.context.beginPath();
        this.context.moveTo(this.startPoint.x, this.startPoint.y);
        this.context.lineTo(event.offsetX, event.offsetY);
        this.context.stroke();
        this.midPoint = this.calculateMidPoint(this.startPoint, { x: event.offsetX, y: event.offsetY });
        this.drawMidPoint();
      } else if (this.midPoint) {
        this.drawMidPoint();
      }
    }
  }

  stopDrawing(event: MouseEvent) {
    if (this.isDrawing && event && this.startPoint) {
      const canvas = this.canvas?.nativeElement;
      if (canvas) {
        const endPoint = { x: event.offsetX, y: event.offsetY };
        this.lines.push({ start: this.startPoint, end: endPoint });
        this.startPoint = null;
        this.midPoint = null;
        this.isDrawing = false;
        this.draw();
      }
    }
  }

  drawMidPoint() {
    if (!this.context || !this.midPoint) return;
    this.context.beginPath();
    this.context.arc(this.midPoint.x, this.midPoint.y, 5, 0, 2 * Math.PI);
    this.context.fillStyle = 'red';
    this.context.fill();
  }

  handleClick(event: MouseEvent) {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.context) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.midPoint && this.isInsideCircle(mouseX, mouseY, this.midPoint.x, this.midPoint.y, 5)) {
      this.startDrawing(event);
    }
  }

  calculateMidPoint(startPoint: { x: number; y: number }, endPoint: { x: number; y: number }): { x: number; y: number } {
    return {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };
  }

  isInsideCircle(x: number, y: number, centerX: number, centerY: number, radius: number): boolean {
    const dx = x - centerX;
    const dy = y - centerY;
    return dx * dx + dy * dy <= radius * radius;
  }

  drawLines() {
    if (!this.context) return;
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;
    for (const line of this.lines) {
      this.context.beginPath();
      this.context.moveTo(line.start.x, line.start.y);
      this.context.lineTo(line.end.x, line.end.y);
      this.context.stroke();
    }
  }
}