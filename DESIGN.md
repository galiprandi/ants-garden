# Design System - Ants Garden

## Visual Identity

The Ants Garden design system is inspired by nature and the organic feel of an ant colony. It uses a palette of greens, ambers, and earth tones to create a soothing and immersive experience.

### Color Palette

- **Primary (Emerald)**: Used for main actions, headings, and accents. Represents growth and life.
  - Emerald 600: `#059669` (Primary Buttons)
  - Emerald 900: `#064e3b` (Headings)
  - Emerald 50: `#ecfdf5` (Light backgrounds)
- **Secondary (Amber)**: Used for subtle accents and highlights. Represents warmth and sunlight.
  - Amber 100: `#fef3c7` (Glow effects)
- **Backgrounds**:
  - Light Gray/Green: `#f0f4f0`
  - Subtle dot pattern: `radial-gradient(#e2e8f0 1px, transparent 1px)`

### Typography

- **Headings**: Bold, tight tracking, high contrast.
- **Body**: Clean, readable sans-serif.

### Components

#### Cards
- Rounded corners: `rounded-3xl`
- Glassmorphism: `bg-white/80 backdrop-blur-md`
- Borders: Subtle emerald borders (`border-emerald-100`)
- Shadows: Soft, colored shadows (`shadow-[0_20px_50px_rgba(16,185,129,0.15)]`)

#### Buttons
- Rounded corners: `rounded-xl`
- Hover state: Background color change and subtle shadow increase.
- Active state: Slight scale down (`active:scale-[0.98]`).
- Interaction: Shine effect on hover.

#### Sudoku Gameplay
- **Cell Selection**: Selected cells highlighted with emerald 200/90 background and inner shadow
- **Related Cells**: Same row/column/subgrid highlighted with emerald 50/40 background
- **Matching Values**: Cells with same value as selected cell highlighted with amber 100/70 background and pulse animation
- **Fixed Cells**: Pre-filled cells cannot be modified, appear with slate-800/extrabold text
- **Error State**: Invalid entries show rose-50/80 background with rose-600 text
- **Win State**: Correct completion shows celebratory message with emerald 50/90 background
- **Number Pad**: On-screen input uses emerald 50/80 background with hover states
- **Note-taking Mode**:
  - Toggle button: Shows ✏️ when active, 🔢 when inactive
  - Inactive state: Subtle emerald 50/80 background with hover effect
  - Active state: Prominent emerald 200/90 background with shadow
  - Number pad in note-taking mode: Softer emerald 50/60 background for active notes
  - Cell styling in note-taking mode: 
    - Cells with notes: Light emerald 50/60 background
    - Empty cells: Very light emerald 50/30 background
    - Hover states: Enhanced feedback with emerald 100/50 background
  - Visual feedback: Notes appear with smooth transitions and hover effects
