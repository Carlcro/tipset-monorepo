import Autosuggest from "react-autosuggest";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAllPlayers } from "../../services/betSlipService";

const theme = {
  container: {
    position: "relative",
  },
  input: {
    width: 240,
    height: 30,
    padding: "10px 10px",
    fontWeight: 300,
    fontSize: 16,
    border: "1px solid #aaa",
  },
  inputFocused: {
    outline: "none",
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {
    display: "none",
  },
  suggestionsContainerOpen: {
    display: "block",
    position: "absolute",
    top: 30,
    width: 280,
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2,
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  suggestion: {
    cursor: "pointer",
    padding: "10px 20px",
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd",
  },
};

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value, players) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : players.filter((lang) =>
        lang.name
          .toLowerCase()
          .split(" ")
          .some(
            (term) => term.toLowerCase().slice(0, inputLength) === inputValue
          )
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

const Auto = (props) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [goalscorerSet, setGoalScorerSet] = useState(false);

  const { data: allPlayers } = useQuery(
    "players",
    async () => {
      const { data } = await getAllPlayers();
      return data;
    },
    { staleTime: Infinity }
  );

  useEffect(() => {
    if (props.goalscorer) {
      setValue(props.goalscorer.name);
      setGoalScorerSet(true);
    }
  }, [props.goalscorer]);

  const onChange = (event, { newValue }) => {
    if (typeof newValue === "object") {
      props.setGoalscorer(newValue);

      setValue(newValue.name);
      setGoalScorerSet(true);
    } else {
      setValue(newValue);

      props.setGoalscorer(undefined);
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, allPlayers));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const clearInput = () => {
    setValue("");
    setGoalScorerSet(false);
    props.setGoalscorer(undefined);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    value,
    onChange,
    disabled: goalscorerSet,
  };

  // Finally, render it!
  return (
    <div className="flex">
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      {goalscorerSet && (
        <button
          type="button"
          style={{ zIndex: 20, marginLeft: "-50px", cursor: "pointer" }}
          onClick={clearInput}
        >
          Rensa
        </button>
      )}
    </div>
  );
};

export default Auto;
