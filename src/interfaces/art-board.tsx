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
  imgDragStart?: Function;
  imgDragEnd?: Function;
}

export interface TextProps {
  id: number;
  size: number;
  content: string;
  textDbClick?: Function;
}
