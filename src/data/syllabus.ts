export type ClassLevel = "9" | "10" | "11" | "12";

export interface Topic {
  id: string;
  title: string;
  description: string;
  hasSimulation?: boolean;
}

export const syllabus: Record<ClassLevel, Topic[]> = {
  "9": [
    { id: "motion", title: "Motion", description: "Distance, displacement, velocity; uniform and non-uniform motion along a straight line; acceleration.", hasSimulation: true },
    { id: "force", title: "Force and Laws of Motion", description: "Force and Motion, Newton's Laws of Motion, Action and Reaction forces.", hasSimulation: true },
    { id: "gravitation", title: "Gravitation", description: "Gravitation; Universal Law of Gravitation, Force of Gravitation of the earth (gravity), Acceleration due to Gravity.", hasSimulation: true },
    { id: "work-energy", title: "Work and Energy", description: "Work done by a force, energy, power; kinetic and potential energy.", hasSimulation: true },
  ],
  "10": [
    { id: "light", title: "Light - Reflection and Refraction", description: "Reflection of light by spherical mirrors, refraction of light, lenses.", hasSimulation: true },
    { id: "human-eye", title: "The Human Eye and the Colourful World", description: "Functioning of a lens in human eye, defects of vision.", hasSimulation: true },
    { id: "electricity", title: "Electricity", description: "Electric current, potential difference, Ohm's law, resistance, resistivity.", hasSimulation: true },
    { id: "magnetic-effects", title: "Magnetic Effects of Electric Current", description: "Magnetic field, field lines, field due to a current carrying conductor.", hasSimulation: true },
  ],
  "11": [
    { id: "kinematics", title: "Kinematics", description: "Frame of reference, Motion in a straight line, Motion in a plane, Projectile motion.", hasSimulation: true },
    { id: "laws-of-motion", title: "Laws of Motion", description: "Intuitive concept of force, Inertia, Newton's laws.", hasSimulation: true },
    { id: "work-energy-power", title: "Work, Energy and Power", description: "Work done by a constant and variable force, Kinetic energy, Power.", hasSimulation: true },
    { id: "gravitation-11", title: "Gravitation", description: "Kepler's laws, Universal law of gravitation, Acceleration due to gravity.", hasSimulation: true },
  ],
  "12": [
    { id: "electrostatics", title: "Electrostatics", description: "Electric charges, Coulomb's law, Electric field, Electric potential.", hasSimulation: true },
    { id: "current-electricity", title: "Current Electricity", description: "Electric current, flow of electric charges, Ohm's law, electrical resistance.", hasSimulation: true },
    { id: "magnetism", title: "Magnetic Effects of Current and Magnetism", description: "Concept of magnetic field, Oersted's experiment, Biot - Savart law.", hasSimulation: true },
    { id: "optics", title: "Ray & Wave Optics", description: "Reflection of light, spherical mirrors, refraction.", hasSimulation: true },
  ]
};
