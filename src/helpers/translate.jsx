import { Language } from "./language";
import * as Global from "./global";

let selectedLang = Global.Language;
const lang = Language;

export const Trans = key => {
  return lang[key] !== undefined ? lang[key][selectedLang] !== undefined ? lang[key][selectedLang] : key : key;
};
