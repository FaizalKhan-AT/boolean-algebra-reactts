import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Arg } from "./Argument";
import { GlobalState, StateType, actionTypes } from "../../contexts/Globals";
import AndOR from "./AndOR";

const Operations: React.FC<{ root?: boolean }> = ({ root }) => {
  const all: string[] = ["constant", "argument", "and", "or"];
  const constant: string[] = ["false", "true"];
  const [args, setArgs] = useState<Arg[]>([]);
  const { state, dispatch, getArgNames } = useContext(GlobalState) as StateType;
  const [switchOptions, setSwitchOptions] = useState<string>("all");
  const [options, setOptions] = useState<string[]>(all);
  const [value, setValue] = useState<string>("default");
  const [name, setName] = useState<string>("select an operation");
  const [argId, setArgId] = useState<string>("");
  const divRef = useRef<HTMLDivElement>(null);
  const id = useId();
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
      case "or":
        setOptions([]);
        dispatch({
          type: actionTypes.COMPUTE,
          payload: { id, op: switchOptions },
        });
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
          type: root ? actionTypes.SETRESULT : actionTypes.COMPUTE,
          payload: root
            ? target.value === "true"
              ? true
              : false
            : {
                id,
                val: target.value === "true" ? true : false,
              },
        });
        break;
      case "argument":
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
    if (root === true) {
      dispatch({
        type: actionTypes.CLEARRESULT,
        payload: undefined,
      });
    }
  };
  const reComputeArgs = (bool: string) => {
    dispatch({
      type: root ? actionTypes.SETRESULT : actionTypes.COMPUTE,
      payload: root
        ? bool === "true"
          ? true
          : false
        : { id, val: bool === "true" ? true : false },
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
    <div className="d-flex flex-column">
      <div className="col-md-5 d-flex align-items-center gap-1">
        <select
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
      <br />
      <div className="container" ref={divRef}>
        {switchOptions === "and" || switchOptions === "or" ? <AndOR /> : ""}
      </div>
    </div>
  );
};

export default Operations;
