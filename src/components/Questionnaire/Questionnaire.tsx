import { useFetchQuestions, useUserFromUrl } from "../../hooks";
import "./Questionnaire.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Questionnaire = () => {
  const user = useUserFromUrl();
  const { data, isLoading, isError, error } = useFetchQuestions(user);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<
    "down" | "up" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnimationDirection(null);
    setIsAnimating(false);
  }, [data]);

  const changeQuestion = useCallback(
    (newIndex: number, direction: "down" | "up") => {
      if (isAnimating || newIndex === currentQuestionIndex) return;

      setIsAnimating(true);
      setAnimationDirection(direction);
      setCurrentQuestionIndex(newIndex);
    },
    [isAnimating, currentQuestionIndex]
  );

  const goToNextQuestion = useCallback(() => {
    if (data?.questions && currentQuestionIndex < data.questions.length - 1) {
      changeQuestion(currentQuestionIndex + 1, "down");
    }
  }, [data?.questions, currentQuestionIndex, changeQuestion]);

  const goToPrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      changeQuestion(currentQuestionIndex - 1, "up");
    }
  }, [currentQuestionIndex, changeQuestion]);

  useEffect(() => {
    const container = questionsContainerRef.current;

    const handleWheel = (event: WheelEvent) => {
      if (isAnimating) return;
      event.preventDefault();

      if (event.deltaY > 0) {
        goToNextQuestion();
      } else {
        goToPrevQuestion();
      }
    };

    container?.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [isAnimating, goToNextQuestion, goToPrevQuestion, data]);

  if (!user) {
    return (
      <div className="questionnaire">
        <h1>Questionnaire</h1>
        <div className="error-message">
          <p>Please provide a user parameter in the URL.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="questionnaire">
        <h1>Questionnaire</h1>
        <p>Loading your questions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="questionnaire">
        <h1>Questionnaire</h1>
        <div className="error-message">
          <p>Error loading questions: {error?.message}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = data?.questions?.[currentQuestionIndex];
  const totalQuestions = data?.questions?.length ?? 0;

  return (
    <div className="questionnaire">
      {currentQuestion && (
        <div className="questions-container" ref={questionsContainerRef}>
          <div className="single-question-view">
            <AnimatePresence
              mode="wait"
              custom={animationDirection}
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={currentQuestion.id}
                className="question-item"
                custom={animationDirection}
                variants={{
                  enter: (direction: "down" | "up" | null) => ({
                    y:
                      direction === "down"
                        ? 100
                        : direction === "up"
                        ? -100
                        : 0,
                    opacity: 0,
                  }),
                  center: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  },
                  exit: (direction: "down" | "up") => ({
                    y: direction === "down" ? -100 : 100,
                    opacity: 0,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="question-content">
                  <span className="question-number">
                    Q{currentQuestionIndex + 1}/{totalQuestions}{" "}
                  </span>
                  <div className="question-text">
                    <p>In a job, I would be motivated by:</p>
                    <p>{currentQuestion.text}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <p>
              To review your previous answers, scroll back before selecting
              finish
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
