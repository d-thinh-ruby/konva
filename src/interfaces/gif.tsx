export interface AnimatorProps {
  animateInCanvas(e: HTMLCanvasElement): any;
  stop(): any;
  onDrawFrame(
    ctx: CanvasRenderingContext2D,
    frame: { x: number; y: number; buffer: HTMLCanvasElement }
  ): any;
}
