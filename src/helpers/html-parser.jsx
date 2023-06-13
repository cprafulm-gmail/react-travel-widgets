import ReactHtmlParser, {
  convertNodeToElement,
} from "react-html-parser";

const options = {
  decodeEntities: true,
  transform
};

function transform(node, index) {
  // return null to block certain elements
  // don't allow <span> elements
  // if (node.type === "tag" && node.name === "span") {  //Code comment due to auto complete having "&nbsp;" and remove that called this component
  //   return null;
  // }

  // Transform <ul> into <ol>
  // A node can be modified and passed to the convertNodeToElement function which will continue to render it and it's children
  if (node.type === "tag" && node.name === "ul") {
    node.name = "ol";
    return convertNodeToElement(node, index, transform);
  }

  // return an <i> element for every <b>
  // a key must be included for all elements
  // if (node.type === "tag" && node.name === "b") {
  //   return <i key={index}>{processNodes(node.children, transform)}</i>;
  // }

  // all links must open in a new window
  if (node.type === "tag" && node.name === "a") {
    node.attribs.target = "_blank";
    return convertNodeToElement(node, index, transform);
  }

  // if (node.type === "tag" && node.name === "button") {
  //   return (
  //     <Button variant="contained" color="primary" key={index}>
  //       {processNodes(node.children, transform)}
  //     </Button>
  //   );
  // }
}

//Purpose : problem fixed : it display html element on UI due to double encode.
const replaceSpecialCharacters = text => {
  return text
    .split("&lt;")
    .join("<")
    .split("&gt;")
    .join(">")
    .split("&nbsp;")
    .join(" ");
};

const HtmlParser = props => {
  if (props.text)
    return ReactHtmlParser(replaceSpecialCharacters(props.text), options);
  else return "";
};

export default HtmlParser;
