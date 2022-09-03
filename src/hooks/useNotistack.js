import { useSnackbar } from "notistack";

function useNotistack() {
  const { enqueueSnackbar } = useSnackbar();

  function showSnackbar(variant, message) {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
    });
  }

  return { showSnackbar };
}

export default useNotistack;
