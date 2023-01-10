declare global {
  interface Window {
    gifler: any;
  }
  interface Document {
    documentMode?: any;
  }

  interface HTMLTextAreaElement {
    parentNode: any;
  }
}

export interface ImageProps {
  x: number;
  y: number;
  src: string;
  imgType: string;
  id: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  imgDragStart?: Function;
  imgDragEnd?: Function;
  imgTransformEnd?: Function;
  dragable: Boolean;
}

export interface TextProps {
  id: number;
  x: number;
  y: number;
  size: number;
  fontFamily: string;
  color: string;
  content: string;
  width: number;
  rotation: number;
  skewX: number;
  textDbClick?: Function;
  textDragEnd?: Function;
  textTransformEnd?: Function;
  dragable: Boolean;
}
