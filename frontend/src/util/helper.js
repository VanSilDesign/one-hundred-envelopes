export function getCleanFileName (path) {
  if (!path) return "";

  // 1. Prende solo l'ultima parte del percorso (es. "/uploads/avatars/1723392000000-avatar-foto.png" -> "1723392000000-avatar-foto.png")
  let filename = path.split("/").pop();

  // 2. Rimuove prefissi "avatar-", "avatar_" o solo "avatar"
  filename = filename.replace(/^avatar[-_]?/i, "");

  // 3. Rimuove eventuali timestamp o ID numerici iniziali (es. "1723392000000-")
  filename = filename.replace(/^\d+[-_]?/, "");

  // 4. Rimuove l'estensione (.png, .jpg, ecc.)
  filename = filename.replace(/\.[^/.]+$/, "");

  return filename;
};