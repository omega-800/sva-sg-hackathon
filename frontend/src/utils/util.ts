import type { Prim, Operation, UserData } from "../types";

export const isPrim = (elem: any): elem is Prim =>
  ["number", "string", "boolean"].includes(typeof elem);

export const isObjPath = (elem: any): elem is Array<string> =>
  Array.isArray(elem) && elem.every((i) => typeof i == "string");

export const setAtObjPath = (
  elem: any,
  path: Array<string>,
  val: any,
  op: "set" | "add" | "push",
) => {
  let cur = elem;
  for (let i = 0; i < path.length - 1; i++) {
    let k = path[i];
    cur[k] ??= {};
    cur = cur[k];
  }
  if (op == "set") {
    cur[path[path.length - 1]] = val;
  } else if (op == "add") {
    cur[path[path.length - 1]] ??= 0;
    cur[path[path.length - 1]] += val;
  } else if (op == "push") {
    cur[path[path.length - 1]] ??= [];
    cur[path[path.length - 1]].push(val);
  }
};

export const getAtObjPath = (elem: any, path: Array<string>) =>
  path.reduce((acc, k) => acc?.[k], elem);

export const deepMerge = <T extends { [key: string]: any }>(a: T, b: T) => {
  for (const key of b.keys()) {
    if (!!a?.[key] && typeof a[key] == "object") {
      deepMerge(a[key], b[key]);
      continue;
    }
    if (key in a) continue;
    a[key] = b[key];
  }
  return a;
};

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

  if (op == "all" || op == "some") {
    const val = "val" in o ? o.val.map((v) => evalFlowOperation(ctx, v)) : [];
    const res = op == "all" ? val.every((v) => v) : val.some((v) => v);
    return res ? lhs : rhs;
  } else if (op == "if") {
    const val = "val" in o ? evalFlowOperation(ctx, o.val) : undefined;
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
  } else if (op == "div") {
    return lhs / rhs;
  } else if (op == "mul") {
    return lhs * rhs;
  }
};
