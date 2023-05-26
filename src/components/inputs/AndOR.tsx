import { FC, Fragment, ReactNode, useState } from "react";
import Operations from "./Operations";

const AndOR: FC = () => {
  const [opNodes, setOpNodes] = useState<ReactNode[]>([]);
  const handleAdd = () => setOpNodes([...opNodes, <Operations />]);
  return (
    <div className="mx-3">
      <Operations />
      <Operations />
      {opNodes && opNodes.length > 0
        ? opNodes.map((el, idx) => {
            return <Fragment key={idx * idx}>{el}</Fragment>;
          })
        : ""}
      <button
        onClick={handleAdd}
        className="btn-success mb-3 btn d-flex align-items-center justify-content-center"
      >
        + op
      </button>
    </div>
  );
};

export default AndOR;
