import React, { useState } from "react";
import { Text } from "react-konva";

import { TextProps } from "../interfaces/art-board";

const AddText = (props: TextProps) => {
  const MIN_WIDTH = 20;
  const [x, setX] = useState(window.innerWidth / 2);
  const [y, setY] = useState(window.innerHeight / 2);
  const [textWidth, setTextWidth] = useState(MIN_WIDTH);

  function handleTransform(e: any) {
    const text = e.target;
    setTextWidth(Math.max(text.width() * text.scaleX(), MIN_WIDTH));
  }

  return (
    <Text
      name={"text-" + props.id}
      fontSize={props.size}
      x={props.x}
      y={props.y}
      scale={{ x: 1, y: 1 }}
      text={props.content}
      wrap="word"
      width={textWidth}
      draggable
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
