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
        <span>{zeroPad(days)}</span> DAYS, <span>{zeroPad(hours)}</span> HOURS,{" "}
        <span>{zeroPad(minutes)}</span> MIN, <span>{zeroPad(seconds)} </span>SEC
      </div>
    );
  }
};

export default Renderer;
