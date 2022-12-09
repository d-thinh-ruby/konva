import Konva from "konva";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import "gifler";
import "../plugins/crop-image";

interface ImageProps {
  src: string;
  imgType: string;
  id: number;
}

interface AnimatorProps {
  animateInCanvas(e: HTMLCanvasElement): any;
  stop(): any;
  onDrawFrame(
    ctx: CanvasRenderingContext2D,
    frame: { x: number; y: number; buffer: HTMLCanvasElement }
  ): any;
}

const URLImage = (props: ImageProps) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const imageRef = useRef<Konva.Image>(null);
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    return node;
  }, []);
  const [img] = useImage(props.src);
  if (props.imgType === "image/gif") {
    useEffect(() => {
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
  }

  function handleDragEnd(e: {
    target: {
      x: () => React.SetStateAction<number>;
      y: () => React.SetStateAction<number>;
    };
  }) {
    setX(e.target.x());
    setY(e.target.y());
  }

  function handleOnDbClick(e: { target: any }) {
    e.target.enableCropOnDblClick();
  }

  return (
    <Image
      name={"image-" + props.id}
      image={props.imgType === "image/gif" ? canvas : img}
      ref={imageRef}
      x={x}
      y={y}
      offsetX={0}
      offsetY={0}
      draggable
      onDragEnd={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onDblClick={handleOnDbClick}
      onDblTap={handleOnDbClick}
    />
  );
};

export default URLImage;