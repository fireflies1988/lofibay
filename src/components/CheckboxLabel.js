import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";

function CheckboxLabel({ label, checked, onChange, sx, name }) {
  return (
    <FormGroup sx={sx}>
      <FormControlLabel
        control={
          <Checkbox checked={checked} onChange={onChange} color="success" name={name} />
        }
        label={label}
      />
    </FormGroup>
  );
}

export default CheckboxLabel;
