import { useState } from 'react';
import { useChirp } from 'react-chirp';
import './App.css';

function App() {
  const { trace, debug, info, warn, error, fatal } = useChirp();
  const [message, setMessage] = useState('Hello from React Chirp!');
  const [userData, setUserData] = useState('user123');

  const handleLog = (level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal') => {
    const data = userData ? { userId: userData, timestamp: Date.now().toString() } : undefined;
    
    switch (level) {
      case 'trace':
        trace(message, data);
        break;
      case 'debug':
        debug(message, data);
        break;
      case 'info':
        info(message, data);
        break;
      case 'warn':
        warn(message, data);
        break;
      case 'error':
        error(message, data);
        break;
      case 'fatal':
        fatal(message, data);
        break;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chirp Simple Demo</h1>
        
        <div className="test-section">
          <h2>Basic Logging Test</h2>
          
          <div className="input-group">
            <label>
              Message:
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter log message"
              />
            </label>
          </div>
          
          <div className="input-group">
            <label>
              User ID:
              <input
                type="text"
                value={userData}
                onChange={(e) => setUserData(e.target.value)}
                placeholder="Enter user ID"
              />
            </label>
          </div>
          
          <div className="button-group">
            <button onClick={() => handleLog('trace')}>
              TRACE
            </button>
            <button onClick={() => handleLog('debug')}>
              DEBUG
            </button>
            <button onClick={() => handleLog('info')}>
              INFO
            </button>
            <button onClick={() => handleLog('warn')}>
              WARN
            </button>
            <button onClick={() => handleLog('error')}>
              ERROR
            </button>
            <button onClick={() => handleLog('fatal')}>
              FATAL
            </button>
          </div>
        </div>

        <div className="instructions">
          <h3>How to use</h3>
          <ul>
            <li>Enter a message and user ID above</li>
            <li>Click any log level button</li>
            <li>Open browser console (F12) to see the logged output</li>
            <li>This uses the default ConsoleTransport</li>
          </ul>
          
          <h3>What this demonstrates</h3>
          <ul>
            <li>Basic useChirp hook usage</li>
            <li>All six log levels</li>
            <li>Logging with additional data (Record&lt;string, string&gt;)</li>
            <li>Simple React integration pattern</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;