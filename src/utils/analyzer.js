export function analyzeCode(code) {
  const tokens = [];
  const lines = code.split('\n');

  // Patrones regulares basados en la teoría del proyecto
  const patterns = [
    { type: 'KEYWORD', regex: /^(int|float|if|while|return)\b/ },
    { type: 'DECIMAL_LITERAL', regex: /^[0-9]+\.[0-9]+\b/ },
    { type: 'INTEGER_LITERAL', regex: /^[0-9]+\b/ },
    { type: 'STRING_LITERAL', regex: /^"[^"]*"/ },
    { type: 'IDENTIFIER', regex: /^[a-zA-Z_][a-zA-Z0-9_]*\b/ },
    { type: 'RELATIONAL_OP', regex: /^(==|!=|>=|<=|>|<)/ },
    { type: 'LOGICAL_OP', regex: /^(&&|\|\||!)/ },
    { type: 'ASSIGN_OP', regex: /^=(?!=)/ }, // Evitar que '==' sea atrapado como '='
    { type: 'ARITHMETIC_OP', regex: /^(\+|-|\*|\/)/ },
    { type: 'SEMICOLON', regex: /^;/ },
    { type: 'DELIMITER', regex: /^(,|\(|\)|\{|\})/ },
    { type: 'SPACE', regex: /^\s+/ },
  ];

  for (let i = 0; i < lines.length; i++) {
    // Remover comentarios simples "//" de la línea
    let lineContent = lines[i];
    const commentIndex = lineContent.indexOf('//');
    if (commentIndex !== -1) {
        lineContent = lineContent.substring(0, commentIndex);
    }

    while (lineContent.length > 0) {
      let matched = false;

      for (const pattern of patterns) {
        const match = lineContent.match(pattern.regex);
        if (match) {
          const lexeme = match[0];
          // Solo guardamos el token si no es un espacio en blanco
          if (pattern.type !== 'SPACE') {
            tokens.push({
              line: i + 1,
              lexeme: lexeme,
              type: pattern.type,
              description: getDescription(pattern.type)
            });
          }
          lineContent = lineContent.substring(lexeme.length);
          matched = true;
          break;
        }
      }

      // Si no coincide con nada, es un error léxico
      if (!matched) {
        tokens.push({
          line: i + 1,
          lexeme: lineContent[0],
          type: 'LEXICAL_ERROR',
          description: 'Carácter no reconocido (Error Léxico)'
        });
        lineContent = lineContent.substring(1);
      }
    }
  }

  return tokens;
}

function getDescription(type) {
  const map = {
    'KEYWORD': 'Palabra reservada del lenguaje',
    'IDENTIFIER': 'Nombre de variable definido por el usuario',
    'INTEGER_LITERAL': 'Constante entera',
    'DECIMAL_LITERAL': 'Constante de punto flotante',
    'STRING_LITERAL': 'Secuencias de caracteres',
    'ARITHMETIC_OP': 'Operador matemático',
    'RELATIONAL_OP': 'Operador de comparación',
    'LOGICAL_OP': 'Operador lógico',
    'ASSIGN_OP': 'Operador de asignación',
    'SEMICOLON': 'Delimitador de fin de sentencia',
    'DELIMITER': 'Separa o agrupa elementos',
    'LEXICAL_ERROR': 'Patrón no válido en el lenguaje'
  };
  return map[type] || 'Desconocido';
}
