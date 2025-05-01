import { useEffect } from "react";

export default () => {
  function enablePreventPageLeave() {
    window.addEventListener("beforeunload", handleBeforeUnload);
  }
  
  function disablePreventPageLeave() {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  }

  useEffect(() => {
    return () => disablePreventPageLeave();
  }, []);

  return { enablePreventPageLeave, disablePreventPageLeave };
}

function handleBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = "As alterações feitas não serão salvas. Tem certeza que deseja sair?";
  return event.returnValue;
}