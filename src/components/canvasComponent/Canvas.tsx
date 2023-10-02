import { useEffect, useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchData } from "../../store/store";
import { calculateBoundingBox } from "../../utils/utils";
import RenderShape from "../renderShapeComponent/RenderShape";

function Canvas() {
  const dispatch = useDispatch();
  const projectDescription = useSelector((state: RootState) => state.data);
  const error = useSelector((state: RootState) => state.error);
  const invalidType = useSelector((state: RootState) => state.invalidType);
  const loading = useSelector((state: RootState) => state.loading);

  const [projectID, setProjectID] = useState<string>("");
  const [boundingBoxes, setBoundingBoxes] = useState<
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }[]
  >([]);

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
          return calculateBoundingBox(rotation, width, height, x, y);
        }
      );
      setBoundingBoxes(boxes);
    }
  }, [projectDescription]);

  return (
    <div className="CanvasWrapper">
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
                  const currentBoundingBox = boundingBoxes[index];
                  const commonProps = {
                    x,
                    y,
                    rotation,
                    currentBoundingBox,
                    index,
                    key: index,
                  };
                  switch (type) {
                    case "rectangle":
                      return (
                        <RenderShape {...commonProps}>
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
                        <RenderShape {...commonProps}>
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

export default Canvas;
