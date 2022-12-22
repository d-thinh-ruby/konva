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
  src: string;
  imgType: string;
  id: number;
}

export interface TextProps {
  id: number;
  content: string;
  textDbClick?: Function;
}
