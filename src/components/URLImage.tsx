import Konva from "konva";
import React, { useRef, useEffect, useMemo } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import "gifler";
import "../plugins/crop-image";

import { ImageProps } from "../interfaces/art-board";
import { AnimatorProps } from "../interfaces/gif";

const URLImage = (props: ImageProps) => {
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

  function handleOnDbClick(e: { target: any }) {
    if (props.dragable) {
      e.target.enableCropOnDblClick();
    }
  }

  return (
    <Image
      name={"image-" + props.id}
      image={props.imgType === "image/gif" ? canvas : img}
      ref={imageRef}
      x={props.x}
      y={props.y}
      offsetX={0}
      offsetY={0}
      rotation={props.rotation}
      scaleX={props.scaleX}
      scaleY={props.scaleY}
      skewX={props.skewX}
      draggable
      onDragStart={(e) => {
        if (props.dragable) {
          props.imgDragStart!(e);
        } else {
          e.target.stopDrag();
        }
      }}
      onDragEnd={(e) => {
        props.imgDragEnd!(e);
      }}
      onTouchEnd={(e) => {
        props.imgDragEnd!(e);
      }}
      onDblClick={handleOnDbClick}
      onDblTap={handleOnDbClick}
      onTransformEnd={(e) => {
        props.imgTransformEnd!(e);
      }}
    />
  );
};

export default URLImage;
