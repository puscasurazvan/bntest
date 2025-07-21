import "./Progressbar.css";

interface ProgressbarProps {
  progressPercentage?: number | string;
}

export const Progressbar = ({ progressPercentage = 100 }: ProgressbarProps) => {
  return (
    <div className="progressbar">
      Your progress - {progressPercentage}%
      <div className="progressbar-visual">
        <div
          className="progressbar-visual-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
