import Konva from "konva";
import { useRef, useEffect } from "react";
import { Transformer } from "react-konva";

interface TextBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface TransformerProps {
  selectedShapeName: string;
  getCurrentTr: Function;
}

const TransformerComponent = (props: TransformerProps) => {
  const TEXT_REGEX = /text/;
  const trRef = useRef<Konva.Transformer>(null);

  function checkNode() {
    const stage = trRef.current!.getStage();
    const { selectedShapeName } = props;
    const selectedNode = stage!.findOne("." + selectedShapeName);

    if (TEXT_REGEX.test(selectedShapeName)) {
      trRef.current!.setAttrs({
        enabledAnchors: ["middle-left", "middle-right"],
        boundBoxFunc: function (oldBox: TextBoxProps, newBox: TextBoxProps) {
          newBox.width = Math.max(100, newBox.width);
          return newBox;
        },
      });
    } else {
      trRef.current!.setAttrs({
        enabledAnchors: null,
        boundBoxFunc: null,
      });
    }

    if (selectedNode) {
      trRef.current!.nodes([selectedNode]);
      props.getCurrentTr(trRef.current);
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

export default TransformerComponent;
