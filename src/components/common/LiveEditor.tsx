"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, PencilLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveEditorProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  isAdmin: boolean;
  renderContent: (text: string) => React.ReactNode;
  containerClassName?: string;
  textareaClassName?: string;
}

export function LiveEditor({
  value,
  onSave,
  isAdmin,
  renderContent,
  containerClassName = "",
  textareaClassName = "",
}: LiveEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea to fit content
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
      toast({
        title: "Content Saved",
        description: "Your changes have been updated live.",
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast({
        variant: "destructive",
        title: "Error saving content",
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
    // Command+Enter or Ctrl+Enter to save
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      void handleSave();
    }
  };

  if (!isAdmin) {
    return <div className={containerClassName}>{renderContent(value)}</div>;
  }

  if (isEditing) {
    return (
      <div className={`relative w-full ${containerClassName}`}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => void handleSave()}
          disabled={isSaving}
          className={`w-full min-h-[300px] p-6 bg-background/90 text-foreground border-2 border-primary/50 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/80 font-mono text-lg leading-relaxed resize-y ${textareaClassName}`}
          placeholder="Enter content here. Double line breaks create new blocks."
        />
        {isSaving && (
          <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-full shadow">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <div className="absolute -bottom-8 right-0 text-xs text-muted-foreground flex items-center gap-2">
          <span>Press <kbd className="bg-muted px-1 rounded">Ctrl+Enter</kbd> to save or click outside</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className={`group relative w-full cursor-pointer transition-all duration-300 hover:ring-4 hover:ring-primary/20 hover:bg-primary/5 rounded-3xl ${containerClassName}`}
      title="Double-click to edit (Admin)"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold backdrop-blur-md">
        <PencilLine className="h-4 w-4" />
        Double-click to edit
      </div>
      {renderContent(value)}
    </div>
  );
}
