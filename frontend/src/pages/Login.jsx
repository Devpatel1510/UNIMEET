import React, { useState } from 'react'
import { useauthstore } from '../store/auth.store';
import { Link } from 'react-router-dom';

function Login() {
    const [formdata, setformdata] = useState({
        email: "",
        password: "",
    });

    const { login, isLoginin } = useauthstore();

    const handlesubmit = (e) => {
        e.preventDefault();

        login(formdata);
    }
    return (
        <div className="m-0 p-0">
            <div className="flex flex-col md:flex-row min-h-screen">

                <div className="bg-blue-800 flex flex-col justify-center items-center w-full md:w-1/3 p-10">
                    <h1 className="text-black text-5xl mb-10 font-extrabold">
                        Login
                    </h1>
                    <form onSubmit={handlesubmit} className="w-full max-w-xs flex flex-col items-center gap-6">
                        <input
                            type="email"
                            placeholder="email"
                            className="w-64 py-3 rounded-full bg-white text-center font-bold text-black placeholder-black"
                            value={formdata.email}
                            onChange={(e) => { setformdata({ ...formdata, email: e.target.value }) }}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            className="w-64 py-3 rounded-full text-center bg-white font-bold text-black placeholder-black"
                            value={formdata.password}
                            onChange={(e) => { setformdata({ ...formdata, password: e.target.value }) }}
                        />
                        <button
                            type="submit"
                            className="bg-[#7a2344] text-white rounded-full py-2.5 px-10 mx-auto text-sm"
                        >
                            {isLoginin ? (
                                <>

                                    Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                        <Link
                            to="/signup"
                            className="text-sm hover:text-gray-300 transition"
                        >
                            Create an account ?
                        </Link>
                    </form>
                    <hr className="border-black border-t-2 w-64 mt-10 mb-6" />
                    <div className="flex gap-8">
                        <button
                            aria-label="Google"
                            className="bg-black text-white font-bold text-center text-sm w-16 h-16 rounded-full leading-5"
                        >
                            GOO
                            <br />
                            GLE
                        </button>
                        <button
                            aria-label="Apple"
                            className="bg-black text-white font-bold text-center text-sm w-16 h-16 rounded-full leading-5"
                        >
                            APPL
                            <br />
                            E
                        </button>
                        <button
                            aria-label="Something"
                            className="bg-black text-white font-bold text-center text-sm w-16 h-16 rounded-full leading-5"
                        >
                            SOME
                            <br />
                            THIN
                        </button>
                    </div>
                </div>


                <div className="flex flex-col justify-center items-center w-full md:w-2/3 p-10 bg-white">
                    <h1 className="text-black text-5xl font-extrabold mb-6">UNIMEET</h1>
                    <p className="text-black font-bold text-center max-w-xl mb-10 text-lg leading-snug">
                        UNIMEET – Universal platform for video calls, chat, and secure communication.
                    </p>
                    <img
                        src='/photo1.png'
                        alt="Illustration of a person waving holding a phone with a video call on a TV screen"
                        className="max-w-full h-auto"
                        width="600"
                        height="350"
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    )
}

export default Login
