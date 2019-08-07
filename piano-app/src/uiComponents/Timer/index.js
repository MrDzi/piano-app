import React from "react";
import { formatTime } from "../../utils/helpers";

const Timer = ({ time }) => <div>{formatTime(time)}</div>;

export default Timer;
