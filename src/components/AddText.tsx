import React, { useState } from "react";
import { Text } from "react-konva";

import { TextProps } from "../interfaces/art-board";

const AddText = (props: TextProps) => {
  const MIN_WIDTH = 100;
  const [x, setX] = useState(window.innerWidth / 2);
  const [y, setY] = useState(window.innerHeight / 2);
  const [textWidth, setTextWidth] = useState(MIN_WIDTH);

  function handleDragEnd(e: {
    target: {
      x: () => React.SetStateAction<number>;
      y: () => React.SetStateAction<number>;
    };
  }) {
    setX(e.target.x());
    setY(e.target.y());
  }

  function handleTransform(e: any) {
    const text = e.target;
    setTextWidth(Math.max(text.width() * text.scaleX(), MIN_WIDTH));
  }

  return (
    <Text
      name={"text-" + props.id}
      fontSize={20}
      fontStyle={"20"}
      x={x}
      y={y}
      scale={{ x: 1, y: 1 }}
      text={props.content}
      wrap="word"
      width={textWidth}
      draggable
      onDragEnd={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onTransform={handleTransform}
      onDblClick={(e) => {
        props.textDbClick(e);
      }}
      onDblTap={(e) => {
        props.textDbClick(e);
      }}
    />
  );
};

export default AddText;
