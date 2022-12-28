import { ChangeEvent } from "react";
import { ImageProps, TextProps } from "../interfaces/art-board";
import { Text } from "konva/lib/shapes/Text";
import { Transformer } from "konva/lib/shapes/Transformer";
import { Image } from "konva/lib/shapes/Image";

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

export function handleFontSize(
  e: ChangeEvent<HTMLInputElement>,
  selectedTextNode: TextProps,
  texts: TextProps[]
) {
  const items = texts.slice();
  const item = texts.find((i) => i.id === selectedTextNode.id);
  const index = texts.indexOf(item as TextProps);
  // update item position
  items[index] = {
    ...item!,
    size: Number(e.target.value),
  };
  return items;
}

export function handleFontFamily(
  e: ChangeEvent<HTMLSelectElement>,
  selectedTextNode: TextProps,
  texts: TextProps[]
) {
  const items = texts.slice();
  const item = texts.find((i) => i.id === selectedTextNode.id);
  const index = texts.indexOf(item as TextProps);
  // update item position
  items[index] = {
    ...item!,
    fontFamily: e.target.value,
  };
  return items;
}

export function handleTextColor(
  e: ChangeEvent<HTMLInputElement>,
  selectedTextNode: TextProps,
  texts: TextProps[]
) {
  const items = texts.slice();
  const item = texts.find((i) => i.id === selectedTextNode.id);
  const index = texts.indexOf(item as TextProps);
  // update item position
  items[index] = {
    ...item!,
    color: e.target.value,
  };
  return items;
}

export function handleTextDragEnd(e: { target: Text }, texts: TextProps[]) {
  const name = e.target.name();
  const items = texts.slice();
  const item = texts.find((i) => `text-${i.id}` === name);
  const index = texts.indexOf(item as TextProps);
  // update item position
  items[index] = {
    ...item!,
    x: e.target.x(),
    y: e.target.y(),
  };
  return items;
}
