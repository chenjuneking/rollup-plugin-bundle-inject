import { InjectTag } from "../constants";
import { OutputAsset, OutputBundle, OutputChunk } from "../types/rollup";

export const isExist = (type: string, code: string): boolean => {
  switch (type) {
    case "inject:css": {
      return InjectTag.CSS.test(code);
    }
    case "inject:js": {
      return InjectTag.JS.test(code);
    }
    case "head": {
      return InjectTag.HEAD_TAG.test(code);
    }
    case "body": {
      return InjectTag.BODY_TAG.test(code);
    }
    default: {
      return false;
    }
  }
};

export const getListFromBundle = (bundle: OutputBundle): BundleList => {
  const cssList: Array<string | Uint8Array> = [];
  const jsList: Array<string> = [];
  for (let key in bundle) {
    let value: OutputAsset | OutputChunk = bundle[key];
    if (/\.css$/.test(key) && "source" in value) {
      cssList.push(value.source);
    } else if (/\.js$/.test(key) && "code" in value) {
      jsList.push(value.code);
    }
  }
  return { cssList, jsList };
};
