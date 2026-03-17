export interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  price: number;
  image: string;
  isBestSeller?: boolean;
  style: 'Fan' | 'Player' | 'Retro';
  size: string;
  season: string;
  type: 'Local' | 'Visitante' | 'Tercera' | 'Cuarta' | 'Especial' | 'Portero';
  playerName?: string;
  number?: string;
  patch?: string;
  originalPrice?: number;
  discountEndDate?: string;
}

export interface EncargoJersey {
  id: string;
  name: string;
  team: string;
  league: string;
  season: string;
  type: 'Local' | 'Visitante' | 'Tercera' | 'Cuarta' | 'Especial' | 'Portero';
  price: number;
  isRetro?: boolean;
  fanImage: string;
  playerImage?: string;
  childImage?: string;
  fanLongSleeveImage?: string;
  playerLongSleeveImage?: string;
  retroLongSleeveImage?: string;
  fanSizeGuide?: string;
  playerSizeGuide?: string;
  retroSizeGuide?: string;
  childSizeGuide?: string;
  ligaNumberingImage?: string;
  championsNumberingImage?: string;
  europaNumberingImage?: string;
  noLongSleeve?: boolean;
  noChild?: boolean;
  noCustomization?: boolean;
  noPatches?: boolean;
  patches?: { name: string; logo: string | null }[];
}

export interface EncargoOrder {
  jerseyId: string;
  version: 'Fan' | 'Player' | 'Niño' | 'Retro';
  size: string;
  sleeves: 'Corta' | 'Larga';
  name: string;
  number: string;
  patch: string;
}

export interface CustomOrder {
  jerseyId: string;
  size: string;
  patches: string;
  name: string;
  number: string;
}

export type League = 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Selecciones' | 'Otras';
