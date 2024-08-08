import { useEffect, useRef } from "react";

export const useOutsideClick = function (handler, listenCaputring = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCaputring);

      return () => {
        document.removeEventListener("click", handleClick, listenCaputring);
      };
    },
    [handler, listenCaputring]
  );
  return ref;
};
