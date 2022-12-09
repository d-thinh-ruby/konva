import Konva from "konva";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import URLImage from "../components/URLImage";
import TransformerComponent from "../components/TransformerComponent";
import AddText from "../components/AddText";

interface ImageProps {
  src: string;
  imgType: string;
  id: number;
}

interface TextProps {
  id: number;
  content: string;
}

declare global {
  interface Window {
    gifler: any;
  }
}

const ArtBoard = () => {
  const borderSize = 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [texts, setTexts] = useState<TextProps[]>([]);
  const [id, setId] = useState(0);
  const [selectedShapeName, setSelectedShapeName] = useState("");
  const [editNode, setEditNode] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth - 2 * borderSize);
    }
  });

  function handleStageClick(e: {
    target: { name: () => React.SetStateAction<string> };
  }) {
    setSelectedShapeName(e.target.name());
  }

  function handleStageDblClick() {
    setEditNode(!editNode);
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
                  },
                ])
              );
              setId(id + 1);
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
          height={containerRef.current?.offsetHeight}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onDblClick={handleStageDblClick}
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
                <AddText id={text.id} content={text.content} key={text.id} />
              );
            })}
            <TransformerComponent
              selectedShapeName={selectedShapeName}
              editNode={editNode}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default ArtBoard;
