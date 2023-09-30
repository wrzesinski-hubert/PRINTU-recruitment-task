import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { setInputId, fetchData } from "./store/store";

type projectDescriptionType = {
  id: string;
  project: {
    id: string;
    name: string;
    width: number;
    height: number;
    items: {
      id: string;
      type: "rectangle" | "ellipse";
      color: string;
      rotation: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }[];
  };
};

function App() {
  const data: any = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();
  // Create a local state to track the input value
  const [inputValue, setInputValue] = useState("");
  const handleButtonClick = () => {
    // Trigger fetchData with the local inputValue when the button is clicked
    dispatch(fetchData(inputValue));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the local inputValue state when the input changes
    setInputValue(e.target.value);
  };

  const [projectID, setProjectID] = useState("");
  const [projectDescription, setProjectDescription] = useState<
    projectDescriptionType | undefined
  >(undefined);
  const groupsRef = useRef<SVGAElement[]>([]);
  const [boundingBoxes, setBoundingBoxes] = useState<
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }[]
    | undefined
  >(undefined);
  const assignRef = (index: number) => (element: SVGAElement) => {
    groupsRef.current[index] = element;
  };

  const fetchInitData = async () => {
    const initResponse = await fetch(
      `http://recruitment01.vercel.app/api/init`
    );
    const init = await initResponse.json();
    return init.id;
  };

  const fetchCanvasData = async () => {
    let randomProjectID;
    if (projectID === "") {
      randomProjectID = await fetchInitData();
    }
    const response = await fetch(
      `http://recruitment01.vercel.app/api/project/${
        projectID || randomProjectID
      }`
    );
    const canvas = await response.json();
    setProjectDescription(canvas);
  };

  useEffect(() => {
    if (data) {
      const boxes = data?.project.items.map(
        ({ x, y, width, height, rotation }: any) => {
          // Calculate bounding box dimensions
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
  }, [data]);

  return (
    <div className="App">
      <div className="inputWrapper">
        ID PROJEKTU:
        <input
          type="text"
          placeholder="Enter ID"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleButtonClick}>fetch</button>
      </div>
      <div className="canvasWrapper">
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <svg
            viewBox={`0 0 ${data?.project.width} ${data?.project.height}`}
            height={"100%"}
            width={"100%"}
          >
            {data?.project.items.map(
              (
                { type, x, y, width, height, color, rotation }: any,
                index: any
              ) => {
                const currentBoundingBox =
                  boundingBoxes && boundingBoxes[index];
                switch (type) {
                  case "rectangle":
                    return (
                      <g ref={assignRef(index)}>
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
                        <circle fill="#FFFFFF" cx={x} cy={y} r="4"></circle>
                        <text x={x + 8} y={y} fill="#FFFFFF">
                          <tspan>{rotation}°</tspan>
                        </text>
                        <rect
                          key={index}
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
                  case "ellipse":
                    return (
                      <g ref={assignRef(index)}>
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
                        <circle fill="#FFFFFF" cx={x} cy={y} r="4"></circle>
                        <text x={x + 8} y={y} fill="#FFFFFF">
                          <tspan>{rotation}°</tspan>
                        </text>
                        <rect
                          key={index}
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
                  default:
                    break;
                }
              }
            )}
          </svg>
        </svg>
      </div>
    </div>
  );
}

export default App;
