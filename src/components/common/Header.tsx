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
import { Globe, LogOut, Flame } from "lucide-react"
import { useLanguage, type Language } from "@/context/language-context"
import { ThemeToggle } from "./ThemeToggle"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

export function Header() {
  const { t, setLanguage } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  }

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm shadow-primary/5">
      <div className="container flex h-16 max-w-screen-2xl items-center">

        {/* Brand / Logo — Om Symbol */}
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Om (ॐ) emblem */}
            <div className="relative h-11 w-11 flex items-center justify-center">
              {/* Outer slow-pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-slow" />
              {/* Saffron gradient circle */}
              <div className="relative z-10 h-11 w-11 rounded-full bg-gradient-to-br from-amber-500 via-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-shadow duration-300">
                {/* Slow-spinning dashed decoration ring */}
                <div className="absolute inset-[-3px] rounded-full border border-dashed border-amber-300/40 animate-spin-slow" />
                {/* The Om character */}
                <span
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  className="relative z-10 text-[22px] leading-none text-white font-bold drop-shadow-md select-none group-hover:scale-110 transition-transform duration-300"
                >
                  ॐ
                </span>
              </div>
            </div>

            {/* Brand name + tagline */}
            <div className="hidden sm:block">
              <span className="font-headline text-lg font-bold leading-tight bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                {t('header.vaidikaconnect')}
              </span>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-light leading-none mt-0.5">
                Ancient Wisdom · Sacred Services
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/programs" className="nav-link">
            Programs
          </Link>
          <Link href="/join-network" className="nav-link">
            Join Network
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>

          {/* Live Poojas badge */}
          <Link
            href="/find-pujari"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            Live Poojas
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex flex-1 items-center justify-end gap-2">

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="sr-only">{t('header.select_language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-primary/20">
              <DropdownMenuLabel className="text-xs text-muted-foreground">{t('header.language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleLanguageSelect('en')}>🇬🇧 {t('header.english')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('te')}>🇮🇳 {t('header.telugu')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('ta')}>🇮🇳 {t('header.tamil')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('ka')}>🇮🇳 {t('header.kannada')}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('hi')}>🇮🇳 {t('header.hindi')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {/* User / Auth */}
          {isUserLoading ? (
            <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2 py-1 hover:bg-primary/10 transition-colors focus:outline-none">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} data-ai-hint="user avatar" />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-xs font-medium max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-primary/20 min-w-[180px]">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {user.displayName || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">⚙️ Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="divine-button h-9 px-5 text-sm rounded-full" size="sm">
              <Link href="/login">
                <Flame className="mr-1.5 h-3.5 w-3.5" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
