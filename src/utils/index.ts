import { InjectTag } from "../constants";

interface BundleList {
  cssList: Array<string>;
  jsList: Array<string>;
}

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

export const getListFromBundle = (bundle: object): BundleList => {
  const cssList: Array<string> = [];
  const jsList: Array<string> = [];
  for (let key in bundle) {
    if (/\.css$/.test(key)) {
      cssList.push(bundle[key].source);
    } else if (/\.js$/.test(key)) {
      jsList.push(bundle[key].code);
    }
  }
  return { cssList, jsList };
};
