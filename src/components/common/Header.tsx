"use client"

import Link from "next/link"
import { OmIcon } from "@/components/icons/OmIcon"
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
import { Globe } from "lucide-react"
import { useLanguage, type Language } from "@/context/language-context"

export function Header() {
  const { t, setLanguage } = useLanguage();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <OmIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-xl sm:inline-block">
              {t('header.vaidikaconnect')}
            </span>
          </Link>
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
              <DropdownMenuItem onSelect={() => handleLanguageSelect('ta')} disabled>{t('header.tamil')} (TBD)</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('ka')} disabled>{t('header.kannada')} (TBD)</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageSelect('hi')} disabled>{t('header.hindi')} (TBD)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="sr-only">{t('header.user_avatar')}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
