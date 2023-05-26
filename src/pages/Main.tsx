import React, { FC, useContext, useEffect, useState } from "react";
import Argument from "../components/inputs/Argument";
import Operations from "../components/inputs/Operations";
import { GlobalState, StateType } from "../contexts/Globals";

const Main: FC = () => {
  const [argNodes, setArgNodes] = useState<React.ReactNode[]>([]);
  const { state } = useContext(GlobalState) as StateType;
  const handleAddArg = () => {
    setArgNodes([...argNodes, <Argument />]);
  };

  return (
    <div className="container row w-100 my-5 mx-4">
      <div className="d-flex flex-column gap-2">
        {argNodes && argNodes.length > 0
          ? argNodes.map((el, idx) => {
              return <React.Fragment key={idx * idx}>{el}</React.Fragment>;
            })
          : ""}
        <button
          onClick={handleAddArg}
          className="btn fw-bold col-md-2 btn-success"
        >
          + add arg
        </button>
      </div>
      <div className="d-flex flex-column gap-2 my-2">
        <Operations root />
      </div>
      <div>Result : {state.result + ""}</div>
    </div>
  );
};

export default Main;
