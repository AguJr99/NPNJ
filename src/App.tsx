import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, Package, ClipboardList, Menu, X, Instagram, Phone, Award, Shirt, Clock, Headphones, Search, Filter, MapPin, ChevronDown } from 'lucide-react';
import { JERSEYS, ENCARGO_JERSEYS, WHATSAPP_NUMBER, LEAGUES } from './constants';
import { Jersey, EncargoJersey, EncargoOrder } from './types';

const LOGO_NAV_URL = "https://drive.google.com/thumbnail?id=1QDifBYZdIrmOZ1C8Hr-EEchd9d5PElN_&sz=w200";
const LOGO_FOOTER_URL = "https://drive.google.com/thumbnail?id=17y8hAaeWVS3U659DmYeCgN52GPQPbNT2&sz=w200";
const LOGO_ABOUT_URL = "https://drive.google.com/thumbnail?id=1fZ5zARjTmJOg96y7vKKR4IaC8BUNidqQ&sz=w600";
const HERO_IMAGE = "https://drive.google.com/thumbnail?id=1Z1mGwwNTio8wQRP3cEEtn5eqiLZW6dZ0&sz=w1920"; 

// Global cache for loaded images to prevent flickering
const LOADED_IMAGES = new Set<string>();

const LEAGUES_DATA = [
  {
    name: 'La Liga',
    logo: 'https://drive.google.com/thumbnail?id=1tPMte612ZBA5g_6I1N7jU-cJllVatcuF&sz=w200',
    teams: [
      { name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
      { name: 'Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
      { name: 'Atlético de Madrid', logo: 'https://drive.google.com/thumbnail?id=1lTt8kiivsanjHf3dphi2lNJ3clpOnxcI&sz=w200' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  },
  {
    name: 'Premier League',
    logo: 'https://drive.google.com/thumbnail?id=12CBEfKXauc2gOPF3lkjJtNsoYSSXKqOH&sz=w200',
    teams: [
      { name: 'Manchester City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
      { name: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
      { name: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
      { name: 'Manchester United', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
      { name: 'Chelsea', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  },
  {
    name: 'Serie A',
    logo: 'https://drive.google.com/thumbnail?id=1CKj9Bq7qszKtykRNpJ2JTsvDH7sSPJ13&sz=w200',
    teams: [
      { name: 'Inter', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
      { name: 'Juventus', logo: 'https://drive.google.com/thumbnail?id=1XSLlMcS-XYkjvVG-KQPiWTAhn9r6WP0X&sz=w200' },
      { name: 'Milan', logo: 'https://drive.google.com/thumbnail?id=1SlrkXTWyUKKu8YxmVnbQOoKGQl4jYNQB&sz=w200' },
      { name: 'Napoli', logo: 'https://drive.google.com/thumbnail?id=1xgcnPUHHR-O_gwhhfB4sLutNmGW0JExm&sz=w200' },
      { name: 'Roma', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  },
  {
    name: 'Bundesliga',
    logo: 'https://drive.google.com/thumbnail?id=1lhwq6p5531Q7LKoCqfGMOF-UYtzulk8M&sz=w200',
    teams: [
      { name: 'Bayern Munich', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
      { name: 'Borussia Dortmund', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
      { name: 'Bayer Leverkusen', logo: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  },
  {
    name: 'Ligue 1',
    logo: 'https://drive.google.com/thumbnail?id=1v7zORdUCbZ4e0ZqNTA6RlaEP9gzk322w&sz=w200',
    teams: [
      { name: 'PSG', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
      { name: 'Mónaco', logo: 'https://drive.google.com/thumbnail?id=1oLx-8tL1nhbIEcuqP9ks8X0tyobc-DYi&sz=w200' },
      { name: 'Marseille', logo: 'https://drive.google.com/thumbnail?id=1_zIK18FJVwkPZ1BB0s-8kgesiS5CrQWh&sz=w200' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  },
  {
    name: 'Selecciones',
    logo: 'https://drive.google.com/thumbnail?id=1oYgHnDKjpIlAuHAQTxyNG8FVnfOfyaZd&sz=w200',
    teams: [
      { name: 'España', logo: 'https://drive.google.com/thumbnail?id=1R5K6bxXtNL7TG3yK3CcTtAQiwACfYhU9&sz=w200' },
      { name: 'Argentina', logo: 'https://drive.google.com/thumbnail?id=12p0dm2-Rnw7SQnYqhhoVgpAb7iNaFSdA&sz=w200' },
      { name: 'Brasil', logo: 'https://drive.google.com/thumbnail?id=1VGKyeMQfFUcIvA0YBWz1RdTxUZzEt8eZ&sz=w200' },
      { name: 'Francia', logo: 'https://drive.google.com/thumbnail?id=19r5O2FF0RRE2g6GsPeoB7CcujerZZzbM&sz=w200' },
      { name: 'Alemania', logo: 'https://drive.google.com/thumbnail?id=19CdrHSq0jIAMiIYpLK6_K5vI018Npv_l&sz=w200' },
      { name: 'Italia', logo: 'https://drive.google.com/thumbnail?id=1bUhVWMxL02et5xCCGjP6M0jkrWiwwt87&sz=w200' },
      { name: 'Inglaterra', logo: 'https://upload.wikimedia.org/wikipedia/en/8/8b/England_national_football_team_crest.svg' },
      { name: 'Portugal', logo: 'https://drive.google.com/thumbnail?id=1A_UYzinbSE6JIvqkgV65EDhQkqxWfp7M&sz=w200' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  },
  {
    name: 'Otras Ligas',
    logo: 'https://drive.google.com/thumbnail?id=1uz9f3jXMWJBqF2pQEOgF9KQZpqTXPxD-&sz=w200',
    teams: [
      { name: 'Al-Nassr', logo: 'https://drive.google.com/thumbnail?id=14U4pAalr6YGNqlVOKXZtBMG0kIJJDnCe&sz=w200' },
      { name: 'Inter Miami', logo: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Inter_Miami_CF_logo.svg' },
      { name: 'Ajax', logo: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg' },
      { name: 'Boca Juniors', logo: 'https://drive.google.com/thumbnail?id=1EsL37gO3-DECj-LTxfGIYDKrwrWD8tED&sz=w200' },
      { name: 'River Plate', logo: 'https://drive.google.com/thumbnail?id=1ngxtQwJwwS5-uwLAMG4P2himv_xIMWz1&sz=w200' },
      { name: 'Otros', logo: 'https://drive.google.com/thumbnail?id=1-BuZ9jOVI5Uduxg-9dXCrcnvgtK12F4y&sz=w200' }
    ]
  }
];

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-secondary text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-24">
          <Link to="/" className="flex items-center gap-3 md:gap-4 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#ebd6ac] rounded-xl md:rounded-2xl flex items-center justify-center p-0 shadow-xl border-2 border-primary/20 overflow-hidden transform hover:scale-105 transition-transform">
              <img 
                src={LOGO_NAV_URL} 
                alt="No Pain No Jersey Logo" 
                className="w-full h-full object-contain scale-110" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-text');
                  if (fallback) (fallback as HTMLElement).style.display = 'block';
                }}
              />
              <span className="fallback-text hidden font-display font-black text-[10px] text-primary leading-none text-center">
                NO PAIN<br/>NO JERSEY
              </span>
            </div>
          </Link>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2 bg-black/20 p-1.5 rounded-full">
              {['home', 'stock', 'encargos', 'nosotros', 'preguntas', 'contacto', 'sorteo'].map((tab) => (
                <Link
                  key={tab}
                  to={tab === 'home' ? '/' : `/${tab}`}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab ? 'bg-primary text-secondary shadow-lg' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab === 'home' ? 'Inicio' : tab === 'stock' ? 'Stock' : tab === 'encargos' ? 'Encargos' : tab === 'nosotros' ? 'Nosotros' : tab === 'preguntas' ? 'Preguntas' : tab === 'contacto' ? 'Contacto' : 'Sorteo'}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Secciones</span>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-white/5 text-primary hover:bg-white/10 transition-colors">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-16 left-4 right-4 bg-secondary/95 backdrop-blur-xl rounded-[1.5rem] border border-primary/20 shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {['home', 'stock', 'encargos', 'nosotros', 'preguntas', 'contacto', 'sorteo'].map((tab) => (
                <Link
                  key={tab}
                  to={tab === 'home' ? '/' : `/${tab}`}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-center py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-primary text-secondary' : 'text-accent/60 hover:text-primary'
                  }`}
                >
                  {tab === 'home' ? 'Inicio' : tab === 'stock' ? 'Stock' : tab === 'encargos' ? 'Encargos' : tab === 'nosotros' ? 'Nosotros' : tab === 'preguntas' ? 'Preguntas' : tab === 'contacto' ? 'Contacto' : 'Sorteo'}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FAQItem: React.FC<{ question: string, answer: React.ReactNode, index: number, onZoom?: (src: string) => void }> = ({ question, answer, index, onZoom }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className={`bg-white rounded-lg md:rounded-[2rem] shadow-xl shadow-secondary/5 border transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary/40 ring-1 ring-primary/10' : 'border-secondary/5 hover:border-primary/20'}`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 md:p-8 flex items-center justify-between text-left group"
      >
        <h3 className="text-[12px] md:text-lg font-medium md:font-black text-secondary uppercase tracking-tight flex items-center gap-2 md:gap-4">
          <span className="text-primary text-[10px] md:text-sm font-black">0{index + 1}.</span> {question}
        </h3>
        <div className={`p-1 md:p-2 rounded-full bg-secondary/5 group-hover:bg-primary/10 transition-colors ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-secondary/40'}`}>
          <ChevronDown className="w-3 h-3 md:w-5 md:h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4 md:px-8 md:pb-8 pt-0">
              <div className="h-px bg-secondary/5 mb-4 md:mb-6" />
              <div className="text-secondary/70 leading-relaxed font-medium text-xs md:text-lg">
                {typeof answer === 'string' ? <p>{answer}</p> : (
                  <div className="faq-answer-container">
                    {React.Children.map(answer, child => {
                      if (React.isValidElement(child)) {
                        // This is a bit complex for nested children, 
                        // but let's assume the images are top-level or in a simple grid
                        return child;
                      }
                      return child;
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JerseyCard = ({ jersey, onOrder }: { jersey: Jersey, onOrder: (j?: Jersey) => void, key?: string }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimized thumbnail URL for Google Drive
  const thumbnailUrl = jersey.image.includes('googleusercontent.com/d/') 
    ? `https://drive.google.com/thumbnail?id=${jersey.image.split('/d/')[1]}&sz=w600` 
    : jersey.image;

  const hasDiscount = jersey.discountEndDate && new Date(jersey.discountEndDate) > new Date();
  const discountPercentage = jersey.originalPrice ? Math.round(((jersey.originalPrice - jersey.price) / jersey.originalPrice) * 100) : 0;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-secondary/5 group border flex flex-col hover:shadow-primary/10 transition-all duration-500 ${hasDiscount ? 'border-red-500/30 ring-2 ring-red-500/10' : 'border-secondary/5'}`}
      >
        <div 
          className="relative overflow-hidden bg-accent/30 cursor-zoom-in"
          onClick={() => setShowFullImage(true)}
        >
          {/* Loading Skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-secondary/5 animate-pulse flex items-center justify-center">
              <Shirt className="w-8 h-8 text-secondary/10" />
            </div>
          )}
          
          <img
            src={thumbnailUrl}
            alt={jersey.name}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-auto object-contain transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${jersey.id}/400/600`;
              setIsLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <Search className="text-white w-8 h-8 drop-shadow-lg" />
          </div>
          
          {hasDiscount && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1 items-start">
              <div className="bg-red-600 text-white font-black text-[8px] md:text-xs px-2 py-1 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 md:w-3 h-3" />
                <span>EN OFERTA</span>
              </div>
              <div className="bg-white/95 backdrop-blur-sm text-red-600 font-black text-[7px] md:text-[9px] px-2 py-0.5 rounded-full shadow-sm uppercase tracking-widest border border-red-600/20">
                TERMINA EN <Countdown targetDate={jersey.discountEndDate!} variant="daysOnly" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-8 space-y-4 md:space-y-7 flex-grow flex flex-col items-center text-center">
          <div className="space-y-1 w-full">
            <h3 className="font-sans font-black text-secondary text-base md:text-xl leading-tight uppercase tracking-tight min-h-[2.5rem] md:min-h-[3.5rem] flex items-center justify-center text-center w-full">
              {jersey.team}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[8px] md:text-[10px] font-bold text-secondary/50 uppercase tracking-[0.1em]">{jersey.season}</span>
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-[0.1em]">{jersey.type}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-px bg-secondary/5 rounded-xl md:rounded-2xl overflow-hidden border border-secondary/5">
            <div className="bg-white p-2 md:p-3.5 space-y-0.5 md:space-y-1">
              <p className="text-[6px] md:text-[8px] font-black text-secondary/60 uppercase tracking-[0.25em]">Versión</p>
              <p className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-tight">{jersey.style}</p>
            </div>
            <div className="bg-white p-2 md:p-3.5 space-y-0.5 md:space-y-1">
              <p className="text-[6px] md:text-[8px] font-black text-secondary/60 uppercase tracking-[0.25em]">Talla</p>
              <p className="text-[10px] md:text-xs font-black text-primary uppercase tracking-tight">{jersey.size}</p>
            </div>
          </div>

          <div className="w-full space-y-2 md:space-y-3.5 pt-1">
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              <span className="text-[6px] md:text-[8px] font-black text-secondary/60 uppercase tracking-[0.25em]">Dorsal</span>
              <p className="text-[10px] md:text-xs font-black text-secondary uppercase tracking-[0.05em]">
                {jersey.playerName || 'Sin Nombre'} <span className="text-primary ml-1">#{jersey.number || '-'}</span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              <span className="text-[6px] md:text-[8px] font-black text-secondary/60 uppercase tracking-[0.25em]">Parche</span>
              <p className="text-[9px] md:text-[10px] font-bold text-secondary/80 uppercase tracking-tight italic">
                {jersey.patch || 'Sin Parche'}
              </p>
            </div>
          </div>

          <div className="pt-4 md:pt-5 mt-auto border-t border-secondary/5 w-full space-y-4 md:space-y-5">
            <div className="flex flex-col items-center justify-center gap-2">
              {hasDiscount && (
                <span className="bg-red-600 text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">-{discountPercentage}% DE DESCUENTO</span>
              )}
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <span className="text-[8px] md:text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em]">Precio</span>
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <span className="text-xs md:text-lg font-black text-red-600 line-through decoration-red-600/50 decoration-2 tracking-tighter leading-none pt-1 md:pt-2">${jersey.originalPrice}</span>
                  )}
                  <span className="text-xl md:text-4xl font-sans font-black text-secondary tracking-tighter leading-none">${jersey.price}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                const text = `¡Hola! Me interesa la camiseta en stock del ${jersey.team} - ${jersey.type} - ${jersey.season} - Versión ${jersey.style.toLowerCase()} - Talla ${jersey.size} - ${jersey.playerName ? `${jersey.playerName} (${jersey.number})` : 'Sin dorsal'}`;
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="w-full bg-secondary text-primary py-2 md:py-4 rounded-lg md:rounded-2xl font-black text-[8px] md:text-[11px] hover:bg-primary hover:text-secondary transition-all shadow-xl flex items-center justify-center gap-2 md:gap-3 uppercase tracking-[0.15em]"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mb-0.5 ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
              </svg>
              Comprar por WhatsApp
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(false)}
            className="fixed inset-0 z-[110] bg-secondary/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <button 
              onClick={() => setShowFullImage(false)}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors p-2"
            >
              <X className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={jersey.image}
              alt={jersey.name}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const EncargoJerseyCard = ({ jersey, onOrder }: { jersey: EncargoJersey, onOrder: (j: EncargoJersey) => void, key?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-secondary/5 group border border-secondary/5 flex flex-col hover:shadow-primary/10 transition-all duration-500"
    >
      <div className="relative overflow-hidden bg-accent/30 cursor-pointer aspect-square flex items-center justify-center" onClick={() => onOrder(jersey)}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-secondary/5 animate-pulse flex items-center justify-center">
            <Shirt className="w-8 h-8 text-secondary/10" />
          </div>
        )}
        <img
          src={jersey.fanImage}
          alt={jersey.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-grow items-center text-center">
        <div className="flex-grow flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">{jersey.type}</span>
            <span className="w-1 h-1 rounded-full bg-secondary/20"></span>
            <span className="text-[9px] md:text-[10px] font-black text-secondary/40 uppercase tracking-widest">{jersey.season}</span>
          </div>
          <h3 
            onClick={() => onOrder(jersey)}
            className="text-[15px] md:text-2xl font-sans font-black text-secondary leading-tight group-hover:text-primary transition-colors uppercase tracking-tight md:tracking-tighter cursor-pointer mb-4 min-h-[2.5rem] md:min-h-[3.5rem] flex items-center justify-center text-center"
          >
            {jersey.team}
          </h3>
          <div className="mt-auto flex flex-row justify-center gap-1 md:gap-2 mb-6">
            {(jersey.isRetro ? ['Retro', 'Niño'] : ['Fan', 'Player', 'Niño']).filter(v => {
              if (v === 'Player') return !!jersey.playerImage;
              if (v === 'Niño') return !!jersey.childImage;
              return true;
            }).map(v => (
              <span key={v} className="w-10 md:w-14 py-0.5 md:py-1 bg-secondary/5 rounded-md text-[7px] md:text-[8px] font-black text-secondary/40 uppercase tracking-widest border border-secondary/5 flex items-center justify-center">
                {v}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onOrder(jersey)}
          className="w-full bg-secondary text-primary py-2 md:py-4 rounded-lg md:rounded-2xl font-black text-[8px] md:text-[11px] hover:bg-primary hover:text-secondary transition-all shadow-xl flex items-center justify-center gap-2 md:gap-3 uppercase tracking-[0.15em]"
        >
          <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4 mb-0.5 ml-1.5" />
          <span>Personalizar Encargo</span>
        </button>
      </div>
    </motion.div>
  );
};

const CustomOrderModal = ({ jersey, onClose }: { jersey: Jersey, onClose: () => void }) => {
  const [form, setForm] = useState({
    size: 'M',
    patches: 'Ninguno',
    name: '',
    number: ''
  });

  const handleSend = () => {
    const text = `¡Hola! Quiero encargar esta camiseta:
👕 *${jersey.name}*
📏 Talla: ${form.size}
🛡️ Parches: ${form.patches}
👤 Nombre: ${form.name || 'Sin nombre'}
🔢 Dorsal: ${form.number || 'Sin número'}
    
¿Cómo procedemos con el pago?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-accent rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-primary/20"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-sans font-bold text-secondary">Personalizar</h2>
              <p className="text-secondary/60 text-sm">{jersey.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary/10 rounded-full"><X /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-secondary/40 uppercase tracking-widest mb-2">Talla</label>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, size: s })}
                    className={`flex-1 py-2 rounded-xl font-bold border-2 transition-all ${
                      form.size === s ? 'border-primary bg-primary/10 text-primary' : 'border-secondary/5 text-secondary/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary/40 uppercase tracking-widest mb-2">Parches</label>
              <select
                value={form.patches}
                onChange={(e) => setForm({ ...form, patches: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-secondary/5 focus:border-primary outline-none transition-all bg-white/50"
              >
                <option>Ninguno</option>
                <option>Champions League</option>
                <option>La Liga</option>
                <option>Premier League</option>
                <option>Mundial 2022</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-secondary/40 uppercase tracking-widest mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: MESSI"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                  className="w-full p-3 rounded-xl border-2 border-secondary/5 focus:border-primary outline-none uppercase bg-white/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary/40 uppercase tracking-widest mb-2">Dorsal</label>
                <input
                  type="text"
                  placeholder="Ej: 10"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, '') })}
                  className="w-full p-3 rounded-xl border-2 border-secondary/5 focus:border-primary outline-none bg-white/50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            className="w-full mt-8 bg-secondary text-primary py-4 rounded-2xl font-sans font-bold text-lg hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
            </svg>
            Comprar por WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EncargoOrderModal = ({ jersey, onClose, onZoom }: { jersey: EncargoJersey, onClose: () => void, onZoom: (src: string) => void }) => {
  const getPatches = () => {
    if (jersey.patches && jersey.patches.length > 0) {
      return jersey.patches;
    }
    if (jersey.noPatches) {
      return [{ name: 'Sin Parche', logo: null }];
    }
    if (jersey.team === 'Barcelona') {
      if (jersey.id === 'fcb-special-travis-24-custom' || jersey.id === 'fcb-home-96-custom') {
        return [{ name: 'Sin Parche', logo: null }];
      }
      if (jersey.id === 'fcb-home-05-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Final Champions League', logo: 'https://drive.google.com/thumbnail?id=1XdGVEIF2-IddEgXrVh5ZcD_Eam2j_4Dy&sz=w200' }
        ];
      }
      if (jersey.id === 'fcb-away-03-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1DDzxSLMN4icvg92-Px-IhLqM1QM6h9ii&sz=w200' }
        ];
      }
      if (jersey.id === 'fcb-home-08-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1tJ7B4bWgcPcU3SOEqcxHUdE6MfH8x4sP&sz=w200' }
        ];
      }
      if (jersey.id === 'fcb-third-19-custom' || jersey.id === 'fcb-home-20-custom' || jersey.id === 'fcb-away-20-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1SKVSTU8XjjyMCKnvpGL75t8DjwVnctxA&sz=w200' }
        ];
      }
      if (jersey.season === '24/25') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1zUyNxg6EOLmNLBS1QMxRXUxuGzWOt5zu&sz=w200' },
          { name: 'La Liga', logo: 'https://drive.google.com/thumbnail?id=1v5hYOBNAZ8-xsuA9nXtCk0tA1rg4HZGS&sz=w200' }
        ];
      }
    }
    if (jersey.id === 'fcb-retro-99-custom') {
      return [
        { name: 'Sin Parche', logo: null },
        { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1DDzxSLMN4icvg92-Px-IhLqM1QM6h9ii&sz=w200' }
      ];
    }
    if (jersey.id === 'fcb-retro-14-custom') {
      return [
        { name: 'Sin Parche', logo: null },
        { name: 'Final Champions', logo: 'https://drive.google.com/thumbnail?id=1KoZxERFEccMO1rCEWddEqpNanx8HGQDw&sz=w200' }
      ];
    }
    if (jersey.team === 'Atlético de Madrid') {
      if (jersey.id === 'atm-retro-04-custom') {
        return [{ name: 'Sin Parche', logo: null }];
      }
      const championsLogo = jersey.id === 'atm-home-24-custom' 
        ? 'https://lh3.googleusercontent.com/d/1a1vZFCP487mL09UmRYqZ2bGOgvMvcMmb'
        : 'https://drive.google.com/thumbnail?id=1yDgD4gDXDtoB7o2QDNoHFEWrhVmr9nS2&sz=w200';
        
      return [
        { name: 'Sin Parche', logo: null },
        { name: 'Champions League', logo: championsLogo },
        { name: 'La Liga', logo: 'https://drive.google.com/thumbnail?id=1ta7tkJUgwkYaXXxiRBAXTHU_iHSWHfOw&sz=w200' }
      ];
    }
    if (jersey.team === 'Real Madrid') {
      if (jersey.id === 'rma-third-24-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1PEvAbtJ863o3MZUQ3H7qTPzjzLApi7xf&sz=w200' },
          { name: 'La Liga', logo: 'https://drive.google.com/thumbnail?id=15HCGqYgBj12_ZqmD2rqQ1GoYeTOy_xWZ&sz=w200' }
        ];
      }
      if (jersey.id === 'rma-retro-13-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Final Champions', logo: 'https://drive.google.com/thumbnail?id=1nsqvPIV8Y0Axza38xiGDAY1ddTRUBgIB&sz=w200' }
        ];
      }
      if (jersey.id === 'rma-retro-14-away-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1JMUCnK0owTP3fCNrUTMcS9VM2qDK2Jaz&sz=w200' }
        ];
      }
      if (jersey.id === 'rma-retro-17-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Final Champions', logo: 'https://drive.google.com/thumbnail?id=1UqCn_fVGEPLDZkBcdocqZdRJrBq7a_9z&sz=w200' }
        ];
      }
      if (jersey.id === 'rma-retro-06-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1ixWeh_xeqrc4srrrTGv2cfFGCNgLh3As&sz=w200' }
        ];
      }
      if (jersey.id === 'rma-retro-00-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1PukIo5GCprC76MK8sffDC6aOnF4k2A3G&sz=w200' }
        ];
      }
      if (jersey.id === 'rma-retro-19-custom') {
        return [
          { name: 'Sin Parche', logo: null },
          { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1tzI9IJ6HaGc2nzl1GMpvmFCrmrlIMo7n&sz=w200' }
        ];
      }
      return [
        { name: 'Sin Parche', logo: null },
        { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=10QRJk8tA2VY62O57l4-Tb9_vE8ZkeLep&sz=w200' },
        { name: 'La Liga', logo: 'https://drive.google.com/thumbnail?id=1UtV9rWSqUu5i8MUdGYHOFio4ssY01m9I&sz=w200' },
        { name: 'Champions + Intercontinental', logo: 'https://drive.google.com/thumbnail?id=1cnZgbw1R5AmHJQMmPwd7FYdPfKofUSgS&sz=w200' },
        { name: 'Liga + Intercontinental', logo: 'https://drive.google.com/thumbnail?id=11lbE_VTNIPncE-nyQamFW-mwUwTZB0J4&sz=w200' },
        { name: 'Supercopa de España', logo: 'https://drive.google.com/thumbnail?id=1SN6j0_ItHXTVteBqZCfYYZ8TXRNEHS9O&sz=w200' }
      ];
    }
    return [
      { name: 'Sin Parche', logo: null },
      { name: 'Champions League', logo: 'https://drive.google.com/thumbnail?id=1P4M2T-CKjAj_cs4kF6bt18lbkLUDMXLb&sz=w200' },
      { name: 'La Liga', logo: 'https://drive.google.com/thumbnail?id=15-u5D0AvhJgrjQwUmcCHWZfUOgaAk_59&sz=w200' },
      { name: 'Supercopa de España', logo: 'https://drive.google.com/thumbnail?id=1pCySf3QhJlulDzv_8WhJfE5po7Sgz5J6&sz=w200' }
    ];
  };

  const PATCHES = getPatches();
  
  const defaultPatch = PATCHES.length === 1 
    ? PATCHES[0].name 
    : PATCHES.find(p => p.name === 'Champions League') 
      ? 'Champions League' 
      : PATCHES.find(p => p.name === 'Europa League')
        ? 'Europa League'
        : (PATCHES.length > 1 && PATCHES[0].name === 'Sin Parche')
          ? PATCHES[1].name
          : PATCHES[0].name;

  const [form, setForm] = useState<EncargoOrder>({
    jerseyId: jersey.id,
    version: jersey.isRetro ? 'Retro' : 'Fan',
    size: 'M',
    sleeves: 'Corta',
    name: '',
    number: '',
    patch: defaultPatch
  });

  const isBarcelonaCuarta = jersey.id === 'fcb-fourth-25-custom';
  const isRmaGk = jersey.id === 'rma-gk-third-25-custom';
  const isBarcelona26 = jersey.id === 'fcb-home-26-custom';
  const isTravisScott = jersey.id === 'fcb-special-travis-24-custom';
  const isBarcelona125 = jersey.id === 'fcb-special-125-24-custom';
  const hideLongSleeves = jersey.noLongSleeve || isBarcelonaCuarta || isRmaGk || isBarcelona26 || isTravisScott || isBarcelona125;

  let currentImage = form.version === 'Fan' ? jersey.fanImage : form.version === 'Player' ? jersey.playerImage : form.version === 'Retro' ? jersey.fanImage : jersey.childImage;
  if (form.sleeves === 'Larga' && !hideLongSleeves) {
    if (form.version === 'Retro' && jersey.retroLongSleeveImage) currentImage = jersey.retroLongSleeveImage;
    else if (form.version === 'Fan' && jersey.fanLongSleeveImage) currentImage = jersey.fanLongSleeveImage;
    else if (form.version === 'Player' && jersey.playerLongSleeveImage) currentImage = jersey.playerLongSleeveImage;
  }

  const currentSizeGuide = form.version === 'Fan' ? jersey.fanSizeGuide : form.version === 'Player' ? jersey.playerSizeGuide : form.version === 'Retro' ? jersey.retroSizeGuide : jersey.childSizeGuide;
  const currentNumbering = (
    form.patch === 'Champions League' || 
    form.patch.includes('Champions') || 
    form.patch === 'Sin Parche' ||
    (jersey.league === 'Premier League' && form.patch === 'Carabao Cup')
  ) 
    ? (jersey.championsNumberingImage || jersey.ligaNumberingImage) 
    : (form.patch === 'Europa League' || form.patch.includes('Europa'))
      ? (jersey.europaNumberingImage || jersey.championsNumberingImage || jersey.ligaNumberingImage)
      : (jersey.ligaNumberingImage || jersey.championsNumberingImage);

  const showSpecificStyle = (jersey.ligaNumberingImage && jersey.championsNumberingImage && jersey.ligaNumberingImage !== jersey.championsNumberingImage) || 
                           (jersey.europaNumberingImage && jersey.ligaNumberingImage && jersey.europaNumberingImage !== jersey.ligaNumberingImage);

  const [imagesLoaded, setImagesLoaded] = useState({
    jersey: LOADED_IMAGES.has(currentImage || ''),
    sizeGuide: LOADED_IMAGES.has(currentSizeGuide || ''),
    numbering: currentNumbering ? LOADED_IMAGES.has(currentNumbering) : true
  });

  // Preload all potential images for this jersey when modal opens
  useEffect(() => {
    const imagesToPreload = [
      jersey.fanImage,
      jersey.playerImage,
      jersey.childImage,
      jersey.fanLongSleeveImage,
      jersey.playerLongSleeveImage,
      jersey.retroLongSleeveImage,
      jersey.fanSizeGuide,
      jersey.playerSizeGuide,
      jersey.retroSizeGuide,
      jersey.childSizeGuide,
      jersey.ligaNumberingImage,
      jersey.championsNumberingImage,
      jersey.europaNumberingImage,
      ...PATCHES.map(p => p.logo).filter(Boolean) as string[]
    ].filter(Boolean);

    imagesToPreload.forEach(src => {
      if (!LOADED_IMAGES.has(src)) {
        const img = new Image();
        img.src = src;
        img.onload = () => LOADED_IMAGES.add(src);
      }
    });
  }, [jersey, PATCHES]);

  // Update loading state when images change
  useEffect(() => {
    if (LOADED_IMAGES.has(currentImage)) {
      setImagesLoaded(prev => ({ ...prev, jersey: true }));
    }
  }, [currentImage]);

  useEffect(() => {
    if (LOADED_IMAGES.has(currentSizeGuide)) {
      setImagesLoaded(prev => ({ ...prev, sizeGuide: true }));
    }
  }, [currentSizeGuide]);

  useEffect(() => {
    if (currentNumbering && LOADED_IMAGES.has(currentNumbering)) {
      setImagesLoaded(prev => ({ ...prev, numbering: true }));
    }
  }, [currentNumbering]);

  // Hide body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const basePrice = (jersey.isRetro || form.version === 'Player') ? 35 : 30;
  const totalPrice = form.sleeves === 'Larga' ? basePrice + 3 : basePrice;

  const handleSend = () => {
    const text = `¡Hola! Quiero hacer un encargo personalizado:
Camiseta: *${jersey.name}*
Versión: *${form.version}*
Talla: *${form.size}*
Mangas: *${hideLongSleeves ? 'Corta' : form.sleeves}*
Nombre: *${form.name || 'Sin nombre'}*
Dorsal: *${form.number || 'Sin número'}*
Parche: *${form.patch}*`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-accent overflow-hidden">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="w-full h-full flex flex-col relative"
      >
        {/* Header */}
        <div className="bg-white border-b border-secondary/5 p-4 md:p-6 flex items-center justify-between z-50 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-secondary/5 rounded-full transition-colors">
              <X className="w-6 h-6 text-secondary" />
            </button>
            <div>
              <h2 className="text-xl md:text-3xl font-sans font-black text-secondary uppercase tracking-wider leading-none">Personalizar</h2>
              <p className="text-primary font-black text-[10px] md:text-xs uppercase tracking-widest">
                {jersey.id === 'rma-gk-third-25-custom' ? 'Real Madrid - Portero (Tercera) - 25/26' : jersey.name}
              </p>
              {jersey.season === '26/27' && (
                <p className="text-secondary/40 font-bold text-[8px] md:text-[9px] uppercase tracking-wider mt-1 max-w-[200px] md:max-w-none">
                  * Modelo basado en filtraciones fiables, puede sufrir modificaciones.
                </p>
              )}
            </div>
          </div>
          <div className="text-right flex flex-col justify-center min-h-[48px] md:min-h-[64px]">
            <div className="text-2xl md:text-4xl font-sans font-black text-secondary leading-none">${totalPrice}</div>
            <div className="h-4">
              {form.sleeves === 'Larga' && form.version !== 'Niño' && (
                <div className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-widest mt-1">+ $3 Manga Larga</div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto bg-accent scrollbar-hide">
          <div className="max-w-xl mx-auto p-6 md:p-10 space-y-10 pb-24">
            
            {/* 1. Jersey Photo */}
            <section className="h-[350px] md:h-[450px] flex items-center justify-center">
              <div className="relative bg-white rounded-3xl overflow-hidden cursor-zoom-in group shadow-xl border border-secondary/5 mx-auto max-w-[400px]" onClick={() => onZoom(currentImage)}>
                {!imagesLoaded.jersey && (
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <Shirt className="w-12 h-12 text-secondary/10" />
                  </div>
                )}
                <img 
                  src={currentImage} 
                  alt="Jersey" 
                  className={`w-full max-h-[350px] md:max-h-[450px] object-contain transition-opacity duration-300 ${imagesLoaded.jersey ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => {
                    LOADED_IMAGES.add(currentImage);
                    setImagesLoaded(prev => ({ ...prev, jersey: true }));
                  }}
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-widest shadow-2xl">Ver en grande</span>
                </div>
              </div>
            </section>

            {/* 2. Version Selection */}
            <section>
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-4">Seleccionar Versión</label>
              <div className={`grid ${jersey.isRetro ? 'grid-cols-2' : (jersey.playerImage ? 'grid-cols-3' : 'grid-cols-2')} gap-3`}>
                {(jersey.isRetro ? ['Retro', 'Niño'] : ['Fan', 'Player', 'Niño']).filter(v => {
                  if (v === 'Player') return !!jersey.playerImage;
                  if (v === 'Niño') return !!jersey.childImage;
                  return true;
                }).map(v => (
                    <button
                      key={v}
                      onClick={() => {
                        const nextImage = v === 'Fan' ? jersey.fanImage : v === 'Player' ? jersey.playerImage : v === 'Retro' ? jersey.fanImage : jersey.childImage;
                        const nextSizeGuide = v === 'Fan' ? jersey.fanSizeGuide : v === 'Player' ? jersey.playerSizeGuide : v === 'Retro' ? jersey.retroSizeGuide : jersey.childSizeGuide;
                        
                        setForm({ ...form, version: v as any, sleeves: v === 'Niño' ? 'Corta' : form.sleeves });
                        setImagesLoaded(prev => ({ 
                          ...prev, 
                          jersey: LOADED_IMAGES.has(nextImage || ''), 
                          sizeGuide: LOADED_IMAGES.has(nextSizeGuide || '') 
                        }));
                      }}
                      className={`py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 transition-all ${
                        form.version === v ? 'border-primary bg-primary/10 text-secondary shadow-lg' : 'border-secondary/5 bg-white text-secondary/40'
                      }`}
                    >
                      {v}
                    </button>
                ))}
              </div>
            </section>

            {/* 3. Sleeve Selection */}
            {!hideLongSleeves && (
              <section>
                <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-4">Tipo de Manga</label>
                <div className="grid grid-cols-2 gap-3">
                  {form.version === 'Niño' || hideLongSleeves ? (
                    <button
                      className="py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 border-primary bg-primary/10 text-secondary shadow-lg col-span-2 cursor-default"
                    >
                      Manga Corta
                    </button>
                  ) : (
                      ['Corta', 'Larga'].map(m => (
                        <button
                          key={m}
                          onClick={() => {
                            let nextImage = currentImage;
                            if (m === 'Larga') {
                              if (form.version === 'Retro' && jersey.retroLongSleeveImage) nextImage = jersey.retroLongSleeveImage;
                              else if (form.version === 'Fan' && jersey.fanLongSleeveImage) nextImage = jersey.fanLongSleeveImage;
                              else if (form.version === 'Player' && jersey.playerLongSleeveImage) nextImage = jersey.playerLongSleeveImage;
                            } else {
                              nextImage = form.version === 'Fan' ? jersey.fanImage : form.version === 'Player' ? jersey.playerImage : form.version === 'Retro' ? jersey.fanImage : jersey.childImage;
                            }
                            
                            setForm({ ...form, sleeves: m as any });
                            setImagesLoaded(prev => ({ ...prev, jersey: LOADED_IMAGES.has(nextImage || '') }));
                          }}
                          className={`py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 transition-all ${
                          form.sleeves === m ? 'border-primary bg-primary/10 text-secondary shadow-lg' : 'border-secondary/5 bg-white text-secondary/40'
                        }`}
                      >
                        Manga {m}
                      </button>
                    ))
                  )}
                </div>
                <div className="h-8">
                  {form.sleeves === 'Larga' && form.version !== 'Niño' && (
                    <p className="mt-3 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Las mangas largas aumentan el precio en $3
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* 4. Size Guide Photo */}
            <section className="space-y-4">
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Guía de Tallas ({form.version})</label>
              <div className="flex items-center justify-center">
                <div className="relative cursor-zoom-in group shadow-lg rounded-2xl overflow-hidden max-w-[400px] mx-auto border border-secondary/5 w-fit" onClick={() => onZoom(currentSizeGuide)}>
                  {!imagesLoaded.sizeGuide && (
                    <div className="h-[120px] w-[200px] bg-white animate-pulse flex items-center justify-center">
                      <Shirt className="w-6 h-6 text-secondary/10" />
                    </div>
                  )}
                  <img 
                    src={currentSizeGuide} 
                    alt="Tallas" 
                    className={`block max-w-full max-h-[180px] md:max-h-[300px] h-auto transition-opacity duration-300 ${imagesLoaded.sizeGuide ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => {
                      LOADED_IMAGES.add(currentSizeGuide);
                      setImagesLoaded(prev => ({ ...prev, sizeGuide: true }));
                    }}
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">Ver Guía</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Size Selector */}
            <section>
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-4">Seleccionar Talla</label>
              <div className="flex flex-wrap gap-3">
                {(form.version === 'Niño' ? ['16', '18', '20', '22', '24', '26', '28'] : ['S', 'M', 'L', 'XL', '2XL', '3XL']).map(s => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, size: s })}
                    className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl font-black text-xs border-2 transition-all ${
                      form.size === s ? 'border-primary bg-primary/10 text-secondary shadow-lg' : 'border-secondary/5 bg-white text-secondary/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* 6. Name and Number Inputs */}
            {!jersey.noCustomization && jersey.id !== 'fcb-special-travis-24-custom' && (
              <section className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-4">Nombre</label>
                    <input
                      type="text"
                      placeholder="Ej: MESSI"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                      className="w-full p-5 rounded-2xl border-2 border-secondary/5 focus:border-primary outline-none uppercase bg-white font-black text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-4">Dorsal</label>
                    <input
                      type="text"
                      placeholder="Ej: 10"
                      value={form.number}
                      onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, '') })}
                      className="w-full p-5 rounded-2xl border-2 border-secondary/5 focus:border-primary outline-none bg-white font-black text-sm shadow-sm"
                    />
                  </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-[10px] md:text-xs font-bold text-secondary/70 leading-relaxed italic">
                    * Por favor, consulta exactamente cómo usa el jugador el nombre en su camiseta (ej: "L. MESSI" o "MESSI") para que se coloque correctamente. Si no deseas nombre o dorsal, puedes dejar estos campos en blanco.
                  </p>
                </div>
              </section>
            )}

            {/* 8. Patch Selector */}
            {jersey.id !== 'fcb-special-travis-24-custom' && !(PATCHES.length === 1 && PATCHES[0].name === 'Sin Parche') && (
              <section>
                <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-4">Seleccionar Parche</label>
                <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-4">
                  {PATCHES.map(p => (
                    <button
                      key={p.name}
                      onClick={() => {
                        const nextNumbering = (p.name === 'Champions League' || p.name.includes('Champions')) ? jersey.championsNumberingImage : jersey.ligaNumberingImage;
                        setForm({ ...form, patch: p.name });
                        setImagesLoaded(prev => ({ ...prev, numbering: LOADED_IMAGES.has(nextNumbering || '') }));
                      }}
                      className={`flex flex-col items-center gap-2 md:gap-4 p-2 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all min-h-0 md:min-h-[180px] ${
                        form.patch === p.name ? 'border-primary bg-primary/10 text-secondary shadow-lg' : 'border-secondary/5 bg-white text-secondary/40'
                      }`}
                    >
                      {p.logo ? (
                        <div className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center">
                          <img src={p.logo} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center border-2 border-dashed border-secondary/10 rounded-full">
                          <X className="w-4 h-4 md:w-6 md:h-6 opacity-20" />
                        </div>
                      )}
                      <span className="text-[6px] md:text-[10px] font-black uppercase tracking-widest text-center leading-tight">{p.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* 9. Numbering Style Photo (Moved below patches) */}
            <section className="h-auto flex items-center justify-center pb-10">
              {currentNumbering ? (
                <div className="space-y-4 w-full">
                  <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 text-center">
                    {!showSpecificStyle 
                      ? 'Estilo de Dorsal' 
                      : (form.patch === 'Champions League' || form.patch.includes('Champions'))
                        ? 'Estilo de Dorsal de Champions'
                        : (form.patch === 'Europa League' || form.patch.includes('Europa'))
                          ? 'Estilo de Dorsal de Europa League'
                          : (form.patch === 'Sin Parche')
                            ? (PATCHES.find(p => p.name.includes('Champions')) 
                                ? 'Estilo de Dorsal de Champions' 
                                : PATCHES.find(p => p.name.includes('Europa'))
                                  ? 'Estilo de Dorsal de Europa League'
                                  : 'Estilo de Dorsal de Liga')
                            : (jersey.league === 'Premier League' && form.patch === 'Carabao Cup')
                              ? (jersey.team === 'Manchester United' ? 'Estilo de Dorsal de Copa' : 'Estilo de Dorsal de Champions')
                              : (form.patch === 'Supercopa de España' ? 'Estilo de Dorsal de Liga/Supercopa' : 'Estilo de Dorsal de Liga')
                    }
                  </label>
                  <div className="relative cursor-zoom-in group shadow-lg rounded-2xl overflow-hidden max-w-[400px] mx-auto border border-secondary/5 w-fit" onClick={() => onZoom(currentNumbering)}>
                    {!imagesLoaded.numbering && (
                      <div className="h-[120px] w-[200px] flex items-center justify-center bg-white animate-pulse">
                        <Shirt className="w-8 h-8 text-secondary/10" />
                      </div>
                    )}
                    <img 
                      src={currentNumbering} 
                      alt="Dorsal" 
                      className={`block max-w-full max-h-[180px] md:max-h-[300px] h-auto transition-opacity duration-300 ${imagesLoaded.numbering ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => {
                        LOADED_IMAGES.add(currentNumbering);
                        setImagesLoaded(prev => ({ ...prev, numbering: true }));
                      }}
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">Ver Estilo</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-black text-secondary/10 uppercase tracking-widest">Sin previsualización de dorsal</div>
              )}
            </section>

            {/* Submit Button */}
                      <button
                        onClick={handleSend}
                        className="w-full bg-secondary text-primary py-6 rounded-3xl font-black text-sm uppercase tracking-[0.25em] hover:bg-primary hover:text-secondary transition-all duration-500 shadow-2xl shadow-secondary/20 flex items-center justify-center gap-4 group"
                      >
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
                        </svg>
                        Encargar por WhatsApp
                      </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ImageZoomModal = ({ src, onClose }: { src: string, onClose: () => void }) => {
  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-secondary/95 backdrop-blur-xl p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-5xl w-full h-full flex items-center justify-center"
      >
        <img 
          src={src} 
          alt="Zoomed" 
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-4 text-primary hover:scale-110 transition-transform"
        >
          <X className="w-8 h-8" />
        </button>
      </motion.div>
    </div>
  );
};

const Countdown = ({ targetDate, finishMessage = "¡Finalizado!", variant = "full" }: { targetDate: string, finishMessage?: string, variant?: "full" | "compact" | "daysOnly" }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; totalHours: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        const totalH = Math.floor(difference / (1000 * 60 * 60));

        setTimeLeft({
          days: d,
          hours: h,
          minutes: m,
          seconds: s,
          totalHours: totalH
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-secondary font-black uppercase text-[10px] tracking-widest">{finishMessage}</span>;

  if (variant === "compact") {
    return (
      <span className="font-black tabular-nums">
        {String(timeLeft.totalHours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
      </span>
    );
  }

  if (variant === "daysOnly") {
    return (
      <span className="font-black tabular-nums">
        {timeLeft.days} {timeLeft.days === 1 ? 'DÍA' : 'DÍAS'}
      </span>
    );
  }

  return (
    <div className="flex gap-3 md:gap-4">
      {[
        { label: 'Días', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center min-w-[40px]">
          <span className="text-lg md:text-2xl font-black leading-none">{String(item.value).padStart(2, '0')}</span>
          <span className="text-[7px] md:text-[9px] uppercase font-black opacity-40 tracking-tighter">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Map path to tab - robust parsing handling trailing slashes
  const activeTab = location.pathname.split('/').filter(Boolean)[0] || 'home';
  
  const setActiveTab = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  // Redirect invalid routes to home
  useEffect(() => {
    const validTabs = ['home', 'stock', 'encargos', 'nosotros', 'preguntas', 'contacto', 'sorteo'];
    if (!validTabs.includes(activeTab)) {
      navigate('/', { replace: true });
    }
  }, [activeTab, navigate]);

  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [selectedEncargoJersey, setSelectedEncargoJersey] = useState<EncargoJersey | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');

  // Scroll to top when path changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeTab !== 'encargos') {
      setSelectedLeague(null);
    }
  }, [location.pathname]);

  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [encargoSearchQuery, setEncargoSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [filterSize, setFilterSize] = useState('TODAS');
  const [filterStyle, setFilterStyle] = useState('TODOS');

  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/-/g, " ");

  const filteredJerseys = useMemo(() => {
    return JERSEYS.filter(j => {
      const search = normalizeText(stockSearchQuery);
      const matchesSearch = normalizeText(j.team).includes(search) ||
                           (j.playerName && normalizeText(j.playerName).includes(search));
      const matchesSize = filterSize === 'TODAS' || j.size === filterSize;
      const matchesStyle = filterStyle === 'TODOS' || j.style.toUpperCase() === filterStyle;
      
      return matchesSearch && matchesSize && matchesStyle;
    }).sort((a, b) => {
      const aHasDiscount = a.discountEndDate && new Date(a.discountEndDate) > new Date();
      const bHasDiscount = b.discountEndDate && new Date(b.discountEndDate) > new Date();
      if (aHasDiscount && !bHasDiscount) return -1;
      if (!aHasDiscount && bHasDiscount) return 1;
      return 0;
    });
  }, [stockSearchQuery, filterSize, filterStyle]);

  const filteredEncargoJerseys = useMemo(() => {
    const baseFiltered = ENCARGO_JERSEYS.filter(j => {
      const search = normalizeText(encargoSearchQuery);
      const matchesSearch = encargoSearchQuery ? (normalizeText(j.team).includes(search) ||
                           normalizeText(j.name).includes(search)) : true;
      
      const leagueData = LEAGUES_DATA.find(l => l.name === j.league);
      const mainTeams = leagueData?.teams.filter(t => t.name !== 'Otros').map(t => t.name) || [];
      
      const matchesTeam = !selectedTeam || 
                          (selectedTeam === 'Otros' ? !mainTeams.includes(j.team) : j.team === selectedTeam);
      const matchesLeague = !selectedLeague || j.league === selectedLeague;
      
      return matchesSearch && matchesTeam && matchesLeague;
    });

    const getYear = (season: string) => {
      const yearStr = season.split('/')[0];
      const year = parseInt(yearStr);
      if (isNaN(year)) return 0;
      return year > 40 ? 1900 + year : 2000 + year;
    };

    // Special logic for League View (only league selected)
    if (selectedLeague && !selectedTeam && !encargoSearchQuery) {
      const leagueData = LEAGUES_DATA.find(l => l.name === selectedLeague);
      if (!leagueData) return baseFiltered;

      const explicitTeams = leagueData.teams.filter(t => t.name !== 'Otros').map(t => t.name);
      const otherTeamsInLeague = Array.from(new Set(
        baseFiltered
          .filter(j => !explicitTeams.includes(j.team))
          .map(j => j.team)
      )).sort();
      const allTeamsOrdered = [...explicitTeams, ...otherTeamsInLeague];

      const availableSeasons = Array.from(new Set(baseFiltered.map(j => j.season)))
        .sort((a, b) => getYear(b) - getYear(a));

      const result: EncargoJersey[] = [];
      const addedIds = new Set<string>();
      const typesOrdered: EncargoJersey['type'][] = ['Local', 'Visitante', 'Tercera', 'Cuarta', 'Especial', 'Portero'];

      for (const season of availableSeasons) {
        if (result.length >= 10) break;

        // Pass 1: Locals of this season for all teams
        for (const teamName of allTeamsOrdered) {
          if (result.length >= 10) break;
          const jersey = baseFiltered.find(j => 
            j.season === season && 
            j.team === teamName && 
            j.type === 'Local' && 
            !addedIds.has(j.id)
          );
          if (jersey) {
            result.push(jersey);
            addedIds.add(jersey.id);
          }
        }

        // Pass 2: Visitantes of this season for all teams
        if (result.length < 10) {
          for (const teamName of allTeamsOrdered) {
            if (result.length >= 10) break;
            const jersey = baseFiltered.find(j => 
              j.season === season && 
              j.team === teamName && 
              j.type === 'Visitante' && 
              !addedIds.has(j.id)
            );
            if (jersey) {
              result.push(jersey);
              addedIds.add(jersey.id);
            }
          }
        }

        // Pass 3: Others of this season for all teams
        if (result.length < 10) {
          for (const type of typesOrdered.filter(t => t !== 'Local' && t !== 'Visitante')) {
            if (result.length >= 10) break;
            for (const teamName of allTeamsOrdered) {
              if (result.length >= 10) break;
              const jersey = baseFiltered.find(j => 
                j.season === season && 
                j.team === teamName && 
                j.type === type && 
                !addedIds.has(j.id)
              );
              if (jersey) {
                result.push(jersey);
                addedIds.add(jersey.id);
              }
            }
          }
        }
      }

      return result;
    }

    return baseFiltered.sort((a, b) => {
      const yearA = getYear(a.season);
      const yearB = getYear(b.season);
      if (yearB !== yearA) return yearB - yearA;
      return a.team.localeCompare(b.team);
    });
  }, [selectedLeague, selectedTeam, encargoSearchQuery]);

  const featuredJerseys = useMemo(() => {
    // Get date in New York time (YYYY-MM-DD)
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    // Simple hash function for the date string to use as a seed
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
      seed = ((seed << 5) - seed) + today.charCodeAt(i);
      seed |= 0;
    }

    // Seeded random function using the hash
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    // Create a copy and shuffle using the seeded random
    const shuffled = [...ENCARGO_JERSEYS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 20);
  }, []);

  const bestSellers = JERSEYS.filter(j => j.isBestSeller);

  const handleStockOrder = (jersey: Jersey) => {
    const text = `¡Hola! Me interesa la camiseta en stock del ${jersey.team} - ${jersey.type} - ${jersey.season} - Versión ${jersey.style.toLowerCase()} - Talla ${jersey.size} - ${jersey.playerName ? `${jersey.playerName} (${jersey.number})` : 'Sin dorsal'}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section Split Layout */}
            <section className="relative lg:min-h-[calc(100vh-6rem)] flex flex-col lg:flex-row items-center overflow-hidden">
              <div className="flex flex-row w-full items-start lg:items-center relative">
                <div className="w-[75%] lg:w-1/2 px-4 sm:px-12 lg:px-20 py-8 lg:py-0 text-left z-10">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="max-w-2xl mx-auto lg:mx-0"
                  >
                    <h1 className="text-[42px] sm:text-7xl md:text-8xl lg:text-9xl font-sans font-black tracking-tighter leading-[0.8] mb-4 md:mb-6">
                      <span className="text-secondary block lg:inline">No Pain </span>
                      <span className="text-primary block lg:inline">No Jersey</span>
                    </h1>
                    <p className="text-secondary font-sans italic text-sm md:text-3xl mb-4 md:mb-10 tracking-wide">
                      La pasión se vive con estilo
                    </p>
                    
                    {/* Mobile Buttons - Narrower and below text */}
                    <div className="flex flex-col gap-2 lg:hidden mt-10">
                      <Link
                        to="/stock"
                        className="pill-button bg-primary text-secondary shadow-xl shadow-primary/20 hover:scale-105 text-[10px] py-2.5 px-5 w-[160px] justify-center"
                      >
                        <Package className="w-4 h-4" />
                        Stock Disponible
                      </Link>
                      <Link
                        to="/encargos"
                        className="pill-button border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-[10px] py-2.5 px-5 w-[160px] justify-center"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Hacer Encargo
                      </Link>
                    </div>

                    <div className="hidden lg:flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Link
                        to="/stock"
                        className="pill-button bg-primary text-secondary shadow-xl shadow-primary/20 hover:scale-105 text-xs md:text-base py-4 md:py-5"
                      >
                        <Package className="w-4 h-4 md:w-5 md:h-5" />
                        Ver Stock Disponible
                      </Link>
                      <Link
                        to="/encargos"
                        className="pill-button border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-xs md:text-base py-4 md:py-5"
                      >
                        <ClipboardList className="w-4 h-4 md:w-5 md:h-5" />
                        Hacer Encargo Personalizado
                      </Link>
                    </div>
                  </motion.div>
                </div>
                
                <div className="w-[55%] lg:w-1/2 h-[40vh] sm:h-[60vh] lg:h-[calc(100vh-6rem)] absolute right-0 top-0 lg:relative overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    src={HERO_IMAGE}
                    alt="Soccer Gear"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent via-transparent to-transparent lg:bg-gradient-to-r lg:from-accent lg:via-transparent lg:to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-accent to-transparent" />
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="pt-0 pb-12 lg:py-24 bg-accent">
              <div className="max-w-7xl mx-auto px-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-6xl font-sans font-black text-secondary text-center mb-12 md:mb-20 tracking-tighter"
                >
                  ¿Por qué elegirnos?
                </motion.h2>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                  {[
                    { 
                      icon: <Award className="w-6 h-6 md:w-8 md:h-8" />, 
                      title: 'Calidad Premium', 
                      desc: 'Calidad AAA, con acabados de alta gama y gran nivel de detalle.' 
                    },
                    { 
                      icon: <Shirt className="w-6 h-6 md:w-8 md:h-8" />, 
                      title: 'Personalización', 
                      desc: 'Selecciona el estilo, talla, nombre, dorsal y parches ¡Crea tu camiseta!' 
                    },
                    { 
                      icon: <Clock className="w-6 h-6 md:w-8 md:h-8" />, 
                      title: 'Entrega Rápida', 
                      desc: 'Stock inmediato y encargos recibidos en aproximadamente un mes.' 
                    },
                    { 
                      icon: <Headphones className="w-6 h-6 md:w-8 md:h-8" />, 
                      title: 'Atención 24/7', 
                      desc: 'Resolvemos tus dudas por WhatsApp en cualquier momento.' 
                    }
                  ].map((f, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center space-y-4 md:space-y-6"
                    >
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-primary text-secondary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
                        {f.icon}
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-sm md:text-2xl font-sans font-bold text-secondary uppercase tracking-tight">{f.title}</h3>
                        <p className="text-[10px] md:text-base text-secondary/70 leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
                          {f.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {(activeTab === 'stock' || activeTab === 'encargos') && (
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className={`flex flex-col items-center ${activeTab === 'encargos' ? 'gap-6 md:gap-8 mb-10' : 'gap-12 mb-16'}`}>
              {/* Header Section Centered */}
              <div className="text-center space-y-2 md:space-y-4">
                <h1 className="text-2xl md:text-5xl font-sans font-black text-secondary tracking-tighter uppercase leading-none">
                  Catálogo {activeTab === 'stock' ? 'en Stock' : 'de Encargos'}
                </h1>
                <p className="font-black text-xs md:text-lg text-primary">
                  {activeTab === 'stock' 
                    ? 'Camisetas únicas disponibles para entrega inmediata.' 
                    : 'Tú la sueñas, nosotros te la conseguimos.'}
                </p>
              </div>

              {/* Search and Filters Section Aligned */}
              <div className={`w-full flex flex-col items-center ${activeTab === 'encargos' ? 'gap-6 md:gap-8' : 'gap-8 md:gap-12'}`}>
                <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-2xl w-full">
                    <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-primary w-4 h-4 md:w-6 md:h-6" />
                    <input
                      type="text"
                      placeholder={activeTab === 'stock' ? "Buscar por equipo o jugador..." : "Buscar por equipo..."}
                      value={activeTab === 'stock' ? stockSearchQuery : encargoSearchQuery}
                      onChange={(e) => {
                        if (activeTab === 'stock') {
                          setStockSearchQuery(e.target.value);
                        } else {
                          setEncargoSearchQuery(e.target.value);
                          setSelectedLeague(null);
                          setSelectedTeam(null);
                        }
                      }}
                      className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-5 bg-white rounded-[1.5rem] md:rounded-[2rem] border-none shadow-2xl shadow-secondary/5 focus:ring-4 focus:ring-primary/20 outline-none transition-all text-sm md:text-lg font-bold text-secondary placeholder:text-secondary/50"
                    />
                  </div>

                  {activeTab === 'stock' && (
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center">
                      {/* Style Filter */}
                      <div className="space-y-2 md:space-y-3 w-full sm:w-auto">
                        <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 ml-4">Estilo</label>
                        <div className="flex bg-white p-1.5 md:p-2 rounded-2xl md:rounded-3xl shadow-xl shadow-secondary/5 border border-secondary/5">
                          {['TODOS', 'FAN', 'PLAYER', 'RETRO'].map(style => (
                            <button
                              key={style}
                              onClick={() => setFilterStyle(style)}
                              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                                filterStyle === style ? 'bg-secondary text-primary shadow-lg' : 'text-secondary/60 hover:text-secondary'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Filter */}
                      <div className="space-y-2 md:space-y-3 w-full sm:w-auto">
                        <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 ml-4">Talla</label>
                        <div className="flex bg-white p-1.5 md:p-2 rounded-2xl md:rounded-3xl shadow-xl shadow-secondary/5 border border-secondary/5">
                          {['TODAS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button
                              key={size}
                              onClick={() => setFilterSize(size)}
                              className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black transition-all ${
                                filterSize === size ? 'bg-primary text-secondary shadow-lg' : 'text-secondary/60 hover:text-secondary'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* League Bubbles for Encargos */}
                {activeTab === 'encargos' && !encargoSearchQuery && (
                  <div className="w-full space-y-2 md:space-y-8">
                    <div className="grid grid-cols-4 md:flex md:flex-wrap justify-center gap-1.5 md:gap-6">
                      {LEAGUES_DATA.map((league) => (
                        <button
                          key={league.name}
                          onClick={() => {
                            setSelectedLeague(selectedLeague === league.name ? null : league.name);
                            setSelectedTeam(null);
                            setEncargoSearchQuery('');
                          }}
                          className={`flex flex-col items-center gap-1 md:gap-3 p-1.5 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 w-full md:w-[130px] h-auto md:aspect-auto ${
                            selectedLeague === league.name 
                              ? 'border-primary bg-primary/10 text-secondary shadow-lg shadow-primary/10' 
                              : 'border-secondary/5 bg-white text-secondary/60 hover:border-primary/30 hover:text-secondary'
                          }`}
                        >
                          <img 
                            src={league.logo} 
                            alt={league.name} 
                            className="w-8 h-8 md:w-14 md:h-14 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[6px] md:text-[11px] font-black uppercase tracking-wider text-center leading-tight">{league.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Teams for Selected League or Destacadas */}
                    <AnimatePresence mode="wait">
                      {selectedLeague ? (
                        <motion.div
                          key={`teams-${selectedLeague}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          className="grid grid-cols-4 md:flex md:flex-wrap justify-center gap-2 md:gap-4"
                        >
                          {LEAGUES_DATA.find(l => l.name === selectedLeague)?.teams.map((team) => (
                            <button
                              key={team.name}
                              onClick={() => {
                                setSelectedTeam(selectedTeam === team.name ? null : team.name);
                                setEncargoSearchQuery('');
                              }}
                              className={`flex flex-col items-center gap-1.5 md:gap-2 p-1.5 md:p-4 rounded-xl transition-all w-full md:w-[110px] ${
                                selectedTeam === team.name 
                                  ? 'bg-secondary text-primary shadow-lg' 
                                  : 'bg-secondary/5 text-secondary/60 hover:bg-secondary/10 hover:text-secondary'
                              }`}
                            >
                              <img 
                                src={team.logo} 
                                alt={team.name} 
                                className="w-6 h-6 md:w-12 md:h-12 object-contain"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[6px] md:text-[10px] font-bold uppercase text-center leading-tight">{team.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      ) : (!selectedTeam && !encargoSearchQuery) ? (
                        <motion.div
                          key="destacadas"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          className="pt-1 md:pt-8 space-y-4 md:space-y-8"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-px bg-secondary/10 flex-grow" />
                            <h2 className="text-xl md:text-3xl font-sans font-black text-secondary uppercase tracking-tighter">Destacadas de hoy</h2>
                            <div className="h-px bg-secondary/10 flex-grow" />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredJerseys.map(jersey => (
                              <EncargoJerseyCard
                                key={jersey.id}
                                jersey={jersey}
                                onOrder={setSelectedEncargoJersey}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {activeTab === 'stock' ? (
              filteredJerseys.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredJerseys.map(jersey => (
                    <JerseyCard
                      key={jersey.id}
                      jersey={jersey}
                      onOrder={handleStockOrder}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 md:py-24 bg-white rounded-3xl md:rounded-[3rem] border border-secondary/5 shadow-inner px-6">
                  <Shirt className="w-10 h-10 md:w-16 md:h-16 text-primary/20 mx-auto mb-6" />
                  <h3 className="text-lg md:text-2xl font-sans font-black text-secondary mb-4 uppercase tracking-tight">
                    ¿No encuentras tu camiseta?
                  </h3>
                  <p className="text-secondary/60 text-sm md:text-lg mb-8 max-w-md mx-auto">
                    Si no encuentra la camiseta que desea puede encargarla directamente con nosotros.
                  </p>
                  <Link 
                    to="/encargos"
                    className="bg-secondary text-primary px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-xl inline-block"
                  >
                    Ir a la sección de encargos
                  </Link>
                  <div className="mt-8">
                    <button 
                      onClick={() => { setStockSearchQuery(''); setFilterSize('TODAS'); setFilterStyle('TODOS'); }}
                      className="text-secondary/40 font-bold uppercase tracking-widest text-[10px] hover:text-primary transition-colors"
                    >
                      O limpiar filtros de búsqueda
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-12">
                <AnimatePresence mode="popLayout">
                  {(encargoSearchQuery || selectedTeam || selectedLeague) && filteredEncargoJerseys.length > 0 && (
                    <motion.div
                      key="results-grid"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {filteredEncargoJerseys.map(jersey => (
                        <EncargoJerseyCard
                          key={jersey.id}
                          jersey={jersey}
                          onOrder={setSelectedEncargoJersey}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(encargoSearchQuery || selectedTeam || selectedLeague) && (
                    <motion.div
                      key="whatsapp-cta"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="text-center py-6 md:py-10 bg-white rounded-3xl md:rounded-[2rem] border border-secondary/5 shadow-sm px-6 max-w-3xl mx-auto"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 md:space-y-6"
                      >
                      <h3 className="text-base md:text-xl font-sans font-black text-secondary uppercase tracking-tight">
                        ¿No encuentra la camiseta que busca?
                      </h3>
                      <p className="text-secondary/60 text-[10px] md:text-sm leading-relaxed max-w-xl mx-auto">
                        Si no encuentras la camiseta que buscas, puedes consultarnos por WhatsApp para revisar disponibilidad, tenemos muchas camisetas que todavía no aparecen en el catálogo. Dinos el equipo, la temporada y los detalles que prefieras.
                      </p>
                      <button 
                        onClick={() => {
                          const query = encargoSearchQuery || selectedTeam || '';
                          const message = query 
                            ? `¡Hola! Quiero consultar disponibilidad para la camiseta de: ${query}. ¿Me podrían dar más información?`
                            : `¡Hola! Quiero consultar disponibilidad de modelos que no están en el catálogo. ¿Qué otros modelos tienen?`;
                          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="bg-secondary text-primary px-5 py-2.5 md:px-7 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-lg flex items-center gap-2.5 mx-auto"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
                        </svg>
                        Consultar por WhatsApp
                      </button>
                    </motion.div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nosotros' && (
          <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 md:space-y-16"
            >
              {/* Header Section Centered */}
              <div className="text-center space-y-2 md:space-y-4">
                <h1 className="text-2xl md:text-5xl font-sans font-black text-secondary tracking-tighter uppercase">Nosotros</h1>
                <p className="text-primary text-xs md:text-lg font-black">Nuestra Historia</p>
              </div>

              {/* Content Grid */}
              <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 items-stretch">
                {/* Logo with background box - First on mobile */}
                <div className="order-1 md:order-2 bg-[#ebd6ac] p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl shadow-secondary/5 border border-secondary/5 flex items-center justify-center">
                  <img 
                    src="https://drive.google.com/thumbnail?id=1o9b1FebufUYMasAyZmPF7KOEcjLDbAe4&sz=w800" 
                    alt="Logo Sobre Nosotros" 
                    className="w-full max-w-[320px] md:max-w-md h-auto object-contain transform hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>

                {/* Text - Second on mobile */}
                <div className="order-2 md:order-1 space-y-4 md:space-y-8 text-sm md:text-xl text-secondary/80 leading-relaxed text-left bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl shadow-secondary/5 border border-secondary/5 flex flex-col justify-center">
                  <p>
                    En <span className="text-primary font-black">No Pain No Jersey</span> llevamos más de un año convirtiendo una idea sencilla en una comunidad: que la pasión por el fútbol se pueda vestir sin que sea un lujo. Somos dos jóvenes matanceros que crecimos entre partidos, historias de equipos y camisetas que significan mucho más que una prenda.
                  </p>
                  <p>
                    Nos mueve el detalle: el escudo, los parches, la temporada, el nombre y el número que te representan. Ya sea que busques una clásica o esa camiseta que llevas tiempo cazando, trabajamos para que te llegue con presencia, con identidad y con orgullo.
                  </p>
                </div>
              </div>

              {/* Centered Quote */}
              <div className="text-center">
                <p className="text-lg md:text-3xl font-sans font-black text-secondary italic uppercase tracking-tight">
                  "la pasión se vive con estilo"
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'preguntas' && (
          <div className="max-w-4xl mx-auto px-4 pt-8 pb-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="text-center space-y-2 md:space-y-4">
                <h1 className="text-2xl md:text-5xl font-sans font-black text-secondary uppercase tracking-tighter">Preguntas</h1>
                <p className="text-primary text-xs md:text-lg font-black">Resolvemos tus preguntas más comunes para que compres con total confianza.</p>
              </div>

              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    q: "¿Cómo puedo hacer un pedido?",
                    a: "Es muy sencillo. Puedes elegir una camiseta de nuestro stock para entrega inmediata o hacernos un encargo personalizado, escoja la camiseta que desea y rellene los datos de estilo, la talla y los detalles de personalización y quedará su encargo hecho a través de WhatsApp."
                  },
                  {
                    q: "¿Cuáles son las diferencias entre los tipos de camisetas?",
                    a: (
                      <div className="space-y-6">
                        <p>Puede revisar las diferencias de los tipos de camisetas en las siguientes imágenes:</p>
                        <div className="grid gap-8">
                          <img 
                            src="https://drive.google.com/thumbnail?id=1CO3rEhecYEGJXvHDCX42QqX6eRvf_fF4&sz=w800" 
                            alt="Diferencia 1" 
                            className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                            referrerPolicy="no-referrer" 
                            onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=1CO3rEhecYEGJXvHDCX42QqX6eRvf_fF4&sz=w1600")}
                          />
                          <img 
                            src="https://drive.google.com/thumbnail?id=1nKviH8ENgKsHgqPvi0o4TOBGvv4C72Zt&sz=w800" 
                            alt="Diferencia 2" 
                            className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                            referrerPolicy="no-referrer" 
                            onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=1nKviH8ENgKsHgqPvi0o4TOBGvv4C72Zt&sz=w1600")}
                          />
                          <img 
                            src="https://drive.google.com/thumbnail?id=1IDPj1CwvZGB0EpZ-I0ouoFPtFXL4Yvcw&sz=w800" 
                            alt="Diferencia 3" 
                            className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                            referrerPolicy="no-referrer" 
                            onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=1IDPj1CwvZGB0EpZ-I0ouoFPtFXL4Yvcw&sz=w1600")}
                          />
                          <img 
                            src="https://drive.google.com/thumbnail?id=1Bk9Vx3SXVUn49EdSpo2JLbPYFTIX4sff&sz=w800" 
                            alt="Diferencia 4" 
                            className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                            referrerPolicy="no-referrer" 
                            onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=1Bk9Vx3SXVUn49EdSpo2JLbPYFTIX4sff&sz=w1600")}
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    q: "¿Cuánto tardan los pedidos por encargo?",
                    a: "Los pedidos por encargos suelen tardar alrededor de un mes en llegar a Matanzas. Puedes consultarnos en cualquier momento sobre el estado de su pedido."
                  },
                  {
                    q: "¿Tienen camisetas para niños?",
                    a: "Sí, tenemos jueguitos(camiseta+short) para niños, al encargar una camiseta para niño, viene con su respectivo short."
                  },
                  {
                    q: "¿Cómo se realiza el pago?",
                    a: "El pago de los encargos se realiza cuando usted reciba la camiseta. En caso de su camiseta tenga nombre personalizado, deberá pagar la mitad del monto por adelantado. Aceptamos pagos en efectivo y transferencias al cambio en la moneda que usted desee. El pago se coordina directamente por WhatsApp al realizar el pedido."
                  },
                  {
                    q: "¿Cómo sé cuál es mi talla?",
                    a: (
                      <div className="space-y-6">
                        <p>Puede consultar nuestras guías de talla para las diferentes versiones, le recomendamos medir algún pullover que le guste como le guste y comparar con las guías.</p>
                        <div className="grid gap-8">
                          <div className="space-y-2">
                            <p className="font-bold text-secondary uppercase text-sm">Versiones Fan / Retro:</p>
                            <img 
                              src="https://drive.google.com/thumbnail?id=181qCa4uT14HLyJSSTFYPSAoB0SFG792e&sz=w800" 
                              alt="Guía Fan/Retro" 
                              className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                              referrerPolicy="no-referrer" 
                              onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=181qCa4uT14HLyJSSTFYPSAoB0SFG792e&sz=w1600")}
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="font-bold text-secondary uppercase text-sm">Versiones Player:</p>
                            <img 
                              src="https://drive.google.com/thumbnail?id=1oxhEwRYXV8qJqH33Fugidbsl70MPyOmX&sz=w800" 
                              alt="Guía Player" 
                              className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                              referrerPolicy="no-referrer" 
                              onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=1oxhEwRYXV8qJqH33Fugidbsl70MPyOmX&sz=w1600")}
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="font-bold text-secondary uppercase text-sm">Niños:</p>
                            <img 
                              src="https://drive.google.com/thumbnail?id=1LM40HshR2TghNB0qFuGrHXzvaF1vKXQC&sz=w800" 
                              alt="Guía Niños" 
                              className="rounded-2xl border border-secondary/10 w-full cursor-zoom-in" 
                              referrerPolicy="no-referrer" 
                              onClick={() => setZoomedImage("https://drive.google.com/thumbnail?id=1LM40HshR2TghNB0qFuGrHXzvaF1vKXQC&sz=w1600")}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    q: "¿Tienen domicilio?",
                    a: "Actualmente solo tenemos entrega a domicilio dentro de la ciudad de Matanzas."
                  }
                ].map((faq, i) => (
                  <FAQItem key={i} index={i} question={faq.q} answer={faq.a as any} onZoom={setZoomedImage} />
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'contacto' && (
          <div className="max-w-4xl mx-auto px-4 pt-8 pb-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 md:space-y-16 text-center"
            >
              {/* Header Section */}
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-2xl md:text-5xl font-sans font-black text-secondary tracking-tighter uppercase">Contacto</h1>
                <p className="text-primary text-xs md:text-lg font-black italic">Estamos a un mensaje de distancia</p>
              </div>

              <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl shadow-secondary/5 border border-secondary/5 space-y-6 md:space-y-10">
                <p className="text-sm md:text-xl text-secondary/70 leading-relaxed max-w-2xl mx-auto font-medium">
                  Si tienes alguna duda general, te recomendamos visitar primero nuestra sección de <Link to="/preguntas" className="text-primary font-black hover:underline">Preguntas Frecuentes</Link>.
                </p>
                
                <div className="h-px bg-secondary/5 w-16 md:w-24 mx-auto" />

                <p className="text-sm md:text-xl text-secondary/80 leading-relaxed max-w-2xl mx-auto font-bold">
                  ¿Quieres hacer un pedido de una camiseta que no está en nuestro catálogo o todavía tienes dudas específicas?
                </p>

                <div className="pt-2 md:pt-4">
                  <button 
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-secondary text-primary px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-sans font-black text-[9px] md:text-[11px] hover:bg-primary hover:text-secondary transition-all shadow-xl uppercase tracking-[0.15em] group"
                  >
                    <svg className="w-4 h-4 mb-0.5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
                    </svg>
                    Contactar por WhatsApp
                  </button>
                </div>

                <div className="pt-8 flex flex-wrap justify-center gap-8">
                  <div className="flex items-center gap-3 text-secondary/40 font-black uppercase tracking-widest text-[10px] md:text-xs">
                    <MapPin className="w-4 h-4 text-primary" />
                    Matanzas, Cuba
                  </div>
                  <button 
                    onClick={() => window.open("https://www.instagram.com/no_pain_no_jersey", "_blank")}
                    className="flex items-center gap-3 text-secondary/40 font-black uppercase tracking-widest text-[10px] md:text-xs hover:text-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-primary" />
                    @nopain_nojersey
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'sorteo' && (
          <div className="max-w-4xl mx-auto px-4 pt-8 pb-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 md:space-y-16"
            >
              {/* Header Section */}
              <div className="space-y-2 md:space-y-4 text-center">
                <h1 className="text-2xl md:text-6xl font-sans font-black text-secondary tracking-tighter uppercase">Gran Sorteo</h1>
                <p className="text-primary text-xs md:text-xl font-black italic uppercase tracking-widest">¡Gana una camiseta gratis!</p>
              </div>

              {/* Banner Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary p-6 md:p-10 rounded-3xl md:rounded-[3rem] border-4 border-secondary shadow-2xl text-center space-y-4"
              >
                <h2 className="text-xl md:text-3xl font-black text-secondary uppercase tracking-tight">¡Sorteamos una Camiseta por Encargo!</h2>
                <p className="text-secondary/80 font-bold text-sm md:text-lg max-w-2xl mx-auto">
                  El premio de este sorteo es la posibilidad de elegir cualquier camiseta de nuestro catálogo de encargos totalmente gratis. Los encargos demoran en llegar alrededor de un mes.
                </p>
                <div className="pt-2">
                  <Link 
                    to="/encargos" 
                    className="inline-flex items-center gap-2 bg-secondary text-primary px-6 py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all"
                  >
                    Ver Camisetas Disponibles <Shirt className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                {/* Rules Card */}
                <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl shadow-secondary/5 border border-secondary/5 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-secondary uppercase tracking-tight">Cómo Participar</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <span className="text-primary font-black text-lg leading-none pt-1">1-</span>
                      <div className="space-y-2">
                        <p className="text-secondary/70 font-bold text-sm md:text-lg leading-tight">Participar en nuestro grupo de WhatsApp.</p>
                        <a 
                          href="https://chat.whatsapp.com/H3iHglLv0YDInSZsupsb8W" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase hover:underline"
                        >
                          Unirse al Grupo <Phone className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <span className="text-primary font-black text-lg leading-none pt-1">2-</span>
                      <p className="text-secondary/70 font-bold text-sm md:text-lg leading-tight">Añadir a 3 personas al grupo de WhatsApp.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <span className="text-primary font-black text-lg leading-none pt-1">3-</span>
                      <div className="space-y-2">
                        <p className="text-secondary/70 font-bold text-sm md:text-lg leading-tight">Seguirnos en Instagram (@no_pain_no_jersey).</p>
                        <a 
                          href="https://www.instagram.com/no_pain_no_jersey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase hover:underline"
                        >
                          Seguir en Instagram <Instagram className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <span className="text-primary font-black text-lg leading-none pt-1">4-</span>
                      <p className="text-secondary/70 font-bold text-sm md:text-lg leading-tight">Llenar tu nombre y tu número de Whatsapp y enviarnoslo por WhatsApp.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-2">Tu Nombre</label>
                      <input 
                        type="text" 
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="Ej: Juan"
                        className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 text-secondary font-bold focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-2">Tu Número de WhatsApp</label>
                      <input 
                        type="tel" 
                        value={participantPhone}
                        onChange={(e) => setParticipantPhone(e.target.value)}
                        placeholder="Ej: 55565758"
                        className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 text-secondary font-bold focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (!participantName || !participantPhone) {
                          alert("Por favor, completa tu nombre y número para participar.");
                          return;
                        }
                        const message = `Hola, quiero participar en el sorteo\nMi nombre es: ${participantName}\nMi número es: ${participantPhone}\nDebajo adjunto las capturas de los pasos seguidos`;
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full bg-secondary text-primary py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-secondary transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      Participar por WhatsApp <Phone className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-secondary/5 p-4 md:p-6 rounded-2xl space-y-3">
                    <p className="text-xs md:text-sm font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" /> Importante
                    </p>
                    <p className="text-[10px] md:text-sm text-secondary/60 font-medium leading-relaxed">
                      Toma captura de pantalla de cada paso y envíalas a nuestro WhatsApp para validar tu participación.
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-primary rounded-2xl text-secondary gap-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" />
                        <div className="flex flex-col">
                          <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">Anuncio del Ganador</span>
                          <span className="font-black text-sm md:text-lg tracking-tighter">28 de Marzo</span>
                        </div>
                      </div>
                      <Countdown targetDate="2026-03-28T12:00:00-04:00" finishMessage="¡Sorteo finalizado!" />
                    </div>
                  </div>
                </div>

                {/* Participants Card */}
                <div className="bg-secondary p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl shadow-primary/10 border border-white/5 flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Participantes</h2>
                  </div>

                  <div className="space-y-1 pr-2">
                    {[
                      "Williams", "José Miguel", "Steffanie", "Moreira", "Aismelis", 
                      "Jose Luis", "Cristian", "Yosvel", "Antoine", "Anthony",
                      "Maricel", "Aliandys", "Lía", "Gabriel", "Enzo", "Yahinilin",
                      "Adrián", "Alejandro", "Ana Leidys", "Pedro", "John", "Samuel",
                      "Nuria", "Diana", "Robert", "Marialis", "Valen",
                      "David", "Daimarys", "Luis Daniel", "Maxdiel", "Miguel Alejandro", "Leynier", "Bastian", "Melody", "Alberto Alejandro", "Davisito", "Liz Anette", "Bruno"
                    ].map((name, i) => (
                      <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-primary/50">#{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-xs md:text-sm font-bold text-white/90">{name}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(235,214,172,0.5)]" />
                      </div>
                    ))}
                    {[
                      "Williams", "José Miguel", "Steffanie", "Moreira", "Aismelis", 
                      "Jose Luis", "Cristian", "Yosvel", "Antoine", "Anthony",
                      "Maricel", "Aliandys", "Lía", "Gabriel", "Enzo", "Yahinilin",
                      "Adrián", "Alejandro", "Ana Leidys", "Pedro", "John", "Samuel",
                      "Nuria", "Diana", "Robert", "Marialis", "Valen",
                      "David", "Daimarys", "Luis Daniel", "Maxdiel", "Miguel Alejandro", "Leynier", "Bastian", "Melody", "Alberto Alejandro", "Davisito", "Liz Anette", "Bruno"
                    ].length === 0 && (
                      <div className="text-center py-12 space-y-3">
                        <div className="flex justify-center">
                          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-white/20" />
                          </div>
                        </div>
                        <p className="text-white/30 font-bold text-xs md:text-sm italic">Esperando primeros participantes...</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-[10px] md:text-xs text-white/40 font-black uppercase tracking-[0.2em] text-center">
                      Total Participantes: <span className="text-primary">39</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="bg-secondary text-white py-12 md:py-24 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-row justify-between gap-4 md:gap-16">
            {/* Left side: Description */}
            <div className="w-[45%] md:w-1/3 text-left space-y-3 md:space-y-8">
              <img src={LOGO_FOOTER_URL} alt="Logo" className="w-14 h-14 md:w-32 md:h-32 object-contain" referrerPolicy="no-referrer" />
              <p className="text-white/60 text-xs md:text-xl leading-relaxed font-medium max-w-[180px] md:max-w-none">
                Tu tienda de confianza<br/>
                en Matanzas para<br/>
                camisetas deportivas.
              </p>
            </div>

            {/* Right side: Enunciados */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 flex-1">
              <div className="text-left">
                <h4 className="font-sans font-bold text-xs md:text-xl mb-4 md:mb-8 uppercase tracking-widest text-[#ebd6ac]">Enlaces</h4>
                <ul className="space-y-3 md:space-y-4 text-white/70 font-medium text-[10px] md:text-base">
                  <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                  <li><Link to="/stock" className="hover:text-primary transition-colors">Stock</Link></li>
                  <li><Link to="/encargos" className="hover:text-primary transition-colors">Encargos</Link></li>
                  <li><Link to="/nosotros" className="hover:text-primary transition-colors">Nosotros</Link></li>
                  <li><Link to="/preguntas" className="hover:text-primary transition-colors">Preguntas</Link></li>
                  <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
                  <li><Link to="/sorteo" className="hover:text-primary transition-colors">Sorteo</Link></li>
                </ul>
              </div>

              <div className="space-y-8 md:space-y-0">
                <div className="text-left">
                  <h4 className="font-sans font-bold text-xs md:text-xl mb-4 md:mb-8 uppercase tracking-widest text-[#ebd6ac]">Síguenos</h4>
                  <ul className="space-y-3 md:space-y-4 text-white/70 font-medium text-[10px] md:text-base">
                    <li>
                      <a 
                        href="https://chat.whatsapp.com/H3iHglLv0YDInSZsupsb8W" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-start gap-2 md:gap-3 hover:text-primary transition-all"
                      >
                        <div className="bg-white/10 p-1.5 md:p-2 rounded-lg">
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
                          </svg>
                        </div>
                        <span className="hidden md:inline">Grupo de WhatsApp</span>
                        <span className="md:hidden">WhatsApp</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.instagram.com/no_pain_no_jersey?igsh=b21ibmE3ZWE4cWo5&utm_source=qr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-start gap-2 md:gap-3 hover:text-primary transition-all"
                      >
                        <div className="bg-white/10 p-1.5 md:p-2 rounded-lg"><Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" /></div>
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="text-left md:pt-8">
                  <h4 className="font-sans font-bold text-xs md:text-xl mb-4 md:mb-8 uppercase tracking-widest text-[#ebd6ac]">Contacto</h4>
                  <ul className="space-y-3 md:space-y-4 text-white/70 font-medium text-[10px] md:text-base">
                    <li>
                      <a 
                        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-start gap-2 md:gap-3 hover:text-primary transition-all"
                      >
                        <div className="bg-white/10 p-1.5 md:p-2 rounded-lg">
                          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
                          </svg>
                        </div>
                        Chat
                      </a>
                    </li>
                    <li className="flex items-center justify-start gap-2 md:gap-3">
                      <div className="bg-white/10 p-1.5 md:p-2 rounded-lg"><MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /></div>
                      Matanzas, Cuba
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center">
          <div className="text-white/40 text-xs md:text-sm font-medium">
            © {new Date().getFullYear()} No Pain-No Jersey. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {selectedJersey && (
        <CustomOrderModal
          jersey={selectedJersey}
          onClose={() => setSelectedJersey(null)}
        />
      )}

      {selectedEncargoJersey && (
        <EncargoOrderModal
          jersey={selectedEncargoJersey}
          onClose={() => setSelectedEncargoJersey(null)}
          onZoom={setZoomedImage}
        />
      )}

      {zoomedImage && (
        <ImageZoomModal
          src={zoomedImage}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </div>
  );
}
