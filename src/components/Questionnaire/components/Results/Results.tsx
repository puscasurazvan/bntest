import "./Results.css";

interface ResultsProps {
  dateCompleted: string;
  onButtonClick: () => void;
}

export const Results = ({ dateCompleted, onButtonClick }: ResultsProps) => {
  return (
    <div className="results-container">
      <div className="results-header">
        <img
          src="/src/assets/graduation.svg"
          alt="Graduation celebration"
          className="graduation-image"
        />
      </div>
      <div className="results-content">
        <h2 className="completion-date">Completed on {dateCompleted}</h2>
        <p className="congratulations-text">
          Well done on completing your test. You can view the results now.
        </p>
        <button className="results-button" onClick={onButtonClick}>
          See your results
        </button>
      </div>
    </div>
  );
};
