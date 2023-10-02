export const calculateBoundingBox = (
  rotation: number,
  width: number,
  height: number,
  x: number,
  y: number
) => {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const boxWidth = width * cos + height * sin;
  const boxHeight = width * sin + height * cos;

  return {
    x: x - boxWidth / 2,
    y: y - boxHeight / 2,
    width: boxWidth,
    height: boxHeight,
  };
};
