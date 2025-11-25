import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { PLATFORMS, getIcon } from '../constants';
import { Check, Hash, Image as ImageIcon, Type, Music, MapPin, Loader2, RefreshCw, Copy, Languages, Globe } from 'lucide-react';
import { generateThumbnail } from '../services/geminiService';

interface ResultCardProps {
  result: GeneratedContent;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const platformConfig = PLATFORMS.find(p => p.id === result.platformId);
  const [copiedState, setCopiedState] = useState<{field: string, type: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text');
  
  // Image Generation State
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  if (!platformConfig) return null;

  const handleCopy = (text: string, field: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState({ field, type });
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const base64 = await generateThumbnail(result.visualPrompt, platformConfig.aspectRatio);
      setGeneratedImage(base64);
    } catch (e) {
      console.error(e);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Helper to render 3-way copy buttons
  const CopyGroup = ({ 
    field, 
    contentZh, 
    contentEn 
  }: { 
    field: string; 
    contentZh: string; 
    contentEn: string; 
  }) => {
    const mix = `${contentZh}\n\n${contentEn}`;
    
    const CopyBtn = ({ text, type, label }: { text: string; type: string; label: string }) => {
       const isCopied = copiedState?.field === field && copiedState?.type === type;
       return (
        <button
          onClick={() => handleCopy(text, field, type)}
          className={`
            flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold rounded transition-all border
            ${isCopied 
              ? 'bg-green-500/20 text-green-400 border-green-500/50' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-500'}
          `}
          title={`Copy ${label}`}
        >
          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {label}
        </button>
       )
    };

    return (
      <div className="flex gap-2">
        <CopyBtn text={contentZh} type="zh" label="CN" />
        <CopyBtn text={contentEn} type="en" label="EN" />
        <CopyBtn text={mix} type="mix" label="ALL" />
      </div>
    );
  };

  // Helper for Tags Copy
  const TagsCopyGroup = ({ zhTags, enTags }: { zhTags: string[], enTags: string[] }) => {
    // Format tags with # for copying
    const formatTags = (tags: string[]) => tags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    
    const txtZh = formatTags(zhTags);
    const txtEn = formatTags(enTags);
    const txtMix = `${txtZh} ${txtEn}`;
    
    return <CopyGroup field="tags" contentZh={txtZh} contentEn={txtEn} />;
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-800 ${platformConfig.color}`}>
            {getIcon(platformConfig.icon, "w-5 h-5")}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white leading-none">{platformConfig.name}</h3>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{platformConfig.aspectRatio} Aspect</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'text' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Copy
          </button>
          <button 
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${activeTab === 'visual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Visuals
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        
        {activeTab === 'text' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Title Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Type className="w-3 h-3" /> Title
                </span>
                <CopyGroup field="title" contentZh={result.title.zh} contentEn={result.title.en} />
              </div>
              <div className="space-y-2">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-white font-medium relative group">
                  <div className="absolute top-2 right-2 text-[10px] text-slate-600">CN</div>
                  {result.title.zh}
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-slate-300 font-medium relative group">
                  <div className="absolute top-2 right-2 text-[10px] text-slate-600">EN</div>
                  {result.title.en}
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Languages className="w-3 h-3" /> Description
                </span>
                <CopyGroup field="content" contentZh={result.content.zh} contentEn={result.content.en} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-slate-200 text-sm whitespace-pre-wrap min-h-[80px] relative">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-600">CN</div>
                    {result.content.zh}
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-slate-400 text-sm whitespace-pre-wrap min-h-[80px] relative">
                    <div className="absolute top-2 right-2 text-[10px] text-slate-600">EN</div>
                    {result.content.en}
                 </div>
              </div>
            </div>

            {/* Tags Section */}
            {(result.tags.zh.length > 0 || result.tags.en.length > 0) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Tags
                    </span>
                    <TagsCopyGroup zhTags={result.tags.zh} enTags={result.tags.en} />
                </div>
                <div className="flex flex-wrap gap-2 bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                  {result.tags.zh.map((tag, idx) => (
                    <span key={`zh-${idx}`} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 cursor-default">
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}
                  <div className="w-px h-4 bg-slate-700 mx-1 self-center"></div>
                  {result.tags.en.map((tag, idx) => (
                    <span key={`en-${idx}`} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 cursor-default">
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Cover Text Suggestion */}
            <div>
              <div className="flex justify-between items-center mb-1">
                 <span className="flex items-center gap-1 text-xs font-bold text-pink-400 uppercase tracking-wider">
                   <Type className="w-3 h-3" /> Cover Text (Overlay)
                 </span>
                 <button
                  onClick={() => handleCopy(result.coverText, 'cover', 'mix')}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                 >
                   {copiedState?.field === 'cover' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                 </button>
              </div>
              <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg text-xl font-black text-center text-white tracking-tight shadow-inner">
                {result.coverText}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 text-center">Put this text ON your video cover image.</p>
            </div>

            {/* AI Image Generation */}
            <div className="flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-2">
                 <span className="flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                   <ImageIcon className="w-3 h-3" /> AI Thumbnail Preview
                 </span>
                 {generatedImage && (
                   <button 
                     onClick={handleGenerateImage} 
                     className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white"
                     disabled={isGeneratingImage}
                   >
                     <RefreshCw className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin' : ''}`} /> Regenerate
                   </button>
                 )}
               </div>

               <div className="relative flex-1 bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 overflow-hidden group min-h-[200px] flex items-center justify-center">
                 {isGeneratingImage ? (
                   <div className="flex flex-col items-center gap-3">
                     <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                     <span className="text-xs text-indigo-300">Creating {platformConfig.aspectRatio} art...</span>
                   </div>
                 ) : generatedImage ? (
                   <div className="relative w-full h-full">
                     <img src={generatedImage} alt="AI Generated Thumbnail" className="w-full h-full object-contain bg-black" />
                     <a 
                       href={generatedImage} 
                       download={`${result.platformId}_cover.png`}
                       className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       Download
                     </a>
                   </div>
                 ) : (
                   <div className="text-center p-6 space-y-3">
                     <p className="text-xs text-slate-500 px-4 italic">
                       "{result.visualPrompt}"
                     </p>
                     <button 
                       onClick={handleGenerateImage}
                       className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                     >
                       Generate AI Cover
                     </button>
                   </div>
                 )}
               </div>
            </div>

             {/* Extra Metadata */}
             {result.extraMetadata && (
               <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800 space-y-2">
                 <div className="text-[10px] font-bold text-slate-500 uppercase">Pro Tips</div>
                 <div className="text-xs text-slate-400 flex flex-col gap-1">
                    {result.extraMetadata.split('\n').map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {line.toLowerCase().includes('bgm') && <Music className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />}
                        {line.toLowerCase().includes('location') && <MapPin className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />}
                        <span>{line}</span>
                      </div>
                    ))}
                 </div>
               </div>
             )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;