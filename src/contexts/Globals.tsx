import React, { ReactNode, createContext, useEffect, useReducer } from "react";
import { Arg } from "../components/inputs/Argument";
export interface StateType {
  state: any;
  dispatch: React.Dispatch<Actions>;
  getArgNames: () => Arg[];
}
export const GlobalState = createContext<StateType | null>(null);
export enum actionTypes {
  SETARGS = "SETARGS",
  SETEXP = "  SETEXP",
  SETRESULT = "SETRESULT",
  DELETEEXP = "DELETEEXP",
  CLEARRESULT = "CLEARRESULT",
  COMPUTE = "COMPUTE",
  CLEARALL = "CLEARALL",
}
interface Actions {
  type: actionTypes;
  payload: any;
}
const reducer = (state: any, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SETARGS:
      return {
        ...state,
        allArgs: { ...state.allArgs, [payload.id]: payload[payload.id] },
      };
    case actionTypes.SETEXP:
      return {
        ...state,
        exp: { ...state.exp, [payload.id]: payload },
      };
    case actionTypes.DELETEEXP:
      delete state.exp[payload];
      return {
        ...state,
      };
    case actionTypes.COMPUTE:
      console.log(
        payload,
        `${state.temp}  ${
          state.prevOp
            ? state.prevOp
            : payload.op === "and"
            ? "&&"
            : payload.op === "or"
            ? "||"
            : ""
        } ${payload.val}`
      );

      const res = eval(
        `${state.temp}  ${
          state.prevOp ? state.prevOp : payload.op === "and" ? "&&" : "||"
        } ${payload.val}`
      );
      return {
        ...state,
        temp: res ? res : payload.val,
        result: res,
        prevOp: payload.op
          ? payload.op === "and"
            ? "&&"
            : "||"
          : state.prevOp,
      };
    case actionTypes.SETRESULT:
      return {
        ...state,
        result: payload,
        temp: payload,
      };
    case actionTypes.CLEARALL:
      return {
        ...state,
        result: payload,
      };
    case actionTypes.CLEARRESULT:
      return {
        ...state,
        result: payload,
        temp: payload,
      };
    default:
      return state;
  }
};
const initalState = {
  allArgs: {},
  exp: {},
  temp: undefined,
  result: undefined,
  prevOp: undefined,
};
const Globals: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  const getArgNames = () => {
    let args = [];
    let obj = state.allArgs;
    for (let id in obj) args.push(obj[id]);
    return args;
  };

  return (
    <GlobalState.Provider value={{ state, dispatch, getArgNames }}>
      {children}
    </GlobalState.Provider>
  );
};

export default Globals;
