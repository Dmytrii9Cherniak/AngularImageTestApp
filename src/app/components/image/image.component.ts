// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   HostListener,
//   ViewChild
// } from '@angular/core';
//
// @Component({
//   selector: 'app-image',
//   templateUrl: './image.component.html',
//   styleUrls: ['./image.component.scss']
// })
// export class ImageComponent implements AfterViewInit {
//
//   @ViewChild('imageRef', { static: true }) imageElement: ElementRef;
//
//   public canvas: HTMLCanvasElement;
//   public context: CanvasRenderingContext2D;
//   public startX: number = 0;
//   public startY: number = 0;
//   public endX: number = 0;
//   public endY: number = 0;
//
//   public ngAfterViewInit() {
//     this.canvas = this.imageElement.nativeElement;
//     this.context = this.canvas.getContext('2d')!;
//
//     if (this.context) {
//       const image: HTMLImageElement = new Image();
//       image.src = 'assets/media/img.png';
//       image.onload = () => {
//         this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
//       };
//     }
//   }
//
//   public drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
//     console.log(context)
//     context.beginPath();
//     context.moveTo(x1, y1);  // Встановлюємо початкову точку
//     context.lineTo(x2, y2);  // Встановлюємо кінцеву точку
//     context.lineWidth = 1
//     context.stroke();  // Малюємо лінію
//   }
//
//   @HostListener('touchstart', ['$event'])
//   public canvasOnMouseDown(event: MouseEvent) {
//     const rect: DOMRect = this.canvas.getBoundingClientRect();
//     this.startX =  event.clientX - rect.x;
//     this.startY = event.clientY - rect.y;
//     console.log(this.startY, this.startY, 'x start', 'y start')
//   }
//
//   @HostListener('mouseup', ['$event'])
//   public canvasOnMouseUp(event: MouseEvent) {
//     const rect: DOMRect = this.canvas.getBoundingClientRect();
//     this.endX = event.clientX  - rect.x;
//     this.endY = event.clientY - rect.y;
//     this.drawLine(this.context, this.startX, this.startY, this.endX, this.endY);
//     console.log(this.endX, this.endY, 'x end', 'y end')
//   }
//
// }

import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements AfterViewInit {

  @ViewChild('imageRef', { static: true }) imageElement: ElementRef;

  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public startX: number = 0;
  public startY: number = 0;
  public endX: number = 0;
  public endY: number = 0;

  public ngAfterViewInit() {
    this.canvas = this.imageElement.nativeElement;
    this.context = this.canvas.getContext('2d')!;

    if (this.context) {
      const image: HTMLImageElement = new Image();
      image.src = 'assets/media/img.png';
      image.onload = () => {
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }

  public drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    console.log(context)
    context.beginPath();
    context.moveTo(x1, y1);  // Встановлюємо початкову точку
    context.lineTo(x2, y2);  // Встановлюємо кінцеву точку
    // context.lineWidth = 1
    context.stroke();  // Малюємо лінію
  }

  @HostListener('mousedown', ['$event'])
  public canvasOnMouseDown(event: MouseEvent) {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    this.startX =  event.clientX - rect.x;
    this.startY = event.clientY - rect.y;
    console.log(this.startX, this.startY, 'x start', 'y start')
  }

  @HostListener('mouseup', ['$event'])
  public canvasOnMouseUp(event: MouseEvent) {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    this.endX = event.clientX  - rect.x;
    this.endY = event.clientY - rect.y;
    this.drawLine(this.context, this.startX, this.startY, this.endX, this.endY);
    console.log(this.endX, this.endY, 'x end', 'y end')
  }

}
