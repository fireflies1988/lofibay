import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmDeleteDialog({ buttonText, buttonSize, title, content, onConfirm }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DeleteOutlineIcon />}
        color="error"
        sx={{ textTransform: "none" }}
        onClick={handleClickOpen}
        size={buttonSize}
      >
        {buttonText}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirm} variant="contained" color="error" sx={{ textTransform: "none" }}>Yes</Button>
          <Button onClick={handleClose} variant="outlined" color="error" sx={{ textTransform: "none" }}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmDeleteDialog;
