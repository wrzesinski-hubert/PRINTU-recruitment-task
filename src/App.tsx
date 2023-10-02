import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { fetchData } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const projectDescription = useSelector((state: RootState) => state.data);
  const error = useSelector((state: RootState) => state.error);
  const invalidType = useSelector((state: RootState) => state.invalidType);
  const loading = useSelector((state: RootState) => state.loading);

  const [projectID, setProjectID] = useState("");
  const [boundingBoxes, setBoundingBoxes] = useState<
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }[]
    | undefined
  >(undefined);

  const handleButtonClick = () => {
    dispatch(fetchData(projectID));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectID(e.target.value);
  };

  useEffect(() => {
    if (projectDescription) {
      const boxes = projectDescription.project.items.map(
        ({ x, y, width, height, rotation }) => {
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
        }
      );
      setBoundingBoxes(boxes);
    }
  }, [projectDescription]);

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

  return (
    <div className="App">
      <div className="inputWrapper">
        Project ID:
        <input
          type="text"
          placeholder="Enter ID or leave empty"
          value={projectID}
          onChange={handleInputChange}
        />
        <button onClick={handleButtonClick}>Fetch</button>
      </div>
      <div className="canvasWrapper">
        {loading ? (
          "⌛Loading⌛"
        ) : projectDescription && !invalidType && !error ? (
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <svg
              viewBox={`0 0 ${projectDescription.project.width} ${projectDescription.project.height}`}
              height={"100%"}
              width={"100%"}
            >
              {projectDescription.project.items.map(
                ({ type, x, y, width, height, color, rotation }, index) => {
                  const currentBoundingBox =
                    boundingBoxes && boundingBoxes[index];
                  switch (type) {
                    case "rectangle":
                      return (
                        <RenderShape
                          x={x}
                          y={y}
                          rotation={rotation}
                          currentBoundingBox={currentBoundingBox}
                          index={index}
                        >
                          <rect
                            transform={`
                          translate(${x}, ${y}) 
                          rotate(${rotation}) 
                          translate(-${width / 2}, -${height / 2})`}
                            width={width}
                            height={height}
                            style={{
                              fill: color,
                            }}
                          />
                        </RenderShape>
                      );
                    case "ellipse":
                      return (
                        <RenderShape
                          x={x}
                          y={y}
                          rotation={rotation}
                          currentBoundingBox={currentBoundingBox}
                          index={index}
                        >
                          <ellipse
                            transform={`
                          translate(${x}, ${y}) 
                          rotate(${rotation}) 
                          translate(-${width / 2}, -${height / 2})
                          `}
                            cx={width / 2}
                            cy={height / 2}
                            rx={width / 2}
                            ry={height / 2}
                            style={{
                              fill: color,
                            }}
                          />
                        </RenderShape>
                      );
                    default:
                      break;
                  }
                }
              )}
            </svg>
          </svg>
        ) : error ? (
          <>ERROR</>
        ) : invalidType ? (
          <>INVALID DATA TYPE</>
        ) : (
          <>EMPTY</>
        )}
      </div>
    </div>
  );
}

export default App;
