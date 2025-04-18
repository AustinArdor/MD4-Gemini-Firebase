'use client';

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Bell} from "lucide-react";
import {useState} from "react";
import {useRouter} from 'next/navigation';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notifications, setNotifications] = useState(5); // Example: 5 notifications
    const router = useRouter();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-[#344870] border-b">
          <div className="container flex items-center justify-between h-16">
            <Link href="/" className="flex items-center font-semibold text-[#d7d0d7] space-x-2 ml-6">
              <span className="text-xl">The Myth Dimension</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium hover:text-accent text-[#d7d0d7]">
                My Feed
              </Link>
              <Link href="/projects" className="text-sm font-medium hover:text-accent text-[#d7d0d7]">
                My Projects
              </Link>
              {/* Notification Bell */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 hover:bg-secondary rounded-full">
                    <Bell className="h-5 w-5 text-[#d7d0d7]" />
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                        {notifications > 100 ? '100+' : notifications}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                    No New Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-full ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar>
                      <AvatarImage src="https://picsum.photos/50/50" alt="Profile" />
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                      <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </header>
        {children}
          <footer className="flex items-center justify-center w-full h-12 border-t text-[#d7d0d7] bg-[#344870]">
              <Link href="/settings" className="text-sm font-medium hover:text-accent text-[#d7d0d7] mr-4">
                  Settings
              </Link>
              <Link href="/terms" className="text-sm font-medium hover:text-accent text-[#d7d0d7]">
                  Terms of Service
              </Link>
          </footer>
      </body>
    </html>
  );
}





