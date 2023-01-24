import React from "react";
import FadeLoader from "react-spinners/FadeLoader";

const override = {
  margin: "0 auto",
};
const Loader = () => {
  return (
    <div className="sweet-loading " style={{ marginTop: "150px" }}>
      <FadeLoader
        color={"#3A3941 "}
        loading={true}
        cssOverride={override}
        size={80}
      />
    </div>
  );
};

export default Loader;
