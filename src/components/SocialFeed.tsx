'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

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
                  <div className="mt-4">
                    <Button variant="ghost">Comment</Button>
                    <Button variant="ghost">Share</Button>
                    <Button variant="ghost">Like</Button>
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
