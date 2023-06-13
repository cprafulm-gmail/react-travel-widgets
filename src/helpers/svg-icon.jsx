import React from "react";
import { SVGIconPath } from "./svg-icon-path";

const iconPath = SVGIconPath;
const Path = (name, type) => {
  return iconPath[name] !== undefined ? iconPath[name][type] === "" ? name : type !== "viewBox" && iconPath[name][type].props.children === undefined ? name : iconPath[name][type] : name;
};

const SVGIcon = ({
  name = "",
  style = {},
  fill = "currentColor",
  viewBox = "",
  width = "16",
  className = "",
  height = "100%",
  type = "lineal"
}) => (
  Path(name.toLocaleLowerCase(), type.toLocaleLowerCase()) !== name.toLocaleLowerCase() ? (
    <React.Fragment><i className="align-middle">
      <svg
        width={width}
        style={style}
        height={width}
        className={"align-baseline " + className}
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox || Path(name.toLocaleLowerCase(), "viewBox")}
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>{Path(name.toLocaleLowerCase(), type.toLocaleLowerCase())}</g>
      </svg></i></React.Fragment>
  ) : ("SVG_" + name.toLocaleLowerCase())
);

export default SVGIcon;
