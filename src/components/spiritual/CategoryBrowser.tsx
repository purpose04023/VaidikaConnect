"use client";

import { useState } from "react";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import vignanamData from "@/lib/data/vignanam-categories.json";

interface Category {
  category: string;
  items: { title: string; url: string }[];
}

export function CategoryBrowser() {
  const categories: Category[] = vignanamData;
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = activeCategory.items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-10 md:mt-16 border-t border-border pt-12 md:pt-16">
      
      {/* Sidebar for Categories */}
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-4">
        <h3 className="font-headline text-xl md:text-2xl font-bold text-foreground px-2">
          Categories
        </h3>
        <p className="text-sm text-muted-foreground px-2 mb-2">
          Browse thousands of authentic stotrams across {categories.length} categories.
        </p>
        
        <ScrollArea className="h-[400px] lg:h-[600px] pr-4">
          <div className="flex flex-col gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery("");
                }}
                className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                  activeCategory.category === cat.category
                    ? "bg-muted text-foreground font-semibold"
                    : "hover:bg-muted/50 hover:text-foreground text-muted-foreground"
                }`}
              >
                <span className="font-medium text-sm leading-tight pr-2">
                  {cat.category}
                </span>
                <ChevronRight 
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    activeCategory.category === cat.category ? "translate-x-1" : "group-hover:translate-x-1 opacity-50"
                  }`} 
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl text-foreground font-semibold tracking-tight">
              {activeCategory.category.replace(/\(\d+\)/, '').trim()}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {activeCategory.items.length} sacred texts available
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <ScrollArea className="h-[500px] lg:h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 md:p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-all duration-300 group"
                >
                  <div className="p-3 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read on Vignanam <ChevronRight className="w-3 h-3" />
                    </p>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No stotrams found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

    </div>
  );
}
