import React, { useState } from "react";
import { Text } from "react-konva";

import { TextProps } from "../interfaces/art-board";

const AddText = (props: TextProps) => {
  const [textWidth, setTextWidth] = useState(Math.max(props.size, props.width));

  function handleTransform(e: any) {
    const text = e.target;
    setTextWidth(Math.max(text.width() * text.scaleX(), props.size));
  }

  function handleDragStart(e: { target: { stopDrag: () => void } }) {
    if (!props.dragable) {
      e.target.stopDrag();
    }
  }

  return (
    <Text
      name={"text-" + props.id}
      fontSize={props.size}
      fontFamily={props.fontFamily}
      fill={props.color}
      x={props.x}
      y={props.y}
      scale={{ x: 1, y: 1 }}
      text={props.content}
      wrap="word"
      rotation={props.rotation}
      skewX={props.skewX}
      width={textWidth}
      draggable
      onDragStart={handleDragStart}
      onTransformEnd={(e) => {
        props.textTransformEnd!(e);
      }}
      onDragEnd={(e) => {
        props.textDragEnd!(e);
      }}
      onTouchEnd={(e) => {
        props.textDragEnd!(e);
      }}
      onTransform={handleTransform}
      onDblClick={(e) => {
        props.textDbClick!(e);
      }}
      onDblTap={(e) => {
        props.textDbClick!(e);
      }}
    />
  );
};

export default AddText;
