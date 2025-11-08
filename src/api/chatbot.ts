import apiClient from './client';

export interface ChatMessage {
  role: 'user' | 'bot';
  message: string;
  timestamp: string;
  intent?: string;
}

export interface ChatResponse {
  status: string;
  bot_response: string;
  intent: string;
  suggestions: string[];
  data?: any;
  user_message: string;
  timestamp: string;
  conversation_id: string;
}

export interface QuickResponseType {
  type: 'weather_summary' | 'carbon_tips' | 'eco_products' | 'air_quality' | 'monsoon_info' | 'city_compare';
  user_id?: string;
  city?: string;
}

export interface ChatSuggestion {
  category: string;
  suggestions: string[];
}

export interface BotInfo {
  name: string;
  version: string;
  capabilities: string[];
  supported_cities: string[];
  sample_queries: string[];
}

export const chatbotAPI = {
  // Send a message to the chatbot
  async sendMessage(message: string, userId: string = 'default'): Promise<ChatResponse> {
    try {
      const response = await apiClient.post('/chatbot/chat', {
        message,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock chatbot response');
      return this.getMockResponse(message, userId);
    }
  },

  // Get conversation history for a user
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get(`/chatbot/chat/history/${userId}`);
      return response.data.conversation_history;
    } catch (error) {
      console.warn('Could not get chat history');
      return [];
    }
  },

  // Clear conversation history
  async clearChatHistory(userId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/chatbot/chat/history/${userId}`);
      return response.data.cleared;
    } catch (error) {
      console.warn('Could not clear chat history');
      return false;
    }
  },

  // Get suggested questions
  async getChatSuggestions(): Promise<ChatSuggestion[]> {
    try {
      const response = await apiClient.get('/chatbot/chat/suggestions');
      return response.data.suggestions;
    } catch (error) {
      console.warn('Using mock suggestions');
      return this.getMockSuggestions();
    }
  },

  // Send quick response
  async sendQuickResponse(quickResponse: QuickResponseType): Promise<ChatResponse> {
    try {
      const response = await apiClient.post('/chatbot/chat/quick-response', quickResponse);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock quick response');
      return this.getMockQuickResponse(quickResponse);
    }
  },

  // Get bot information
  async getBotInfo(): Promise<BotInfo> {
    try {
      const response = await apiClient.get('/chatbot/chat/bot-info');
      return response.data.bot_info;
    } catch (error) {
      console.warn('Using mock bot info');
      return this.getMockBotInfo();
    }
  },

  // Set conversation context
  async setContext(userId: string, context: any): Promise<boolean> {
    try {
      const response = await apiClient.post('/chatbot/chat/context', {
        user_id: userId,
        context
      });
      return response.data.status === 'success';
    } catch (error) {
      console.warn('Could not set context');
      return false;
    }
  },

  // Submit feedback
  async submitFeedback(userId: string, messageId: string, rating: number, feedback: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/chatbot/chat/feedback', {
        user_id: userId,
        message_id: messageId,
        rating,
        feedback
      });
      return response.data.status === 'success';
    } catch (error) {
      console.warn('Could not submit feedback');
      return false;
    }
  },

  // Mock responses for offline functionality
  getMockResponse(message: string, userId: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        status: 'success',
        bot_response: "Hello! I'm EcoBot, your climate assistant. I can help you with weather data, carbon footprint advice, eco-friendly tips, and more!",
        intent: 'greeting',
        suggestions: [
          "What's the weather like in Mumbai?",
          "How can I reduce my carbon footprint?",
          "Show me eco-friendly products",
          "Compare Delhi and Bangalore climate"
        ],
        user_message: message,
        timestamp: new Date().toISOString(),
        conversation_id: userId
      };
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      return {
        status: 'success',
        bot_response: "Based on the latest data, Mumbai is currently 32°C with 78% humidity. It's quite warm and humid today! Stay hydrated and consider using fans instead of AC when possible.",
        intent: 'weather_query',
        suggestions: [
          "Compare with another city",
          "Show me air quality data",
          "Carbon footprint tips for hot weather",
          "Eco-friendly cooling solutions"
        ],
        user_message: message,
        timestamp: new Date().toISOString(),
        conversation_id: userId
      };
    } else if (lowerMessage.includes('carbon') || lowerMessage.includes('footprint')) {
      return {
        status: 'success',
        bot_response: "Here are some effective ways to reduce your carbon footprint:\n\n1. Use public transport or carpool\n2. Switch to LED bulbs\n3. Eat more plant-based meals\n4. Unplug electronics when not in use\n\nWould you like me to calculate your specific carbon footprint?",
        intent: 'carbon_footprint',
        suggestions: [
          "Calculate my transportation footprint",
          "Energy saving tips",
          "Sustainable food choices",
          "Green energy options"
        ],
        user_message: message,
        timestamp: new Date().toISOString(),
        conversation_id: userId
      };
    } else if (lowerMessage.includes('eco') || lowerMessage.includes('sustainable')) {
      return {
        status: 'success',
        bot_response: "Here are some eco-friendly product recommendations:\n\n• Bamboo toothbrushes and reusable water bottles\n• Solar-powered chargers and LED light bulbs\n• Organic cotton clothing and biodegradable cleaning products\n\nThese products help reduce environmental impact while maintaining quality!",
        intent: 'eco_shopping',
        suggestions: [
          "More sustainable alternatives",
          "Local eco-friendly stores",
          "DIY eco-friendly solutions",
          "Carbon footprint of products"
        ],
        user_message: message,
        timestamp: new Date().toISOString(),
        conversation_id: userId
      };
    } else {
      return {
        status: 'success',
        bot_response: "I'm specialized in climate and environmental topics! I can help you with weather data, carbon footprint advice, eco-friendly tips, and sustainability guidance. What would you like to know?",
        intent: 'fallback',
        suggestions: [
          "What's the weather like in Mumbai?",
          "How can I reduce my carbon footprint?",
          "Show me eco-friendly products",
          "Compare city climates",
          "Air quality information"
        ],
        user_message: message,
        timestamp: new Date().toISOString(),
        conversation_id: userId
      };
    }
  },

  getMockQuickResponse(quickResponse: QuickResponseType): ChatResponse {
    const responses = {
      weather_summary: {
        bot_response: `Current weather in ${quickResponse.city || 'Delhi'}: 28°C, 65% humidity, light winds. Perfect for outdoor activities!`,
        intent: 'weather_query',
        suggestions: ["Compare with other cities", "Air quality check", "Eco-friendly activities"]
      },
      carbon_tips: {
        bot_response: "Quick carbon reduction tips:\n• Use public transport\n• Switch to renewable energy\n• Reduce meat consumption\n• Buy local products",
        intent: 'carbon_footprint',
        suggestions: ["Calculate my footprint", "Energy-saving tips", "Sustainable transportation"]
      },
      eco_products: {
        bot_response: "Eco-friendly essentials:\n• Reusable bags and bottles\n• Solar chargers\n• Organic skincare\n• Energy-efficient appliances",
        intent: 'eco_shopping',
        suggestions: ["Product comparisons", "Local eco stores", "DIY alternatives"]
      },
      air_quality: {
        bot_response: `Air quality in ${quickResponse.city || 'Delhi'} is moderate today. Consider indoor plants and air purifiers for better indoor air quality.`,
        intent: 'air_quality',
        suggestions: ["Indoor air quality tips", "Best air-purifying plants", "Pollution reduction"]
      },
      monsoon_info: {
        bot_response: "Indian monsoon (June-September) brings 70-80% of annual rainfall. It's crucial for agriculture and water resources. Great time for rainwater harvesting!",
        intent: 'seasonal',
        suggestions: ["Rainwater harvesting", "Monsoon preparation", "Seasonal gardening"]
      },
      city_compare: {
        bot_response: `Comparing ${quickResponse.city || 'Delhi'} with Mumbai: Different climate zones mean varying temperatures and humidity levels throughout the year.`,
        intent: 'comparison',
        suggestions: ["Detailed comparison", "Seasonal differences", "Living costs comparison"]
      }
    };

    const response = responses[quickResponse.type] || responses.weather_summary;
    
    return {
      status: 'success',
      bot_response: response.bot_response,
      intent: response.intent,
      suggestions: response.suggestions,
      user_message: `Quick: ${quickResponse.type}`,
      timestamp: new Date().toISOString(),
      conversation_id: quickResponse.user_id || 'default'
    };
  },

  getMockSuggestions(): ChatSuggestion[] {
    return [
      {
        category: "Weather Queries",
        suggestions: [
          "What's the weather like in Mumbai?",
          "Show me temperature in Delhi",
          "How humid is it in Chennai?",
          "Tell me about rainfall in Bangalore"
        ]
      },
      {
        category: "City Comparisons",
        suggestions: [
          "Compare Mumbai and Delhi weather",
          "Delhi vs Bangalore climate",
          "Which city is warmer: Chennai or Kolkata?",
          "Compare rainfall between cities"
        ]
      },
      {
        category: "Carbon Footprint",
        suggestions: [
          "How can I reduce my carbon footprint?",
          "Calculate my transportation emissions",
          "Energy saving tips",
          "Sustainable living practices"
        ]
      },
      {
        category: "Eco-Shopping",
        suggestions: [
          "Show me eco-friendly products",
          "Sustainable alternatives to plastic",
          "Green energy solutions",
          "Organic and natural products"
        ]
      },
      {
        category: "Climate Knowledge",
        suggestions: [
          "Explain Indian monsoon season",
          "Best time to visit different cities",
          "Air quality tips",
          "Seasonal climate patterns"
        ]
      }
    ];
  },

  getMockBotInfo(): BotInfo {
    return {
      name: "EcoBot",
      version: "1.0.0",
      capabilities: [
        "Weather data for Indian cities",
        "Climate comparisons between cities",
        "Carbon footprint advice and calculations",
        "Eco-friendly product recommendations",
        "Air quality insights",
        "Seasonal climate patterns",
        "Sustainable living tips"
      ],
      supported_cities: [
        "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
        "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Kochi"
      ],
      sample_queries: [
        "What's the weather like in Mumbai?",
        "Compare climate between Delhi and Bangalore",
        "How can I reduce my carbon footprint?",
        "Show me eco-friendly products",
        "Tell me about monsoon season",
        "Air quality tips for Delhi"
      ]
    };
  }
};