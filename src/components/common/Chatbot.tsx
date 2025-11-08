import React, { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw,
  Lightbulb,
  Bot,
  User,
  Loader
} from 'lucide-react'
import { chatbotAPI, ChatMessage, ChatSuggestion } from '../../api/chatbot'

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  userId?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, userId = 'default' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allSuggestions, setAllSuggestions] = useState<ChatSuggestion[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async () => {
    try {
      // Load chat history
      const history = await chatbotAPI.getChatHistory(userId)
      if (history.length > 0) {
        setMessages(history)
      } else {
        // Send initial greeting if no history
        const response = await chatbotAPI.sendMessage('hello', userId)
        const botMessage: ChatMessage = {
          role: 'bot',
          message: response.bot_response,
          timestamp: response.timestamp,
          intent: response.intent
        }
        setMessages([botMessage])
        setSuggestions(response.suggestions)
      }

      // Load suggestions
      const suggestionsData = await chatbotAPI.getChatSuggestions()
      setAllSuggestions(suggestionsData)
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      // Fallback to basic greeting
      const fallbackMessage: ChatMessage = {
        role: 'bot',
        message: "Hello! I'm EcoBot, your climate assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
        intent: 'greeting'
      }
      setMessages([fallbackMessage])
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setSuggestions([])

    try {
      const response = await chatbotAPI.sendMessage(inputMessage, userId)
      
      const botMessage: ChatMessage = {
        role: 'bot',
        message: response.bot_response,
        timestamp: response.timestamp,
        intent: response.intent
      }

      setMessages(prev => [...prev, botMessage])
      setSuggestions(response.suggestions)
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        role: 'bot',
        message: "I'm sorry, I'm having trouble right now. Please try again!",
        timestamp: new Date().toISOString(),
        intent: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = async (suggestion: string) => {
    setInputMessage(suggestion)
    // Auto-send the suggestion
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  const handleQuickResponse = async (type: string, city?: string) => {
    setIsLoading(true)
    try {
      const response = await chatbotAPI.sendQuickResponse({ 
        type: type as any, 
        user_id: userId, 
        city 
      })
      
      const userMessage: ChatMessage = {
        role: 'user',
        message: `Quick: ${type}`,
        timestamp: new Date().toISOString()
      }

      const botMessage: ChatMessage = {
        role: 'bot',
        message: response.bot_response,
        timestamp: response.timestamp,
        intent: response.intent
      }

      setMessages(prev => [...prev, userMessage, botMessage])
      setSuggestions(response.suggestions)
    } catch (error) {
      console.error('Failed to send quick response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      await chatbotAPI.clearChatHistory(userId)
      setMessages([])
      setSuggestions([])
      initializeChat()
    } catch (error) {
      console.error('Failed to clear chat:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-climate-blue-600 hover:bg-climate-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-climate-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-climate-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">EcoBot</h3>
            <p className="text-xs text-climate-blue-100">Climate Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-climate-blue-500 rounded transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={clearChat}
            className="p-1 hover:bg-climate-blue-500 rounded transition-colors"
            aria-label="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-climate-blue-500 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-climate-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-climate-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <Loader className="w-4 h-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">EcoBot is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-1 mb-2">
                <Lightbulb className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600">Suggestions:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickResponse('weather_summary', 'Mumbai')}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
                disabled={isLoading}
              >
                Weather Summary
              </button>
              <button
                onClick={() => handleQuickResponse('carbon_tips')}
                className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded transition-colors"
                disabled={isLoading}
              >
                Carbon Tips
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about climate, weather, or sustainability..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-climate-blue-600 hover:bg-climate-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Toggle All Suggestions */}
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs text-climate-blue-600 hover:text-climate-blue-700 mt-2 flex items-center space-x-1"
            >
              <Lightbulb className="w-3 h-3" />
              <span>{showSuggestions ? 'Hide' : 'Show'} all suggestions</span>
            </button>
          </div>

          {/* All Suggestions Panel */}
          {showSuggestions && (
            <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 mb-3">Try asking about:</h4>
                {allSuggestions.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-3">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">{category.category}</h5>
                    <div className="space-y-1">
                      {category.suggestions.map((suggestion, suggestionIndex) => (
                        <button
                          key={suggestionIndex}
                          onClick={() => {
                            handleSuggestionClick(suggestion)
                            setShowSuggestions(false)
                          }}
                          className="block w-full text-left text-xs text-gray-700 hover:text-climate-blue-600 hover:bg-climate-blue-50 px-2 py-1 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Chatbot