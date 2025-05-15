
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { aiChatbot, type AIChatbotInput } from '@/ai/flows/ai-chatbot';
import { Bot, User, Send, Loader2, Settings2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type ChatbotTone = AIChatbotInput['preferredTone'];

const availableTones: { value: NonNullable<ChatbotTone>; label: string }[] = [
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'calm', label: 'Calm' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'direct', label: 'Direct' },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferredTone, setPreferredTone] = useState<ChatbotTone>('empathetic');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        requestAnimationFrame(() => {
          scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        });
      }
    }
  }, [messages]);
  
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm Manasooth Bot, here to offer a supportive space. How are you feeling today? You can also select a preferred chat style below.",
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  }, []);


  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Prepare chat history: last 5 messages (or 10 items: 5 user, 5 AI)
    const historyForAI = messages.slice(-10).map(msg => ({ sender: msg.sender, text: msg.text }));

    try {
      const aiResponse = await aiChatbot({ 
        message: currentInput, 
        preferredTone: preferredTone,
        chatHistory: historyForAI 
      });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      toast({ title: "Chatbot Error", description: "Could not get a response from the AI. Please try again.", variant: "destructive" });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a little trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <Bot className="mr-3 h-7 w-7 text-primary" /> AI Chat Support
              </CardTitle>
              <CardDescription>A safe space to express your thoughts and feelings. I&apos;m here to listen and support you.</CardDescription>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto max-w-xs">
              <Label htmlFor="tone-select" className="text-xs text-muted-foreground flex items-center">
                <Settings2 className="h-3 w-3 mr-1"/> Chat Style
              </Label>
              <Select
                value={preferredTone}
                onValueChange={(value) => setPreferredTone(value as ChatbotTone)}
                disabled={isLoading}
              >
                <SelectTrigger id="tone-select" className="h-9 text-xs w-full sm:w-[150px]">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {availableTones.map(tone => (
                    <SelectItem key={tone.value} value={tone.value} className="text-xs">
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4 sm:p-6" ref={scrollAreaRef}>
            <div className="space-y-6" aria-live="polite" aria-atomic="false">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <Avatar className="h-10 w-10 border border-primary/50">
                       <div className="bg-primary rounded-full p-1.5">
                        <Bot className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-3 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card border border-border text-card-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                     <Avatar className="h-10 w-10 border">
                       <div className="bg-secondary rounded-full p-1.5">
                        <User className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-3 justify-start">
                  <Avatar className="h-10 w-10 border border-primary/50">
                     <div className="bg-primary rounded-full p-1.5">
                        <Bot className="h-6 w-6 text-primary-foreground" />
                      </div>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-xl px-4 py-3 shadow-md bg-card border border-border text-card-foreground rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full items-center space-x-3"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-base py-3 px-4 h-12"
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <Button type="submit" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading || input.trim() === ''}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
