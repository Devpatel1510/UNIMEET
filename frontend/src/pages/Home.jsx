import React,{ useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import EnterM from '../components/EnterM';




function Home() {
   const navigate = useNavigate();
   const [showJoin, setShowJoin] = useState(false);

  const createMeeting = () => {
    const roomId = uuidv4();
    navigate(`/meet/${roomId}`);
    };

   

    
  
  
  return (
    
    <div className=' flex justify-center items-center'>
      
      
      
      
      <main id="your-element-selector" className="flex flex-col motion-preset-blur-right motion-duration-300 sm:flex-row justify-center pt-32 items-center mt-20 sm:mt-40 space-y-10 sm:space-y-0 sm:space-x-20 px-4">
        <button
          aria-label="Add new item"
          className="bg-[#5519D0] hover:bg-[#3d129e] rounded-3xl w-40 h-40 sm:w-52 sm:h-52 flex justify-center items-center transition duration-300 hover:scale-105"
          onClick={createMeeting}
        >
          <svg
            className="w-20 h-20 sm:w-28 sm:h-28 text-white transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
          </svg>
        </button>

        <button
          aria-label="Video camera"
           onClick={() => setShowJoin(true)}
          className="bg-[#5519D0] hover:bg-[#3d129e] rounded-3xl w-40 h-40 sm:w-52 sm:h-52 flex justify-center items-center transition duration-300 hover:scale-105"
        >
          <svg
            className="w-20 h-20 sm:w-28 sm:h-28 text-white transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17 7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10zm3 1.5-4 3v-5l4 3z" />
          </svg>
        </button>
        {showJoin && <EnterM onClose={() => setShowJoin(false)} />}
      </main>
    
    </div>
  )
}

export default Home
