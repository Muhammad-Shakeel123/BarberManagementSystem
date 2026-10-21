import { useState, useEffect } from "react";
import { PopupContext } from "./popup-context";
import GlobalPopup from "@/components/common/GlobalPopup";

export function PopupProvider({ children }) {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });

  const showPopup = ({ type = "error", title, message }) => {
    setPopupState({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const showError = (message, title = "Error") => {
    showPopup({
      type: "error",
      title,
      message,
    });
  };

  const hidePopup = () => {
    setPopupState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  useEffect(() => {
    const handleGlobalApiError = (event) => {
      const { title, message } = event.detail || {};

      showPopup({
        type: "error",
        title: title || "Operation Failed",
        message: message || "An unexpected backend error occurred.",
      });
    };

    const handleGlobalApiSuccess = (event) => {
      const { title, message } = event.detail || {};

      showPopup({
        type: "success",
        title: title || "Success",
        message: message || "Operation completed successfully.",
      });
    };
    

    window.addEventListener("api-error-popup", handleGlobalApiError);

    window.addEventListener("api-success-popup", handleGlobalApiSuccess);

    return () => {
      window.removeEventListener("api-error-popup", handleGlobalApiError);

      window.removeEventListener("api-success-popup", handleGlobalApiSuccess);
    };
  }, []);
// Auto close popup
useEffect(() => {
  if (!popupState.isOpen) return;

  const timeoutId = window.setTimeout(() => {
    hidePopup();
  }, 5000);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [popupState.isOpen, popupState.message]);
  return (
    <PopupContext.Provider
      value={{
        showPopup,
        showError,
        hidePopup,
      }}
    >
      {children}

      <GlobalPopup
        isOpen={popupState.isOpen}
        onClose={hidePopup}
        type={popupState.type}
        title={popupState.title}
        message={popupState.message}
      />
    </PopupContext.Provider>
  );
}
