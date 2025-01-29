import { render, screen, fireEvent } from "@testing-library/react";
import Summary from "./Summary";

describe("Summary Component", () => {
  const mockOnSubmit = jest.fn(); 
  const mockOnCancel = jest.fn(); 
  const mockAnswers = [{'title':"title 1",'option':'Option 1'}, {'title':"title 2",'option':'Option 2'},{'title':"title 3",'option':'Option 3'}];

  test("renders the component without crashing", () => {
    render(<Summary answers={mockAnswers} onSubmit={mockOnSubmit} handleCancel={mockOnCancel} />);

    expect(screen.getByText("Your Selected Options:")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("displays the correct number of answers", () => {
    const {container}= render(<Summary answers={mockAnswers} onSubmit={mockOnSubmit} handleCancel={mockOnCancel} />);


    const renderedAnswers = container.getElementsByClassName('summary-answer');
    expect(renderedAnswers).toHaveLength(mockAnswers.length);

    mockAnswers.forEach((answer) => {
      expect(screen.getByText(answer.option)).toBeInTheDocument();
    });
  });

  test("triggers onSubmit function when the submit button is clicked", () => {
    render(<Summary answers={mockAnswers} onSubmit={mockOnSubmit} handleCancel={mockOnCancel} />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test("triggers onSubmit function when the submit button is clicked", () => {
    render(<Summary answers={mockAnswers} onSubmit={mockOnSubmit} handleCancel={mockOnCancel} />);


    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

});