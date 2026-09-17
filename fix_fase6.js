import fs from 'fs';
const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase6_Planteamiento.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix imports
content = content.replace(
  "import { Bot, MapPin, Target, Lightbulb } from 'lucide-react';",
  "import { Bot, MapPin, Target, Lightbulb, CheckCircle2 } from 'lucide-react';"
);
content = content.replace(
  "import { Bot, MapPin, Target, Lightbulb, CheckCircle2 } from 'lucide-react';",
  "import { Bot, MapPin, Target, Lightbulb, CheckCircle } from 'lucide-react';"
);

// Replace CheckCircle2 with CheckCircle in JSX
content = content.replace(/<CheckCircle2/g, '<CheckCircle');

fs.writeFileSync(file, content);
console.log('Fixed Fase6');
