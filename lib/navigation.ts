/**
 * Warns user before navigating away when there are unsaved changes
 * @param hasChanges - Whether there are unsaved changes
 * @returns Cleanup function to remove the event listener
 */
export function addNavigationWarning(hasChanges: () => boolean): () => void {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanges()) {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires returnValue to be set
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}
