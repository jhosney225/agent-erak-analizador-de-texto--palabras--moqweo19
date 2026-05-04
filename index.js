
```javascript
const readline = require('readline');
const fs = require('fs');

// Crear interfaz de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para analizar texto
function analizarTexto(texto) {
  // Validar entrada
  if (!texto || typeof texto !== 'string') {
    return { error: 'El texto debe ser una cadena válida' };
  }

  // Limpieza básica del texto
  const textoLimpio = texto.trim();
  
  // Contar caracteres
  const totalCaracteres = textoLimpio.length;
  const caracteresEnLetra = textoLimpio.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ]/g, '').length;

  // Dividir en palabras
  const palabras = textoLimpio
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(palabra => palabra.length > 0);
  
  const totalPalabras = palabras.length;

  // Contar palabras únicas
  const palabrasUnicas = new Set(palabras);
  const totalPalabrasUnicas = palabrasUnicas.size;

  // Dividir en oraciones (por . ! ?)
  const oraciones = textoLimpio
    .split(/[.!?]+/)
    .map(o => o.trim())
    .filter(o => o.length > 0);
  
  const totalOraciones = oraciones.length;

  // Calcular longitud promedio de palabras
  const longitudPromedioPalabras = totalPalabras > 0 
    ? (totalCaracteres / totalPalabras).toFixed(2) 
    : 0;

  // Calcular longitud promedio de oraciones
  const longitudPromedioOraciones = totalOraciones > 0 
    ? (totalPalabras / totalOraciones).toFixed(2) 
    : 0;

  // Palabras más frecuentes
  const frecuenciaPalabras = {};
  palabras.forEach(palabra => {
    // Filtrar palabras muy cortas (menos de 3 caracteres)
    if (palabra.length >= 3) {
      frecuenciaPalabras[palabra] = (frecuenciaPalabras[palabra] || 0) + 1;
    }
  });

  const palabrasMasFrecuentes = Object.entries(frecuenciaPalabras)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([palabra, frecuencia]) => ({ palabra, frecuencia }));

  // Contar espacios en blanco
  const espacios = (textoLimpio.match(/\s/g) || []).length;

  // Contar números
  const numeros = (textoLimpio.match(/\d/g) || []).length;

  // Contar puntuación
  const puntuacion = (textoLimpio.match(/[.!?,;:()[\]{}]/g) || []).length;

  // Párrafos
  const parrafos = textoLimpio
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0);
  
  const totalParrafos = parrafos.length;

  return {
    resumen: {
      totalCaracteres,
      caracteresEnLetra,
      totalPalabras,
      totalPalabrasUnicas,
      totalOraciones,
      totalParrafos,
      espacios,
      numeros,
      puntuacion
    },
    promedios: {
      longitudPromedioPalabras: parseFloat(longitudPromedioPalabras),
      longitudPromedioOraciones: parseFloat(longitudPromedioOraciones)
    },
    palabrasMasFrecuentes,
    primerasOraciones: oraciones.slice(0, 3),
    densidadLexical: ((totalPalabrasUnicas / totalPalabras) * 100).toFixed(2) + '%'
  };
}

// Función para formatear resultados
function formatearResultados(analisis) {
  if (analisis.error) {
    return `Error: ${analisis.error}`;
  }

  let resultado = '\n' + '='.repeat(60) + '\n';
  resultado += '📊 ANÁLISIS DE TEXTO\n';
  resultado += '='.repeat(60) + '\n\n';

  resultado += '📈 RESUMEN GENERAL\n';
  resultado += '-'.repeat(40) + '\n';
  resultado += `  Total de caracteres:      ${analisis.resumen.totalCaracteres}\n`;
  resultado += `  Caracteres en letra:      ${analisis.resumen.caracteresEnLetra}\n`;
  resultado += `  Total de palabras:        ${analisis.resumen.totalPalabras}\n`;
  resultado += `  Palabras únicas:          ${analisis.resumen.totalPalabrasUnicas}\n`;
  resultado += `  Densidad léxica:          ${analisis.densidadLexical}\n`;
  resultado += `  Oraciones:                ${analisis.resumen.totalOraciones}\n`;
  resultado += `  Párrafos:                 ${analisis.resumen.totalParrafos}\n`;
  resultado += `  Espacios en blanco:       ${analisis.resumen.espacios}\n`;
  resultado += `  Números encontrados:     ${analisis.resumen.numeros}\n`;
  resultado += `  Signos de puntuación:     ${analisis.resumen.puntuacion}\n\n`;

  resultado += '📏 PROMEDIOS\n';
  resultado += '-'.repeat(40) + '\n';
  resultado += `  