import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Heart, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock database for stotrams
interface StotramData {
  title: string;
  titleEn: string;
  category: string;
  stanzas: string[];
}

const mockStotrams: Record<string, StotramData> = {
  "ganapati-prarthana-ghanapatham": {
    title: "గణపతి ప్రార్థన ఘనపాఠః",
    titleEn: "Ganapati Prarthana Ghanapatham",
    category: "వేద మంత్రాః",
    stanzas: [
      "గణానాం త్వా గణపతిగ్ం హవామహే కవిం కవీనాముపమశ్రవస్తమమ్ |\nజ్యేష్ఠరాజం బ్రహ్మణాం బ్రహ్మణస్పత ఆ నః శృణ్వన్నూతిభిః సీద సాదనమ్ ||",
      "ప్రణో దేవీ సరస్వతీ వాజేభిర్వాజినీవతీ |\nధీనామవిత్ర్యవతు ||",
      "శ్రీ మహాగణాధిపతయే నమః |\nశ్రీ శారదాదేవ్యై నమః |\nశ్రీ గురుభ్యో నమః ||"
    ]
  },
  "gayatri-mantram-ghanapatham": {
    title: "గాయత్రీ మంత్రం ఘనపాఠః",
    titleEn: "Gayatri Mantram Ghanapatham",
    category: "వేద మంత్రాః",
    stanzas: [
      "ఓం భూర్భువస్సువః |\nతత్సవితుర్వరేణ్యం |\nభర్గో దేవస్య ధీమహి |\nధియో యో నః ప్రచోదయాత్ ||",
      "ఓం ఆపో జ్యోతీ రసోమృతం బ్రహ్మ భూర్భువస్సువరోమ్ ||"
    ]
  },
  "purusha-suktam": {
    title: "పురుష సూక్తం",
    titleEn: "Purusha Suktam",
    category: "వేద మంత్రాః",
    stanzas: [
      "సహస్రశీర్షా పురుషః సహస్రాక్షః సహస్రపాత్ |\nస భూమిం విశ్వతో వృత్వా అత్యతిష్ఠద్దశాంగులమ్ ||",
      "పురుష ఏవేదగ్ం సర్వమ్ యద్భూతం యచ్చ భవ్యమ్ |\nఉతామృతత్వస్యేశానః యదన్నేనాతిరోహతి ||",
      "ఏతావానస్య మహిమా అతో జ్యాయాగ్శ్చ పూరుషః |\nపాదోస్య విశ్వా భూతాని త్రిపాదస్యామృతం దివి ||"
    ]
  },
  "narayana-suktam": {
    title: "నారాయణ సూక్తం",
    titleEn: "Narayana Suktam",
    category: "వేద మంత్రాః",
    stanzas: [
      "సహస్రశీర్షం దేవం విశ్వాక్షం విశ్వశంభువమ్ |\nవిశ్వం నారాయణందేవమక్షరం పరమం పదమ్ ||",
      "విశ్వతః పరమాన్నిత్యం విశ్వం నారాయణగ్ం హరిమ్ |\nవిశ్వమేవేదం పురుషస్తద్విశ్వముపజీవతి ||",
      "పతిం విశ్వస్యాత్మేశ్వరగ్ం శాశ్వతగ్ం శివమచ్యుతమ్ |\nనారాయణమ్మహాజ్ఞేయం విశ్వాత్మానం పరాయణమ్ ||"
    ]
  },
  "shiva-manasa-puja": {
    title: "శివ మానస పూజ",
    titleEn: "Shiva Manasa Puja",
    category: "నిత్య పారాయణ శ్లోకాః",
    stanzas: [
      "ఆరాధయామి మణిసన్నిభమాత్మలింగం\nమాయాపురీహృదయపంకజసన్నివిష్టమ్ |\nశ్రద్ధానదీవిమలచిత్తజలాభిషేకైః\nనిత్యం సమాధికుసుమైరపునర్భవాయ ||",
      "సౌవర్ణే నవరత్నఖండరచితే పాత్రే ఘృతం పాయసం\nభక్ష్యం పంచవిధం పయోదధియుతం రంభాఫలం పానకమ్ |\nశాకానామయుతం జలం రుచికరం కర్పూరఖండోజ్జ్వలం\nతాంబూలం మనసా మయా విరచితం భక్త్యా ప్రభో స్వీకురు ||"
    ]
  },
  "mantra-pushpam": {
    title: "మంత్ర పుష్పం",
    titleEn: "Mantra Pushpam",
    category: "వేద మంత్రాః",
    stanzas: [
      "యోపాం పుష్పం వేద పుష్పవాన్ ప్రజావాన్ పశుమాన్ భవతి |\nచంద్రమా వా అపాం పుష్పమ్ పుష్పవాన్ ప్రజావాన్ పశుమాన్ భవతి |\nయ ఏవం వేద యోపామాయతనం వేద ఆయతనవాన్ భవతి ||",
      "అగ్నిర్వా అపామాయతనమ్ ఆయతనవాన్ భవతి |\nయోగ్నేరాయతనం వేద ఆయతనవాన్ భవతి |\nఆపో వా అగ్నేరాయతనమ్ ఆయతనవాన్ భవతి |\nయ ఏవం వేద యోపామాయతనం వేద ఆయతనవాన్ భవతి ||"
    ]
  }
};

// Generates Title Case from Slug for unknown slokas
function getTitleFromSlug(slug: string) {
  const words = slug.split("-");
  const capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const englishName = capitalized.join(" ");

  // Simple mapping of some key words to Telugu for better UX
  let teluguName = "శ్రీ ప్రార్థన స్తోత్రం";
  if (slug.includes("shiva") || slug.includes("siva")) teluguName = "శ్రీ శివ స్తోత్రం";
  else if (slug.includes("ganesha") || slug.includes("ganapati")) teluguName = "శ్రీ విఘ్నేశ్వర స్తోత్రం";
  else if (slug.includes("devi") || slug.includes("durga")) teluguName = "శ్రీ దేవి స్తోత్రం";
  else if (slug.includes("lakshmi")) teluguName = "శ్రీ మహాలక్ష్మి మంగళ స్తోత్రం";
  else if (slug.includes("krishna")) teluguName = "శ్రీ కృష్ణ స్తోత్రం";
  else if (slug.includes("rama")) teluguName = "శ్రీ రామచంద్ర స్తోత్రం";
  else if (slug.includes("mantra") || slug.includes("mantram")) teluguName = "వైదిక మంత్ర పారాయణం";

  return { title: teluguName, titleEn: englishName };
}

// Generate static params for major routes to speed up static compilation
export function generateStaticParams() {
  return [
    { slug: "ganapati-prarthana-ghanapatham" },
    { slug: "gayatri-mantram-ghanapatham" },
    { slug: "purusha-suktam" },
    { slug: "narayana-suktam" },
    { slug: "shiva-manasa-puja" },
    { slug: "mantra-pushpam" }
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReadingPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Find or generate stotram
  const data = mockStotrams[slug] || {
    ...getTitleFromSlug(slug),
    category: "భక్తి స్తోత్రములు",
    stanzas: [
      "ఓం భద్రం కర్ణేభిః శృణుయామ దేవాః |\nభద్రం పశ్యేమాక్షభిర్యజత్రాః |\nస్థిరైరంగైస్తుష్టువాగ్ంసస్తనూభిః |\nవ్యశేమ దేవహితం యదాయుః ||",
      "స్వస్తి న ఇన్ద్రో వృద్ధశ్రవాః |\nస్వస్తి నః పూషా విశ్వవేదాః |\nస్వస్తి నస్తార్క్ష్యో అరిష్టనేమిః |\nస్వస్తి నో బృహస్పతిర్దధాతు ||",
      "ఓం శాంతి శాంతి శాంతిః ||"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18110b] to-[#0c0805] text-[#f4ecd8] py-8 md:py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Back Button */}
        <div className="mb-8 md:mb-12 flex justify-start">
          <Button asChild variant="ghost" className="text-[#c8a261] hover:text-[#e5c583] hover:bg-white/5 rounded-xl gap-2 transition-all">
            <Link href="/spiritual/reading">
              <ArrowLeft className="h-4 w-4" />
              <span>{data.category === "వేద మంత్రాః" ? "తిరిగి వెనుకకు" : "Back to Readings"}</span>
            </Link>
          </Button>
        </div>

        {/* Premium Header Accent */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <div className="flex justify-center mb-2">
            <span className="text-[#c8a261] p-2 rounded-full bg-white/5 border border-[#c8a261]/20">
              <Sun className="h-6 w-6 animate-pulse-slow text-[#c8a261]" />
            </span>
          </div>
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#c8a261] bg-[#c8a261]/10 px-3 py-1 rounded-full border border-[#c8a261]/20 shadow-inner">
            {data.category}
          </span>
          <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#f4ecd8] break-words whitespace-normal leading-relaxed md:leading-snug max-w-3xl mx-auto px-2 drop-shadow-md">
            {data.title}
          </h1>
          <p className="text-sm md:text-base text-[#c8a261]/80 tracking-widest uppercase font-sans">
            {data.titleEn}
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#c8a261]/50 to-transparent mx-auto mt-6" />
        </div>

        {/* Text Body Card wrapper */}
        <div className="bg-[#1e1610]/80 border border-[#c8a261]/15 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle noise / design pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#c8a261_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-8 md:gap-12">
            {data.stanzas.map((stanza, idx) => (
              <div 
                key={idx} 
                className="group relative p-6 md:p-10 rounded-2xl bg-black/20 hover:bg-black/35 border border-[#c8a261]/5 hover:border-[#c8a261]/25 transition-all duration-500 shadow-sm hover:shadow-xl w-full h-full text-center"
              >
                {/* Micro-sparkle icon */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#1e1610] px-2 text-[#c8a261]">
                  <Sparkles className="h-4 w-4" />
                </div>

                {stanza.split("\n").map((line, lineIdx) => (
                  <p 
                    key={lineIdx} 
                    className="my-3 text-lg md:text-2xl lg:text-3xl leading-relaxed md:leading-loose font-telugu text-[#f4ecd8]/95 font-medium tracking-wide break-words whitespace-normal"
                  >
                    {line.trim()}
                  </p>
                ))}

                {/* Stanza Badge */}
                <div className="mt-4 inline-flex items-center justify-center text-[10px] font-mono text-[#c8a261]/50 group-hover:text-[#c8a261] transition-colors border border-[#c8a261]/20 rounded-full w-6 h-6 bg-[#18110b]">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Devotion Accent */}
        <div className="mt-12 md:mt-16 text-center space-y-2 opacity-60">
          <p className="text-xs text-[#c8a261] tracking-wide uppercase">
            సమస్త సన్మంగళాని భవంతు
          </p>
          <p className="text-[10px] text-muted-foreground">
            VaidikaConnect spiritual library • Preserving Vedic Tradition
          </p>
        </div>

      </div>
    </div>
  );
}
