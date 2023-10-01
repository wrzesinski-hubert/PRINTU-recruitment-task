export type projectDescriptionType = {
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
