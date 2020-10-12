import React from "react";
import ImageComponent from "./ImageComponent";

export const mediaBlockRenderer = (block, { getEditorState }) => {
  if (block.getType() === "atomic") {
    const contentState = getEditorState().getCurrentContent();
    const entity = contentState.getEntity(block.getEntityAt(0));
    const type = entity.getType().toLowerCase();

    if (type === "image") {
      return {
        component: Image,
        editable: true,
      };
    } else if (type === "video") {
      return {
        component: Video,
        editable: true,
      };
    } else if (type === "audio") {
      return {
        component: Audio,
        editable: true,
      };
    }
  }
  return null;
};

const Image = ({ block, contentState }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, width, height } = entity.getData();
  const type = entity.getType().toLowerCase();
  const data = entity.getData();
  const dataCaption = data["data-caption"];
  const dataSource = data["data-source"];
  const dataPopup = data["data-popup"];

  if (!!src) {
    return (
      <ImageComponent
        src={src}
        width={width}
        height={height}
        data-caption={dataCaption}
        data-source={dataSource}
        data-popup={dataPopup}
      />
    );
  }
};

const Video = ({ block, contentState }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, width, height } = entity.getData();

  if (!!src) {
    return <iframe src={src} width={width} height={height} />;
  }
};

const Audio = ({ block, contentState }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();

  if (!!src) {
    return <audio controls src={src} />;
  }
};
