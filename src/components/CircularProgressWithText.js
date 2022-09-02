import { CircularProgress } from "@mui/material";
import React from "react";

function CircularProgressWithText({ loading, text, children }) {
  return (
    <>
      {loading ? (
        <>
          <CircularProgress color="success" sx={{ mt: "1rem" }} />
          <h4>{text || "Fetching data, please stand by..."}</h4>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default CircularProgressWithText;
