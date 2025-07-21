import "./Progressbar.css";

export const Progressbar = ({ progressPercentage = "100%" }) => {
  return (
    <div className="progressbar">Your progress - {progressPercentage}</div>
  );
};
