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
  Ticket,
  Star,
  Users,
  Sun,
  Flower,
  MessageCircle
} from "lucide-react";

export default function Navbar() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-border bg-background/60 backdrop-blur-xl shadow-2xl z-40 transition-all duration-300">

      <div className="w-full px-6">
        <div className="flex h-12 items-center justify-between">
          
          {/* Main Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/aalaya-sannidi" className="flex items-center gap-1 py-3 text-foreground/80 transition-colors hover:text-[#d4af37] focus:outline-none font-medium">
              <MessageCircle className="h-4 w-4 text-amber-500/80" />
              <span>AalayaSannidi</span>
            </Link>
            
            {/* Dropdown 0: Vaidika Poojas */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown("sacredPrograms")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 py-3 text-foreground/80 transition-colors hover:text-[#d4af37] focus:outline-none font-medium">
                <span>{language === "te" ? "వైదిక పూజలు" : "Vaidika Poojas"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 text-amber-500/80" />
              </button>
              
              <div className="absolute left-0 top-full w-80 rounded-2xl border border-border bg-popover p-3 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 z-50">
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Deeksha Pujas" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "దీక్షా పూజలు" : "Deeksha Pujas"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Dosha Parihara Pujas" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Star className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "దోష పరిహార పూజలు" : "Dosha Parihara"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Homams" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Flame className="h-4 w-4 text-[#b89045] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "హోమాలు" : "Homams"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Kalyanams" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Heart className="h-4 w-4 text-rose-500/80 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "కల్యాణాలు" : "Kalyanams"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Nomulu" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Users className="h-4 w-4 text-[#c8a261] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "నోములు" : "Nomulu"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Pujas" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Flower className="h-4 w-4 text-emerald-500/80 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "పూజలు" : "Pujas"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Vratas" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary col-span-2">
                    <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "వ్రతాలు" : "Vratas"}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown 1: సంస్కారాలు (Life Cycle Poojas) */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown("samskaras")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 py-3 text-foreground/80 transition-colors hover:text-[#d4af37] focus:outline-none font-medium">
                <span>{language === "te" ? "జీవిత చక్ర సంస్కారాలు" : "Life Cycle Poojas"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 text-amber-500/80" />
              </button>
              
              <div className="absolute left-0 top-full w-72 rounded-2xl border border-border bg-popover p-3 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 z-50">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b89045] border-b pb-1 border-white/5">
                    {language === "te" ? "జీవిత చక్ర దశలు" : "Samskara Stages"}
                  </p>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Prenatal" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "జననానికి ముందు" : "Prenatal"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "గర్భధారణ క్రియలు" : "Before birth rituals"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Childhood" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Baby className="h-5 w-5 text-[#c8a261] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "బాల్యం" : "Childhood"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "నామకరణము, అన్నప్రాసనము" : "Naming & feeding rituals"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Youth+and+Education" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <BookOpen className="h-5 w-5 text-amber-500/80 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "విద్య & యవ్వనం" : "Youth & Education"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "ఉపనయనము, వేదారంభము" : "Thread ceremony & studies"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Adulthood" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Heart className="h-5 w-5 text-rose-500/80 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "గృహస్థాశ్రమం" : "Adulthood & Marriage"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "వివాహము, శుభకార్యాలు" : "Hindu wedding ceremonies"}</p>
                    </div>
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=General+or+Auspicious" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Flame className="h-5 w-5 text-[#b89045] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "శుభకార్యాలు & నిత్య పూజలు" : "General / Auspicious"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "నిత్య హోమాలు, విఘ్నేశ్వర పూజ" : "Beginnings & Daily homam"}</p>
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
              <button className="flex items-center gap-1 py-3 text-foreground/80 transition-colors hover:text-[#d4af37] focus:outline-none font-medium">
                <span>{language === "te" ? "మంత్రాలు & సేవలు" : "Spiritual & Services"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 text-amber-500/80" />
              </button>
              
              <div className="absolute left-0 top-full w-72 rounded-2xl border border-border bg-popover p-3 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 z-50">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b89045] border-b pb-1 border-white/5">
                    {language === "te" ? "ఆధ్యాత్మిక పఠనం" : "Readings & Chanting"}
                  </p>
                  <Link href="/spiritual/reading" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <FileText className="h-5 w-5 text-amber-500/80 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "అష్టోత్తరాలు & సహస్రనామాలు" : "Stotram & Ashtotharam"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "స్తోత్రాలు, పూజా విధానాలు" : "Divine stotras & guides"}</p>
                    </div>
                  </Link>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b89045] border-b pb-1 border-white/5 pt-2">
                    {language === "te" ? "ప్రత్యేక సేవలు" : "Special Online Services"}
                  </p>
                  <Link href="/find-pujari" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Video className="h-5 w-5 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "జాతకాలు & లైవ్ పూజ" : "Astrology & Live Pujas"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "వేదాధ్యయనం ఆన్‌లైన్ క్లాసులు" : "Interactive virtual booking"}</p>
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
              <button className="flex items-center gap-1 py-3 text-foreground/80 transition-colors hover:text-[#d4af37] focus:outline-none font-medium">
                <span>{language === "te" ? "యాత్రలు & దర్శనాలు" : "Pilgrimage & Temples"}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 text-amber-500/80" />
              </button>
              
              <div className="absolute left-0 top-full w-80 rounded-2xl border border-border bg-popover p-3 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 z-50">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b89045] border-b pb-1 border-white/5">
                    {language === "te" ? "తీర్థయాత్రలు" : "Temple Services"}
                  </p>
                  <Link href="/pilgrimage/darshan" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Ticket className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "ఆలయాల దర్శనాలు బుకింగ్" : "Temple Darshan Tickets"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "దర్శనం & ప్రత్యేక టికెట్లు" : "Darshan & special entry tickets"}</p>
                    </div>
                  </Link>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b89045] border-b pb-1 border-white/5 pt-2">
                    {language === "te" ? "ప్రయాణం & వసతులు" : "Travel & Stays"}
                  </p>
                  <Link href="/pilgrimage/accommodations" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Hotel className="h-5 w-5 text-[#c8a261] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "వసతి గృహాల బుకింగ్" : "Haritha Hotel & Stays"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "వైజాగ్, అరకు రూమ్ బుకింగ్" : "Vizag resorts & cottages"}</p>
                    </div>
                  </Link>
                  <Link href="/pilgrimage/sightseeing" className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted hover:text-primary">
                    <Compass className="h-5 w-5 text-[#d4af37] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-tight">{language === "te" ? "దర్శనీయ ప్రదేశాలు" : "Local Sightseeing"}</p>
                      <p className="text-[11px] text-muted-foreground">{language === "te" ? "ఆలయాల చుట్టుపక్కల విహార యాత్రలు" : "Beaches, hill parks & history"}</p>
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
        <div className="md:hidden border border-border bg-background/95 backdrop-blur-2xl px-4 py-4 space-y-4 shadow-2xl absolute w-full left-0 z-50 rounded-3xl mt-4">
          <div className="space-y-3">
            
            {/* Mobile Block 0: Vaidika Poojas */}
            <div>
              <button 
                onClick={() => toggleDropdown("sacredPrograms")}
                className="flex items-center justify-between w-full font-bold text-sm text-foreground border-b pb-1 border-border/40"
              >
                <span>{language === "te" ? "వైదిక పూజలు (Vaidika Poojas)" : "Vaidika Poojas"}</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${activeDropdown === "sacredPrograms" ? "rotate-180" : ""}`} />
              </button>
              
              {activeDropdown === "sacredPrograms" && (
                <div className="pl-3 mt-2 space-y-2 text-sm text-muted-foreground">
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Deeksha Pujas" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "దీక్షా పూజలు (Deeksha)" : "Deeksha Pujas"}
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Dosha Parihara Pujas" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "దోష పరిహార పూజలు" : "Dosha Parihara"}
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Homams" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "హోమాలు (Homams)" : "Homams"}
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Kalyanams" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "కల్యాణాలు (Kalyanams)" : "Kalyanams"}
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Nomulu" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "నోములు (Nomulu)" : "Nomulu"}
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Pujas" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "పూజలు (Pujas)" : "Pujas"}
                  </Link>
                  <Link href="/programs?category=VAIDIKA_POOJA&subcategory=Vratas" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "వ్రతాలు (Vratas)" : "Vratas"}
                  </Link>
                </div>
              )}
            </div>

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
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Prenatal" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "జననానికి ముందు (Prenatal)" : "Prenatal"}
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Childhood" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "బాల్యం (Childhood)" : "Childhood"}
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Youth+and+Education" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "విద్య & యవ్వనం (Youth)" : "Youth & Education"}
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=Adulthood" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
                    - {language === "te" ? "గృహస్థాశ్రమం (Adulthood)" : "Adulthood & Marriage"}
                  </Link>
                  <Link href="/programs?category=LIFE_CYCLE_POOJA&stage=General+or+Auspicious" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary">
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
