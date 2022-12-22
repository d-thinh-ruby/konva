import { ChangeEvent } from "react";
import { ImageProps, TextProps } from "../interfaces/art-board";
import { Text } from "konva/lib/shapes/Text";
import { Transformer } from "konva/lib/shapes/Transformer";
import { Image } from "konva/lib/shapes/Image";

export function handleTextDblClick(
  e: { target: Text },
  currentTransformer: Transformer,
  borderSize: number
) {
  const canvasContainer = document.getElementById("canvas-container");
  const textNode = e.target;
  const textPosition = textNode.absolutePosition();
  const areaPosition = {
    x: canvasContainer!.offsetLeft + textPosition.x + borderSize,
    y: canvasContainer!.offsetTop + textPosition.y + borderSize - 1,
  };

  currentTransformer.hide();
  textNode.hide();
  let textarea = document.createElement("textarea");
  document.body.appendChild(textarea);

  textarea.value = textNode.text();
  textarea.style.position = "absolute";
  textarea.style.top = areaPosition.y + "px";
  textarea.style.left = areaPosition.x + "px";
  textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
  textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + "px";
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
    currentTransformer.show();
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
    textarea.style.height = textarea.scrollHeight + textNode.fontSize() + "px";
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

export function handleImageDragStart(
  e: { target: Image },
  images: ImageProps[]
) {
  const name = e.target.name();
  const items = images.slice();
  const item = items.find((i) => `image-${i.id}` === name);
  const index = items.indexOf(item as ImageProps);
  // remove from the list:
  items.splice(index, 1);
  // add to the top
  items.push(item as ImageProps);
  return items;
}

export function handleImageDragEnd(e: { target: Image }, images: ImageProps[]) {
  const name = e.target.name();
  const items = images.slice();
  const item = images.find((i) => `image-${i.id}` === name);
  const index = images.indexOf(item as ImageProps);
  // update item position
  items[index] = {
    ...item!,
    x: e.target.x(),
    y: e.target.y(),
  };
  return items;
}

export function qqq(
  e: ChangeEvent<HTMLInputElement>,
  selectedTextName: String,
  texts: TextProps[]
) {
  const items = texts.slice();
  const item = texts.find((i) => `text-${i.id}` === selectedTextName);
  const index = texts.indexOf(item as TextProps);
  // update item position
  items[index] = {
    ...item!,
    size: Number(e.target.value),
  };
  return items;
}
