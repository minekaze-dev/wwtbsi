import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Lifelines, LifelineResult, ChatMessage } from '../types';

interface QuestionPanelProps {
  question: Question;
  onChooseAnswer: (index: number) => void;
  locked: boolean;
  selectedAnswer: number | null;
  revealAnswer: boolean;
  lifelines: Lifelines;
  useFifty: () => void;
  useAudience: () => void;
  useChat: () => void;
  lifelineResult: LifelineResult;
  lifelineTimer: number | null;
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendChatMessage: () => void;
}

const OptionButton: React.FC<{
    optionText: string;
    index: number;
    onClick: (index: number) => void;
    isSelected: boolean;
    isCorrect: boolean;
    isWrong: boolean;
    isDisabled: boolean;
}> = ({ optionText, index, onClick, isSelected, isCorrect, isWrong, isDisabled }) => {
    const getButtonClass = () => {
        if (isCorrect) return "bg-green-500/90 border-green-400 ring-2 ring-green-300";
        if (isWrong) return "bg-red-600/90 border-red-400 ring-2 ring-red-300";
        if (isSelected) return "bg-yellow-500/80 border-yellow-400";
        return "bg-indigo-600/40 border-indigo-500 hover:bg-indigo-500/60";
    };

    return (
        <motion.button
            whileTap={{ scale: isDisabled ? 1 : 0.97 }}
            onClick={() => onClick(index)}
            disabled={isDisabled}
            className={`w-full border rounded-lg p-4 text-left transition-all duration-200 text-white font-semibold flex items-center text-lg select-none ${getButtonClass()} ${isDisabled && !isCorrect ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            <span className="text-yellow-400 mr-3">{String.fromCharCode(65 + index)}:</span>
            <span>{optionText}</span>
        </motion.button>
    );
};


const LifelineButton: React.FC<{ icon: string; onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ icon, onClick, disabled, children }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${disabled ? 'bg-gray-700/50 cursor-not-allowed opacity-50' : 'bg-indigo-500 hover:bg-indigo-400 transform hover:scale-110'}`}
        >
            <i className={`fa-solid ${icon} text-2xl`}></i>
            <span className="text-xs mt-1">{children}</span>
        </button>
    )
}

const ChatUI: React.FC<{ 
    messages: ChatMessage[], 
    isLoading: boolean, 
    chatInput: string,
    onChatInputChange: (value: string) => void,
    onSendChatMessage: () => void
}> = ({ messages, isLoading, chatInput, onChatInputChange, onSendChatMessage }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim() && !isLoading) {
            onSendChatMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div ref={chatContainerRef} className="flex-grow space-y-2 overflow-y-auto pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm rounded-lg px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-slate-700 rounded-lg px-3 py-2 text-sm">
                           <span className="animate-pulse text-slate-300 italic">Teman anda sedang mengetik...</span>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleFormSubmit} className="mt-2 flex gap-2">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    placeholder="Ketik pesanmu..."
                    disabled={isLoading}
                    className="flex-grow bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                />
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-50">
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

const QuestionPanel: React.FC<QuestionPanelProps> = ({ 
    question, onChooseAnswer, locked, selectedAnswer, revealAnswer, 
    lifelines, useFifty, useAudience, useChat, lifelineResult, lifelineTimer,
    chatInput, onChatInputChange, onSendChatMessage
}) => {
  return (
    <section className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
      <AnimatePresence>
      {lifelineResult && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-black/40 rounded-lg flex-shrink-0 p-4 min-h-[150px] flex flex-col"
        >
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-yellow-400">
                    {lifelineResult.type === 'audience' && 'Hasil Polling Audiens'}
                    {lifelineResult.type === 'chat' && 'Chat Teman'}
                </h4>
                {lifelineTimer !== null && (
                    <div className="text-lg font-bold text-red-500 bg-black/50 px-3 py-1 rounded-full">
                        <i className="fa-solid fa-clock mr-2"></i>{lifelineTimer}
                    </div>
                )}
            </div>

            {lifelineResult.type === 'audience' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end flex-grow">
                    {lifelineResult.poll.map((p, i) => (
                        !question.hiddenOptions?.includes(i) && <div key={i} className="text-sm text-center">
                            <div className="w-full h-24 bg-white/10 rounded-t flex items-end">
                                <motion.div 
                                    initial={{ height: '0%' }}
                                    animate={{ height: `${p}%`}}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="w-full bg-indigo-400 rounded-t" 
                                />
                            </div>
                            <div className="font-bold mt-1">{String.fromCharCode(65 + i)}: {p}%</div>
                        </div>
                    ))}
                </div>
            )}
            {lifelineResult.type === 'chat' && (
                <ChatUI 
                    messages={lifelineResult.messages} 
                    isLoading={lifelineResult.isLoading}
                    chatInput={chatInput}
                    onChatInputChange={onChatInputChange}
                    onSendChatMessage={onSendChatMessage}
                />
            )}
        </motion.div>
      )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question?.options.map((opt, i) => (
          <OptionButton
            key={i}
            optionText={opt}
            index={i}
            onClick={onChooseAnswer}
            isSelected={selectedAnswer === i}
            isCorrect={revealAnswer && i === question.answerIndex}
            isWrong={revealAnswer && selectedAnswer === i && i !== question.answerIndex}
            isDisabled={locked || (question.hiddenOptions?.includes(i) ?? false)}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-6 flex-shrink-0">
          <LifelineButton icon="fa-star-half-stroke" onClick={useFifty} disabled={lifelines.fifty}>50:50</LifelineButton>
          <LifelineButton icon="fa-users" onClick={useAudience} disabled={lifelines.audience}>Audience</LifelineButton>
          <LifelineButton icon="fa-comments" onClick={useChat} disabled={lifelines.chat}>Chat</LifelineButton>
      </div>
    </section>
  );
};

export default QuestionPanel;