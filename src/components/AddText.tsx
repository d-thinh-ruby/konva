import React, { useState } from "react";
import { Text } from "react-konva";

interface TextProps {
  id: number;
  content: string;
}

declare global {
  interface Document {
    documentMode?: any;
  }

  interface HTMLTextAreaElement {
    parentNode: any;
  }
}

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

  function handleDblClick(e: any) {
    const canvasContainer = document.getElementById("canvas-container");
    const textNode = e.target;
    const textPosition = textNode.absolutePosition();
    const areaPosition = {
      x: canvasContainer!.offsetLeft + textPosition.x,
      y: canvasContainer!.offsetTop + textPosition.y,
    };

    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }

    let px = 0;
    let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += "translateY(-" + px + "px)";

    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 3 + "px";

    textarea.focus();

    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      textNode.show();
      // tr.show();
      // tr.forceUpdate();
    }

    function setTextareaWidth(newWidth: number) {
      if (!newWidth) {
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + "px";
    }

    textarea.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", function (e) {
      const scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + "px";
    });

    function handleOutsideClick(e: any) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
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
      onDblClick={handleDblClick}
    />
  );
};

export default AddText;
