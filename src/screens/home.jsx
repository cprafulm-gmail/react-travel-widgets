import React from "react";
import SearchWidget from "../components/search/search-widget";

const Home = (props) => {
  return (
    <>
      <SearchWidget
        history={props.history}
        match={props.match}
        mode={"home"}
      />
    </>
  );
};

export default Home;
