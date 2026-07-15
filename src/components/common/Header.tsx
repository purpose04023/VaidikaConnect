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
import { useUser, useAuth } from "@/hooks/use-auth"
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
    auth.signOut();
  }
  
  const logo = PlaceHolderImages.find(p => p.id === 'app-logo');


  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-border bg-background/60 backdrop-blur-xl">
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
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white dark:bg-gray-800 flex items-center justify-center p-0.5 border border-border shadow-sm">
                    <img 
                      src="/logo.png" 
                      alt="VaidikaConnect Logo" 
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <span className="font-bold font-headline text-lg">
                    {t('header.vaidikaconnect')}
                  </span>
                </Link>
                <nav className="flex flex-col space-y-4 text-sm font-medium">
                  <Link href="/aalaya-sannidi" className="text-foreground/60 transition-colors hover:text-foreground/80 py-1.5 border-b border-border/40" onClick={() => setIsOpen(false)}>
                    AalayaSannidi
                  </Link>
                  <div className="flex flex-col space-y-2">
                    <span className="text-foreground font-semibold py-1.5 border-b border-border/40">Programs</span>
                    <Link href="/programs?category=VAIDIKA_POOJA" className="text-foreground/60 transition-colors hover:text-foreground/80 pl-4 py-1" onClick={() => setIsOpen(false)}>
                      Vaidika Poojas
                    </Link>
                    <Link href="/programs?category=LIFE_CYCLE_POOJA" className="text-foreground/60 transition-colors hover:text-foreground/80 pl-4 py-1" onClick={() => setIsOpen(false)}>
                      Life Cycle Poojas
                    </Link>
                  </div>
                  <Link href="/pilgrimage/darshan" className="text-foreground/60 transition-colors hover:text-foreground/80 py-1.5 border-b border-border/40" onClick={() => setIsOpen(false)}>
                    Pilgrimage & Temples
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

          <Link href="/" className="mr-3 sm:mr-6 flex items-center group">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-full bg-white dark:bg-gray-800 flex items-center justify-center p-0.5 border border-border shadow-sm transition-transform group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="VaidikaConnect Logo" 
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col text-left leading-none font-bold ml-1.5 font-headline select-none">
              <span className="text-xs sm:text-base block text-primary tracking-wide">Vaidika</span>
              <span className="text-[9px] sm:text-xs block text-foreground uppercase tracking-widest mt-0.5">Connect</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground/60 transition-colors hover:text-foreground/80 outline-none">
                Programs
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/programs?category=VAIDIKA_POOJA" className="w-full cursor-pointer">Vaidika Poojas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA" className="w-full cursor-pointer">Life Cycle Poojas</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/pilgrimage/darshan" className="text-foreground/60 transition-colors hover:text-foreground/80">
              Pilgrimage & Temples
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
                    <AvatarImage src={user.user_metadata?.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">{t('header.user_avatar')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.user_metadata?.full_name || user.email}</DropdownMenuLabel>
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

    
