import type { Prim, Operation, UserData } from "../types";

export const isPrim = (elem: any): elem is Prim =>
  ["number", "string", "boolean"].includes(typeof elem);

export const isObjPath = (elem: any): elem is Array<string> =>
  Array.isArray(elem) && elem.every((i) => typeof i == "string");

export const setAtObjPath = (elem: any, path: Array<string>, val: any) => {
  let cur = elem;
  for (let i = 0; i < path.length - 1; i++) {
    let k = path[i];
    cur[k] ??= {};
    cur = cur[k];
  }
  cur[path[path.length - 1]] = val;
};

export const getAtObjPath = (elem: any, path: Array<string>) =>
  path.reduce((acc, k) => acc?.[k], elem);

export const evalFlowOperation = (
  ctx: UserData,
  o: Operation | Prim | Array<string>,
): any => {
  if (isPrim(o)) return o;
  if (isObjPath(o)) return getAtObjPath(ctx, o);

  // We need to handle the union type Operation safely
  // define evalOp with the evaluated children
  const op = o.op;
  const lhs = evalFlowOperation(ctx, o.lhs);
  const rhs = evalFlowOperation(ctx, o.rhs);
  const val = "val" in o ? evalFlowOperation(ctx, o.val) : undefined;

  if (op == "if") {
    return val ? lhs : rhs;
  } else if (op == "sub") {
    return lhs - rhs;
  } else if (op == "add") {
    return lhs + rhs;
  } else if (op == "lt") {
    return lhs < rhs;
  } else if (op == "gt") {
    return lhs > rhs;
  } else if (op == "eq") {
    return lhs == rhs;
  }
};
