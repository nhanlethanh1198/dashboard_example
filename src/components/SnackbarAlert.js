import * as React from "react";
import { Stack, Snackbar, Slide } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useStoreState, useStoreActions } from "easy-peasy";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="right" />;
}

export default function CustomizedSnackbars() {
  const { snackbarType, snackbarMessage } = useStoreState(
    (states) => states.snackbar.snackbar
  );
  const { showSnackbar } = useStoreState((state) => state.snackbar);
  const { setShowSnackbar } = useStoreActions((actions) => actions.snackbar);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setShowSnackbar(false);
    }
    setShowSnackbar(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionComponent={SlideTransition}
        disableWindowBlurListener
      >
        <Alert
          onClose={handleClose}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
