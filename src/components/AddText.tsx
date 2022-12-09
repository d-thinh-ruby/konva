import React, { useState } from "react";
import { Text } from "react-konva";

interface TextProps {
  id: number;
  content: string;
}
const AddText = (props: TextProps) => {
  const [x, setX] = useState(window.innerWidth / 2);
  const [y, setY] = useState(window.innerHeight / 2);

  function handleDragEnd(e: {
    target: {
      x: () => React.SetStateAction<number>;
      y: () => React.SetStateAction<number>;
    };
  }) {
    setX(e.target.x());
    setY(e.target.y());
  }

  return (
    <Text
      name={"text-" + props.id}
      fontSize={20}
      fontStyle={"20"}
      x={x}
      y={y}
      text={props.content}
      wrap="word"
      width={window.innerWidth - 50}
      draggable
      onDragEnd={handleDragEnd}
      onTouchEnd={handleDragEnd}
    />
  );
};

export default AddText;
