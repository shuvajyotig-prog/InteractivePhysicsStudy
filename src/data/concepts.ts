export interface ConceptSection {
  id: string;
  title: string;
  content: string;
}

export interface ConceptData {
  topicId: string;
  intro: string;
  principles: ConceptSection[];
  formulas: ConceptSection[];
  techniques: ConceptSection[];
  samples?: ConceptSection[];
  mistakes: ConceptSection[];
}

export const conceptDatabase: Record<string, ConceptData> = {
  "kinematics": {
    topicId: "kinematics",
    intro: "Kinematics is the 'geometry of motion'. It focuses purely on describing how objects move—their positions, velocities, and accelerations over time—without worrying about the underlying forces (like pushes or pulls) that cause the motion. Think of it as the director's cut of a movie scene: we track the actors, but we don't care *why* they started running yet.",
    principles: [
      { 
        id: "p1", 
        title: "Displacement vs. Distance", 
        content: "**Distance** is the total length of the actual path traveled by an object. It's a *scalar* quantity, meaning it only has magnitude (e.g., 50 meters).\n\n**Displacement**, however, is the shortest straight-line distance from the initial position to the final position, along with the direction. It is a *vector* quantity (e.g., 50 meters North).\n\n*   **Key Insight:** If you run a full 400m lap on a track and finish exactly where you started, your distance traveled is 400m, but your displacement is absolutely **zero**." 
      },
      { 
        id: "p2", 
        title: "Instantaneous vs. Average Velocity", 
        content: "**Average Velocity** is the total displacement divided by the total time taken ($v_{avg} = \\frac{\\Delta x}{\\Delta t}$). It tells you the overall rate of position change over an interval.\n\n**Instantaneous Velocity** is the velocity of an object at exactly one specific moment in time. Mathematically, it's the limit of the average velocity as the time interval approaches zero ($v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt}$).\n\n*   **Analogy:** Your car's speedometer shows instantaneous speed. A trip computer calculating total miles over total hours shows average speed." 
      },
      { 
        id: "p3", 
        title: "Projectile Motion Anatomy", 
        content: "Projectile motion occurs when an object is thrown near the Earth's surface and moves along a curved path under the action of gravity alone.\n\nThe crucial realization is that this 2D motion consists of two **independent** 1D motions:\n1.  **Horizontal (X-axis):** Constant velocity motion. There is no acceleration (ignoring air resistance), so $v_x$ remains constant.\n2.  **Vertical (Y-axis):** Uniformly accelerated motion. Gravity provides a constant downward acceleration ($a_y = -9.8 \\text{ m/s}^2$)." 
      }
    ],
    formulas: [
      { 
        id: "f1", 
        title: "1st Equation of Motion (Velocity-Time)", 
        content: "### $v = u + at$\n\n*   **$v$** = Final continuous velocity\n*   **$u$** = Initial velocity\n*   **$a$** = Constant acceleration\n*   **$t$** = Time elapsed\n\n**Use case:** Finding the final speed when you know how long you've been accelerating." 
      },
      { 
        id: "f2", 
        title: "2nd Equation of Motion (Position-Time)", 
        content: "### $s = ut + \\frac{1}{2}at^2$\n\n*   **$s$** = Displacement (not distance!)\n*   **$u$** = Initial velocity\n*   **$a$** = Constant acceleration\n*   **$t$** = Time elapsed\n\n**Use case:** Predicting where an object will be after a certain amount of time." 
      },
      { 
        id: "f3", 
        title: "3rd Equation of Motion (Velocity-Position)", 
        content: "### $v^2 = u^2 + 2as$\n\n*   **$v$** = Final velocity\n*   **$u$** = Initial velocity\n*   **$a$** = Constant acceleration\n*   **$s$** = Displacement\n\n**Use case:** Finding velocity or distance when time ($t$) is unknown or irrelevant." 
      }
    ],
    techniques: [
      { 
        id: "t1", 
        title: "The Strict Coordinate Setup", 
        content: "Before writing a single equation, rigorously define your coordinate system. \n\n1. Pick an origin point (usually where the motion starts).\n2. Decide which direction is positive (e.g., Up is $+$, Down is $-$).\n3. **Stick to it.** If Up is $+$, then gravity is *always* $a = -9.8 \\text{ m/s}^2$, even when the object is falling down." 
      },
      { 
        id: "t2", 
        title: "Independent Axes Theorem", 
        content: "For Projectile or 2D motion, physically separate your paper into two columns: **X-Data** and **Y-Data**. \n\nNever mix an X-velocity with a Y-acceleration. They live in different worlds. The only variable allowed to travel between the X column and the Y column is **Time ($t$)**, because time is a scalar." 
      },
      {
        id: "t3",
        title: "Constant Acceleration Pattern",
        content: "When dealing with linear motion under constant acceleration:\n\n1.  List your knowns: always try to find 3 out of the 5 variables ($u, v, a, s, t$).\n2.  Identify the unknown you need.\n3.  Select the equation that contains your exactly 3 knowns and 1 unknown."
      },
      {
        id: "t4",
        title: "Projectile Symmetry Pattern",
        content: "If a projectile lands at the same height it was launched from:\n\n1.  **Time of flight** is determined entirely by initial vertical velocity ($u_y$).\n2.  The **path is perfectly symmetrical**. The time to reach max height is exactly half the total flight time.\n3.  The speed when it hits the ground is identical to its launch speed."
      }
    ],
    samples: [
       {
         id: "s1",
         title: "Sample: The Dropped Stone",
         content: "**Problem:** A stone is dropped from a 45m high building. How long does it take to reach the ground? (Use $g = 10 \\text{ m/s}^2$).\n\n**Solution:**\n1. Coordinate system: Let throwing point be origin $(0,0)$ and DOWNWARD be positive.\n2. Knowns: $u = 0 \\text{ m/s}$, $a = +10 \\text{ m/s}^2$, $s = +45 \\text{ m}$.\n3. Unknown: $t =$ ?\n4. Select equation: $s = ut + \\frac{1}{2}at^2$\n5. Solve: $45 = 0 + 5t^2 \\implies t^2 = 9 \\implies t = 3 \\text{ s}$."
       },
       {
         id: "s2",
         title: "Sample: The Horizontal Projectile",
         content: "**Problem:** A ball is thrown horizontally off a 20m high cliff at 15 m/s. How far from the base does it land?\n\n**Solution:**\n1. **Y-Axis (Find time):** $u_y = 0$, $s_y = 20$, $a_y = 10$. \n   $20 = \\frac{1}{2}(10)t^2 \\implies t = 2\\text{s}$.\n2. **X-Axis (Find range):** $u_x = 15$, $a_x = 0$, $t = 2$.\n   $s_x = u_x t = 15(2) = 30\\text{m}$."
       }
    ],
    mistakes: [
      { 
        id: "m1", 
        title: "Assuming v = 0 means a = 0", 
        content: "At the maximum height of a thrown ball, its vertical velocity is momentarily zero ($v_y = 0$). Countless students conclude that $a = 0$ here. \n\n**Wrong.** Gravity never takes a break. The acceleration is still strictly $9.8 \\text{ m/s}^2$ downwards. If acceleration were zero at the top, the ball would hover there forever!" 
      },
      { 
        id: "m2", 
        title: "Using constant 'a' formulas for varying forces", 
        content: "The three standard equations of motion ($v=u+at$, etc.) are **only strictly valid when acceleration is perfectly constant**. \n\nIf a force is changing (like a spring pushing an object, or air resistance increasing with speed), you absolutely cannot use these formulas algebraically. You must use calculus (integration)." 
      }
    ]
  },
  "motion": {
    topicId: "motion",
    intro: "Motion is everywhere! Everything in the universe is constantly moving. We study motion by looking at how an object's position changes compared to a reference point over time.",
    principles: [
      { 
        id: "m_p1", 
        title: "Reference Points", 
        content: "Motion is entirely relative. You cannot say something is 'moving' without asking 'moving relative to what?'.\n\nWhen you are sitting still on a train, you are at rest relative to the train carriage. But to someone standing on the platform, you are moving at 100 km/h!" 
      },
      { 
        id: "m_p2", 
        title: "Uniform Motion", 
        content: "Uniform motion occurs when an object covers equal distances in equal intervals of time, going in a straight line. \n\nThis means the velocity is perfectly constant, and therefore, the net acceleration is absolutely zero." 
      }
    ],
    formulas: [
      { 
        id: "m_f1", 
        title: "Speed", 
        content: "### $v = \\frac{s}{t}$\n\nWhere **$s$** is total distance traveled, and **$t$** is time taken. Speed is a scalar." 
      },
      { 
        id: "m_f2", 
        title: "Average Speed", 
        content: "### $v_{avg} = \\frac{\\text{Total Distance}}{\\text{Total Time}}$\n\nNote that this is not always the simple arithmetic mean of two speeds. If you drive at 60 km/h for the first half of a *journey*, and 40 km/h for the second half, your average speed is actually 48 km/h, not 50!" 
      }
    ],
    techniques: [
      { 
        id: "m_t1", 
        title: "Graph Check Protocol", 
        content: "Whenever you encounter a kinematics graph, physically touch the Y-axis label before analyzing the slope.\n\n*   **Position-Time (x-t) Graph:** Slope indicates velocity. A flat horizontal line means 'at rest'.\n*   **Velocity-Time (v-t) Graph:** Slope indicates acceleration. Area under the curve indicates displacement. A flat horizontal line means 'constant speed'." 
      }
    ],
    mistakes: [
      { 
        id: "m_m1", 
        title: "Speed vs Velocity Mix-Up", 
        content: "Forgetting that velocity requires a direction vector. \n\nIf you drive a car around a circular track at a constant 50 km/h, your **speed is constant**, but your **velocity is constantly changing** because your direction is constantly changing. Therefore, you are accelerating!" 
      }
    ]
  },
  "electricity": {
    topicId: "electricity",
    intro: "Electricity is the flow of electrical power or charge. It powers everything from our brains to our modern cities.",
    principles: [
      {
        id: "elec_p1",
        title: "Electric Charge and Current",
        content: "Electric current ($I$) is the rate of flow of electric charge ($Q$) through a conductor. Think of it like water flowing through a pipe: the charge is the water, and current is how many gallons pass by per second."
      },
      {
        id: "elec_p2",
        title: "Potential Difference (Voltage)",
        content: "Voltage ($V$) is the work done to move a unit charge from one point to another. In our water analogy, voltage is the water pressure provided by a pump. No pressure difference, no flow."
      },
      {
        id: "elec_p3",
        title: "Ohm's Law",
        content: "Ohm's law states that the current passing through a conductor between two points is directly proportional to the voltage across the two points ($V \\propto I$)."
      }
    ],
    formulas: [
      {
        id: "elec_f1",
        title: "Ohm's Law",
        content: "### $V = IR$\n\n*   **$V$** = Voltage (Volts)\n*   **$I$** = Current (Amperes)\n*   **$R$** = Resistance (Ohms)\n\n**Use case:** Finding the required voltage to drive a current through a known resistor."
      },
      {
        id: "elec_f2",
        title: "Electric Power",
        content: "### $P = VI = I^2R = \\frac{V^2}{R}$\n\n*   **$P$** = Power (Watts)\n\n**Use case:** Calculating the energy consumption rate of a device like a bulb or heater."
      }
    ],
    techniques: [
      {
        id: "elec_t1",
        title: "Series vs Parallel Analysis",
        content: "Always trace the current path from the positive terminal. If the path splits, you are looking at a parallel circuit. In series, current is constant. In parallel, voltage is constant across branches."
      }
    ],
    samples: [
       {
         id: "elec_s1",
         title: "Sample: Series Resistors",
         content: "**Problem:** Two resistors, $5 \\Omega$ and $10 \\Omega$, are connected in series to a 30V battery. Find the current.\n\n**Solution:**\n1. Find total resistance: $R_{eq} = R_1 + R_2 = 5 + 10 = 15 \\Omega$.\n2. Use Ohm's Law: $I = \\frac{V}{R} = \\frac{30}{15} = 2\\text{A}$."
       }
    ],
    mistakes: [
      {
        id: "elec_m1",
        title: "Adding Parallel Resistors Incorrectly",
        content: "Students often add parallel resistors linearly ($R = R_1 + R_2$). The correct formula is $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$. Remember that adding resistors in parallel *decreases* the total resistance!"
      }
    ]
  },
  "light": {
    topicId: "light",
    intro: "Light is a form of electromagnetic radiation that can be detected by the human eye. We study its behaviors—chiefly reflection and refraction to understand optical instruments.",
    principles: [
      {
        id: "opt_p1",
        title: "Laws of Reflection",
        content: "1. The angle of incidence equals the angle of reflection ($i = r$).\n2. The incident ray, the reflected ray, and the normal all lie in the same plane."
      },
      {
        id: "opt_p2",
        title: "Refraction & Snell's Law",
        content: "When light travels from one transparent medium to another, it changes speed and bends. Snell's law relates the angles to the refractive indices ($n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2$)."
      }
    ],
    formulas: [
      {
        id: "opt_f1",
        title: "Mirror and Lens Formula",
        content: "### $\\frac{1}{f} = \\frac{1}{v} \\pm \\frac{1}{u}$\n\n*   **$f$** = focal length\n*   **$v$** = image distance\n*   **$u$** = object distance\n\n**Use case:** Finding where an image will form for a given lens or mirror."
      }
    ],
    techniques: [
      {
        id: "opt_t1",
        title: "Sign Convention",
        content: "Strictly adhere to the Cartesian sign convention. The optical center/pole is the origin $(0,0)$. The direction of incident light is the positive X-axis. This is the #1 place students make mistakes."
      }
    ],
    mistakes: [
      {
        id: "opt_m1",
        title: "Flipping u and v",
        content: "Always ensure $u$ is the object distance and $v$ is the image distance. Since the object is usually placed to the left of the mirror/lens, $u$ is almost always a negative value."
      }
    ]
  },
  "force": {
    topicId: "force",
    intro: "Dynamics is the study of why things move. Force is a push or pull that can cause an object with mass to change its velocity (i.e., to accelerate).",
    principles: [
      {
        id: "f_p1",
        title: "Newton's First Law (Inertia)",
        content: "An object rests, or moves in a straight line at a constant speed, unless acted upon by a net external force. Inertia is an object's resistance to change in motion."
      },
      {
        id: "f_p2",
        title: "Newton's Second Law",
        content: "The acceleration of an object depends directly on the net force acting upon it, and inversely upon its mass ($F = ma$)."
      },
      {
        id: "f_p3",
        title: "Newton's Third Law",
        content: "For every action, there is an equal and opposite reaction. Forces always come in pairs."
      }
    ],
    formulas: [
      {
        id: "f_f1",
        title: "Force",
        content: "### $F = ma$\n\n*   **$F$** = Net Force (Newtons)\n*   **$m$** = Mass (kg)\n*   **$a$** = Acceleration (m/s²)"
      },
      {
        id: "f_f2",
        title: "Momentum",
        content: "### $p = mv$\n\n*   **$p$** = Momentum (kg·m/s)\n*   **$m$** = Mass\n*   **$v$** = Velocity"
      }
    ],
    techniques: [
      {
        id: "f_t1",
        title: "Free Body Diagrams",
        content: "Always draw a Free Body Diagram (FBD) indicating all forces acting on the object before writing Newton's equations. Isolate the body!"
      }
    ],
    samples: [
      {
        id: "f_s1",
        title: "Sample: Pushing a block",
        content: "**Problem:** A 5kg block is pushed with a 20N force on a frictionless surface. What is its acceleration?\n\n**Solution:** \n$F = ma \n\\implies 20 = 5 \\cdot a \n\\implies a = 4 \\text{ m/s}^2$."
      }
    ],
    mistakes: [
      {
        id: "f_m1",
        title: "Forgetting Net Force",
        content: "Students often equate $F=ma$ to just one applied force, forgetting to subtract opposing forces like friction. It's $F_{net} = ma$, not just $F_{applied} = ma$!"
      }
    ]
  },
  "gravitation": {
    topicId: "gravitation",
    intro: "Gravity is a fundamental interaction which causes mutual attraction between all things with mass or energy. It's what keeps planets in orbit and our feet on the ground.",
    principles: [
      {
        id: "g_p1",
        title: "Universal Law of Gravitation",
        content: "Every particle attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them."
      },
      {
        id: "g_p2",
        title: "Acceleration Due to Gravity (g)",
        content: "The acceleration of an object in free fall near a massive body like the Earth. On Earth's surface, this is approximately $9.8 \\text{ m/s}^2$."
      }
    ],
    formulas: [
      {
        id: "g_f1",
        title: "Gravitational Force",
        content: "### $F = G \\frac{m_1 m_2}{r^2}$\n\n*   **$G$** = Gravitational constant\n*   **$m_1, m_2$** = Masses\n*   **$r$** = Distance between centers"
      },
      {
        id: "g_f2",
        title: "Gravity Acceleration",
        content: "### $g = G \\frac{M}{R^2}$\n\n*   **$M$** = Mass of the central body (e.g., Earth)\n*   **$R$** = Radius of the body"
      }
    ],
    techniques: [
      {
        id: "g_t1",
        title: "Inverse Square Rule",
        content: "Remember that force drops off with the square of the distance. If you double the distance ($2r$), the force becomes one-quarter ($\\frac{1}{4}F$). If you triple it, it becomes one-ninth ($\\frac{1}{9}F$)."
      }
    ],
    samples: [
      {
        id: "g_s1",
        title: "Sample: Doubling the mass",
        content: "**Problem:** If the mass of one object is doubled, and the distance between two objects is kept the same, what happens to the gravitational force?\n\n**Solution:** Because $F \\propto m_1 m_2$, doubling one mass doubles the numerator, so the overall force doubles."
      }
    ],
    mistakes: [
      {
        id: "g_m1",
        title: "Distance parameter 'r'",
        content: "Students often use the distance between the *surfaces* of the objects. The $r$ in the formula is the distance between their **centers of mass**."
      }
    ]
  },
  "work-energy": {
    topicId: "work-energy",
    intro: "Work relates applied forces to displacement. Energy is the capacity to do work. They are two sides of the same coin.",
    principles: [
      {
        id: "w_p1",
        title: "Work-Energy Theorem",
        content: "The net work done on an object equals the change in its kinetic energy. Work is energy transfer."
      },
      {
        id: "w_p2",
        title: "Conservation of Energy",
        content: "In an isolated system, total energy remains constant. Energy transforms from potential to kinetic, but the sum stays the same."
      }
    ],
    formulas: [
      {
        id: "w_f1",
        title: "Work",
        content: "### $W = F \\cdot s \\cdot \\cos(\\theta)$\n\n*   **$F$** = Force\n*   **$s$** = Displacement\n*   **$\\theta$** = Angle between force and displacement vectors"
      },
      {
        id: "w_f2",
        title: "Kinetic & Potential Energy",
        content: "### $KE = \\frac{1}{2}mv^2$ and $PE = mgh$"
      }
    ],
    techniques: [
      {
        id: "w_t1",
        title: "Energy Before = Energy After",
        content: "For mechanics problems where only gravity/springs are acting, simply set $KE_i + PE_i = KE_f + PE_f$. It often solves problems much faster than finding forces and accelerations."
      }
    ],
    mistakes: [
      {
        id: "w_m1",
        title: "Angle in the Work Formula",
        content: "If you carry a heavy box horizontally, gravity does ZERO work, because the angle between displacement (horizontal) and gravity (downward) is 90 degrees, and $\\cos(90^\\circ) = 0$."
      }
    ]
  },
  "human-eye": {
    topicId: "human-eye",
    intro: "The human eye is essentially an organic camera, using lenses to focus light onto the retina, which our brain interprets as images.",
    principles: [
      {
        id: "eye_p1",
        title: "Power of Accommodation",
        content: "The ability of the eye lens to adjust its focal length to clearly see objects at varying distances, accomplished by the ciliary muscles."
      },
      {
        id: "eye_p2",
        title: "Defects of Vision",
        content: "Myopia (nearsightedness - corrected with concave lens), Hypermetropia (farsightedness - corrected with convex lens), and Presbyopia (aging effect)."
      }
    ],
    formulas: [
      {
        id: "eye_f1",
        title: "Power of a Lens",
        content: "### $P = \\frac{1}{f(\\text{in meters})}$\n\n*   **$P$** = Power in Diopters (D)\n*   **$f$** = Focal length"
      }
    ],
    techniques: [
      {
        id: "eye_t1",
        title: "Tracing Ray Defects",
        content: "In Myopia, the eyeball is too elongated, so rays converge *in front* of the retina. A diverging (concave) lens is needed to spread them out before they enter the eye."
      }
    ],
    mistakes: [
      {
        id: "eye_m1",
        title: "Focal Length Units",
        content: "When calculating Power (Diopters), students often leave the focal length in centimeters. You MUST convert $f$ to meters first!"
      }
    ]
  },
  "magnetic-effects": {
    topicId: "magnetic-effects",
    intro: "Electricity and magnetism are intimately linked. Moving electric charges generate magnetic fields.",
    principles: [
      {
        id: "mag_p1",
        title: "Magnetic Field Lines",
        content: "Lines emerge from the North pole and enter the South pole. They are closed loops, and the field is strongest where lines are densest."
      },
      {
        id: "mag_p2",
        title: "Electromagnetism",
        content: "A current-carrying wire produces a magnetic field around it, following the Right-Hand Thumb Rule."
      }
    ],
    formulas: [
      {
        id: "mag_f1",
        title: "Lorentz Force (Charge)",
        content: "### $F = qvB\\sin(\\theta)$\n\n*   **$q$** = charge, **$v$** = velocity\n*   **$B$** = magnetic field strength\n*   **$\\theta$** = angle between velocity and B-field"
      }
    ],
    techniques: [
      {
        id: "mag_t1",
        title: "Fleming's Left-Hand Rule",
        content: "Used for motors. Thumb = Force (Motion), Forefinger = Magnetic Field (B), Middle Finger = Current (I). Align the fingers mutually perpendicular."
      }
    ],
    mistakes: [
      {
        id: "mag_m1",
        title: "Charge vs Current Direction",
        content: "Current (I) is defined as the flow of POSITIVE charge. If an electron (negative charge) moves right, the conventional current is to the left!"
      }
    ]
  },
  "electrostatics": {
    topicId: "electrostatics",
    intro: "Electrostatics deals with the forces, fields, and potentials arising from static (stationary) electric charges. When solving electrostatic problems involving geometric shapes, the key is mastering the Superposition Principle.",
    principles: [
      {
        id: "elst_p1",
        title: "Coulomb's Law",
        content: "Like charges repel; opposite charges attract. The force is proportional to the product of the charges and inversely proportional to the square of the distance between them."
      },
      {
        id: "elst_p2",
        title: "Electric Field",
        content: "A space around a charge where another charge experiences a force. Field lines radiate outward from positive charges and inward to negative ones."
      }
    ],
    formulas: [
      {
        id: "elst_f1",
        title: "Electric Force",
        content: "### $F = k \\frac{|q_1 q_2|}{r^2}$\n\nWhere $k$ is Coulomb's constant ($9 \\times 10^9 \\text{ N m}^2/\\text{C}^2$)."
      },
      {
        id: "elst_f2",
        title: "Electric Field Intensity",
        content: "### $E = \\frac{F}{q}$\n\nThe force experienced by a unit positive test charge."
      }
    ],
    techniques: [
      {
        id: "elst_t1",
        title: "Superposition Principle",
        content: "When multiple charges are present, find the force (or field) from each individual charge, then add them up as **Vectors**. The net force on any charge is simply the vector sum of the individual forces acting on it. Before doing any math, always draw a diagram and sketch the force arrows. If you can visually estimate where the net force should point, you'll immediately know if your final math is correct!"
      }
    ],
    samples: [
      {
        id: "elst_s1",
        title: "The Basic Triangle (Resultant Force)",
        content: "**The Problem:** Three identical positive charges, each of magnitude $+q$, are placed at the vertices (A, B, and C) of an equilateral triangle of side length $a$. Find the magnitude and direction of the net electrostatic force acting on the charge at vertex A.\n\n**Intuition Builder (The \"Push\" Model):** Imagine you are standing at vertex A. The charge at B is pushing you away (up and to the right), and the charge at C is also pushing you away (up and to the left). Because the pushes are identical in strength and symmetrical, your left/right movements cancel out. You will only be pushed straight up, exactly along the bisector of the angle. Concrete Example: If two friends push you with equal force from exactly opposite angles, you won't fall left or right; you'll stumble straight backward."
      },
      {
        id: "elst_s2",
        title: "Triangle System Equilibrium",
        content: "**The Problem:** Three identical charges $+q$ are fixed at the corners of an equilateral triangle of side $a$. A fourth unknown charge $Q$ is placed exactly at the centroid of the triangle. What must be the sign and magnitude of charge $Q$ so that the entire system is in static equilibrium?\n\n**Intuition Builder:** From Problem 1, we know the corner charges want to fly apart outward. To stop them, $Q$ must pull them inward. Therefore, $Q$ must be negative. It's closer to the corners than the corners are to each other (distance to centroid is $a/\\sqrt{3}$). Because electrostatic force gets exponentially stronger the closer you get (inverse-square law), $Q$ doesn't need to be as large as $+q$ to hold them together. Think of $Q$ as a central rubber band."
      },
      {
        id: "elst_s3",
        title: "The Rectangle (Concrete Vectors)",
        content: "**The Problem:** Four charges are placed at the corners of a 3cm x 4cm rectangle. Top-left (A): $+2\\mu\\text{C}$, Top-right (B): $-2\\mu\\text{C}$, Bottom-left (C): $+2\\mu\\text{C}$, Bottom-right (D): $-2\\mu\\text{C}$. Find the net force acting on a $+1\\mu\\text{C}$ test charge placed exactly at the center.\n\n**Intuition Builder (The Diagonal Pull):** The diagonal of a 3-4 rectangle is exactly 5 cm. The test charge at the center is positive. Top-left (+) pushes it away, and bottom-right (-) pulls it in. These two forces point in the exact same direction (down and to the right) and combine. The bottom-left (+) pushes it away, and top-right (-) pulls it in. These also combine (pointing up and to the right). The vertical forces will cancel, but the horizontal forces will stack up massively. The net force must be purely horizontal, pointing to the right."
      },
      {
        id: "elst_s4",
        title: "Combination Shape (The Hexagon Symmetry Hack)",
        content: "**The Problem:** Six points form a regular hexagon of side length $a$. Five identical positive charges $+q$ are placed at five of the vertices. The sixth vertex is left empty. Calculate the net electric field at the exact geometric center.\n\n**Intuition Builder (The \"Negative Space\" Trick):** If you calculate the field from all 5 charges, it will take a page of trigonometry. Instead, imagine what would happen if a 6th $+q$ charge was placed in the empty spot. The hexagon would be perfectly symmetrical. The \"pushes\" from opposite corners would perfectly cancel each other out, making the net field at the center exactly zero. Mathematically treat the \"missing\" charge as if it is a combination of two ghost charges: a $+q$ and a $-q$ occupying the same empty spot. The problem simplifies from adding 5 vectors to just calculating the field of a single $-q$ charge located at a distance $a$ from the center."
      }
    ],
    mistakes: [
      {
        id: "elst_m1",
        title: "Vector Addition Errors",
        content: "Electric Force and Electric Field are vectors. You must break them into X and Y components to add them properly. Electric Potential, however, is a scalar, so you can just add the numbers algebraically."
      }
    ]
  }
};

export function getConceptData(topicId: string, topicTitle: string): ConceptData {
  const aliasMap: Record<string, string> = {
    "current-electricity": "electricity",
    "optics": "light",
    "laws-of-motion": "force",
    "gravitation-11": "gravitation",
    "work-energy-power": "work-energy",
    "magnetism": "magnetic-effects"
  };
  
  const mappedId = aliasMap[topicId] || topicId;

  if (conceptDatabase[mappedId]) {
    return conceptDatabase[mappedId];
  }
  
  // Generic Fallback
  return {
    topicId,
    intro: `Welcome to the study of ${topicTitle}. This topic covers essential principles that build our understanding of the physical world.`,
    principles: [
      { 
        id: "gen_p1", 
        title: "Core Fundamentals", 
        content: "Every physics topic builds on foundational properties and definitions. Ensure you understand the base units and definitions perfectly before attempting complex problems." 
      }
    ],
    formulas: [
      { 
        id: "gen_f1", 
        title: "Key Governing Equations", 
        content: "Formulas will be provided linking the core variables of this topic." 
      }
    ],
    techniques: [
      { 
        id: "gen_t1", 
        title: "Dimensional Analysis", 
        content: "Always check your units! The left side of an equation must always evaluate to the exact same base units as the right side. This is the fastest way to check if an equation you derived is fundamentally flawed." 
      }
    ],
    mistakes: [
      { 
        id: "gen_m1", 
        title: "Unit Conversion Errors", 
        content: "A massive number of simple exam mistakes come from forgetting to convert km/h to m/s, or grams to kilograms before calculating. Always work in standard S.I. units unless explicitly told otherwise." 
      }
    ]
  };
}
