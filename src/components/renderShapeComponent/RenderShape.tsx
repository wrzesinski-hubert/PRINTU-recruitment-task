const RenderShape = ({
  children,
  x,
  y,
  rotation,
  currentBoundingBox,
  index,
}: {
  children: JSX.Element;
  x: number;
  y: number;
  rotation: number;
  currentBoundingBox?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  index: number;
}) => {
  return (
    <g key={index}>
      {children}
      <circle fill="#FFFFFF" cx={x} cy={y} r="4"></circle>
      <text x={x + 8} y={y} fill="#FFFFFF">
        <tspan>{rotation}°</tspan>
      </text>
      <rect
        x={currentBoundingBox?.x}
        y={currentBoundingBox?.y}
        width={currentBoundingBox?.width}
        height={currentBoundingBox?.height}
        fill="none"
        strokeWidth="2"
        strokeOpacity="0.4"
        stroke="#FF0000"
      />
    </g>
  );
};

export default RenderShape;
