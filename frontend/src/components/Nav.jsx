import React,{useEffect} from 'react'
import { useauthstore } from '../store/auth.store'
import { Link } from 'react-router-dom';
import MSidebar from './MobileSidebar';

function Nav() {
  
   useEffect(() => {
    const navToggle = document.getElementById("nav-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    const toggleMenu = () => {
      if (mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== "0px") {
        mobileMenu.style.maxHeight = "0px";
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      } else {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        mobileMenu.style.maxHeight = "0px";
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    };

    navToggle.addEventListener("click", toggleMenu);
    window.addEventListener("resize", handleResize);

    return () => {
      navToggle.removeEventListener("click", toggleMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
    const {logout} = useauthstore();
  return (
    <div>
      
      <header className="bg-gradient-to-r from-[#5c3cdb] to-[#8b5cf6] w-full py-4 shadow-lg flex justify-between items-center px-4 md:justify-center md:px-0 relative">
        <div className="text-white font-extrabold text-lg select-none tracking-wide drop-shadow-md md:hidden">
          UNIMEET
        </div>
         <nav
          id="nav-menu"
          className="hidden md:flex space-x-10 font-extrabold text-white text-lg select-none tracking-wide drop-shadow-md"
        >
          <Link
            to="/"
            className="relative px-3 py-1 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
          >
            Home
          </Link>
          
          <Link
            to="/chat"
            
            className="relative px-3 py-1 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
          >
            
        
            Chats
          </Link>
          
          <Link
            to="/account"
            className="relative px-3 py-1 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
          >
            Account
          </Link>
          <button
            onClick={logout}
            className="relative px-3 py-1 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </nav>
         <button
          id="nav-toggle"
          aria-label="Toggle navigation menu"
          className="text-white text-2xl md:hidden focus:outline-none"
          type="button"
        >
          <i className="fas fa-bars"></i>
        </button>

        
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full bg-gradient-to-r from-[#5c3cdb] to-[#8b5cf6] shadow-lg md:hidden overflow-hidden max-h-0 transition-[max-height] duration-300 ease-in-out rounded-b-3xl z-50"
        >
          <nav className="flex flex-col space-y-2 py-4 px-6 font-extrabold text-white text-lg select-none tracking-wide">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            <Link
              to="/chat"
              className="px-3 py-2 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
            >
              Chats
            </Link>
            <Link
              to="/account"
              className="px-3 py-2 rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
            >
              Account
            </Link>
            <button
              onClick={logout}
              className="px-3 py-2 text-left rounded-lg hover:bg-white/20 transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Nav
