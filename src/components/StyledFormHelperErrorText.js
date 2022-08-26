import { FormHelperText } from "@mui/material";
import React from "react";

function StyledFormHelperErrorText({ children }) {
  return (
    <FormHelperText
      error
      style={{
        textAlign: "right",
        fontSize: "small",
        fontWeight: "bold",
      }}
    >
      {children}
    </FormHelperText>
  );
}

export default StyledFormHelperErrorText;
