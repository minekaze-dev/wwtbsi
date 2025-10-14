import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, GameState, Lifelines, LifelineResult, LeaderboardEntry, ChatMessage, GameMode } from './types';
import { generateQuestions, getChatLifelineHelp } from './services/geminiService';
import { GAME_MODES, AVATARS } from './constants';
import QuestionPanel from './components/QuestionPanel';
import Sidebar from './components/Sidebar';
import GameOverModal from './components/GameOverModal';
import LoadingSpinner from './components/LoadingSpinner';
import Leaderboard from './components/Leaderboard';
import ConfirmationModal from './components/ConfirmationModal';
import EtiquetteModal from './components/EtiquetteModal';
import ModeSelectionModal from './components/ModeSelectionModal';
import TimerProgressBar from './components/TimerProgressBar';

const getWeekIdentifier = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-${weekNo}`;
};


export default function App() {
    const [gameState, setGameState] = useState<GameState>('WELCOME');
    const [gameMode, setGameMode] = useState<GameMode>('HARD');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [points, setPoints] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [locked, setLocked] = useState(false);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [lifelines, setLifelines] = useState<Lifelines>({ fifty: false, audience: false, chat: false });
    const [lifelineResult, setLifelineResult] = useState<LifelineResult>(null);
    const [walkedAway, setWalkedAway] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [disqualified, setDisqualified] = useState(false);
    const [timedOut, setTimedOut] = useState(false);
    
    const [normalLeaderboard, setNormalLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [hardLeaderboard, setHardLeaderboard] = useState<LeaderboardEntry[]>([]);
    
    const [isConfirmingWalkAway, setIsConfirmingWalkAway] = useState(false);
    const [showEtiquetteModal, setShowEtiquetteModal] = useState(false);
    const [showModeSelectionModal, setShowModeSelectionModal] = useState(false);
    
    // Timer State
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [totalDuration, setTotalDuration] = useState<number | null>(null);
    // FIX: Declare lifelineTimer state variable
    const [lifelineTimer, setLifelineTimer] = useState<number | null>(null);
    const timerIntervalRef = useRef<number | null>(null);
    const lifelineIntervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const [chatInput, setChatInput] = useState('');
    
    const gameConfig = useMemo(() => GAME_MODES[gameMode], [gameMode]);

    const clearTimer = useCallback((timerRef: React.MutableRefObject<number | null>) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const loadLeaderboard = useCallback(() => {
        const currentWeekId = getWeekIdentifier(new Date());

        Object.keys(GAME_MODES).forEach(mode => {
            const key = GAME_MODES[mode as GameMode].leaderboardKey;
            const savedData = localStorage.getItem(key);
            const setter = mode === 'NORMAL' ? setNormalLeaderboard : setHardLeaderboard;

            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData.weekId === currentWeekId && Array.isArray(parsedData.scores)) {
                        setter(parsedData.scores);
                    } else {
                        setter([]);
                    }
                } catch (error) {
                    console.error(`Failed to parse ${mode} leaderboard data, resetting.`, error);
                    setter([]);
                }
            }
        });
    }, []);

    useEffect(() => {
        loadLeaderboard();
    }, [loadLeaderboard]);
    
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && gameState === 'PLAYING') {
                setDisqualified(true);
                setGameState('GAME_OVER');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [gameState]);


    const saveLeaderboard = (mode: GameMode, board: LeaderboardEntry[]) => {
        const currentWeekId = getWeekIdentifier(new Date());
        const dataToSave = {
            weekId: currentWeekId,
            scores: board
        };
        localStorage.setItem(GAME_MODES[mode].leaderboardKey, JSON.stringify(dataToSave));
    };

    const clearLifelineTimer = () => {
        clearTimer(lifelineIntervalRef);
        setLifelineTimer(null);
    };

    useEffect(() => {
        if (lifelineTimer === 0) {
            clearLifelineTimer();
            setLifelineResult(null);
        }
    }, [lifelineTimer]);

    const startLifelineTimer = () => {
        clearLifelineTimer();
        setLifelineTimer(30);
        lifelineIntervalRef.current = window.setInterval(() => {
            setLifelineTimer(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
    };
    
    useEffect(() => {
      // Main question timer logic
      if (gameState === 'PLAYING' && questions.length > 0 && currentIdx < questions.length) {
        const currentQ = questions[currentIdx];
        const duration = currentQ.category === 'Matematika' ? 90 : 30;
        setTotalDuration(duration);
        setTimeLeft(duration);

        clearTimer(timerIntervalRef);
        timerIntervalRef.current = window.setInterval(() => {
          setTimeLeft(prev => {
            if (prev !== null && prev > 1) {
              return prev - 1;
            }
            clearTimer(timerIntervalRef);
            setTimedOut(true);
            setGameState('GAME_OVER');
            return 0;
          });
        }, 1000);
      } else {
        clearTimer(timerIntervalRef);
      }
    
      return () => clearTimer(timerIntervalRef);
    }, [gameState, currentIdx, questions, clearTimer]);


    useEffect(() => {
        return () => {
            clearTimer(lifelineIntervalRef);
            clearTimer(timerIntervalRef);
        };
    }, [clearTimer]);

    const resetGame = (fullReset: boolean) => {
        setCurrentIdx(0);
        setScore(0);
        setPoints(0);
        setSelectedAnswer(null);
        setLocked(false);
        setRevealAnswer(false);
        setLifelineResult(null);
        setWalkedAway(false);
        setIsWinner(false);
        setDisqualified(false);
        setTimedOut(false);
        clearLifelineTimer();
        clearTimer(timerIntervalRef);
        setChatInput('');
        startTimeRef.current = null;
        if(fullReset) {
            setLifelines({ fifty: false, audience: false, chat: false });
        }
    }
    
    const handleStartQuizFlow = () => {
        setShowModeSelectionModal(true);
    };

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode);
        setShowModeSelectionModal(false);
        setShowEtiquetteModal(true);
    };

    const handleAcknowledgeEtiquette = async () => {
        setShowEtiquetteModal(false);
        setGameState('LOADING');
        resetGame(true);
        try {
            const newQuestions = await generateQuestions(gameMode);
            setQuestions(newQuestions);
            startTimeRef.current = Date.now();
            setGameState('PLAYING');
        } catch (error) {
            console.error(error);
            setGameState('ERROR');
        }
    };

    const handleChooseAnswer = (index: number) => {
        if (locked) return;
        clearTimer(timerIntervalRef);
        setLocked(true);
        setSelectedAnswer(index);
        clearLifelineTimer();
        
        setTimeout(() => {
            setRevealAnswer(true);
            const isCorrect = index === questions[currentIdx].answerIndex;
            setTimeout(() => {
                if (isCorrect) {
                    const currentPrize = gameConfig.prizeTiers[currentIdx].prize;
                    setScore(currentPrize);
                    setPoints(prev => prev + 10);
                    if (currentIdx + 1 >= questions.length) {
                        setIsWinner(true);
                        setGameState('GAME_OVER');
                    } else {
                        setCurrentIdx(prev => prev + 1);
                        setSelectedAnswer(null);
                        setLocked(false);
                        setRevealAnswer(false);
                        setLifelineResult(null);
                    }
                } else {
                    setGameState('GAME_OVER');
                }
            }, 2000);
        }, 1500);
    };
    
    const handleWalkAway = () => {
        setIsConfirmingWalkAway(true);
    };

    const handleConfirmWalkAway = () => {
        clearTimer(timerIntervalRef);
        setWalkedAway(true);
        setGameState('GAME_OVER');
        setIsConfirmingWalkAway(false);
    };

    const handleCancelWalkAway = () => {
        setIsConfirmingWalkAway(false);
    };
    
    const useFifty = () => {
        if (lifelines.fifty || locked) return;
        setLifelines(p => ({ ...p, fifty: true }));
        setQuestions(prev => {
            const newQ = [...prev];
            const currentQ = newQ[currentIdx];
            const correctIdx = currentQ.answerIndex;
            const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
            const hidden = ([...wrongIndices]).sort(() => 0.5 - Math.random()).slice(0, 2);
            newQ[currentIdx] = { ...currentQ, hiddenOptions: hidden };
            return newQ;
        });
    };

    const useAudience = () => {
        if (lifelines.audience || locked) return;
        setLifelines(p => ({ ...p, audience: true }));
        const currentQ = questions[currentIdx];
        const poll = [0, 0, 0, 0];
        let remaining = 100;
        const correctChance = Math.min(0.85, 0.4 + (15 - currentIdx) / 20);
        const correctShare = Math.round(remaining * correctChance);
        poll[currentQ.answerIndex] = correctShare;
        remaining -= correctShare;
        
        const wrongOptions = [0,1,2,3].filter(i => i !== currentQ.answerIndex);
        if(currentQ.hiddenOptions) {
            const visibleWrong = wrongOptions.filter(i => !currentQ.hiddenOptions?.includes(i));
            if(visibleWrong.length > 0) {
                 poll[visibleWrong[0]] = remaining;
            }
        } else {
            const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random());
            poll[shuffledWrong[0]] = Math.round(remaining * 0.6);
            poll[shuffledWrong[1]] = Math.round(remaining * 0.3);
            poll[shuffledWrong[2]] = remaining - poll[shuffledWrong[0]] - poll[shuffledWrong[1]];
        }
        
        setLifelineResult({ type: 'audience', poll });
        startLifelineTimer();
    };

    const useChat = async () => {
        if (lifelines.chat || locked) return;
        setLifelines(p => ({ ...p, chat: true }));
    
        const currentQ = questions[currentIdx];
        const firstMessage: ChatMessage = { sender: 'user', text: currentQ.q };

        setLifelineResult({ type: 'chat', messages: [firstMessage], isLoading: true });
        startLifelineTimer();

        const aiResponseText = await getChatLifelineHelp(currentQ, currentQ.q, true);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    
        setLifelineResult(prev => {
            if (prev && prev.type === 'chat') {
                return { ...prev, messages: [...prev.messages, aiMessage], isLoading: false };
            }
            return prev;
        });
    };

    const handleSendChatMessage = async () => {
        if (!chatInput.trim() || !lifelineResult || lifelineResult.type !== 'chat') return;

        const userMessage: ChatMessage = { sender: 'user', text: chatInput };
        setLifelineResult(prev => ({ ...prev, type: 'chat', messages: [...(prev as any).messages, userMessage], isLoading: true }));
        setChatInput('');

        const aiResponseText = await getChatLifelineHelp(questions[currentIdx], chatInput, false);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
        
        setLifelineResult(prev => {
            if (prev && prev.type === 'chat') {
                return { ...prev, messages: [...prev.messages, aiMessage], isLoading: false };
            }
            return prev;
        });
    };
    
    const handlePlayAgain = useCallback(() => {
        setGameState('WELCOME');
        setQuestions([]);
        resetGame(true);
    }, []);


    const handleNameSubmit = async (name: string) => {
        if (!isWinner || !startTimeRef.current) return;

        const endTime = Date.now();
        const durationInSeconds = (endTime - startTimeRef.current) / 1000;

        const newEntry: LeaderboardEntry = {
            name,
            score: getFinalWinnings(),
            points: points,
            time: durationInSeconds,
            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        };
        
        const currentLeaderboard = gameMode === 'NORMAL' ? normalLeaderboard : hardLeaderboard;
        const newLeaderboard = [...currentLeaderboard, newEntry]
            .sort((a, b) => a.time - b.time) // Sort by fastest time
            .slice(0, 5);

        if(gameMode === 'NORMAL') {
            setNormalLeaderboard(newLeaderboard);
            saveLeaderboard('NORMAL', newLeaderboard);
        } else {
            setHardLeaderboard(newLeaderboard);
            saveLeaderboard('HARD', newLeaderboard);
        }
        
        handlePlayAgain();
    };

    const getFinalWinnings = useCallback(() => {
        if (walkedAway || isWinner) return score;
        let lastGuaranteedLevel = 0;
        for (const level of gameConfig.guaranteedLevels) {
            if (currentIdx >= (level-1)) {
                lastGuaranteedLevel = level;
            } else {
                break;
            }
        }
        return lastGuaranteedLevel > 0 ? gameConfig.prizeTiers[lastGuaranteedLevel - 1].prize : 0;
    }, [currentIdx, score, isWinner, walkedAway, gameConfig]);
    
    const currentQ = useMemo(() => questions[currentIdx], [questions, currentIdx]);

    const renderContent = () => {
        switch (gameState) {
            case 'LOADING':
                return <div className="flex-grow flex items-center justify-center"><LoadingSpinner message="Generating Your Quiz..." /></div>;
            case 'ERROR':
                return (
                    <div className="flex-grow flex items-center justify-center text-center text-white">
                        <div>
                            <h2 className="text-2xl text-red-500">Failed to Load Quiz</h2>
                            <p className="mt-2">There was an error communicating with the AI. Please try again.</p>
                            <button onClick={() => setGameState('WELCOME')} className="mt-4 px-4 py-2 bg-indigo-600 rounded">Back to Menu</button>
                        </div>
                    </div>
                );
            case 'WELCOME':
            case 'PLAYING':
                return (
                     <main className="flex-grow w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                        <div className="hidden lg:flex flex-col gap-6">
                            <Leaderboard leaderboard={hardLeaderboard} title="Top Smartest - Hard" />
                            <Leaderboard leaderboard={normalLeaderboard} title="Top Smartest - Normal" />
                        </div>

                        <div className="lg:col-span-2 flex flex-col gap-6">
                             <div className="flex-grow rounded-2xl border border-white/10 bg-black/20 flex flex-col items-center justify-center p-6 text-center">
                                {gameState === 'WELCOME' ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex flex-col items-center"
                                    >
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Selamat Datang di Who Wants to Be a Smart Indonesian!</h2>
                                        <p className="mt-4 text-gray-300 max-w-md mx-auto">
                                            Pilih mode permainan Anda dan buktikan pengetahuan Anda untuk menjadi yang terpintar di Indonesia!
                                        </p>
                                        <button onClick={handleStartQuizFlow} className="mt-8 px-8 py-4 bg-green-600 hover:bg-green-500 rounded-lg transition-colors font-bold text-xl transform hover:scale-105">
                                            Mulai Kuis!
                                        </button>
                                    </motion.div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIdx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.4 }}
                                            className="w-full"
                                        >
                                            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white select-none">{currentQ?.q}</h2>
                                             {timeLeft !== null && totalDuration !== null && (
                                                <TimerProgressBar timeLeft={timeLeft} totalDuration={totalDuration} />
                                             )}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                             </div>
                             {gameState === 'PLAYING' && currentQ && <div className="flex-shrink-0">
                                <QuestionPanel 
                                    question={currentQ}
                                    onChooseAnswer={handleChooseAnswer}
                                    locked={locked}
                                    selectedAnswer={selectedAnswer}
                                    revealAnswer={revealAnswer}
                                    lifelines={lifelines}
                                    useFifty={useFifty}
                                    useAudience={useAudience}
                                    useChat={useChat}
                                    lifelineResult={lifelineResult}
                                    lifelineTimer={lifelineTimer}
                                    chatInput={chatInput}
                                    onChatInputChange={setChatInput}
                                    onSendChatMessage={handleSendChatMessage}
                                />
                             </div>}
                        </div>
                        
                        <div>
                            <Sidebar 
                                currentQuestionIndex={currentIdx}
                                prizeTiers={gameConfig.prizeTiers}
                                guaranteedLevels={gameConfig.guaranteedLevels}
                                onWalkAway={handleWalkAway}
                                isPlaying={gameState === 'PLAYING'}
                                points={points}
                            />
                        </div>
                    </main>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen text-white p-4 sm:p-6 flex flex-col relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            <div className="z-10 flex flex-col h-full flex-grow">
                <header className="flex items-center justify-between mb-6 flex-shrink-0 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-black font-bold text-2xl shadow-lg">
                            <i className="fa-solid fa-brain"></i>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Who Wants to Be a Smart Indonesian</h1>
                            <p className="text-xs sm:text-sm text-gray-300 font-semibold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">Be #1 in Indonesia</p>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={gameState}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-grow flex flex-col"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>

                <footer className="text-center text-xs text-gray-500 pt-4 flex-shrink-0">
                    © 2025 Who Wants to Be a Smart Indonesian. All Rights Reserved.
                </footer>
            </div>
            
            <AnimatePresence>
                {gameState === 'GAME_OVER' && (
                    <GameOverModal 
                        finalWinnings={getFinalWinnings()}
                        walkAway={walkedAway}
                        isWinner={isWinner}
                        disqualified={disqualified}
                        timedOut={timedOut}
                        onSubmitName={handleNameSubmit}
                        onPlayAgain={handlePlayAgain}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isConfirmingWalkAway && (
                    <ConfirmationModal 
                        prizeAmount={score}
                        onConfirm={handleConfirmWalkAway}
                        onCancel={handleCancelWalkAway}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showModeSelectionModal && (
                    <ModeSelectionModal onSelectMode={handleModeSelect} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showEtiquetteModal && (
                    <EtiquetteModal onClose={handleAcknowledgeEtiquette} />
                )}
            </AnimatePresence>
        </div>
    );
}