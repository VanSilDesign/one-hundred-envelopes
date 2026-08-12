import { useRef } from "react";
import { Pencil, User } from "lucide-react";
import "./ImagePicker.css";

export function ImagePicker({ previewUrl, onImageSelect }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Quando clicchi sulla matita, simuli il click sull'input file
    fileInputRef.current.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("immagine:", file);
    
    if(file) {
      onImageSelect(file); // Passiamo il file grezzo al genitore (EditProfile)
    }
  }
  return (
    <div id="image-picker">
      <div 
        className="image-picker-placeholder"
        style={{
          backgroundImage: previewUrl ? `url("${previewUrl}")` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button type="button" className="select-image" onClick={handleButtonClick}>
          <Pencil size={18} />
        </button>

        {/* Input vero nascosto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
