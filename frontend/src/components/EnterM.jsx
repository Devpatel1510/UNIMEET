import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterM = ({ onClose }) => {
    const navigate = useNavigate();
    const [input,setInput] = useState("");
    
  const ref = useRef(null);
  const joinMeeting = () => {
    
    if (!input) return;

    let roomId;
    try {
      const url = new URL(input);
      roomId = url.pathname.split('/meet/')[1];
    } catch {
      roomId = input;
    }

    if (roomId && roomId.length > 5) {
      navigate(`/meet/${roomId}`);
    } else {
      alert('Invalid meeting link or ID.');
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50  bg-opacity-30 backdrop-blur-sm flex items-center justify-center px-4">
      
      
      

      
      <section
        ref={ref}
        className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md relative z-10"
      >
     
        <h2 className="font-fredoka text-blue-900 text-center text-3xl mb-8 drop-shadow-sm">
          Enter Meeting Id
        </h2>
        <input
          type="text"
          placeholder="Enter your meeting ID"
          className="w-full rounded-full py-4 px-8 mb-8 text-blue-900 text-lg font-semibold outline-none shadow-inner focus:ring-4 focus:ring-blue-400 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            className="bg-blue-700 text-white font-bold rounded-full px-14 py-4 shadow-lg hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
            type="button"
            onClick={joinMeeting}
          >
            Join
          </button>
        </div>
      </section>

      <style jsx>{`
        @layer utilities {
          .font-fredoka {
            font-family: 'Fredoka One', cursive;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        }
      `}</style>
    </div>
  );
};

export default EnterM;
