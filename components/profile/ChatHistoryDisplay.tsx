'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatHistoryDisplayProps {
  userId: string;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export function ChatHistoryDisplay({ userId }: ChatHistoryDisplayProps) {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        // For now, we'll create a mock chat history since we don't have a chat history API yet
        // In a real implementation, you'd fetch from an API endpoint like /api/chat/history
        const mockHistory: ChatSession[] = [
          {
            id: '1',
            title: 'Career advice for software engineering',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            messages: [
              {
                id: '1',
                content: 'What are the best career paths for someone with my background in computer science?',
                role: 'user',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: '2',
                content: 'Based on your profile, I can see you have strong analytical skills and enjoy problem-solving. Here are some career paths that align with your interests...',
                role: 'assistant',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
              },
            ],
          },
          {
            id: '2',
            title: 'Resume feedback and improvements',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            messages: [
              {
                id: '3',
                content: 'Can you review my resume and suggest improvements?',
                role: 'user',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: '4',
                content: 'I\'ve analyzed your resume and here are my recommendations for making it more impactful...',
                role: 'assistant',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 120000).toISOString(),
              },
            ],
          },
        ];

        setChatHistory(mockHistory);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessage = (messages: ChatMessage[]) => {
    return messages[messages.length - 1];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading chat history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Conversations</CardTitle>
        <p className="text-xs text-muted-foreground">
          Your chat history with Milo
        </p>
      </CardHeader>
      <CardContent>
        {chatHistory.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-3">No conversations yet</p>
            <Button size="sm" onClick={() => router.push('/')}>
              Start Your First Conversation
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {chatHistory.map((chat) => {
              const lastMessage = getLastMessage(chat.messages);
              return (
                <div
                  key={chat.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-xs">{chat.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(chat.updatedAt)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {lastMessage.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {chat.messages.length} messages
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last: {formatDate(lastMessage.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
