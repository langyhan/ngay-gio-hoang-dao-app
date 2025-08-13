
import { CardData } from '../types';

const MAJOR_ARCANA: CardData[] = [
  { name: 'The Fool' }, { name: 'The Magician' }, { name: 'The High Priestess' },
  { name: 'The Empress' }, { name: 'The Emperor' }, { name: 'The Hierophant' },
  { name: 'The Lovers' }, { name: 'The Chariot' }, { name: 'Strength' },
  { name: 'The Hermit' }, { name: 'Wheel of Fortune' }, { name: 'Justice' },
  { name: 'The Hanged Man' }, { name: 'Death' }, { name: 'Temperance' },
  { name: 'The Devil' }, { name: 'The Tower' }, { name: 'The Star' },
  { name: 'The Moon' }, { name: 'The Sun' }, { name: 'Judgement' },
  { name: 'The World' }
];

const SUIT_NAMES = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const COURT_CARDS = ['Page', 'Knight', 'Queen', 'King'];
const NUMBERED_CARDS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

const MINOR_ARCANA: CardData[] = SUIT_NAMES.flatMap(suit => 
  [
    ...NUMBERED_CARDS.map(rank => ({ name: `${rank} of ${suit}` })),
    ...COURT_CARDS.map(rank => ({ name: `${rank} of ${suit}` }))
  ]
);

export const ALL_CARDS: CardData[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];
