import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @ViewChild('imageRef', { static: true }) imageElement: ElementRef;

  private startX: number; // Початкова координата X
  private startY: number; // Початкова координата Y
  private endX: number; // Кінцева координата X
  private endY: number; // Кінцева координата Y
  private lastX: number; // Остання координата X
  private lastY: number; // Остання координата Y

  ngOnInit() {
    this.imageElement.nativeElement.draggable = false;
    console.log(this.imageElement);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.target === this.imageElement.nativeElement) {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      document.addEventListener('mouseup', this.onMouseUpOutsideImage);
    }
  }

  onMouseUpOutsideImage = (event: MouseEvent) => {
    this.endX = event.clientX;
    this.endY = event.clientY;
    console.log('Start coordinates:', this.startX, this.startY);
    console.log('End coordinates:', this.endX, this.endY);
    document.removeEventListener('mouseup', this.onMouseUpOutsideImage);
  };

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (event.target === this.imageElement.nativeElement) {
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }
}
