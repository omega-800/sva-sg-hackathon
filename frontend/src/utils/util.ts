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

export const deepMerge = (target: any, source: any) => {
  if (!source || typeof source !== "object") return target;
  if (!target || typeof target !== "object") return source;

  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      if (!(key in target) || target[key] === undefined || target[key] === null) {
        target[key] = JSON.parse(JSON.stringify(source[key]));
      }
    }
  }
  return target;
};

export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return (
      keysA.length === keysB.length &&
      keysA.every((k) => deepEqual(a[k], b[k]))
    );
  }
  return false;
};

export const evalFlowOperation = (
  ctx: UserData,
  o: Operation | Prim | Array<string>,
): any => {
  if (isPrim(o)) return o;
  if (isObjPath(o)) return getAtObjPath(ctx, o);

  const op = o.op;
  const lhs = evalFlowOperation(ctx, o.lhs);
  const rhs = evalFlowOperation(ctx, o.rhs);

  if (op == "all" || op == "some") {
    const vals = "val" in o ? o.val.map((v) => evalFlowOperation(ctx, v)) : [];
    const res = op == "all" ? vals.every((v) => !!v) : vals.some((v) => !!v);
    return res ? lhs : rhs;
  } else if (op == "if") {
    const val = "val" in o ? evalFlowOperation(ctx, o.val) : undefined;
    return val ? lhs : rhs;
  } else if (op == "sub") {
    return (lhs || 0) - (rhs || 0);
  } else if (op == "add") {
    return (lhs || 0) + (rhs || 0);
  } else if (op == "lt") {
    return (lhs || 0) < (rhs || 0);
  } else if (op == "gt") {
    return (lhs || 0) > (rhs || 0);
  } else if (op == "eq") {
    return deepEqual(lhs, rhs);
  } else if (op == "div") {
    return (lhs || 0) / (rhs || 1);
  } else if (op == "mul") {
    return (lhs || 0) * (rhs || 0);
  }
};
