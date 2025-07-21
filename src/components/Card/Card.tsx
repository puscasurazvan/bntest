import "./Card.css";

interface CardProps {
  title?: string;
  subtitle?: string;
  icon: string;
  iconBorderColor?: string;
}

export const Card = ({
  title = "2 minutes",
  subtitle = "Gain insights into your future career in just two minutes.",
  icon,
  iconBorderColor = "#ffca30",
}: CardProps) => {
  return (
    <div className="card">
      <div className="icon-wrapper" style={{ borderColor: iconBorderColor }}>
        <img src={icon} alt={title} className="card-icon" />
      </div>
      <h6 className="card-title">{title}</h6>
      <p className="card-subtitle">{subtitle}</p>
    </div>
  );
};
