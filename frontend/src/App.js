import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios'
import io from 'socket.io-client';

function App() {

  const [numEmails, setNumEmails] = useState("");
  const [jobId, setJobId] = useState("");
  

  const handleSendEmails = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/sendEmails", {
        numEmails: parseInt(numEmails),
      });
      setJobId(response.data.jobId);
      localStorage.setItem('job_id', response.data.jobId)
      localStorage.setItem('persist', true)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const socket = io('ws://localhost:3000'); // Replace with your NestJS server URL

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
      // Handle incoming messages from the server
    });

    return () => {
      socket.disconnect(); // Clean up the WebSocket connection on unmounting
    };
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <input
        className={'input'}
        type={'number'}
        value={numEmails}
        onChange={(e) => setNumEmails(e.target.value)}
        />
        <button
        className={'APP-btn'}
        onClick={handleSendEmails}
        >
          Send Mails
        </button>
      </header>
    </div>
  );
}

export default App;
