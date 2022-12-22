import Konva from "konva";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import URLImage from "../components/URLImage";
import TransformerComponent from "../components/TransformerComponent";
import AddText from "../components/AddText";
import { Transformer } from "konva/lib/shapes/Transformer";
import { Text } from "konva/lib/shapes/Text";
import { Image } from "konva/lib/shapes/Image";
import * as Funct from "../functions/handle-event";

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
              setTexts(
                texts.concat([
                  {
                    ...stageRef.current!.getPosition(),
                    id: id,
                    content: content,
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
                  x={image.x}
                  y={image.y}
                  src={image.src}
                  id={image.id}
                  imgType={image.imgType}
                  key={image.id}
                  imgDragStart={(imgEvent: { target: Image }) => {
                    setImages(Funct.handleImageDragStart(imgEvent, images));
                  }}
                  imgDragEnd={(e: { target: Image }) => {
                    setImages(Funct.handleImageDragEnd(e, images));
                  }}
                />
              );
            })}
            {texts.map((text) => {
              return (
                <AddText
                  id={text.id}
                  content={text.content}
                  key={text.id}
                  textDbClick={(textEvent: { target: Text }) => {
                    Funct.handleTextDblClick(
                      textEvent,
                      currentTransformer!,
                      borderSize
                    );
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
