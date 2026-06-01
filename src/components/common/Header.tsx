"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Globe, LogOut } from "lucide-react"
import { useLanguage, type Language } from "@/context/language-context"
import { useState } from "react"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ThemeToggle } from "./ThemeToggle"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { ManagedImage } from "./ManagedImage"

export function Header() {
  const { t, setLanguage } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  }

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  }
  
  const logo = PlaceHolderImages.find(p => p.id === 'app-logo');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-4 flex items-center">
          {/* Mobile Navigation Hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-6 pt-4">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  {logo ? (
                    <div className="h-8 w-8 flex items-center justify-center">
                      <ManagedImage 
                        src={logo.imageUrl}
                        alt="VaidikaConnect Logo" 
                        width={32} 
                        height={32} 
                        data-ai-hint={logo.imageHint}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-primary rounded-sm" />
                  )}
                  <span className="font-bold font-headline text-lg">
                    {t('header.vaidikaconnect')}
                  </span>
                </Link>
                <nav className="flex flex-col space-y-4 text-sm font-medium">
                  <Link href="/programs" className="text-foreground/60 transition-colors hover:text-foreground/80 py-1.5 border-b border-border/40" onClick={() => setIsOpen(false)}>
                    Programs
                  </Link>
                  <Link href="/join-network" className="text-foreground/60 transition-colors hover:text-foreground/80 py-1.5 border-b border-border/40" onClick={() => setIsOpen(false)}>
                    Join Network
                  </Link>
                  <Link href="/contact" className="text-foreground/60 transition-colors hover:text-foreground/80 py-1.5 border-b border-border/40" onClick={() => setIsOpen(false)}>
                    Contact
                  </Link>
                  <Link href="/admin" className="text-foreground/60 transition-colors hover:text-foreground/80 py-1.5" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="mr-6 flex items-center space-x-2">
            {logo ? (
              <div className="h-10 w-10 flex items-center justify-center">
                <ManagedImage 
                  src={logo.imageUrl}
                  alt="VaidikaConnect Logo" 
                  width={40} 
                  height={40} 
                  data-ai-hint={logo.imageHint}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-10 w-10 bg-primary rounded-sm" />
            )}
            <span className="font-bold font-headline text-xl hidden sm:inline-block">
              {t('header.vaidikaconnect')}
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/programs" className="text-foreground/60 transition-colors hover:text-foreground/80">
              Programs
            </Link>
            <Link href="/join-network" className="text-foreground/60 transition-colors hover:text-foreground/80">
              Join Network
            </Link>
            <Link href="/contact" className="text-foreground/60 transition-colors hover:text-foreground/80">
              Contact
            </Link>
            <Link href="/admin" className="text-foreground/60 transition-colors hover:text-foreground/80">
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('header.select_language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('header.language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleLanguageSelect('en')}>{t('header.english')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('te')}>{t('header.telugu')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('ta')}>{t('header.tamil')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('ka')}>{t('header.kannada')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('hi')}>{t('header.hindi')}</DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          {isUserLoading ? (
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">{t('header.user_avatar')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

    
