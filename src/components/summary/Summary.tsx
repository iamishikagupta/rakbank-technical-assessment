import React from 'react';
import "./summary.scss";

interface SummaryProps {
  answers: { title: string; option: string }[];
  onSubmit: () => void;
  handleCancel: () => void;
}

const Summary: React.FC<SummaryProps> = ({ answers, onSubmit, handleCancel, }) => {
  return (
    <div className="summary">
      <div className='summary-left'>
        <h2 className='summary-title'>Your Selected Options:</h2>
        <ul>
          {answers.map((answer) => (
            <li key={answer.title}>
              <div className='summary-answer'>
                <div className='answer-title'><span>{answer.title}</span></div>
                <div className='answer-option'><span>{answer.option}</span></div>
              </div>
            </li>
          ))}
        </ul>
        <div className='summary-action-btn'>
          <button className='summary-submit-btn' onClick={onSubmit}>Submit</button>
          <button className='summary-cancel-btn' onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Summary;