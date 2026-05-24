export interface Character {
  id: string;
  name: string;
  class: string;
  image: string;
  quote: string;
  mood: 'cozy' | 'dark';
}

export interface Scene {
  id: string;
  label: string;
  image: string;
  overlay: string;
  mood: 'cozy' | 'dark';
}

export const CHARACTERS: Character[] = [
  { id: 'elf-green',   name: 'Sylph Brightleaf',  class: 'Forest Drifter',          image: '/assets/char-elf-green.png',
    quote: 'Every "no" is a doorway opening elsewhere.', mood: 'cozy' },
  { id: 'cleric',      name: 'Mira the Wayfarer', class: 'Cleric of Cover Letters',  image: '/assets/char-cleric.png',
    quote: 'A good follow-up is a quiet prayer.', mood: 'cozy' },
  { id: 'yang',        name: 'Yang Stormbow',     class: 'Wandering Adventurer',     image: '/assets/char-yang.png',
    quote: 'I treat every cold app like a side quest.', mood: 'cozy' },
  { id: 'finn',        name: 'Finn Embermane',    class: 'Folk Bard',                image: '/assets/char-finn.png',
    quote: 'Networking is just bardic performance.', mood: 'cozy' },
  { id: 'frog',        name: 'Sir Croak',         class: 'Princess of Limbo',        image: '/assets/char-frog.png',
    quote: 'Ribbit. (My standards are not up for negotiation.)', mood: 'cozy' },
  { id: 'lady-red',    name: 'Lady Crimson',      class: 'The Headhunter',           image: '/assets/char-lady-red.png',
    quote: 'I do not chase offers. They find me.', mood: 'dark' },
  { id: 'knight-dark', name: 'Sir Cinder',        class: 'Knight of Rejection',      image: '/assets/char-knight-dark.png',
    quote: 'Rejection is the whetstone of resilience.', mood: 'dark' },
  { id: 'mage-blue',   name: 'Liara of the Veil', class: 'Oracle of Offers',         image: '/assets/char-mage-blue.png',
    quote: 'I have seen your salary band, and it is good.', mood: 'dark' },
  { id: 'camilla',     name: 'Camilla Aether',    class: 'Champion of L4 Loops',     image: '/assets/char-camilla.png',
    quote: 'Bring me your hardest interview loop.', mood: 'dark' },
  { id: 'scarlet',     name: 'Scarlet Vex',       class: 'Salary Negotiator',        image: '/assets/char-scarlet.png',
    quote: 'I have never accepted a first offer. Try me.', mood: 'dark' },
  { id: 'namika',      name: 'Namika Nono',       class: 'Arcane Recruiter',         image: '/assets/char-namika.png',
    quote: 'My staff points only at six-figure roles.', mood: 'dark' },
];

export const SCENES: Scene[] = [
  { id: 'cozy-desk',      label: 'Cozy Desk',      image: '/assets/bg-cozy-desk.jpg',      overlay: 'rgba(15,8,4,.42)',   mood: 'cozy' },
  { id: 'sunflowers',     label: 'Sunflower Sky',  image: '/assets/bg-sunflowers.jpg',     overlay: 'rgba(8,20,40,.28)',  mood: 'cozy' },
  { id: 'forest-lush',    label: 'Lush Forest',    image: '/assets/bg-forest-lush.jpg',    overlay: 'rgba(4,16,8,.45)',   mood: 'cozy' },
  { id: 'forest-deep',    label: 'Deep Forest',    image: '/assets/bg-forest-deep.jpg',    overlay: 'rgba(2,8,4,.38)',    mood: 'cozy' },
  { id: 'forest-cabin',   label: 'Forest Cabin',   image: '/assets/bg-forest-cabin.jpg',   overlay: 'rgba(8,12,4,.45)',   mood: 'cozy' },
  { id: 'forest-pink',    label: 'Twilight Wood',  image: '/assets/bg-forest-pink.jpg',    overlay: 'rgba(20,8,30,.4)',   mood: 'dark' },
  { id: 'vampire-castle', label: 'Vampire Castle', image: '/assets/bg-vampire-castle.jpg', overlay: 'rgba(20,8,40,.5)',   mood: 'dark' },
  { id: 'sunset-village', label: 'Sunset Bay',     image: '/assets/bg-sunset-village.jpg', overlay: 'rgba(40,8,30,.4)',   mood: 'dark' },
];
