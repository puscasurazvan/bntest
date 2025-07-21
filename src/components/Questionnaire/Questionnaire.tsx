import {
  useFetchQuestions,
  useSubmitAnswers,
  useUserFromUrl,
  useGetLatestSubmissions,
} from "../../hooks";
import "./Questionnaire.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progressbar, QuestionOptions, Results } from "./components";
import { formatDate } from "../../utils";
import { v4 as uuid } from "uuid";

export const Questionnaire = () => {
  const user = useUserFromUrl();
  const { data, isLoading, isError, error } = useFetchQuestions(user);
  const { mutate: submitAnswers, isPending, isSuccess } = useSubmitAnswers();
  const { data: latestSubmissionData, refetch: refetchLatestSubmissions } =
    useGetLatestSubmissions(user);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<
    "down" | "up" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; answer: number }>
  >([]);
  const [showResults, setShowResults] = useState(false);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnimationDirection(null);
    setIsAnimating(false);
    setAnswers([]);
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      setShowResults(true);
      refetchLatestSubmissions();
    }
  }, [isSuccess, refetchLatestSubmissions]);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAnimating) return;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        goToNextQuestion();
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnimating, goToNextQuestion, goToPrevQuestion]);

  const handleSelectOption = (questionId: string, option: number) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.questionId === questionId
      );

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { questionId, answer: option };
        return updatedAnswers;
      } else {
        return [...prevAnswers, { questionId, answer: option }];
      }
    });
    setTimeout(() => {
      goToNextQuestion();
    }, 300);
  };

  const allQuestionsAnswered =
    data?.questions && answers.length === data.questions.length;

  const handleSubmit = () => {
    if (allQuestionsAnswered && user) {
      submitAnswers({ user, answers });
    }
  };

  const handleLogin = () => {
    const userId = uuid();
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("user", userId);
    window.location.href = currentUrl.toString();
  };

  if (!user) {
    return (
      <div className="questionnaire" style={{ marginTop: "20px" }}>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    );
  }

  if (
    user &&
    (showResults ||
      (latestSubmissionData?.ok && latestSubmissionData?.latestSubmission))
  ) {
    const completionDate = formatDate(
      latestSubmissionData?.latestSubmission ?? ""
    );

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Results
          dateCompleted={completionDate || ""}
          onButtonClick={() => window.location.reload()}
        />
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="questionnaire">
        <p>Loading your questions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="questionnaire">
        <div className="error-message">
          <p>Error loading questions: {error?.message}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = data?.questions?.[currentQuestionIndex];
  const totalQuestions = data?.questions?.length ?? 0;
  const progressPercentage =
    totalQuestions > 0
      ? Math.round((answers.length / totalQuestions) * 100)
      : 0;

  return (
    <>
      <Progressbar progressPercentage={progressPercentage} />
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
                  <div className="questions-wrapper">
                    <span className="question-number">
                      Q{currentQuestionIndex + 1}/{totalQuestions}{" "}
                    </span>
                    <div className="questions-text-wrapper">
                      <p>In a job, I would be motivated by:</p>
                      <p>{currentQuestion.text}</p>
                      <QuestionOptions
                        onSelectOption={(option) =>
                          handleSelectOption(currentQuestion.id, option)
                        }
                        selectedOption={
                          answers.find(
                            (answer) => answer.questionId === currentQuestion.id
                          )?.answer ?? null
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {allQuestionsAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="finish-button-container"
              >
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="finish-button"
                >
                  {isPending ? "Submitting..." : "Finish"}
                </button>
              </motion.div>
            )}
            <p
              className="questions-footer"
              style={{ marginTop: allQuestionsAnswered ? "40px" : "60px" }}
            >
              To review your previous answers, scroll back before selecting
              finish
            </p>
          </div>
        )}
      </div>
    </>
  );
};
