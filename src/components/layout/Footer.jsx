import React from 'react';
import { Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border/80 bg-background/60 py-3.5 px-4 sm:px-6 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span>GitHub Profile README Builder</span>
          <span className="text-border">&bull;</span>
          <span className="text-muted-foreground/80">Open Source</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Built by</span>
          <a
            href="https://github.com/benniiee"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-blue-500 transition-colors inline-flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <Github className="w-3.5 h-3.5" />
            <span>benniiee</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
