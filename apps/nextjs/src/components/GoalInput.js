import React, { useRef } from "react";

const GoalInput = (props) => {
  const inputEl = useRef(null);

  const handleKeyPress = (e) => {
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);

    if (!charStr.match(/^[0-9]+$/)) {
      e.preventDefault();
    }
  };

  const handleOnBlur = () => {
    if (props.teamScore > 9) {
      props.setTeamScore(9);
    }
  };

  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  function handleChange({ target }) {
    if (target.value.length > 1) {
      return;
    } else {
      props.setTeamScore(target.value);
    }
  }

  return (
    <input
      ref={inputEl}
      disabled={props.mode === "placedBet"}
      value={props.teamScore}
      type="number"
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      onBlur={handleOnBlur}
      onFocus={() => {
        if (!isTouchDevice()) {
          inputEl.current.select();
        }
      }}
      className=" h-6 w-10 mx-3 p-0 border-grey-200 border text-center"
    />
  );
};

export default GoalInput;
