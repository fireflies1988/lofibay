import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { Button, Dialog, DialogContent } from "@mui/material";
import React from "react";
import ImageEditor from "./ImageEditor";

function ImageEditorDialog({ photoUrl }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const props = {
    includeUI: {
      menu: [
        "crop",
        "flip",
        "rotate",
        "draw",
        "shape",
        "icon",
        "text",
        "mask",
        "filter",
      ],
      initMenu: "filter",
      uiSize: {
        width: "1200px",
        height: "640px",
      },
      menuBarPosition: "bottom",
      loadImage: {
        path: photoUrl,
        name: "SampleImage",
      },
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AutoAwesomeOutlinedIcon />}
        color="success"
        sx={{ height: "32px", textTransform: "none" }}
        onClick={handleClickOpen}
      >
        Editor
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <DialogContent>
          <ImageEditor {...props} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageEditorDialog;
