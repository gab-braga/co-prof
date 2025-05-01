import { useRef } from 'react';

export default () => {
  const wakeLock = useRef(null);

  async function requestWakeLock() {
    try {
      wakeLock.current = await navigator.wakeLock.request("screen");
      console.info("Wake Lock enabled.");
    } catch {
      console.error("Wake Lock request error.");
    }
  }

  async function releaseWakeLock() {
    if (wakeLock.current !== null) {
      try {
        wakeLock.current.release();
        wakeLock.current = null;
        console.info("Wake Lock disabled.");
      } catch {
        console.error("Wake Lock release error.");
      }
    }
  }

  return { requestWakeLock, releaseWakeLock };
}
