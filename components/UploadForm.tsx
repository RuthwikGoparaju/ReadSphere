import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { Link as LinkIcon, FileText, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';

interface UploadFormProps {
  onSubmit: (book: Book) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    link: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load drafts from localStorage on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('readSphere_uploadDraft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    } catch (e) {
      console.error("Failed to load draft", e);
    }
  }, []);

  // Save drafts to localStorage whenever form data changes
  useEffect(() => {
    try {
      localStorage.setItem('readSphere_uploadDraft', JSON.stringify(formData));
    } catch (e) {
      // Ignore storage errors for drafts
    }
  }, [formData]);

  // Helper to convert file to Base64 string for persistent storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process files to Base64 or use placeholder/link
      let coverUrl = 'https://picsum.photos/400/600';
      if (coverFile) {
        coverUrl = await fileToBase64(coverFile);
      }

      let pdfUrl = formData.link;
      if (pdfFile) {
        pdfUrl = await fileToBase64(pdfFile);
      }

      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.title,
        author: formData.author,
        description: formData.description,
        coverUrl,
        pdfUrl
      };

      // Simulate a small network delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));

      onSubmit(newBook);
      
      // Clear draft on success
      localStorage.removeItem('readSphere_uploadDraft');
      
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setFormData({ title: '', author: '', description: '', link: '' });
        setCoverFile(null);
        setPdfFile(null);
      }, 3000);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("There was an error processing your files.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#1a1a1a] border border-green-900 rounded-xl p-12 text-center h-full flex flex-col items-center justify-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">Received!</h3>
        <p className="text-gray-400">Your book is now part of the sanctuary.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] text-white rounded-xl p-8 sm:p-10 space-y-8 h-full">
      
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Upload Details
          <span className="w-2 h-2 rounded-full bg-[#F0A6CA]"></span>
          <span className="text-xs font-normal text-gray-500 ml-auto bg-white/5 px-2 py-1 rounded">Drafts Autosaved</span>
        </h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Book Title</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#2a2a2a] text-white px-4 py-3 border-2 border-transparent rounded-lg focus:border-[#F0A6CA] outline-none transition-colors placeholder-gray-600"
              placeholder="e.g. The Midnight Library"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Author Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#2a2a2a] text-white px-4 py-3 border-2 border-transparent rounded-lg focus:border-[#F0A6CA] outline-none transition-colors placeholder-gray-600"
              placeholder="e.g. Matt Haig"
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Short Description</label>
        <textarea 
          required
          rows={3}
          className="w-full bg-[#2a2a2a] text-white px-4 py-3 border-2 border-transparent rounded-lg focus:border-[#F0A6CA] outline-none transition-colors placeholder-gray-600"
          placeholder="What is this story about?"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cover Image Upload */}
        <div className="relative border-2 border-dashed border-[#333] rounded-xl p-6 hover:border-[#F0A6CA] transition-colors text-center cursor-pointer group bg-[#222]">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={e => setCoverFile(e.target.files ? e.target.files[0] : null)}
          />
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center mb-3 group-hover:bg-[#F0A6CA] group-hover:text-black transition-colors">
               <ImageIcon className="w-5 h-5" />
             </div>
             <p className="text-sm font-bold text-gray-300">
               {coverFile ? coverFile.name : 'Cover Image'}
             </p>
          </div>
        </div>

        {/* PDF Upload */}
        <div className="relative border-2 border-dashed border-[#333] rounded-xl p-6 hover:border-[#F0A6CA] transition-colors text-center cursor-pointer group bg-[#222]">
          <input 
            type="file" 
            accept="application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={e => {
                setPdfFile(e.target.files ? e.target.files[0] : null);
                if (e.target.files?.[0]) setFormData(prev => ({ ...prev, link: '' }));
            }}
          />
           <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center mb-3 group-hover:bg-[#F0A6CA] group-hover:text-black transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-gray-300">
               {pdfFile ? pdfFile.name : 'PDF File'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
         <div className="relative">
             <input
               type="url"
               disabled={!!pdfFile}
               className={`w-full bg-transparent border-b-2 border-[#333] py-2 text-white placeholder-gray-600 focus:border-[#F0A6CA] outline-none transition-colors ${!!pdfFile ? 'opacity-50 cursor-not-allowed' : ''}`}
               placeholder="Or paste an external link here..."
               value={formData.link}
               onChange={e => setFormData({...formData, link: e.target.value})}
             />
             <LinkIcon className="absolute right-0 top-2 w-5 h-5 text-gray-600" />
         </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-bold text-[#1a1a1a] bg-[#F0A6CA] hover:bg-white transition-all ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Adding to Library...' : (
          <>
            Submit to Sanctuary
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};