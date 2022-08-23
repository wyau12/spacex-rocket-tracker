import { useEffect } from 'react';
import { PreviousRockets } from './components';

function App() {
  useEffect(() => {
    document.title = 'SpaceX Rocket Tracker';
  }, []);
  return (
    <div>
      <p>Check out our list of previous rockets!</p>
      <PreviousRockets />
    </div>
  );
}

export default App;
