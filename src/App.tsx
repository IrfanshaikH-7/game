import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dice from './components/shared/Dice';
import './App.css';
import Game from './game/Game';
import Constructor from './components/others/Contructor';
import Onboarding from './pages/Onboarding/Onboarding';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Onboarding />} />

        <Route path="/game-in" element={<Game />} />
        <Route path="/builder" element={<Constructor />} />
      </Routes>
    </Router>
  );
};

export default App;
