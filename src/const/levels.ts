export const LEVEL_GROUPS = [
  {
    id: 'basic',
    title: 'Nivel básico',
    description: 'Construye vocabulario esencial y domina frases cotidianas.',
    sublevels: [
      {
        id: 'basic-1',
        order: 1,
        title: 'Saludos esenciales',
        description: 'Aprende a presentarte y saludar en diferentes contextos.',
        requirement: 1,
        icon: '👋',
      },
      {
        id: 'basic-2',
        order: 2,
        title: 'Café y comida',
        description: 'Pide tus platillos favoritos sin miedo.',
        requirement: 3,
        icon: '☕️',
      },
      {
        id: 'basic-3',
        order: 3,
        title: 'Rutas y transporte',
        description: 'Pregunta direcciones y entiende indicaciones simples.',
        requirement: 6,
        icon: '🗺️',
      },
      {
        id: 'basic-4',
        order: 4,
        title: 'Plan de viaje',
        description: 'Organiza una salida y coordina horarios.',
        requirement: 10,
        icon: '🎒',
      },
      {
        id: 'basic-5',
        order: 5,
        title: 'Historias breves',
        description: 'Cuenta experiencias en pasado de forma natural.',
        requirement: 15,
        icon: '📖',
      },
    ],
  },
] as const;

export const LEVELS = LEVEL_GROUPS.flatMap((group) => group.sublevels);

export type Level = (typeof LEVELS)[number];
export type LevelGroup = (typeof LEVEL_GROUPS)[number];
