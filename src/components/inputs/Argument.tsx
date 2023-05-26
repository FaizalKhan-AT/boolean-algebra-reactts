import { FC, useContext, useId, useState } from "react";
import { GlobalState, StateType, actionTypes } from "../../contexts/Globals";
export type Arg = {
  argName: string;
  argVal: boolean;
  Id: string;
};

const Argument: FC = () => {
  const { dispatch } = useContext(GlobalState) as StateType;
  const id = useId();
  const [arg, setArg] = useState<Arg>({ Id: id, argName: "", argVal: false });
  const handleChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    setArg({
      ...arg,
      [target.name]:
        target.name === "argVal"
          ? target.value === "true"
            ? true
            : false
          : target.value,
    });
    dispatch({
      type: actionTypes.SETARGS,
      payload: {
        id,
        [id]: {
          ...arg,
          id,
          [target.name]:
            target.name === "argVal"
              ? target.value === "true"
                ? true
                : false
              : target.value,
        },
      },
    });
  };
  return (
    <>
      <div className="col-3  d-flex align-items-center">
        <input
          onChange={handleChange}
          value={arg.argName}
          className="form-control"
          type="text"
          name="argName"
        />
        <select
          value={arg.argVal + ""}
          onChange={handleChange}
          className="form-select"
          name="argVal"
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </div>
    </>
  );
};

export default Argument;
