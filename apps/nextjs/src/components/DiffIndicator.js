import * as React from "react";

const DiffIndicator = ({ fill, height, width }) => (
  <svg
    width={width}
    height={height}
    viewBox="0, 0, 650.742, 650.742"
    fill={fill}
  >
    <polygon points="250,250 100,400 400,400" />
  </svg>
);

export default DiffIndicator;
