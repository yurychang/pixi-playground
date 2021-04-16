import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Graphics, InteractionEvent, settings, utils } from 'pixi.js';
import { PainterCanvasComponent } from './painter-canvas.component';

settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

utils.skipHello();

describe('Painter canvas component', () => {
  let fixture: ComponentFixture<PainterCanvasComponent>;
  let component: PainterCanvasComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PainterCanvasComponent],
    });

    fixture = TestBed.createComponent(PainterCanvasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should canavs element exist', () => {
    const painterEl: HTMLElement = fixture.nativeElement;
    const canvas = painterEl.querySelector('canvas') as HTMLCanvasElement;

    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it('should correct size of canvas element', () => {
    const painterEl: HTMLElement = fixture.nativeElement;
    const canvas = painterEl.querySelector('canvas') as HTMLCanvasElement;

    const size = 500;
    component.width = size;
    component.height = size;

    fixture.detectChanges();

    expect(canvas.width).toBe(size);
    expect(canvas.height).toBe(size);
  });

  it('should clear main layer', () => {
    const graphics = new Graphics();
    component.mainLayer.addChild(graphics);
    component.clear();

    const children = component.mainLayer.children;
    expect(children).toHaveSize(0);
  });

  it('should add child to main layer', () => {
    const graphics = new Graphics();
    component.addChild(graphics);

    const children = component.mainLayer.children;
    expect(children).toContain(graphics);
  });

  // it('should dispatch drawing event by drawing$ observable', () => {
  //   const painterEl: HTMLElement = fixture.nativeElement;
  //   const canvas = painterEl.querySelector('canvas') as HTMLCanvasElement;

  //   const drawFunc = jasmine.createSpy('drawFunc');
  //   const spy = {
  //     drawStart: (drawing$: Observable<InteractionEvent>) => {
  //       drawing$.subscribe(drawFunc);
  //     },
  //   };

  //   spyOn(spy, 'drawStart');

  //   component.drawingStart$.subscribe(drawFunc);

  //   const downEvent = new MouseEvent('mousedown');
  //   const moveEvent = new MouseEvent('mousemove');
  //   const upEvent = new MouseEvent('mouseup');
  //   const leaveEvent = new MouseEvent('mouseleave');

  //   canvas.dispatchEvent(downEvent);
  //   fixture.detectChanges();
  //   canvas.dispatchEvent(moveEvent);
  //   fixture.detectChanges();
  //   canvas.dispatchEvent(moveEvent);
  //   fixture.detectChanges();
  //   canvas.dispatchEvent(upEvent);
  //   fixture.detectChanges();
  //   canvas.dispatchEvent(moveEvent);
  //   fixture.detectChanges();

  //   expect(spy.drawStart).toHaveBeenCalledTimes(1);
  // });
});
