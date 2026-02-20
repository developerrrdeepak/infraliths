'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatbotWidget from "./chatbot-widget";
import { MessagesSquare } from "lucide-react";
import ChatHistoryPanel from "./chat-history-panel";
import { useState } from "react";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const handleSelectChat = (id: string | null) => {
    setActiveSessionId(id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] gap-3 -mt-2">
      <div className="shrink-0">
        <h1 className="text-lg font-bold font-headline flex items-center gap-2">
          <MessagesSquare className="h-5 w-5 text-primary" />
          Infralith Intelligence Chat
        </h1>
        <p className="text-[11px] text-muted-foreground">
          Query blueprints, Indian building codes, and project risk. Use ✨ for insights.
        </p>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        <Card className="flex-1 flex flex-col min-w-0 bg-card/20 backdrop-blur-sm border-white/5 overflow-hidden">
          <CardContent className="flex-1 p-0 relative">
            <ChatbotWidget
              className="border-none p-0 h-full"
              activeSessionId={activeSessionId}
              onSessionChange={handleSelectChat}
            />
          </CardContent>
        </Card>

        <ChatHistoryPanel
          className="w-72 shrink-0 h-full border-white/5 bg-card/10"
          activeSessionId={activeSessionId}
          onSelectChat={handleSelectChat}
        />
      </div>
    </div>
  );
}