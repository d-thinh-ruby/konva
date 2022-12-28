import Konva from "konva";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { Transformer } from "konva/lib/shapes/Transformer";
import { Text } from "konva/lib/shapes/Text";
import { Image } from "konva/lib/shapes/Image";

import URLImage from "../components/URLImage";
import TransformerComponent from "../components/TransformerComponent";
import AddText from "../components/AddText";

import * as Funct from "../functions/handle-event";
import { loadFonts } from "../functions/load-fonts";

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
  const [selectedTextNode, setSelectedTextNode] = useState<TextProps>();

  useEffect(() => {
    loadFonts();
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth - 2 * borderSize);
      setContainerHeight(containerRef.current.offsetHeight - 2 * borderSize);
    }
  }, []);

  function handleStageClick(e: {
    target: { name: () => React.SetStateAction<string> };
  }) {
    if (e.target.constructor.name === "Text") {
      setSelectedTextNode(
        texts.find((i) => `text-${i.id}` === e.target.name())
      );
    } else {
      setSelectedTextNode(undefined);
    }
    setSelectedShapeName(e.target.name());
  }

  function handleTextDblClick(e: { target: Text }) {
    const canvasContainer = document.getElementById("canvas-container");
    const textNode = e.target;
    const textPosition = textNode.absolutePosition();
    const areaPosition = {
      x: canvasContainer!.offsetLeft + textPosition.x + borderSize,
      y: canvasContainer!.offsetTop + textPosition.y + borderSize - 1,
    };

    const name = e.target.name();
    const items = texts.slice();
    const item = texts.find((i) => `text-${i.id}` === name);
    const index = texts.indexOf(item as TextProps);

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
    textarea.style.lineHeight = `${textNode.lineHeight()}`;
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
      items[index] = {
        ...item!,
        content: textNode.text(),
      };
      setTexts(items);
    }

    function setTextareaWidth(newWidth: number) {
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

            setImages(
              images.concat([
                {
                  ...stageRef.current!.getPosition(),
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
              if (content !== "") {
                setTexts(
                  texts.concat([
                    {
                      ...stageRef.current!.getPosition(),
                      id: id,
                      content: content,
                      size: 20,
                      fontFamily: "Arial",
                      color: "black",
                    },
                  ])
                );
                setId(id + 1);
                (document.getElementById(
                  "form-input-text"
                ) as HTMLInputElement)!.value = "";
                setContent("");
              }
            }}
          >
            Submit
          </button>
        </div>
        <div className={`${selectedTextNode ? "" : "d-none"}`}>
          <div className="row">
            <label htmlFor="sizeRange" className="col-sm-2">
              Size
            </label>
            <div className="col-sm-10">
              <input
                type="range"
                className="form-range"
                min="5"
                max="50"
                id="sizeRange"
                onChange={(e) => {
                  if (selectedTextNode) {
                    setTexts(Funct.handleFontSize(e, selectedTextNode, texts));
                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <label htmlFor="fontSelect" className="col-sm-2">
              Font Family
            </label>
            <div className="col-sm-10">
              <select
                className="form-select"
                id="fontSelect"
                onChange={(e) => {
                  if (selectedTextNode) {
                    setTexts(
                      Funct.handleFontFamily(e, selectedTextNode, texts)
                    );
                  }
                }}
              >
                <option value="Arial">Arial</option>
                <option
                  value="Shadows Into Light"
                  style={{ fontFamily: "Shadows Into Light" }}
                >
                  Shadows Into Light
                </option>
                <option value="Montserrat" style={{ fontFamily: "Montserrat" }}>
                  Montserrat
                </option>
                <option
                  value="Rubik Gemstones"
                  style={{ fontFamily: "Rubik Gemstones" }}
                >
                  Rubik Gemstones
                </option>
                <option value="Sevillana" style={{ fontFamily: "Sevillana" }}>
                  Sevillana
                </option>
                <option
                  value="Rubik 80s Fade"
                  style={{ fontFamily: "Rubik 80s Fade" }}
                >
                  Rubik 80s Fade
                </option>
                <option
                  value="Rubik Puddles"
                  style={{ fontFamily: "Rubik Puddles" }}
                >
                  Rubik Puddles
                </option>
              </select>
            </div>
          </div>
          <div className="row">
            <label htmlFor="colorPicker" className="col-sm-2">
              Color Picker
            </label>
            <div className="col-sm-10">
              <input
                type="color"
                className="form-control form-control-color"
                id="exampleColorInput"
                title="Choose your color"
                onChange={(e) => {
                  if (selectedTextNode) {
                    setTexts(Funct.handleTextColor(e, selectedTextNode, texts));
                  }
                }}
              />
            </div>
          </div>
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
                  x={image.x}
                  y={image.y}
                  src={image.src}
                  id={image.id}
                  imgType={image.imgType}
                  key={image.id}
                  imgDragStart={(imgEvent: { target: Image }) => {
                    setImages(Funct.handleImageDragStart(imgEvent, images));
                  }}
                  imgDragEnd={(imgEvent: { target: Image }) => {
                    setImages(Funct.handleImageDragEnd(imgEvent, images));
                  }}
                />
              );
            })}
            {texts.map((text) => {
              return (
                <AddText
                  id={text.id}
                  x={text.x}
                  y={text.y}
                  content={text.content}
                  size={text.size}
                  fontFamily={text.fontFamily}
                  color={text.color}
                  key={text.id}
                  textDragEnd={(textEvent: { target: Text }) => {
                    setTexts(Funct.handleTextDragEnd(textEvent, texts));
                  }}
                  textDbClick={(textEvent: { target: Text }) => {
                    handleTextDblClick(textEvent);
                  }}
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
