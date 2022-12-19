import Konva from "konva";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import URLImage from "../components/URLImage";
import TransformerComponent from "../components/TransformerComponent";
import AddText from "../components/AddText";
import { Transformer } from "konva/lib/shapes/Transformer";

import { ImageProps, TextProps } from "../interfaces/art-board";

const ArtBoard = () => {
  const borderSize = 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [texts, setTexts] = useState<TextProps[]>([]);
  const [id, setId] = useState(0);
  const [selectedShapeName, setSelectedShapeName] = useState("");
  const [currentTransformer, setCurrentTransformer] = useState<Transformer>();
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth - 2 * borderSize);
      setContainerHeight(containerRef.current.offsetHeight - 2 * borderSize);
    }
  });

  function handleStageClick(e: {
    target: { name: () => React.SetStateAction<string> };
  }) {
    setSelectedShapeName(e.target.name());
  }

  function handleTextDblClick(e: { target: any }) {
    const canvasContainer = document.getElementById("canvas-container");
    const textNode = e.target;
    const textPosition = textNode.absolutePosition();
    const areaPosition = {
      x: canvasContainer!.offsetLeft + textPosition.x + borderSize,
      y: canvasContainer!.offsetTop + textPosition.y + borderSize - 1,
    };

    currentTransformer!.hide();
    textNode.hide();
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
      currentTransformer!.show();
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
      if (e.key === "Enter" && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      if (e.key === "Escape") {
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
    <>
      <div className="mb-3">
        <input
          className="form-control"
          id="upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            e.preventDefault();
            const URL = window.webkitURL || window.URL;
            const url = URL.createObjectURL(e.target.files![0]);
            const imgType = e.target.files![0].type;
            const img = new window.Image();
            img.src = url;

            stageRef.current!.setPointersPositions(e);
            setImages(
              images.concat([
                {
                  ...stageRef.current!.getPointerPosition(),
                  id: id,
                  src: url,
                  imgType: imgType,
                },
              ])
            );
            setId(id + 1);
          }}
        />
        <div className="input-group mb-3 pt-2">
          <input
            type="text"
            id="form-input-text"
            className="form-control"
            placeholder="Add text..."
            onChange={(e) => {
              e.preventDefault();
              setContent(e.target.value);
            }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              stageRef.current!.setPointersPositions(e);
              setTexts(
                texts.concat([
                  {
                    ...stageRef.current!.getPointerPosition(),
                    id: id,
                    content: content,
                    textDbClick: (textEvent: any) => {
                      handleTextDblClick(textEvent);
                    },
                  },
                ])
              );
              setId(id + 1);
              (document.getElementById(
                "form-input-text"
              ) as HTMLInputElement)!.value = "";
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        style={{ border: `${borderSize}px solid grey` }}
        className={"w-100 flex-grow-1"}
        id={"canvas-container"}
        ref={containerRef}
      >
        <Stage
          width={containerWidth}
          height={containerHeight}
          onClick={handleStageClick}
          onTap={handleStageClick}
          ref={stageRef}
        >
          <Layer>
            {images.map((image) => {
              return (
                <URLImage
                  src={image.src}
                  id={image.id}
                  imgType={image.imgType}
                  key={image.id}
                />
              );
            })}
            {texts.map((text) => {
              return (
                <AddText
                  id={text.id}
                  content={text.content}
                  key={text.id}
                  textDbClick={text.textDbClick}
                />
              );
            })}
            <TransformerComponent
              selectedShapeName={selectedShapeName}
              getCurrentTr={(tr: Transformer) => {
                setCurrentTransformer(tr);
              }}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default ArtBoard;
