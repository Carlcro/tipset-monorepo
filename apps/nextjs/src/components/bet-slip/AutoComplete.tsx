import React, { useState, useRef, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { Player } from "@acme/db";

type Props = {
  goalscorer: Player | null;
  handleSetGoalscorer: (goalscorer: Player) => void;
};

const AutoComplete = ({ goalscorer, handleSetGoalscorer }: Props) => {
  const [inputValue, setInputValue] = useState<string | undefined>(
    goalscorer?.name,
  );

  useEffect(() => {
    setInputValue(goalscorer?.name);
  }, [goalscorer?.name]);

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { data: names } = trpc.player.getAll.useQuery();
  const inputRef = useRef<HTMLDivElement>(null);

  const filteredNames =
    (inputValue &&
      names
        ?.filter((name) =>
          name.name.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .slice(0, 5)) ||
    [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (name: string): void => {
    setInputValue(name);
    setShowSuggestions(false);
    const selectedGoalscorer = names?.find((x) => x.name === name);
    if (selectedGoalscorer) {
      handleSetGoalscorer(selectedGoalscorer);
    }
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={inputRef}>
      <input
        value={inputValue}
        onChange={handleInputChange}
        className="w-48, b-2 relative rounded-sm border border-polarNight py-1 px-2"
      />
      {showSuggestions && (
        <ul className="absolute rounded-sm border-x-2 bg-slate">
          {filteredNames.map((name) => (
            <li
              className="w-48 cursor-pointer rounded-sm px-2 py-2 hover:bg-polarNight hover:text-slate"
              key={name.id}
              onClick={() => handleSuggestionClick(name.name)}
            >
              {name.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
