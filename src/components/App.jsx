import { useState } from 'react';
import './App.css';
import { analyzeCode } from '../utils/analyzer';
import { parseCode } from '../utils/parser';

function App() {
  const [code, setCode] = useState('');
  const [tokens, setTokens] = useState([]);
  const [parseResult, setParseResult] = useState(null);

  const loadExample = (exampleType) => {
    const examples = {
      basico: `int edad = 20;\nfloat promedio = 9.5;\nstring nombre = "Sebastian";\nprint(edad);`,
      condicional: `int x = 10;\nint y = 20;\nif (x < y) {\n  print(x);\n} else {\n  print(y);\n}`,
      ciclo: `int contador = 0;\nwhile (contador < 5) {\n  print(contador);\n  contador = contador + 1;\n}`,
      error: `int x = 10\nfloat promedio = 9.5;`
    };
    setCode(examples[exampleType] || '');
    setTokens([]);
    setParseResult(null);
  };

  const handleClear = () => {
    setCode('');
    setTokens([]);
    setParseResult(null);
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target.result;
      if (text.length > 1000) {
        alert(`⚠️ El archivo es demasiado largo (${text.length} caracteres). Se ha recortado a los primeros 1000 caracteres para garantizar un rendimiento óptimo.`);
        text = text.substring(0, 1000);
      }
      setCode(text);
      setTokens([]);
      setParseResult(null);
    };
    reader.readAsText(file);
    
    // Resetear el valor del input para poder volver a cargar el mismo archivo si se edita afuera
    event.target.value = '';
  };

  const handleDownloadCSV = () => {
    if (tokens.length === 0) return;

    // Cabeceras y filas del archivo CSV
    const headers = ['Linea', 'Lexema', 'Token (Categoria)', 'Descripcion'];
    const rows = tokens.map(t => [
      t.line,
      `"${t.lexeme.replace(/"/g, '""')}"`, // escapar comillas dobles
      `"${t.type}"`,
      `"${t.description}"`
    ]);

    const csvContent = "\uFEFF" + [ // \uFEFF añade la marca BOM para corregir tildes/eñes en Excel
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analisis_lexico_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnalyze = () => {
    if (!code.trim()) {
      setTokens([]);
      setParseResult(null);
      return;
    }

    const newTokens = analyzeCode(code);
    setTokens(newTokens);

    const result = parseCode(newTokens);
    setParseResult(result);
  };

  return (
    <div className="app-container">
      <div className="side-frame-left"></div>
      <div className="side-frame-right"></div>
      
      {/* Contenedor de esferas de neón flotantes (animadas por hardware) */}
      <div className="bg-glow-container">
        <div className="glow-orb orb-indigo"></div>
        <div className="glow-orb orb-cyan"></div>
        <div className="glow-orb orb-violet"></div>
      </div>
      
      <header className="header">
        <div className="title-cloud">
          <h1>Analizador Léxico</h1>
          <svg className="sparkle-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
            <defs>
              <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <path d="M12 2C12 2 12 9 19 12C12 15 12 22 12 22C12 22 12 15 5 12C12 9 12 2 12 2Z" fill="url(#sparkle-gradient)" />
            <path d="M19 4C19 4 19 7 22 8.5C19 10 19 13 19 13C19 13 19 10 16 8.5C19 7 19 4 19 4Z" fill="url(#sparkle-gradient)" />
            <path d="M6 18C6 18 6 19.5 8 20.5C6 21.5 6 23 6 23C6 23 6 21.5 4 20.5C6 19.5 6 18 6 18Z" fill="url(#sparkle-gradient)" />
          </svg>
        </div>
        <p>Motor de análisis basado en Autómatas Finitos Deterministas</p>
      </header>

      <main className="glass-panel editor-section">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="terminal-title">editor.minilang</div>
          <div style={{ width: '52px' }}></div> {/* Balanceador espacial */}
        </div>

        <textarea
          className="code-input"
          placeholder="Escribe tu código fuente aquí (ej. int x = 10;)..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={1000}
        />
        
        <div className="editor-controls">
          <div className="quick-examples">
            <span className="examples-label">Ejemplos:</span>
            <button className="example-tag-btn" onClick={() => loadExample('basico')}>📄 Básico</button>
            <button className="example-tag-btn" onClick={() => loadExample('condicional')}>🔀 Condicional</button>
            <button className="example-tag-btn" onClick={() => loadExample('ciclo')}>🔁 Bucle</button>
            <button className="example-tag-btn error-tag" onClick={() => loadExample('error')}>⚠️ Con Error</button>
          </div>
          
          <div className="action-buttons">
            <input
              type="file"
              id="file-import-input"
              accept=".txt,.minilang,.json,.cpp,.java,.c"
              style={{ display: 'none' }}
              onChange={handleImportFile}
            />
            <button className="import-btn" onClick={() => document.getElementById('file-import-input').click()} title="Importar archivo de código (.txt, .minilang)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Importar
            </button>
            <button className="clear-btn" onClick={handleClear} title="Limpiar editor">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Limpiar
            </button>
            <button className="analyze-btn" onClick={handleAnalyze}>
              Analizar Código
            </button>
          </div>
        </div>
        
        <div className="character-counter-row">
          <span style={{ fontSize: '0.85rem', color: code.length === 1000 ? '#ef4444' : '#94a3b8' }}>
            {code.length} / 1000 caracteres
          </span>
        </div>
      </main>

      <section className="glass-panel results-section">
        <div className="results-header">
          <div className="results-title-group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8b5cf6'}}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <h2>Resultados del Análisis</h2>
            {tokens.length > 0 && (
              <span className="token-counter-badge">
                {tokens.length} {tokens.length === 1 ? 'Token' : 'Tokens'}
              </span>
            )}
          </div>
          
          {tokens.length > 0 && (
            <button className="csv-download-btn" onClick={handleDownloadCSV} title="Descargar reporte en formato Excel/CSV">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Exportar CSV
            </button>
          )}
        </div>

        {parseResult && (
          <div className={`parser-result ${parseResult.success ? 'parser-success' : 'parser-error'}`}>
            <div className="parser-icon">
              {parseResult.success ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              )}
            </div>
            <div className="parser-message">
              <strong>{parseResult.success ? 'Sintaxis Válida' : 'Error de Sintaxis'}</strong>
              <p>{parseResult.success ? parseResult.message : parseResult.error}</p>
            </div>
          </div>
        )}
        
        {tokens.length > 0 ? (
          <div className="table-wrapper">
            <table className="tokens-table">
              <thead>
                <tr>
                  <th>Línea</th>
                  <th>Lexema</th>
                  <th>Token (Categoría)</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr key={index}>
                    <td style={{ color: '#64748b', fontWeight: '500' }}>{token.line}</td>
                    <td><span style={{ fontFamily: 'monospace', color: '#f8fafc', fontSize: '1.05rem' }}>{token.lexeme}</span></td>
                    <td><span className={`token-badge badge-${token.type.toLowerCase()}`}>{token.type}</span></td>
                    <td><span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>{token.description}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            Ingresa código fuente y presiona "Analizar Código" para visualizar el flujo de tokens.
          </div>
        )}
      </section>

      <footer className="footer">
        <a href="https://github.com/Chapinguin/Analizador-Lexico" target="_blank" rel="noopener noreferrer" className="repo-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          Repositorio del Proyecto
        </a>
        <div>
          Desarrollado por{' '}
          <a href="https://github.com/Chapinguin" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', color: '#a78bfa', margin: '0 0.2rem'}}>Chapinguin</a> 
          {' '}&amp;{' '}
          <a href="https://github.com/guco-17" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', color: '#60a5fa', margin: '0 0.2rem'}}>guco-17</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
