import {AfterContentInit, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, AfterViewInit {

  @ViewChild('imageRef', { static: true }) imageElement: ElementRef;


  ngOnInit() {

  }

  public ngAfterViewInit() {
    const canvasElement: HTMLCanvasElement = this.imageElement.nativeElement;
    const image = new Image();
    canvasElement.width = 1400;
    canvasElement.height = 650;
    image.src = 'assets/media/img.png';
    image.onload = () => {
      const context = canvasElement.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
      }
    };
  }

}
