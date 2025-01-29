import React, { useState, useEffect, useRef } from 'react';
import Step from '../step/Step';
import "./Carousel.scss";
import Summary from '../summary/Summary';
import { toast } from 'react-toastify';

const Carousel: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ title: string; option: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stepsData = [
    {
      id: 0,
      title: 'How was your day overall?',
      options: ['😊 Great', '😐 Average', '😔 Bad'],
    },
    {
      id: 1,
      title: 'What’s your favorite meal today?',
      options: ['🍔 Burger', '🍕 Pizza', '🥗 Salad', '🍣 Sushi'],
    },
    {
      id: 2,
      title: 'Did you connect with friends or family today?',
      options: ['📞 Yes, a lot', '✉️ A little', '🛑 Not at all'],
    },
  ];

  const handleBtnClick = (targetIndex: number) => {
    stepRefs.current[targetIndex]?.scrollIntoView({
      behavior: "smooth",
    });
    setCurrentStep(targetIndex);
  };

  const handleScrollStop = (): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollTop;
    const cardHeight = stepRefs.current[0]?.offsetHeight ?? container.offsetHeight;

    const newStep = Math.round(scrollPosition / cardHeight);
    setCurrentStep(newStep);

    stepRefs.current[newStep]?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const useScrollStopListener = (callback: () => void, delay = 150): void => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = (): void => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
    };

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }, [callback, delay]);
  };

  useScrollStopListener(handleScrollStop, 200);
  
  const handleOptionSelect = (option: string) => {
    if(currentStep===2){
      setButtonClicked(true);
    }
    setAnswers((prevAnswers) => {
      const stepTitle = stepsData[currentStep].title;
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.title === stepTitle
      );
  
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { title: stepTitle, option };
        return updatedAnswers;
      } else {
        return [...prevAnswers, { title: stepTitle, option }];
      }
    });
  
    const nextStep = currentStep + 1;
  
    if (nextStep < stepsData.length) {
      setCurrentStep(nextStep);
      stepRefs.current[nextStep]?.scrollIntoView({ behavior: "smooth" });
    } else {
      setTimeout(() => {
        stepRefs.current[stepsData.length]?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };
  
  const isSummaryVisible = buttonClicked&&answers.length === stepsData.length;

  const scrollBackToTop = (stepIndex: number) => {
    if (stepIndex > 0) {
      setTimeout(() => {
        stepIndex -= 1;
        setCurrentStep(stepIndex);
        stepRefs.current[stepIndex]?.scrollIntoView({
          behavior: "smooth",
        });
        scrollBackToTop(stepIndex);
      }, 300);
    } else {
      scrollContainerRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = () => {
    toast.success('Summary Submitted!');
    setAnswers([]);
    setSelectedOption([])
    let stepIndex = currentStep;
    scrollBackToTop(stepIndex);
  };

  const handleCancel = () => {
    toast.error('Summary Cancelled!');
    setButtonClicked(false)
    let stepIndex = currentStep;
    scrollBackToTop(stepIndex);
  }

  return (
    <div className="carousel" ref={scrollContainerRef} data-testid="scroll-container">
      <div className="dots">
        {stepsData.map((step, index) => (
          <button
            key={step?.title || index}
            className={
              `navigation_btn_dot ${index === currentStep ? "active" : ""}`
            }
            onClick={() => handleBtnClick(index)}
          />
        ))}
      </div>
      <div className="step-container">
        {stepsData.map((step, index) => (
          <div
          className='questions_container'
            key={step.title}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
          >
            <Step
              step={step}
              stepIndex={index}
              onOptionSelect={handleOptionSelect}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        ))}
        {isSummaryVisible && <div
         className={`${currentStep===stepsData.length-1 && 'active_step'} summary_container`}
          ref={(el) => {
            stepRefs.current[stepsData.length] = el;
          }}
        >
          <Summary answers={answers} onSubmit={handleSubmit} handleCancel={handleCancel} />
        </div>}
      </div>
    </div>
  );
};

export default Carousel;