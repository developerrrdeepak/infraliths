'use client';
import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/contexts/app-context';
import { dmService, userDbService, ChatSummary, ChatMessage, UserProfileData } from '@/lib/services';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle, AlertCircle, Check, Trash2, X, Plus, Image as ImageIcon, ShieldCheck, Search, Users, Video } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

export default function DMPage() {
  const { user } = useAppContext();
  const { toast } = useToast();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSummary | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // New Chat Dialog State
  const [allUsers, setAllUsers] = useState<UserProfileData[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isGroupDialogActive, setIsGroupDialogActive] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);

  const canCreateGroups = user?.role === 'Engineer' || user?.role === 'Supervisor' || user?.role === 'Admin';

  // 1. Load Chat List (Inbox) - LISTENER
  useEffect(() => {
    if (!user) return;
    const fetchChats = async () => {
      try {
        const chatsRef = dmService.getUserChatsRef(user.uid);
        // In our mock, this returns a string key for local storage
        if (typeof chatsRef === 'string') {
          const data = localStorage.getItem(chatsRef);
          if (data) {
            const parsed = JSON.parse(data);
            const list = Object.values(parsed) as ChatSummary[];
            if (list.length === 0 && !sessionStorage.getItem('infralith_dm_seeded')) {
              await dmService.seedMockDMs(user.uid);
              sessionStorage.setItem('infralith_dm_seeded', 'true');
              return; // Next interval will pick it up
            }
            setChats(list.sort((a, b) => b.timestamp - a.timestamp));
          } else if (!sessionStorage.getItem('infralith_dm_seeded')) {
            await dmService.seedMockDMs(user.uid);
            sessionStorage.setItem('infralith_dm_seeded', 'true');
          }
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 3000); // 3s polling for mock realism
    return () => clearInterval(interval);
  }, [user]);

  // Load all users on mount for group creation, or when dialog opens
  useEffect(() => {
    if (user && canCreateGroups) {
      userDbService.getAllUsers().then(users => {
        setAllUsers(users.filter(u => u.uid !== user?.uid)); // Filter out current user
      });
    }
  }, [user]);

  // 2. Handle Redirects and Updates - EFFECT
  useEffect(() => {
    const pendingChatId = sessionStorage.getItem('open_chat_id');

    if (pendingChatId && chats.length > 0) {
      const chatToOpen = chats.find(c => c.chatId === pendingChatId);
      if (chatToOpen) {
        setSelectedChat(chatToOpen);
        sessionStorage.removeItem('open_chat_id');
      }
    }

    if (selectedChat && chats.length > 0) {
      const updatedChat = chats.find(c => c.chatId === selectedChat.chatId);
      if (updatedChat && (updatedChat.lastMessage !== selectedChat.lastMessage || updatedChat.status !== selectedChat.status)) {
        setSelectedChat(updatedChat);
      }
    }
  }, [chats, selectedChat]);

  // 3. Load Messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      try {
        const messagesRef = dmService.getMessagesRef(selectedChat.chatId);
        if (typeof messagesRef === 'string') {
          const data = localStorage.getItem(messagesRef);
          if (data) {
            const msgs = JSON.parse(data) as ChatMessage[];
            setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedChat?.chatId]);

  // 4. Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, imagePreview]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ variant: 'destructive', title: 'Image too large', description: 'Please select an image smaller than 2MB' });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    // reset input so the same file can be selected again if removed
    e.target.value = '';
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSendMessage = async () => {
    if (!user || !selectedChat || (!newMessage.trim() && !imagePreview)) return;

    const text = newMessage;
    const imgData = imagePreview;

    setNewMessage('');
    setImageFile(null);
    setImagePreview(null);

    await dmService.sendMessage(
      user.uid,
      selectedChat.otherUserId,
      selectedChat.otherUserName,
      selectedChat.otherUserAvatar,
      user.name,
      user.avatar || '',
      text,
      imgData
    );
  };

  const handleAcceptRequest = async () => {
    if (!user || !selectedChat) return;
    await dmService.acceptChatRequest(user.uid, selectedChat.chatId);
  };

  const handleDeclineRequest = async () => {
    if (!user || !selectedChat) return;
    if (confirm("Are you sure you want to decline this message request? The conversation will be removed.")) {
      await dmService.removeChat(user.uid, selectedChat.chatId);
      setSelectedChat(null);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedChat) return;
    try {
      await dmService.deleteMessage(selectedChat.chatId, messageId);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete message" });
    }
  };

  const openNewChatDialog = async () => {
    const users = await userDbService.getAllUsers();
    setAllUsers(users.filter(u => u.uid !== user?.uid)); // Filter out current user
    setIsNewChatOpen(true);
  };

  const startChatWithUser = async (targetUser: UserProfileData) => {
    const existingChat = chats.find(c => c.otherUserId === targetUser.uid);
    if (existingChat) {
      setSelectedChat(existingChat);
      setIsNewChatOpen(false);
      return;
    }

    const newChatSession: ChatSummary = {
      chatId: dmService.getChatId(user!.uid, targetUser.uid),
      otherUserId: targetUser.uid,
      otherUserName: targetUser.name || targetUser.email || 'Unknown User',
      otherUserAvatar: targetUser.avatar || '',
      lastMessage: '',
      timestamp: Date.now(),
      status: 'accepted'
    };
    setSelectedChat(newChatSession);
    setIsNewChatOpen(false);
  };

  const isWaitingForAcceptance = user && messages.length > 0 && messages.every(m => m.senderId === user.uid);
  const isIncomingRequest = selectedChat?.status === 'pending';

  const filteredUsers = allUsers.filter(u =>
    (u.name || '').toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Chat List */}
      <Card className={cn("md:col-span-1 flex flex-col overflow-hidden shadow-sm", selectedChat ? "hidden md:flex" : "flex")}>
        <div className="p-4 border-b flex justify-between items-center bg-muted/10">
          <span className="font-headline font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Team Messages
          </span>
          <div className="flex items-center gap-1">
            {canCreateGroups && (
              <Dialog open={isGroupDialogActive} onOpenChange={setIsGroupDialogActive}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/20 text-primary" title="Create Group of Engineers">
                    <Users className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Team Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input placeholder="Group Name (e.g., Structural Team Alpha)" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    <div className="text-sm font-semibold text-muted-foreground">Select Engineers:</div>
                    <ScrollArea className="h-[200px] border rounded-md p-2 bg-muted/30">
                      {allUsers.filter((u: any) => u.role === 'Engineer' || !u.role).map(u => (
                        <label key={u.uid} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer border border-transparent hover:border-border transition-all">
                          <Checkbox checked={selectedEngineers.includes(u.uid)} onCheckedChange={(c) => {
                            if (c) setSelectedEngineers([...selectedEngineers, u.uid]);
                            else setSelectedEngineers(selectedEngineers.filter(id => id !== u.uid));
                          }} />
                          <Avatar className="h-8 w-8"><AvatarImage src={u.avatar || undefined} /><AvatarFallback>{u.name?.[0]}</AvatarFallback></Avatar>
                          <span className="text-sm font-medium">{u.name}</span>
                        </label>
                      ))}
                      {allUsers.filter((u: any) => u.role === 'Engineer' || !u.role).length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-10">No engineers found.</div>
                      )}
                    </ScrollArea>
                    <Button className="w-full bg-primary font-bold shadow-lg" onClick={async () => {
                      if (!user) return;
                      await dmService.createGroup(user.uid, user.name, user.avatar || '', groupName, selectedEngineers);
                      toast({ title: "Group Created", description: `Added ${selectedEngineers.length} engineers to ${groupName || 'New Group'}` });
                      setIsGroupDialogActive(false);
                      setGroupName('');
                      setSelectedEngineers([]);
                    }}>Create Group Conversation</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={openNewChatDialog} className="hover:bg-primary/20 text-primary" title="New Private Message">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Workspace Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search engineers or users..."
                      className="pl-9"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[300px] border rounded-md">
                    <div className="p-2 space-y-1">
                      {filteredUsers.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-10">No users found.</div>
                      ) : (
                        filteredUsers.map(u => (
                          <button
                            key={u.uid}
                            onClick={() => startChatWithUser(u)}
                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-left"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatar || ''} />
                              <AvatarFallback>{u.name ? u.name[0].toUpperCase() : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 px-4 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary opacity-50" />
              </div>
              <p className="font-medium text-foreground">Secure Workspace Chat</p>
              <p className="text-xs mt-1">Connect instantly with fellow engineers. Click the + icon to start.</p>
            </div>
          ) : (
            chats.map(chat => (
              <button
                key={chat.chatId}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left relative",
                  selectedChat?.chatId === chat.chatId ? "bg-primary/10 dark:bg-primary/20" : "hover:bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={chat.otherUserAvatar} />
                    <AvatarFallback>{chat.otherUserName[0]}</AvatarFallback>
                  </Avatar>
                  {chat.status === 'pending' && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm truncate">{chat.otherUserName}</span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(chat.timestamp, { addSuffix: false }).replace('about ', '')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className={cn("text-xs truncate max-w-[80%]", chat.status === 'pending' ? "font-semibold text-foreground" : "text-muted-foreground")}>
                      {chat.status === 'pending' ? "New Message Request" : (chat.lastMessage || 'Sent an attachment')}
                    </p>
                    {chat.status === 'pending' && <Badge variant="secondary" className="text-[10px] h-4 px-1">Req</Badge>}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Right: Chat Window */}
      <Card className={cn("md:col-span-2 flex flex-col overflow-hidden shadow-sm", !selectedChat ? "hidden md:flex" : "flex")}>
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50 dark:bg-slate-900/20">
            <div className="h-20 w-20 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mb-6">
              <ShieldCheck className="h-10 w-10 text-primary opacity-80" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">End-to-End Encrypted Team Chat</h3>
            <p className="text-sm max-w-[300px] text-center">
              Select a conversation or start a new one to communicate securely with your team.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-card shadow-sm z-10">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="md:hidden mr-1" onClick={() => setSelectedChat(null)}>
                  ←
                </Button>
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={selectedChat.otherUserAvatar} />
                  <AvatarFallback>{selectedChat.otherUserName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{selectedChat.otherUserName}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Protected Session</span>
                  </div>
                </div>
              </div>

              {canCreateGroups && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-md gap-2" onClick={() => {
                  if (!user || !selectedChat) return;
                  dmService.sendMessage(
                    user.uid,
                    selectedChat.otherUserId,
                    selectedChat.otherUserName,
                    selectedChat.otherUserAvatar,
                    user.name,
                    user.avatar || '',
                    "🎥 Please join my secure video meeting: https://meet.infralith.com/room-" + Math.floor(Math.random() * 10000),
                    null
                  );
                  toast({ title: "Meeting Started", description: "Secure video meeting link sent." });
                }}>
                  <Video className="h-4 w-4" /> <span className="hidden sm:inline font-bold">Meet</span>
                </Button>
              )}
            </div>

            {/* E2E Privacy Banner */}
            <div className="bg-primary/10 py-1.5 px-4 flex items-center justify-center gap-2 border-b border-primary/20 backdrop-blur-sm shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">End-to-End Encrypted</span>
              <span className="text-[9px] text-primary/70 ml-2 hidden sm:inline uppercase font-bold tracking-wider">Messages & files are secured for your privacy.</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20 relative" ref={scrollRef}>
              {messages.map((msg, index) => {
                const isMe = msg.senderId === user?.uid;
                const showAvatar = index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId;

                return (
                  <div key={msg.id} className={cn("flex group", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn("flex items-end gap-2 max-w-[85%]", isMe ? "flex-row" : "flex-row-reverse")}>
                      {isMe && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                          title="Delete message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div className={cn(
                        "flex flex-col shadow-sm rounded-2xl px-4 py-2.5 text-sm",
                        isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-sm"
                      )}>
                        {msg.imageUrl && (
                          <img src={msg.imageUrl} alt="Shared file" className="max-w-full sm:max-w-[250px] object-cover rounded-md mb-2 mt-1 border border-black/10 dark:border-white/10" />
                        )}
                        {msg.text && <span>{msg.text}</span>}
                        <div className={cn("text-[9px] mt-1 text-right font-medium", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!isMe && (
                        <Avatar className="h-6 w-6 shadow-sm mb-1 opacity-80">
                          {showAvatar ? (
                            <>
                              <AvatarImage src={selectedChat.otherUserAvatar} />
                              <AvatarFallback>{selectedChat.otherUserName[0]}</AvatarFallback>
                            </>
                          ) : <div className="h-full w-full bg-transparent" />}
                        </Avatar>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {isWaitingForAcceptance && !isIncomingRequest && (
              <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-950/20">
                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-xs text-amber-700 dark:text-amber-400 ml-2 font-medium">
                    Message sent. The engineer needs to accept your request before replying.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {isIncomingRequest && (
              <div className="p-4 bg-muted/50 border-t backdrop-blur-md">
                <Alert className="bg-background border-primary/30 shadow-md">
                  <div className="flex flex-col gap-3 w-full">
                    <div>
                      <AlertTitle className="font-semibold flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-primary fill-primary/20" />
                        Workspace Message Request
                      </AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">{selectedChat.otherUserName}</span> wants to connect and collaborate.
                      </AlertDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 shadow-sm font-semibold" onClick={handleAcceptRequest}>
                        <Check className="mr-2 h-4 w-4" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-destructive/10 hover:text-destructive font-semibold shadow-sm" onClick={handleDeclineRequest}>
                        <X className="mr-2 h-4 w-4" /> Decline
                      </Button>
                    </div>
                  </div>
                </Alert>
              </div>
            )}

            {/* Input Area */}
            {!isIncomingRequest && (
              <div className="p-4 border-t bg-card relative">
                {/* Image Attachment Preview */}
                {imagePreview && (
                  <div className="absolute bottom-full left-0 p-3 bg-background border-t border-r border-border rounded-tr-xl flex items-center gap-3 shadow-lg z-20">
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded-md border" />
                      <button onClick={removeSelectedImage} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-md hover:scale-110 transition-transform">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">File attached</span>
                  </div>
                )}

                <div className="flex gap-2 items-end">
                  <div className="relative flex-1 group">
                    <label className="absolute left-3 bottom-0 h-10 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-primary transition-colors z-10" title="Attach file">
                      <ImageIcon className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelection}
                      />
                    </label>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Write a secure message..."
                      className="pl-11 pr-4 py-6 rounded-xl bg-muted/50 focus-visible:ring-primary/50 shadow-inner resize-none overflow-hidden group-hover:bg-muted/80 transition-colors border-primary/10"
                    />
                  </div>
                  <Button
                    className={cn(
                      "h-[50px] w-[50px] rounded-xl flex items-center justify-center shadow-md transition-all",
                      (newMessage.trim() || imagePreview) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105" : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !imagePreview}
                  >
                    <Send className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}