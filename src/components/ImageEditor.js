import { useEffect, useRef } from "react";
import TuiImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

function ImageEditor(props) {
  const instance = useRef(null);
  const rootEl = useRef(null);

  useEffect(() => {
    instance.current = new TuiImageEditor(rootEl.current, {
      ...props,
    });
    return () => {
      instance.current.destroy();
      instance.current = null;
    };
  }, [instance, props]);
  return <div ref={rootEl} />;
}

export default ImageEditor;
