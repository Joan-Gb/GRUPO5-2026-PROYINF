import { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRScanner = ({ onDataScanned }) => {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'spa', // Idioma español
        { logger: m => console.log(m) }
      );
      
      console.log("Texto detectado:", text);

      // Lógica simple para buscar un RUT en el texto (ej: 12.345.678-9)
      // Esta expresión regular busca patrones de RUT chilenos
      const rutRegex = /(\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK])/g;
      const found = text.match(rutRegex);

      if (found && found.length > 0) {
        // Limpiamos el RUT (quitamos puntos) y se lo pasamos al padre
        const rutLimpio = found[0].replace(/\./g, '');
        onDataScanned(rutLimpio);
        alert(`RUT detectado: ${rutLimpio}`);
      } else {
        alert("No se pudo detectar un RUT claro en la imagen.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al escanear la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px dashed #ccc', padding: '10px', margin: '10px 0' }}>
      <p>📷 <b>Autocompletar con Cédula (Beta)</b></p>
      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
      {loading && <p>Procesando imagen... (esto puede tardar unos segundos)</p>}
    </div>
  );
};

export default OCRScanner;