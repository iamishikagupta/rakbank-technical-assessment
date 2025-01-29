import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Carousel from './Carousel';
import { toast } from 'react-toastify'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

const stepsData = [
  {
    title: 'How was your day overall?',
    options: ['😊 Great', '😐 Average', '😔 Bad'],
  },
  {
    title: 'What’s your favorite meal today?',
    options: ['🍔 Burger', '🍕 Pizza', '🥗 Salad', '🍣 Sushi'],
  },
  {
    title: 'Did you connect with friends or family today?',
    options: ['📞 Yes, a lot', '✉️ A little', '🛑 Not at all'],
  },
];

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: jest.fn(),
}));

describe('Carousel Component', () => {
  test('renders the component and steps', () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  test('renders the correct number of dots', () => {
    const { container } = render(<Carousel />);

    const dots = container.getElementsByClassName('navigation_btn_dot')
    expect(dots).toHaveLength(stepsData.length);
  });

  test('clicking on a dot scrolls to the correct step', async () => {
    const { container } = render(<Carousel />);

    const dots = container.getElementsByClassName('navigation_btn_dot')
    fireEvent.click(dots[1]);

    expect(screen.getByText(stepsData[1].title)).toBeInTheDocument();
  });

  test('option selection scrolls to the next step', async () => {
    render(<Carousel />);

    const firstOptionButton = screen.getByText(stepsData[0].options[0]);
    fireEvent.click(firstOptionButton);

    await waitFor(() => {
      expect(screen.getByText(stepsData[1].title)).toBeInTheDocument();
    });
  });

  test('renders summary step after all steps are completed', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Selected Options:')).toBeInTheDocument();
    });
  });

  test('handles invalid step index gracefully', async () => {
    const { container } = render(<Carousel />);
    const dots = container.getElementsByClassName('navigation_btn_dot');

    fireEvent.click(dots[dots.length - 1]);

    expect(screen.getByText(stepsData[stepsData.length - 1].title)).toBeInTheDocument();
  });


  test('skips a disabled step when navigating', async () => {
    render(<Carousel />);
    const firstOptionButton = screen.getByText(stepsData[0].options[0]);

    fireEvent.click(firstOptionButton);

    await waitFor(() => {
      expect(screen.getByText(stepsData[2].title)).toBeInTheDocument();
    });
  });

  test('displays success toast on summary submission', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Selected Options:')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(toast.success).toHaveBeenCalledWith('Summary Submitted!');
  });

  test('displays error toast on summary cancellation', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Selected Options:')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(toast.error).toHaveBeenCalledWith('Summary Cancelled!');
  });

  test('scrollBackToTop navigates to the first step', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    const cancelButton = screen.getByText('Submit');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(stepsData[0].title)).toBeInTheDocument();
    });
  });

  test('selecting an option updates the answers state', async () => {
    render(<Carousel />);

    const firstOption = screen.getByText(stepsData[0].options[0]);
    fireEvent.click(firstOption);

    await waitFor(() => {
      expect(screen.getByText(stepsData[1].title)).toBeInTheDocument();
    });

    expect(screen.getByText(stepsData[1].options[0])).toBeInTheDocument();
  });

  test('selecting an option at the last step triggers the summary', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Selected Options:')).toBeInTheDocument();
    });
  });

  test('clicking submit resets answers and selectedOption state', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Selected Options:')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(stepsData[0].title)).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalledWith('Summary Submitted!');
  });

  test('clicking cancel hides summary and resets state', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Selected Options:')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(stepsData[0].title)).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith('Summary Cancelled!');
  });

  test('scrollBackToTop navigates back to the first step', async () => {
    render(<Carousel />);

    stepsData.forEach((step) => {
      const optionButton = screen.getByText(step.options[0]);
      fireEvent.click(optionButton);
    });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(stepsData[0].title)).toBeInTheDocument();
    });
  });

  test('handleScrollStop updates current step correctly', async () => {
    render(<Carousel />);

    const scrollContainer = screen.getByTestId('scroll-container');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 500 } });

    await waitFor(() => {
      expect(screen.getByText(stepsData[1].title)).toBeInTheDocument();
    });
  });

  jest.useFakeTimers(); // Simulate timers

  test('useScrollStopListener calls handleScroll with delay', async () => {
    render(<Carousel />);

    const scrollContainer = screen.getByTestId('scroll-container')
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 300 } });
    act(() => {
      jest.runAllTimers();

    })

    await waitFor(() => {
      expect(screen.getByText(stepsData[1].title)).toBeInTheDocument();
    });
  });

  test('scrollBackToTop resets to the first step smoothly', async () => {
    render(<Carousel />);
  
    stepsData.forEach((step) => {
      fireEvent.click(screen.getByText(step.options[0]));
    });
  
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText(stepsData[0].title)).toBeInTheDocument();
    });
  });
  
});