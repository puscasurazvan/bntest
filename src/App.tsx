import "./App.css";
import { Card, Header, Questionnaire, Details } from "./components";

function App() {
  return (
    <div className="container">
      <Header />
      <div className="cards-container">
        <Card
          title="24 questions"
          subtitle="Answer 24 questins about your working style and career preferences"
          icon="/assets/icons/clipboard-question.svg"
          iconBorderColor="#3b82f6"
        />
        <Card
          title="2 minutes"
          subtitle="Gain insights into your future career in just two minutes."
          iconBorderColor="#10b981"
          icon="/assets/icons/stopwatch.svg"
        />
        <Card
          title="Personalised advice"
          subtitle="Receive personalised advice to guide you on your next steps"
          icon="/assets/icons/scissor-cutting.svg"
          iconBorderColor="#f59e0b"
        />
      </div>
      <Details />
      <Questionnaire />
    </div>
  );
}

export default App;
