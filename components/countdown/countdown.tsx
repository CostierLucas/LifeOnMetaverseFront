import { useEffect, useRef } from "react";
import Countdown, { zeroPad } from "react-countdown";
import styles from "./countdown.module.scss";

const Renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  completed: any;
}) => {
  if (completed) {
    return "Mint is open";
  } else {
    return (
      <div className={styles.countdown}>
        <span>
          {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      </div>
    );
  }
};

export default Renderer;
