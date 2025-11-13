export const LEARNING_STAGES = [
  {
    id: "principiante",
    order: 1,
    title: "Principiante",
    focus: "Morfología esencial",
    description: "Identifica sustantivos, adjetivos y la concordancia básica.",
    unlockRequirement: 0,
    icon: "🌱",
    levelTag: "Nivel 1",
    accent: "#6ddccf",
  },
  {
    id: "basico",
    order: 2,
    title: "Básico",
    focus: "Flexiones regulares y conectores simples",
    description:
      "Aprende a clasificar raíces y observar las variaciones de género.",
    unlockRequirement: 3,
    icon: "🚀",
    levelTag: "Nivel 2",
    accent: "#78c6ff",
  },
  {
    id: "pre-intermedio",
    order: 3,
    title: "Pre-intermedio",
    focus: "Prefijos y sufijos clave",
    description:
      "Asocia sufijos con modificaciones de significado y forma palabras.",
    unlockRequirement: 7,
    icon: "🧠",
    levelTag: "Nivel 3",
    accent: "#f59e0b",
  },
  {
    id: "intermedio",
    order: 4,
    title: "Intermedio",
    focus: "Tiempos compuestos y morfemas",
    description:
      "Explora verbos compuestos y cómo los morfemas cambian sus formas.",
    unlockRequirement: 12,
    icon: "🔥",
    levelTag: "Nivel 4",
    accent: "#ef4444",
  },
  {
    id: "avanzado",
    order: 5,
    title: "Avanzado",
    focus: "Derivaciones complejas y variaciones",
    description:
      "Conecta raíces, sufijos y prefijos para construir vocabulario experto.",
    unlockRequirement: 18,
    icon: "🌌",
    levelTag: "Nivel 5",
    accent: "#9333ea",
  },
] as const;

export type LearningStage = (typeof LEARNING_STAGES)[number];
