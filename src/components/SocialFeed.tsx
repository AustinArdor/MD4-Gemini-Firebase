'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Post {
  id: string;
  type: 'project' | 'personal';
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  bookTitle?: string;
  wordCountChange?: number;
  summary?: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  text: string;
  likes: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  text: string;
  likes: number;
}

const DUMMY_POSTS: Post[] = [
  {
    id: '1',
    type: 'project',
    author: {
      name: 'John Doe',
      avatarUrl: 'https://picsum.photos/50/50',
    },
    content: 'Made significant progress on my novel today!',
    bookTitle: 'The Dragon and the Stone',
    wordCountChange: 500,
    summary: 'Added a new chapter and fleshed out the characters.',
  },
  {
    id: '2',
    type: 'personal',
    author: {
      name: 'Jane Smith',
      avatarUrl: 'https://picsum.photos/50/50',
    },
    content: 'Just finished reading a great book. Highly recommended!',
  },
];

const SocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [replyInput, setReplyInput] = useState<{ [commentId: string]: string }>({});
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handlePublishPost = () => {
    if (newPostContent.trim() !== '') {
      const newPost: Post = {
        id: String(Date.now()),
        type: 'personal',
        author: {
          name: 'Current User', // TODO: Replace with actual user data
          avatarUrl: 'https://picsum.photos/50/50', // TODO: Replace with actual user data
        },
        content: newPostContent,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (text) {
      const newComment: Comment = {
        id: String(Date.now()),
        author: {
          name: 'Current User', // TODO: Replace with actual user data
          avatarUrl: 'https://picsum.photos/50/50', // TODO: Replace with actual user data
        },
        text: text,
        likes: 0,
        replies: [],
      };
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newLikedComments = new Set(prev);
      if (newLikedComments.has(commentId)) {
        newLikedComments.delete(commentId);
      } else {
        newLikedComments.add(commentId);
      }
      return newLikedComments;
    });
  };

  const handleReplySubmit = (postId: string, commentId: string) => {
    const text = replyInput[commentId]?.trim();
    if (text) {
      const newReply: Reply = {
        id: String(Date.now()),
        author: {
          name: 'Current User', // TODO: Replace with actual user data
          avatarUrl: 'https://picsum.photos/50/50', // TODO: Replace with actual user data
        },
        text: text,
        likes: 0,
      };

      setComments(prev => {
        const postComments = prev[postId] || [];
        const updatedComments = postComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, replies: [...comment.replies, newReply] };
          }
          return comment;
        });
        return { ...prev, [postId]: updatedComments };
      });
      setReplyInput(prev => ({ ...prev, [commentId]: '' }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold text-calm-blue">
          Welcome to <span className="text-accent">The Myth Dimension</span> Social Feed
        </h1>

        <div className="flex w-full mt-6">
          {/* Social Feed */}
          <div className="w-2/3 pr-4">
            {posts.map((post) => (
              <Card key={post.id} className="mb-4">
                <CardHeader className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{post.author.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {post.type === 'project' ? (
                    <>
                      <CardTitle>{post.bookTitle}</CardTitle>
                      <CardDescription>
                        {post.wordCountChange > 0 ? `+${post.wordCountChange} words` : `${post.wordCountChange} words`}
                      </CardDescription>
                      <CardDescription>{post.summary}</CardDescription>
                      <p>{post.content}</p>
                      <Button>View Project</Button>
                    </>
                  ) : (
                    <p>{post.content}</p>
                  )}
                  <div className="mt-4 flex items-center space-x-4">
                    <Button variant="ghost"><MessageSquare /></Button>
                    <Button variant="ghost"><Share2 /></Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleLikeComment(post.id)}
                      className={likedComments.has(post.id) ? 'text-red-500' : ''}
                    >
                      <Heart fill={likedComments.has(post.id) ? 'red' : 'none'} />
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4">
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-semibold">{comment.author.name}</div>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                        <div className="flex items-center space-x-4 mt-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleLikeComment(comment.id)}
                            className={likedComments.has(comment.id) ? 'text-red-500' : ''}
                          >
                            <Heart fill={likedComments.has(comment.id) ? 'red' : 'none'} className="h-3 w-3 mr-1" />
                            Like
                          </Button>
                          <Button variant="ghost" size="xs">Reply</Button>
                        </div>
                        {/* Replies Section */}
                        <div className="ml-6">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={reply.author.avatarUrl} alt={reply.author.name} />
                                  <AvatarFallback>{reply.author.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="text-xs font-semibold">{reply.author.name}</div>
                              </div>
                              <div className="text-xs">{reply.text}</div>
                              <div className="flex items-center space-x-4 mt-1">
                                <Button variant="ghost" size="xs">Like</Button>
                              </div>
                            </div>
                          ))}
                          {/* Reply Input */}
                          <div className="flex items-center space-x-2 mt-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src="https://picsum.photos/50/50" alt="Current User" /> {/* TODO: Replace with actual user data */}
                              <AvatarFallback>CU</AvatarFallback>
                            </Avatar>
                            <Input
                              type="text"
                              placeholder="Add a reply..."
                              value={replyInput[comment.id] || ''}
                              onChange={(e) => setReplyInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleReplySubmit(post.id, comment.id);
                                }
                              }}
                              className="text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleReplySubmit(post.id, comment.id)}
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <div className="mt-2 flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://picsum.photos/50/50" alt="Current User" /> {/* TODO: Replace with actual user data */}
                      <AvatarFallback>CU</AvatarFallback>
                    </Avatar>
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInput[post.id] || ''}
                      onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(post.id);
                        }
                      }}
                      className="text-sm"
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleCommentSubmit(post.id)}>Post</Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rich Text Editor */}
          <div className="w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Create a Post</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <Button className="mt-4" onClick={handlePublishPost}>
                  Publish
                </Button>
              </CardContent>
            </Card>

            {/* Google Ads */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Advertisement</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Google Ads Integration Here</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>Powered by Firebase Studio</p>
      </footer>
    </div>
  );
};

export default SocialFeed;
