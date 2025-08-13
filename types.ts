
export interface CardData {
  name: string;
}

export interface DrawnCard {
  card: CardData;
  isReversed: boolean;
}

export type AppState = 'IDLE' | 'LOADING' | 'RESULT';
