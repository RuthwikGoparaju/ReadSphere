import React from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  pdfUrl?: string; // URL for the PDF file (blob or remote)
  isExternal?: boolean; // If true, opens in new tab (optional behavior)
  demoContent?: React.ReactNode[]; // For the demo flipbook
  lastReadPage?: number; // Autosaved progress
}

export type ViewMode = 'home' | 'reader';

export type ReaderMode = 'flip' | 'scroll';