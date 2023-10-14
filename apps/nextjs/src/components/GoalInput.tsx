import React, { useRef } from "react";
import { Mode } from "../types";

type Props = {
  teamScore: number | string;
  setTeamScore: (score: number | string) => void;
  mode: Mode;
};

const GoalInput = (props: Props) => {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: any) => {
    e = e || window.event;
    const charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);

    if (!charStr.match(/^[0-9]+$/)) {
      e.preventDefault();
    }
  };

  const handleOnBlur = () => {
    if (typeof props.teamScore === "number" && props.teamScore > 9) {
      props.setTeamScore(9);
    }
  };

  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.value === "") {
      return props.setTeamScore(target.value);
    }
    if (target.value.length > 1) {
      return;
    }
    return props.setTeamScore(Number(target.value));
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
          inputEl?.current?.select();
        }
      }}
      className=" border-grey-200 mx-3 h-6 w-10 border p-0 text-center"
    />
  );
};

export default GoalInput;
