import Link from 'next/link';
import type { Pujari } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Star, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"
import { ManagedImage } from '@/components/common/ManagedImage';

interface PujariCardProps {
  pujari: Pujari;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function PujariCard({ pujari, isSelected, onSelect }: PujariCardProps) {
  const { toast } = useToast()

  const handleChatClick = () => {
    toast({
      title: "Coming Soon!",
      description: "In-app chat functionality is under development.",
    })
  }

  return (
    <Card 
      className={cn(
        "w-full overflow-hidden transition-all duration-300 border-2",
        isSelected ? 'border-primary shadow-2xl scale-105' : 'border-transparent shadow-lg'
      )}
      onClick={() => onSelect(pujari.id)}
    >
      <CardContent className="p-4 flex gap-4">
        <div className="relative w-24 h-24 shrink-0">
          <ManagedImage
            src={pujari.photo}
            alt={pujari.name}
            fill
            className="rounded-full object-cover border-2 border-accent"
            data-ai-hint={pujari.photoHint}
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-headline text-xl">{pujari.name}</h3>
            {pujari.verified && (
              <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-current" />
              <span>{pujari.rating}</span>
            </div>
            <span>({pujari.reviewCount} reviews)</span>
          </div>
          <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground">
            Price: Rs. {pujari.basePrice.toLocaleString()}
          </Badge>
          <div className="flex gap-2 mt-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/pujari/${pujari.id}`}>View Profile</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleChatClick}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
