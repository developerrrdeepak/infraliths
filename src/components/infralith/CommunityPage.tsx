'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, Trophy, Clock, Image as ImageIcon, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type Post = {
    id: string;
    author: {
        name: string;
        avatar: string;
        role: string;
        verified: boolean;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    hasLiked: boolean;
    comments: number;
    shares: number;
    tags: string[];
    isBounty?: boolean;
    bountyAmount?: number;
};

const MOCK_POSTS: Post[] = [
    {
        id: '1',
        author: {
            name: 'Apex Engineering Corp',
            avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&auto=format&fit=crop',
            role: 'Enterprise Firm',
            verified: true,
        },
        content: "Just finalized the structural analysis for the new Delta Towers in downtown Seattle using Infralith's AI! Identified a critical load-bearing weakness that saved us over $2.4M in potential retrofit costs. The compliance agent is a game-changer! 🏗️🚀",
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        timestamp: '2 hours ago',
        likes: 342,
        hasLiked: false,
        comments: 45,
        shares: 12,
        tags: ['#StructuralEngineering', '#InfralithSuccess', '#AIinConstruction'],
    },
    {
        id: '2',
        author: {
            name: 'Elena Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&auto=format&fit=crop',
            role: 'Lead Site Engineer',
            verified: true,
        },
        content: "Successfully orchestrated the concrete pour for Phase 3 today. The risk aggregator showed a 98% safety confidence score. Shoutout to the team for the hard work! 👷‍♀️✅",
        timestamp: '5 hours ago',
        likes: 128,
        hasLiked: false,
        comments: 18,
        shares: 3,
        tags: ['#WomenInSTEM', '#SiteUpdates', '#SafetyFirst'],
    },
    {
        id: '3',
        author: {
            name: 'Titan Constructors',
            avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&auto=format&fit=crop',
            role: 'Global Contractor',
            verified: true,
        },
        content: "We're expanding our drone fleet for automated site surveying! The integration with the new blueprint APIs means real-time structural comparisons. We'll be posting the telemetry data to the community forum next week.",
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
        timestamp: '1 day ago',
        likes: 567,
        hasLiked: true,
        comments: 89,
        shares: 44,
        tags: ['#DroneTech', '#Innovation', '#ConstructionTech'],
    },
    {
        id: '4',
        author: {
            name: 'Anonymous (Code Solvers Bounty)',
            avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=bounty',
            role: 'Seeking Structural Insight',
            verified: false,
        },
        content: "🚨 BOUNTY POST: Encountering recurring compliance failures (Code 4A-Seismic) on staggered truss systems above 40 floors. The AI agent flags the shear wall connections as inadequate. Looking for an engineered workaround or alternate connection detailing that satisfies ISO 19902. $5,000 bounty for verified solution. 🚨",
        timestamp: '15 mins ago',
        likes: 12,
        hasLiked: false,
        comments: 4,
        shares: 8,
        tags: ['#Bounty', '#SeismicDesign', '#TrussSystem'],
        isBounty: true,
        bountyAmount: 5000,
    }
];

import { useEffect } from 'react';
import { postService } from '@/lib/services';

export default function CommunityPage() {
    const { user } = useAppContext();
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [following, setFollowing] = useState<Record<string, boolean>>({});
    const [newPostContent, setNewPostContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoading(true);
            const data = await postService.getAllPosts();
            if (data.length === 0) {
                // Seed mock data if empty
                setPosts(MOCK_POSTS);
            } else {
                setPosts(data.map((p: any) => ({
                    id: p.id,
                    author: {
                        name: p.authorName,
                        avatar: p.authorAvatar,
                        role: 'Engineer',
                        verified: true
                    },
                    content: p.content,
                    timestamp: new Date(p.timestamp).toLocaleTimeString(),
                    likes: p.likeCount,
                    hasLiked: !!p.likes[user?.uid || ''],
                    comments: p.commentCount,
                    shares: p.shares,
                    tags: ['#CommunityUpdate']
                })));
            }
            setIsLoading(false);
        };
        loadPosts();
    }, [user?.uid]);

    const toggleLike = async (postId: string) => {
        if (!user?.uid) return;
        await postService.toggleLike(postId, user.uid);
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const isLiking = !post.hasLiked;
                return {
                    ...post,
                    hasLiked: isLiking,
                    likes: isLiking ? post.likes + 1 : post.likes - 1
                };
            }
            return post;
        }));
    };

    const toggleFollow = (authorName: string) => {
        setFollowing(prev => {
            const isFollowing = !prev[authorName];
            toast({
                title: isFollowing ? `Following ${authorName}` : `Unfollowed ${authorName}`,
                description: isFollowing ? 'You will now see their updates in your feed.' : 'You will no longer see their updates.',
            });
            return {
                ...prev,
                [authorName]: isFollowing
            };
        });
    };

    const handlePostSubmit = async () => {
        if (!newPostContent.trim() || !user) return;

        const authorName = user.name || user.email || 'Anonymous Engineer';

        const postId = await postService.createPost(
            user.uid,
            authorName,
            user.avatar || '',
            user.email,
            newPostContent,
            null
        );

        const newPost: Post = {
            id: postId,
            author: {
                name: authorName,
                avatar: user.avatar || '',
                role: user?.role || 'Engineer',
                verified: false,
            },
            content: newPostContent,
            timestamp: 'Just now',
            likes: 0,
            hasLiked: false,
            comments: 0,
            shares: 0,
            tags: ['#CommunityUpdate'],
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        toast({
            title: "Post Published",
            description: "Your update has been shared with the Infralith community.",
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">

            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Engineering Community</h1>
                </div>
                <p className="text-muted-foreground font-mono text-sm tracking-widest">GLOBAL NETWORK: [ 14,204 ACTIVE ORGS ]</p>
            </div>

            {/* Create Post Section */}
            <Card className="premium-glass p-1 shadow-lg">
                <CardContent className="p-4 flex gap-4">
                    <Avatar className="h-12 w-12 border border-primary/20">
                        <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <Input
                            placeholder="Share a project success story or update with the network..."
                            className="bg-slate-50 dark:bg-black/60 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm py-6 rounded-xl focus-visible:ring-primary/50 shadow-inner transition-colors"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handlePostSubmit();
                            }}
                        />
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                                <ImageIcon className="h-4 w-4 mr-2" /> Attach Media
                            </Button>
                            <Button size="sm" className="bg-primary text-background-dark font-bold px-6 rounded-lg shadow-lg shadow-primary/20" onClick={handlePostSubmit}>
                                Publish Post
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feed Section */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <Card key={post.id} className="premium-glass premium-glass-hover overflow-hidden transition-all duration-300">

                        {/* Post Header */}
                        <CardHeader className="flex flex-row items-center justify-between p-5 pb-3">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border border-primary/30 shadow-sm">
                                    <AvatarImage src={post.author.avatar} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-bold text-foreground">{post.author.name}</h3>
                                        {post.author.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="font-medium text-primary/80">{post.author.role}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {post.isBounty && (
                                    <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/30 flex items-center gap-1 animate-pulse">
                                        <Flame className="h-3 w-3" /> ${post.bountyAmount?.toLocaleString()} BOUNTY
                                    </Badge>
                                )}
                                {(user?.name || user?.email || 'Anonymous Engineer') !== post.author.name && !post.isBounty && (
                                    <Button
                                        variant={following[post.author.name] ? "outline" : "default"}
                                        size="sm"
                                        className={cn("h-8 px-4 text-xs font-bold transition-all", following[post.author.name] ? "" : "bg-primary text-background-dark")}
                                        onClick={() => toggleFollow(post.author.name)}
                                    >
                                        {following[post.author.name] ? 'Following' : 'Follow'}
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        {/* Post Content */}
                        <CardContent className="p-0">
                            <div className="px-5 pb-3">
                                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                                    {post.content}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {post.tags.map((tag, i) => (
                                        <span key={i} className="text-xs font-bold text-primary cursor-pointer hover:underline">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Optional Image Attachment */}
                            {post.image && (
                                <div className="w-full max-h-[400px] overflow-hidden bg-black/20 border-y border-white/5">
                                    <img
                                        src={post.image}
                                        alt="Post attachment"
                                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Engagement Bar */}
                            <div className="flex items-center justify-between p-3 px-5 bg-slate-50 dark:bg-black/20 backdrop-blur-sm border-t border-slate-100 dark:border-white/5 transition-colors">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className={cn(
                                            "flex items-center gap-2 text-sm font-semibold transition-all group",
                                            post.hasLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                                        )}
                                    >
                                        <Heart className={cn("h-5 w-5 transition-transform group-active:scale-75", post.hasLiked ? "fill-current" : "")} />
                                        <span>{post.likes}</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all group">
                                        <MessageCircle className="h-5 w-5 transition-transform group-active:scale-75" />
                                        <span>{post.comments}</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all group">
                                        <Share2 className="h-5 w-5 transition-transform group-active:scale-75" />
                                        <span>{post.shares}</span>
                                    </button>
                                </div>

                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/20 bg-primary/5 text-primary">
                                    Network Verified
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
