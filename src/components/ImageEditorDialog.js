import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { Button, Dialog, DialogContent } from "@mui/material";
import ImageEditor from "@toast-ui/react-image-editor";
import React, { useEffect, useRef } from "react";
import "tui-image-editor/dist/tui-image-editor.css";

function ImageEditorDialog({ photoUrl }) {
  const [open, setOpen] = React.useState(false);
  const editorRef = useRef();
  const imageEditorOptions = {
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
        path: "https://res.cloudinary.com/dsskvx9ha/image/upload/v1636038302/sample.jpg",
        name: "SampleImage",
      },
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
    usageStatistics: true,
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (photoUrl) {
      editorRef.current.getInstance().loadImageFromURL(photoUrl, "SampleIamge");
    }
  }, [photoUrl]);

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
          <ImageEditor {...imageEditorOptions} ref={editorRef} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageEditorDialog;
