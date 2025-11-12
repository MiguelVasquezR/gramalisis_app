export const LEVELS = [
  {
    id: 1,
    title: 'Explorador',
    description: 'Registra tu primer análisis y descubre los insights básicos.',
    requirement: 1,
  },
  {
    id: 2,
    title: 'Analista',
    description: 'Mantén una racha de 5 análisis para desbloquear métricas avanzadas.',
    requirement: 5,
  },
  {
    id: 3,
    title: 'Estratega',
    description: 'Comparte 10 textos distintos para activar recomendaciones.',
    requirement: 10,
  },
  {
    id: 4,
    title: 'Mentor',
    description: 'Colabora con tu equipo compartiendo 15 análisis.',
    requirement: 15,
  },
  {
    id: 5,
    title: 'Leyenda',
    description: 'Completa 25 análisis para desbloquear todos los reportes.',
    requirement: 25,
  },
] as const;

export type Level = (typeof LEVELS)[number];

