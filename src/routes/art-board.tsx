import Konva from "konva";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";
import "gifler";
import "../plugins/crop-image";

interface ImageProps {
  src: string;
  imgType: string;
  id: number;
}

interface AnimatorProps {
  animateInCanvas(e: HTMLCanvasElement): any;
  stop(): any;
  onDrawFrame(
    ctx: CanvasRenderingContext2D,
    frame: { x: number; y: number; buffer: HTMLCanvasElement }
  ): any;
}

declare global {
  interface Window {
    gifler: any;
  }
}

const URLImage = (props: ImageProps) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
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

  function handleDragEnd(e: {
    target: {
      x: () => React.SetStateAction<number>;
      y: () => React.SetStateAction<number>;
    };
  }) {
    setX(e.target.x());
    setY(e.target.y());
  }

  function handleOnDbClick(e: { target: any }) {
    e.target.enableCropOnDblClick();
  }

  return (
    <Image
      name={"image-" + props.id}
      image={props.imgType === "image/gif" ? canvas : img}
      ref={imageRef}
      x={x}
      y={y}
      offsetX={0}
      offsetY={0}
      draggable
      onDragEnd={handleDragEnd}
      onDblClick={handleOnDbClick}
    />
  );
};

const TransformerComponent = (props: { selectedShapeName: string }) => {
  const trRef = useRef<Konva.Transformer>(null);

  function checkNode() {
    const stage = trRef.current!.getStage();
    const { selectedShapeName } = props;
    const selectedNode = stage!.findOne("." + selectedShapeName);

    if (selectedNode) {
      trRef.current!.nodes([selectedNode]);
    } else {
      trRef.current!.detach();
    }
    trRef.current!.getLayer()!.batchDraw();
  }

  useEffect(() => {
    checkNode();
  });

  return <Transformer ref={trRef} />;
};

const ArtBoard = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [id, setId] = useState(0);
  const [selectedShapeName, setSelectedShapeName] = useState("");

  function handleStageClick(e: {
    target: { name: () => React.SetStateAction<string> };
  }) {
    setSelectedShapeName(e.target.name());
  }

  return (
    <>
      <input
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
      <Stage
        width={1280}
        height={700}
        style={{ border: "5px solid grey" }}
        onClick={handleStageClick}
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
          <TransformerComponent selectedShapeName={selectedShapeName} />
        </Layer>
      </Stage>
    </>
  );
};

export default ArtBoard;
