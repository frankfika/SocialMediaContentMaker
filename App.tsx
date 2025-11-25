import React, { useState } from 'react';
import PlatformSelector from './components/PlatformSelector';
import ResultCard from './components/ResultCard';
import { PLATFORMS, TONES } from './constants';
import { GeneratedContent, PlatformId } from './types';
import { generateSocialCopy } from './services/geminiService';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['youtube', 'wechat']);
  const [selectedTone, setSelectedTone] = useState<string>('casual');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a video description.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await generateSocialCopy(description, selectedPlatforms, selectedTone);
      
      // Sort results to match user selection order (mostly)
      const sortedResults = data.sort((a, b) => {
         return selectedPlatforms.indexOf(a.platformId as PlatformId) - selectedPlatforms.indexOf(b.platformId as PlatformId);
      });

      setResults(sortedResults);
    } catch (err: any) {
      setError("Failed to generate content. Please try again. " + (err.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="text-indigo-400" />
              SocialSync Pro
            </h1>
            <p className="text-slate-400 mt-2">
              全平台视频文案 + AI 封面生成器 (Optimized for Chinese Social Media)
            </p>
          </div>
          
          {/* Tone Selector */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
             <span className="text-sm font-medium text-slate-500 pl-3">Tone/语气:</span>
             <select 
               value={selectedTone}
               onChange={(e) => setSelectedTone(e.target.value)}
               className="bg-transparent text-sm font-medium text-white p-2 outline-none cursor-pointer hover:bg-slate-800 rounded-md"
             >
               {TONES.map(t => (
                 <option key={t.value} value={t.value} className="bg-slate-900">{t.label}</option>
               ))}
             </select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            
            <section className="space-y-3">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                1. Select Platforms / 选择平台
              </label>
              <PlatformSelector 
                selected={selectedPlatforms} 
                onChange={setSelectedPlatforms} 
              />
            </section>

            <section className="space-y-3">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                2. Video Description / 视频描述
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例如：关于京都旅行的Vlog，去了伏见稻荷大社，吃了很多路边摊。想强调虽然人很多但很便宜，最后还有个彩蛋..."
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-base leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                  {description.length} chars
                </div>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${isLoading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Copy & Visuals
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-slate-600">
               Note: Generates titles, descriptions, tags, and cover prompts. Use the "Visuals" tab to create AI thumbnails.
            </p>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
             <div className="h-full">
               {results.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {results.map((result) => (
                     <ResultCard key={result.platformId} result={result} />
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl p-12 min-h-[500px]">
                   {isLoading ? (
                     <div className="text-center space-y-4">
                       <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-500" />
                       <p className="animate-pulse">Analyzing viral trends...</p>
                       <p className="text-xs text-slate-500">Writing copy for {selectedPlatforms.length} platforms...</p>
                     </div>
                   ) : (
                     <>
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                          <Sparkles className="w-8 h-8 text-slate-700" />
                        </div>
                        <p className="text-lg font-medium">Ready to generate</p>
                        <p className="text-sm">Enter your video details to get tailored copy & cover art.</p>
                     </>
                   )}
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;