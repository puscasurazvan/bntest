import React from "react";
import "./QuestionOptions.css";

interface QuestionOptionsProps {
  onSelectOption: (option: number) => void;
  selectedOption: number | null;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  onSelectOption,
  selectedOption,
}) => {
  const options = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="question-options">
      <div className="options-container">
        {options.map((option) => (
          <button
            key={option}
            className={`option-button ${
              selectedOption === option ? "selected" : ""
            }`}
            onClick={() => onSelectOption(option)}
          />
        ))}
      </div>
      <div className="options-labels">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>
    </div>
  );
};
