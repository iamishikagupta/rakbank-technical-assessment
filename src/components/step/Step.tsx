import React from 'react';
import "./Step.scss";

interface StepProps {
  step: { title: string; options: string[] };
  stepIndex: number;
  onOptionSelect: (option: string) => void;
  selectedOption: string [];
  setSelectedOption: (options: string[]) => void;
}

const Step: React.FC<StepProps> = ({ step, stepIndex, onOptionSelect, setSelectedOption, selectedOption }) => {

  const handleOptionClick = (option: string) => {
    const updatedOptions = [...selectedOption];
    updatedOptions[stepIndex] = option;
    setSelectedOption(updatedOptions);
    onOptionSelect(option);
  };
  return (
    <div className={`step step-${stepIndex + 1}`}>
      <div className="upper">
        <div className='title'>
          <h2>{step.title}</h2>
        </div>
      </div>
      <div className="lower">
        <div className='option-box'>
          <div className="options">
            {step.options.map((option, idx) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`option-${idx} ${selectedOption[stepIndex] === option ? 'active-option' : ''}`} // Add class for each option
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step;