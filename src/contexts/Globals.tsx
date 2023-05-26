import React, { ReactNode, createContext, useEffect, useReducer } from "react";
import { Arg } from "../components/inputs/Argument";
export interface StateType {
  state: any;
  compute: () => void;
  dispatch: React.Dispatch<Actions>;
  getArgNames: () => Arg[];
}
export const GlobalState = createContext<StateType | null>(null);
export enum actionTypes {
  SETARGS = "SETARGS",
  SETCONST = "SETCONST",
  SETRESULT = "SETRESULT",
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
    case actionTypes.SETCONST:
      return {
        ...state,
        constant: payload,
      };
    case actionTypes.SETRESULT:
      return {
        ...state,
        result: payload,
      };
    default:
      return state;
  }
};
const initalState = {
  allArgs: {},
  constant: false,
  result: undefined,
};
const Globals: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);
  const compute = () => {
    dispatch({ type: actionTypes.SETRESULT, payload: state.constant });
  };
  const getArgNames = () => {
    let args = [];
    let obj = state.allArgs;
    for (let id in obj) args.push(obj[id]);
    return args;
  };
  return (
    <GlobalState.Provider value={{ state, dispatch, compute, getArgNames }}>
      {children}
    </GlobalState.Provider>
  );
};

export default Globals;
