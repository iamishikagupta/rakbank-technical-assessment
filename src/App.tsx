import React from 'react';
import Carousel from './components/carousel/Carousel';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="App">
        <Carousel />
      </div>
    </>
  );
};

export default App;