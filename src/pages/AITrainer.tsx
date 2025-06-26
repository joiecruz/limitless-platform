
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles, BookOpen, Users, Target } from "lucide-react";

export default function AITrainer() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage("");
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm your AI Ready Master Trainer! I can help you with innovation strategies, project planning, team building, and much more. What specific challenge are you facing today?"
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const quickActions = [
    {
      title: "Innovation Strategy",
      description: "Get guidance on developing your innovation roadmap",
      icon: Target,
      prompt: "Help me create an innovation strategy for my organization"
    },
    {
      title: "Team Building",
      description: "Learn how to build and manage innovative teams",
      icon: Users,
      prompt: "What are the key principles for building high-performing innovation teams?"
    },
    {
      title: "Learning Path",
      description: "Get personalized recommendations for your growth",
      icon: BookOpen,
      prompt: "Can you recommend a learning path for someone new to innovation management?"
    }
  ];

  const handleQuickAction = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Ready Master Trainer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal AI-powered innovation coach, ready to guide you through complex challenges 
            and accelerate your innovation journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Master Trainer</h3>
                    <p className="text-sm text-gray-500">Online • Ready to help</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Ready to accelerate your innovation journey?
                    </h3>
                    <p className="text-gray-500">
                      Ask me anything about innovation, strategy, team building, or use one of the quick actions below.
                    </p>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask your AI Master Trainer anything..."
                    className="flex-1 min-h-[44px] max-h-32 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                    onClick={() => handleQuickAction(action.prompt)}
                  >
                    <div className="flex items-start gap-3">
                      <action.icon className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">AI Capabilities</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Innovation Strategy Planning
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Team Building & Leadership
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Project Management
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Learning Path Recommendations
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
