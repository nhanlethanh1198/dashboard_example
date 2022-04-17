import { useState } from "react";

function useShowDialog(type = "", data = {}, message, callback) {
  const [showDialog, setShowDialog] = useState(false);
  const [isAccept, setIsAccept] = useState();

  if (isAccept === false) {
    setShowDialog(false);
  } else if (isAccept === true) {
    setShowDialog(false);
    callback();
  }

  return { showDialog, setShowDialog, isAccept, setIsAccept, message };
}

export default useShowDialog;
