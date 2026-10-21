import { useContext } from "react";
import { PopupContext } from "@/context/popup-context";

/**
 * @returns {{ showPopup: Function, showError: Function, hidePopup: Function }}
 */
export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}