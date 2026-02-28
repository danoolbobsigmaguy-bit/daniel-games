/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Gamepad2, Maximize2, ArrowLeft, TrendingUp, Grid, Info, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  category: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Panic Key: Press 'P' to instantly redirect to Google
      if (e.key.toLowerCase() === 'p') {
        window.location.href = 'https://www.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const openAboutBlank = (game: Game) => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup blocked! Please allow popups to use About:Blank cloaking.');
      return;
    }

    const doc = win.document;
    doc.title = 'Google Docs'; // Masking title
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'; // Google Docs favicon
    doc.head.appendChild(link);

    const iframe = doc.createElement('iframe');
    iframe.src = game.url;
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'black';
    iframe.allow = 'autoplay; gamepad; keyboard; focus-without-user-activation; fullscreen';
    
    doc.body.style.margin = '0';
    doc.body.style.padding = '0';
    doc.body.appendChild(iframe);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter">
              DIAB<span className="text-brand">PLAY</span>
            </h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-brand/50 transition-colors text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white/60" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
              <span className="text-xs font-bold text-brand">DP</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero / Categories */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Trending Now</span>
                  </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat 
                          ? 'bg-brand text-black' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredGames.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/5 game-card-shadow transition-all group-hover:-translate-y-1">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="bg-brand text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Play Now
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-bold text-sm group-hover:text-brand transition-colors truncate">
                        {game.title}
                      </h3>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                        {game.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-white/40 italic">No games found matching your search.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4 h-[calc(100vh-12rem)]"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-brand transition-colors font-bold text-sm group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  BACK TO GAMES
                </button>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => openAboutBlank(selectedGame)}
                    className="flex items-center gap-2 bg-brand/10 hover:bg-brand/20 text-brand px-3 py-1.5 rounded-xl border border-brand/20 transition-all text-xs font-bold"
                  >
                    <Info className="w-3 h-3" />
                    CLOAK MODE (ABOUT:BLANK)
                  </button>
                  <h2 className="text-xl font-black italic tracking-tight uppercase">{selectedGame.title}</h2>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60 font-mono">
                    {selectedGame.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-white/10 relative group">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="autoplay; gamepad; keyboard; focus-without-user-activation; fullscreen"
                  allowFullScreen
                />
                
                {/* Blocked Game Help Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 p-8 text-center">
                  <Info className="w-12 h-12 text-brand mb-4" />
                  <h3 className="text-xl font-bold mb-2">Game not loading?</h3>
                  <p className="text-white/60 text-sm max-w-md mb-6">
                    If you see "Refused to connect" or a blank screen, your network is blocking this game's source. 
                    Click the <span className="text-brand font-bold">CLOAK MODE</span> button above to bypass the filter!
                  </p>
                  <button 
                    onClick={() => openAboutBlank(selectedGame)}
                    className="bg-brand text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    TRY CLOAK MODE NOW
                  </button>
                </div>
                
                {/* Overlay controls for better UX */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={toggleFullscreen}
                    className="bg-brand p-3 rounded-2xl text-black hover:scale-110 transition-transform shadow-2xl"
                   >
                     <Maximize2 className="w-6 h-6" />
                   </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-white/40 text-xs font-medium px-2">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Use arrow keys to play</span>
                  <span className="flex items-center gap-1"><Grid className="w-3 h-3" /> Category: {selectedGame.category}</span>
                </div>
                <span>Powered by Diab Play Engine</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-black w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tighter">
                DIAB<span className="text-brand">PLAY</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The ultimate destination for unblocked gaming. Fast, secure, and always free.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Explore</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="hover:text-brand cursor-pointer transition-colors">New Games</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Trending</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Categories</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Support</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="hover:text-brand cursor-pointer transition-colors">FAQ</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Privacy</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand hover:text-black transition-all">
                <Github className="w-5 h-5" />
              </a>
              <div className="p-2 bg-white/5 rounded-lg hover:bg-brand hover:text-black transition-all cursor-pointer">
                <Gamepad2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          <p>© 2026 DIAB PLAY. ALL RIGHTS RESERVED.</p>
          <p>MADE WITH ❤️ FOR GAMERS</p>
        </div>
      </footer>
    </div>
  );
}
