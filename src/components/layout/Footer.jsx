import React from 'react';
import { Github } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 bg-background/80 py-5 px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3.5">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <span className="font-semibold text-foreground">README Builder</span>
          <span className="text-border">&bull;</span>
          <span className="text-muted-foreground/80">Open Source</span>
          <span className="text-border">&bull;</span>
          <span className="text-muted-foreground/60">&copy; {currentYear}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>Crafted by</span>
          <a
            href="https://github.com/benniiee"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-blue-500 transition-colors inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <Github className="w-4 h-4" />
            <span>benniiee</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
