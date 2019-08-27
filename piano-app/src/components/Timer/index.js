import React from "react";
import PropTypes from "prop-types";
import { formatTime } from "../../utils/helpers";
import cx from "classnames";
import "./timer.scss";

const Timer = ({ time, type }) => {
    const classNames = cx("timer", {
        "timer--big": type === "big",
    });
    return <span className={classNames}>{formatTime(time)}</span>;
};

Timer.propTypes = {
    time: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["big"]),
};

export default Timer;
