import { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [tokens, setTokens] = useState([]);

  const handleAnalyze = () => {
    // Por ahora, simularemos unos tokens como prueba de concepto para la UI
    // Más adelante conectaremos esto con la lógica real del analizador
    if (!code.trim()) {
      setTokens([]);
      return;
    }

    const mockTokens = [
      { lexeme: 'int', type: 'Palabra Reservada', line: 1 },
      { lexeme: 'x', type: 'Identificador', line: 1 },
      { lexeme: '=', type: 'Operador Asignación', line: 1 },
      { lexeme: '5', type: 'Número Entero', line: 1 },
      { lexeme: ';', type: 'Símbolo', line: 1 },
    ];
    setTokens(mockTokens);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Analizador Léxico</h1>
        <p>Escribe tu código y descubre los componentes léxicos</p>
      </header>

      <main className="glass-panel editor-section">
        <textarea
          className="code-input"
          placeholder="Escribe tu código fuente aquí..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="analyze-btn" onClick={handleAnalyze}>
          Analizar Código
        </button>
      </main>

      <section className="glass-panel results-section">
        <h2>Tabla de Tokens</h2>
        
        {tokens.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="tokens-table">
              <thead>
                <tr>
                  <th>Línea</th>
                  <th>Lexema</th>
                  <th>Tipo de Token</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr key={index}>
                    <td>{token.line}</td>
                    <td><span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>{token.lexeme}</span></td>
                    <td><span className="token-badge">{token.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            Ingresa algo de código y presiona "Analizar Código" para ver los resultados.
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
