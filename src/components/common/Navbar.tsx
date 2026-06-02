"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Baby, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Flame,
  FileText,
  Video,
  Compass,
  Hotel,
  Ticket
} from "lucide-react";

export default function Navbar() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-14 z-40">
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="flex h-12 items-center justify-between">
          
          {/* Main Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            
            {/* Dropdown 1: సంస్కారాలు (Life Cycle Poojas) */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown("samskaras")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 py-3 text-foreground/75 transition-colors hover:text-primary focus:outline-none">
                <span>{language === "te" ? "జీవిత చక్ర సంస్కారాలు" : "Life Cycle Poojas"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-0 top-full w-72 rounded-lg border border-primary/20 bg-background/95 p-4 shadow-xl backdrop-blur-md transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 border-border/40">
                    {language === "te" ? "జీవిత చక్ర దశలు" : "Samskara Stages"}
                  </p>
                  <Link href="/life-cycle-poojas?stage=prenatal" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "జననానికి ముందు" : "Prenatal"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "గర్భధారణ క్రియలు" : "Before birth rituals"}</p>
                    </div>
                  </Link>
                  <Link href="/life-cycle-poojas?stage=childhood" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Baby className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "బాల్యం" : "Childhood"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "నామకరణము, అన్నప్రాసనము" : "Naming & feeding rituals"}</p>
                    </div>
                  </Link>
                  <Link href="/life-cycle-poojas?stage=youth" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "విద్య & యవ్వనం" : "Youth & Education"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "ఉపనయనము, వేదారంభము" : "Thread ceremony & studies"}</p>
                    </div>
                  </Link>
                  <Link href="/life-cycle-poojas?stage=adulthood" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Heart className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "గృహస్థాశ్రమం" : "Adulthood & Marriage"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "వివాహము, శుభకార్యాలు" : "Hindu wedding ceremonies"}</p>
                    </div>
                  </Link>
                  <Link href="/life-cycle-poojas?stage=general" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "శుభకార్యాలు & నిత్య పూజలు" : "General / Auspicious"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "నిత్య హోమాలు, విఘ్నేశ్వర పూజ" : "Beginnings & Daily homam"}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown 2: మంత్రాలు & సేవలు (Spiritual & Services) */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown("spiritual")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 py-3 text-foreground/75 transition-colors hover:text-primary focus:outline-none">
                <span>{language === "te" ? "మంత్రాలు & సేవలు" : "Spiritual & Services"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-0 top-full w-72 rounded-lg border border-primary/20 bg-background/95 p-4 shadow-xl backdrop-blur-md transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 border-border/40">
                    {language === "te" ? "ఆధ్యాత్మిక పఠనం" : "Readings & Chanting"}
                  </p>
                  <Link href="/spiritual/reading" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "అష్టోత్తరాలు & సహస్రనామాలు" : "Stotram & Ashtotharam"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "స్తోత్రాలు, పూజా విధానాలు" : "Divine stotras & guides"}</p>
                    </div>
                  </Link>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 border-border/40 pt-2">
                    {language === "te" ? "ప్రత్యేక సేవలు" : "Special Online Services"}
                  </p>
                  <Link href="/find-pujari" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Video className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "జాతకాలు & లైవ్ పూజ" : "Astrology & Live Pujas"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "వేదాధ్యయనం ఆన్‌లైన్ క్లాసులు" : "Interactive virtual booking"}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown 3: యాత్రలు & దర్శనాలు (Pilgrimage & Tourism) */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown("pilgrimage")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 py-3 text-foreground/75 transition-colors hover:text-primary focus:outline-none">
                <span>{language === "te" ? "యాత్రలు & దర్శనాలు" : "Pilgrimage & Temples"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-0 top-full w-80 rounded-lg border border-primary/20 bg-background/95 p-4 shadow-xl backdrop-blur-md transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 border-border/40">
                    {language === "te" ? "తీర్థయాత్రలు" : "Temple Services"}
                  </p>
                  <Link href="/pilgrimage/darshan" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Ticket className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "ఆలయాల దర్శనాలు బుకింగ్" : "Temple Darshan Tickets"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "విజయవాడ, మంగళగిరి ప్రత్యేక సేవలు" : "Vijayawada & special entry"}</p>
                    </div>
                  </Link>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 border-border/40 pt-2">
                    {language === "te" ? "ప్రయాణం & వసతులు" : "Travel & Stays"}
                  </p>
                  <Link href="/pilgrimage/accommodations" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Hotel className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "వసతి గృహాల బుకింగ్" : "Haritha Hotel & Stays"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "వైజాగ్, అరకు రూమ్ బుకింగ్" : "Vizag resorts & cottages"}</p>
                    </div>
                  </Link>
                  <Link href="/pilgrimage/sightseeing" className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-primary/10">
                    <Compass className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{language === "te" ? "దర్శనీయ ప్రదేశాలు" : "Local Sightseeing"}</p>
                      <p className="text-xs text-muted-foreground">{language === "te" ? "ఆలయాల చుట్టుపక్కల విహార యాత్రలు" : "Beaches, hill parks & history"}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Legacy links fallback for other options */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-foreground/60">
            <span>{language === "te" ? "✦ వైదిక సంప్రదాయ కనెక్ట్" : "✦ Ancient Vedic Legacy"}</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center w-full justify-end">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-md text-foreground/70 hover:text-foreground focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-3 space-y-4 shadow-lg absolute w-full left-0 z-50">
          <div className="space-y-3">
            
            {/* Mobile Block 1: సంస్కారాలు */}
            <div>
              <button 
                onClick={() => toggleDropdown("samskaras")}
                className="flex items-center justify-between w-full font-bold text-sm text-foreground border-b pb-1 border-border/40"
              >
                <span>{language === "te" ? "సంస్కారాలు (Life Cycle)" : "Life Cycle Poojas"}</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${activeDropdown === "samskaras" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "samskaras" && (
                <div className="pl-3 mt-2 space-y-2 text-sm text-muted-foreground">
                  <Link href="/life-cycle-poojas?stage=prenatal" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "జననానికి ముందు (Prenatal)" : "Prenatal"}
                  </Link>
                  <Link href="/life-cycle-poojas?stage=childhood" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "బాల్యం (Childhood)" : "Childhood"}
                  </Link>
                  <Link href="/life-cycle-poojas?stage=youth" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "విద్య & యవ్వనం (Youth)" : "Youth & Education"}
                  </Link>
                  <Link href="/life-cycle-poojas?stage=adulthood" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "గృహస్థాశ్రమం (Adulthood)" : "Adulthood & Marriage"}
                  </Link>
                  <Link href="/life-cycle-poojas?stage=general" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "శుభకార్యాలు & నిత్య పూజలు" : "General / Auspicious"}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Block 2: మంత్రాలు & సేవలు */}
            <div>
              <button 
                onClick={() => toggleDropdown("spiritual")}
                className="flex items-center justify-between w-full font-bold text-sm text-foreground border-b pb-1 border-border/40"
              >
                <span>{language === "te" ? "మంత్రాలు & సేవలు" : "Spiritual & Services"}</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${activeDropdown === "spiritual" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "spiritual" && (
                <div className="pl-3 mt-2 space-y-2 text-sm text-muted-foreground">
                  <Link href="/spiritual/reading" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "అష్టోత్తరాలు, సహస్రనామాలు (పఠనం)" : "Readings & Chanting"}
                  </Link>
                  <Link href="/find-pujari" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "జాతకాలు, లైవ్ పూజ (సేవలు)" : "Astrology, Live Pujas & Classes"}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Block 3: యాత్రలు & దర్శనాలు */}
            <div>
              <button 
                onClick={() => toggleDropdown("pilgrimage")}
                className="flex items-center justify-between w-full font-bold text-sm text-foreground border-b pb-1 border-border/40"
              >
                <span>{language === "te" ? "యాత్రలు & దర్శనాలు" : "Pilgrimage & Temples"}</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${activeDropdown === "pilgrimage" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "pilgrimage" && (
                <div className="pl-3 mt-2 space-y-2 text-sm text-muted-foreground">
                  <Link href="/pilgrimage/darshan" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "ఆలయాల దర్శనాలు బుకింగ్" : "Temple Darshans"}
                  </Link>
                  <Link href="/pilgrimage/accommodations" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "వసతి గృహాల బుకింగ్ (హరిత హోటల్స్)" : "Accommodation Bookings"}
                  </Link>
                  <Link href="/pilgrimage/sightseeing" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "చుట్టుపక్కల చూడదగ్గ ప్రదేశాలు" : "Sightseeing Destinations"}
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
