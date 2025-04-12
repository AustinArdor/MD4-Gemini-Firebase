'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {Textarea} from '@/components/ui/textarea';
import {Progress} from '@/components/ui/progress';
import {cn} from '@/lib/utils';
import {listGoogleDocuments, getGoogleDocumentChanges, GoogleDocument} from '@/services/google-docs';
import {analyzeDocumentChanges} from '@/ai/flows/analyze-document-changes';
import {generateSocialPost} from '@/ai/flows/generate-social-post';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {toast} from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription} from "@/components/ui/dialog";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('John Doe');
    const [bio, setBio] = useState('Aspiring fiction author.');
    const [bannerImage, setBannerImage] = useState('https://picsum.photos/820/312');
    const [profileImage, setProfileImage] = useState('https://picsum.photos/170/170');
    const [followers, setFollowers] = useState(123);
    const [following, setFollowing] = useState(456);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const [followerListOpen, setFollowerListOpen] = useState(false);
    const [followingListOpen, setFollowingListOpen] = useState(false);

    const genres = ['Fantasy', 'Sci-Fi', 'Horror', 'Mystery', 'Thriller', 'Romance', 'Historical Fiction'];

    const handleGenreSelect = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const followerUsers = Array.from({ length: followers }, (_, i) => `Follower ${i + 1}`);
    const followingUsers = Array.from({ length: following }, (_, i) => `Following ${i + 1}`);

    const handleSaveProfile = () => {
        // Implement save logic here, e.g., store the updated data in local storage or a database
        setIsEditing(false);
        toast({
            title: "Profile Updated!",
            description: "Your profile has been updated successfully.",
        });
    };


    return (
        <div className="flex flex-col items-center justify-start min-h-screen py-2">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <div className="w-full max-w-4xl">
                    {/* Profile Banner and Picture */}
                    <div className="relative">
                        <img src={bannerImage} alt="Profile Banner" className="w-full h-72 object-cover rounded-md" />
                        <Avatar className="absolute left-4 bottom-0 transform translate-y-1/2" style={{ width: '120px', height: '120px' }}>
                            <AvatarImage src={profileImage} alt="Profile Picture" />
                            <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
                        </Avatar>

                        {/* Follower/Following Counts */}
                        <div className="absolute right-4 top-4 flex flex-col items-end bg-gray-200/50 backdrop-blur-sm rounded-md p-2">
                            <Dialog open={followerListOpen} onOpenChange={setFollowerListOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="justify-end">
                                        <span className="font-semibold">{followers}</span> Followers
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Followers</DialogTitle>
                                    <DialogDescription>List of users following you:</DialogDescription>
                                    <div className="py-2 flex flex-col">
                                        {followerUsers.map((user) => (
                                            <div key={user} className="py-2">{user}</div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={followingListOpen} onOpenChange={setFollowingListOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="justify-end">
                                        <span className="font-semibold">{following}</span> Following
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Following</DialogTitle>
                                    <DialogDescription>List of users you are following:</DialogDescription>
                                    <div className="py-2 flex flex-col">
                                        {followingUsers.map((user) => (
                                            <div key={user} className="py-2">{user}</div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Edit Button */}
                        <div className="absolute left-4 top-4">
                            {!isEditing && (
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="mt-8 pl-4 flex flex-row">
                        <div className="w-1/4"/>
                        <div className="w-3/4 text-left">
                            {isEditing ? (
                                <>
                                    <Label htmlFor="display-name">Display Name</Label>
                                    <Input
                                        type="text"
                                        id="display-name"
                                        maxLength={50}
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="mb-2"
                                    />
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        maxLength={160}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="mb-2"
                                    />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-calm-blue">{displayName}</h1>
                                    <p className="text-sm text-gray-500">{bio}</p>
                                </>
                            )}
                        </div>

                        {/* Genre Bubbles */}

                    </div>

                    {/* Tabs for Biography, Projects, Social Feed */}
                    <Tabs defaultValue="biography" className="w-full mt-8">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="biography">Biography</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="socialFeed">Social Feed</TabsTrigger>
                        </TabsList>
                        <TabsContent value="biography" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About Me</CardTitle>
                                    <CardDescription>A little bit about myself.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <Textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="mb-2"
                                        />
                                    ) : (
                                        <p>{bio}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="projects" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Projects</CardTitle>
                                    <CardDescription>Here are my current writing projects.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>List of projects and contribution tracker will go here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="socialFeed" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Social Feed</CardTitle>
                                    <CardDescription>My latest posts and updates.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Social feed posts will go here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {isEditing && (
                        <div className="mt-4 flex justify-end">
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button className="ml-2" onClick={handleSaveProfile}>
                                Save Profile
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <footer className="flex items-center justify-center w-full h-24 border-t">
                <p>Powered by Firebase Studio</p>
            </footer>
        </div>
    );
};

export default ProfilePage;
