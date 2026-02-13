import type { Prim, Operation, UserData } from "../types";

export const isPrim = (elem: any): elem is Prim =>
  ["number", "string", "boolean"].includes(typeof elem);

export const isObjPath = (elem: any): elem is Array<string> =>
  Array.isArray(elem) && elem.every((i) => typeof i == "string");

export const setAtObjPath = (elem: object, path: Array<string>, val: any) => {
  let cur = elem;
  for (const k in path.slice(-1)) cur = cur[k] ??= {};
  cur[path[path.length - 1]] = val;
};

export const getAtObjPath = (elem: object, path: Array<string>) =>
  path.reduce((acc, k) => acc?.[k], elem);

export const evalFlowOperation = (
  ctx: UserData,
  o: Operation | Prim | Array<string>,
) => {
  if (isPrim(o)) return o;
  if (isObjPath(o)) return getAtObjPath(ctx, o);
  let evalOp = {
    op: o.op,
    ...("val" in o ? { val: evalFlowOperation(ctx, o.val) } : {}),
    lhs: evalFlowOperation(ctx, o.lhs),
    rhs: evalFlowOperation(ctx, o.rhs),
  };
  if (evalOp.op == "if") {
    return evalOp.val ? evalOp.lhs : evalOp.rhs;
  } else if (evalOp.op == "sub") {
    return evalOp.lhs - evalOp.rhs;
  } else if (evalOp.op == "add") {
    return evalOp.lhs + evalOp.rhs;
  } else if (evalOp.op == "lt") {
    return evalOp.lhs < evalOp.rhs;
  } else if (evalOp.op == "gt") {
    return evalOp.lhs > evalOp.rhs;
  } else if (evalOp.op == "eq") {
    return evalOp.lhs == evalOp.rhs;
  }
};
