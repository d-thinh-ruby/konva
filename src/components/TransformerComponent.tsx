import Konva from "konva";
import { useRef, useEffect } from "react";
import { Transformer } from "react-konva";

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

export default TransformerComponent;
