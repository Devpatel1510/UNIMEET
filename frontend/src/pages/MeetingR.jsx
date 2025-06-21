import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    ScreenShare,
    MessageCircle,
    PhoneOff,
    Clipboard, ClipboardCheck
} from 'lucide-react';



const socket = io('http://localhost:5001');

const MeetingR = () => {
    const { roomId } = useParams();
    const localVideo = useRef(null);
    const peerConnections = useRef({});
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [videoOn, setVideoOn] = useState(true);
    const [chatMessage, setChatMessage] = useState('Welcome to the UNI MEET.');
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [participants, setParticipants] = useState([]);

    const meetingURL = window.location.href;


    const copyToClipboard = () => {
        navigator.clipboard.writeText(meetingURL).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };


    const handleLeaveCall = () => {

        Object.values(peerConnections.current).forEach(peer => peer.close());
        peerConnections.current = {};


        const stream = localVideo.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }



        socket.disconnect();


        setRemoteStreams([]);
        if (localVideo.current) {
            localVideo.current.srcObject = null;
        }



        navigate('/');
    };

    useEffect(() => {
        const constraints = { video: true, audio: true };

        // eslint-disable-next-line no-unused-vars
        let localStream;
        let userId;

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            localStream = stream;
            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }

            userId = socket.id;
            socket.emit('join-room', { roomId, userId });

            socket.on('user-connected', userSocketId => {
                const peer = createPeer(userSocketId, socket.id, stream);
                peerConnections.current[userSocketId] = peer;
            });

            socket.on('offer', async ({ sdp, caller }) => {
                const peer = addPeer(sdp, caller, stream);
                peerConnections.current[caller] = peer;
            });

            socket.on('answer', ({ sdp, caller }) => {
                peerConnections.current[caller].setRemoteDescription(new RTCSessionDescription(sdp));
            });

            
            socket.on('participants', (list) => {
                setParticipants(list);
            });

            
            socket.on('user-joined', (userSocketId) => {
                setParticipants(prev => [...prev, userSocketId]);
            });

            
            socket.on('user-left', (userSocketId) => {
                setParticipants(prev => prev.filter(id => id !== userSocketId));
                if (peerConnections.current[userSocketId]) {
                    peerConnections.current[userSocketId].close();
                    delete peerConnections.current[userSocketId];
                }
                setRemoteStreams(prev => prev.filter(stream => stream.id !== userSocketId));
            });



            socket.on('ice-candidate', ({ candidate, from }) => {
                const conn = peerConnections.current[from];
                if (conn) conn.addIceCandidate(new RTCIceCandidate(candidate));
            });
        });

        return () => {
            Object.values(peerConnections.current).forEach(p => p.close());
            if (localVideo.current?.srcObject) {
                localVideo.current.srcObject.getTracks().forEach(track => track.stop());
            }
            socket.disconnect();
        };
    }, [roomId]);

    const createPeer = (userToCall, callerId, stream) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = e => {
            if (e.candidate) {
                socket.emit('ice-candidate', {
                    target: userToCall,
                    candidate: e.candidate,
                });
            }
        };

        peer.ontrack = e => {
            if (e.streams && e.streams[0]) {
                setRemoteStreams(prev => {
                    const exists = prev.some(s => s.id === e.streams[0].id);
                    return exists ? prev : [...prev, e.streams[0]];
                });
            }
        };

        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            socket.emit('offer', {
                target: userToCall,
                caller: callerId,
                sdp: offer,
            });
        });

        return peer;
    };

    const addPeer = (incomingSDP, callerId, stream) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = e => {
            if (e.candidate) {
                socket.emit('ice-candidate', {
                    target: callerId,
                    candidate: e.candidate,
                });
            }
        };

        peer.ontrack = e => {
            if (e.streams && e.streams[0]) {
                setRemoteStreams(prev => {
                    const exists = prev.some(s => s.id === e.streams[0].id);
                    return exists ? prev : [...prev, e.streams[0]];
                });
            }
        };

        peer.setRemoteDescription(new RTCSessionDescription(incomingSDP)).then(() => {
            peer.createAnswer().then(answer => {
                peer.setLocalDescription(answer);
                socket.emit('answer', {
                    target: callerId,
                    caller: socket.id,
                    sdp: answer,
                });
            });
        });

        return peer;
    };

    const toggleMute = () => {
        const stream = localVideo.current.srcObject;
        stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
        setIsMuted(prev => !prev);
        updateChat(`You ${!isMuted ? 'muted' : 'unmuted'} your microphone.`);
    };

    const toggleVideo = () => {
        const stream = localVideo.current.srcObject;
        stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
        setVideoOn(prev => !prev);
        updateChat(`You ${!videoOn ? 'started' : 'stopped'} your video.`);
    };

    const updateChat = (message) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessage(`[${time}] ${message}`);
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-inter h-screen flex flex-col overflow-hidden">
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] grid-rows-[1fr_72px] gap-4 p-4 min-h-0">

                <aside className="participants bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 hidden lg:flex flex flex-col overflow-y-auto shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-sky-400">Participants</h2>
                    <ul className="space-y-2 text-slate-300 text-sm">
                        <li className="text-green-400">You (Me)</li>
                        {participants
                            .filter(id => id !== socket.id)
                            .map((id, index) => (
                                <li key={id}>Peer {index + 1}</li>
                            ))}
                    </ul>
                </aside>

                <section className="main-video-area bg-slate-900/75 backdrop-blur-lg rounded-3xl p-6 grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] auto-rows-[8.125rem] gap-4 overflow-y-auto shadow-xl">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <video ref={localVideo} autoPlay muted playsInline className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute bottom-2 left-2 bg-black/50 rounded-lg px-2 py-1 text-xs">You</div>
                    </div>

                    {remoteStreams.map((stream, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden shadow-lg">
                            <video autoPlay playsInline className="w-full h-full object-cover rounded-xl"
                                ref={video => {
                                    if (video) video.srcObject = stream;
                                }} />
                            <div className="absolute bottom-2 left-2 bg-black/50 rounded-lg px-2 py-1 text-xs">Peer {i + 1}</div>
                        </div>
                    ))}
                    
                    <div className="controls absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-sm rounded-full px-6 py-3 flex gap-6 shadow-inner">
                        <button
                            onClick={toggleMute}
                            className={`rounded-full w-14 h-14 flex justify-center items-center text-slate-100 shadow-md transition transform hover:scale-110 ${isMuted ? 'bg-white/10' : 'bg-sky-600'
                                }`}
                        >
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`rounded-full w-14 h-14 flex justify-center items-center text-slate-100 shadow-md transition transform hover:scale-110 ${videoOn ? 'bg-sky-600' : 'bg-white/10'
                                }`}
                        >
                            {videoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                        </button>

                        <button className="rounded-full w-14 h-14 flex justify-center items-center text-slate-100 bg-white/10 shadow-md transition transform hover:scale-110">
                            <ScreenShare className="w-6 h-6" />
                        </button>

                        <button className="rounded-full w-14 h-14 flex justify-center items-center text-slate-100 bg-white/10 shadow-md transition transform hover:scale-110">
                            <MessageCircle className="w-6 h-6" />
                        </button>

                        <button
                            onClick={handleLeaveCall}
                            className="rounded-full w-14 h-14 flex justify-center items-center text-white bg-red-600 hover:bg-red-700 shadow-lg transition transform hover:scale-110"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className={`rounded-full w-14 h-14 flex justify-center items-center text-slate-100 ${copied ? 'bg-green-600' : 'bg-white/10'
                                } shadow-md transition transform hover:scale-110`}
                        >
                            {copied ? <ClipboardCheck className="w-6 h-6" /> : <Clipboard className="w-6 h-6" />}
                        </button>
                    </div>
                </section>

                <aside className="sidebar bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 flex-col shadow-lg hidden lg:flex">
                    <h2 className="text-lg font-bold mb-4 text-sky-400">Call Details</h2>
                    <div className="bg-sky-800/20 rounded-3xl p-4 text-slate-300 text-sm leading-relaxed overflow-y-auto flex-grow select-none">
                        {chatMessage}
                    </div>
                </aside>



            </div>
        </div>
    );
};

export default MeetingR;
