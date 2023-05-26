import React, { useContext, useEffect, useRef, useState } from "react";
import { Arg } from "./Argument";
import { GlobalState, StateType, actionTypes } from "../../contexts/Globals";

const Operations: React.FC = () => {
  const all: string[] = ["constant", "argument", "and", "or"];
  const constant: string[] = ["false", "true"];
  const [args, setArgs] = useState<Arg[]>([]);
  const { state, dispatch, compute, getArgNames } = useContext(
    GlobalState
  ) as StateType;
  const [switchOptions, setSwitchOptions] = useState<string>("all");
  const [options, setOptions] = useState<string[]>(all);
  const [value, setValue] = useState<string>("default");
  const [name, setName] = useState<string>("select an operation");
  const [argId, setArgId] = useState<string>("");
  const selRef = useRef<HTMLSelectElement>(null);
  const renderOptions = () => {
    switch (switchOptions) {
      case "all":
        setOptions(all);
        break;
      case "constant":
        setOptions(constant);
        break;
      case "argument":
        setOptions([]);
        break;
      case "and":
        setOptions([]);
        break;
      case "or":
        setOptions([]);
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    if (switchOptions === "all") {
      setSwitchOptions(target.value);
      if (target.value === "and" || target.value === "or")
        return setName(target.value);
      setName(`select a ${target.value}`);
    } else {
      setValue(target.value);
    }
    switch (switchOptions) {
      case "constant":
        dispatch({
          type: actionTypes.SETRESULT,
          payload: target.value === "true" ? true : false,
        });
        break;
      case "argument":
        console.log(target.value);

        setArgId(target.value.split("-")[2]);
        reComputeArgs(target.value.split("-")[1]);
        break;
      default:
        break;
    }
  };
  const handleRemove = () => {
    setSwitchOptions("all");
    setValue("default");
    setName("select an operation");
    setOptions(all);
  };
  const reComputeArgs = (bool: string) => {
    dispatch({
      type: actionTypes.SETRESULT,
      payload: bool === "true" ? true : false,
    });
  };
  useEffect(() => {
    renderOptions();
  }, [switchOptions]);
  useEffect(() => {
    let nameObj = getArgNames();
    setArgs(nameObj);
    if (nameObj && argId) {
      const [obj] = nameObj.filter((el) => el.Id === argId);
      reComputeArgs(obj.argVal + "");
    }
  }, [state.allArgs]);

  return (
    <div className="col-3 d-flex align-items-center gap-1">
      <select
        ref={selRef}
        value={value}
        onChange={handleChange}
        name="operations"
        className="form-select"
      >
        <option value="default" disabled>
          {name}
        </option>
        {switchOptions === "argument"
          ? args && args.length > 0
            ? args.map((op, idx) => {
                return (
                  <option
                    value={op.argName + "-" + op.argVal + "-" + op.Id}
                    key={op.toString() + idx}
                  >
                    {op.argName}
                  </option>
                );
              })
            : ""
          : options && options.length > 0
          ? options.map((op, idx) => {
              return (
                <option value={op} key={op + idx}>
                  {op}
                </option>
              );
            })
          : ""}
      </select>
      <button
        onClick={handleRemove}
        className="btn btn-danger  d-flex align-items-center justify-content-center"
      >
        X
      </button>
    </div>
  );
};

export default Operations;
