import * as LucideIcons from "lucide-react";
import EnvelopeCustomIcon from "./EnvelopeCustomIcon";

const iconMap = {
  // Mappa le tue icone personalizzate con nomi a tua scelta
  envelope: EnvelopeCustomIcon,
  "logo-app": EnvelopeCustomIcon,
  // Puoi aggiungere quante icone vuoi
};

export default function ChallengeIcon({
  iconName,
  color,
  filter = "none",
  size = 24,
  className,
}) {
  // 1. Controlla prima nella tua mappa personalizzata
  let IconComponent = iconMap[iconName];

  // 2. Se non è lì, cercala in Lucide
  if (!IconComponent) {
    const toPascalCase = (str) => {
      return str
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join("");
    };
    const pascalName = toPascalCase(iconName);
    IconComponent = LucideIcons[pascalName] || LucideIcons.Mail;
  }

  return (
    <IconComponent
      color={color}
      filter={filter}
      size={size}
      className={className}
      strokeWidth={1.5}
    />
  );
}
