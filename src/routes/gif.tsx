import Konva from "konva";
import React, { useRef, useMemo, useEffect } from "react";
import { Stage, Layer, Image } from "react-konva";
// gifler will be imported into global window object
import "gifler";

import { AnimatorProps } from "../interfaces/gif";
interface GifProps {
  src: string;
}

// the first very simple and recommended way:
const GIF = (props: GifProps) => {
  const imageRef = useRef<Konva.Image>(null);
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    return node;
  }, []);

  useEffect(() => {
    // save animation instance to stop it on unmount
    let anim: AnimatorProps;
    window.gifler(props.src).get((a: AnimatorProps) => {
      anim = a;
      anim.animateInCanvas(canvas);
      anim.onDrawFrame = (ctx, frame) => {
        ctx.drawImage(frame.buffer, frame.x, frame.y);
        imageRef.current?.getLayer()?.draw();
      };
    });
    return () => anim?.stop();
  }, [props.src, canvas]);

  return <Image image={canvas} ref={imageRef} />;
};

const App = () => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <GIF src="https://konvajs.org/assets/yoda.gif" />
      </Layer>
    </Stage>
  );
};

export default App;
