export function parseCode(tokens) {
  let currentTokenIndex = 0;
  let currentToken = tokens[currentTokenIndex] || null;

  function advance() {
    currentTokenIndex++;
    currentToken = tokens[currentTokenIndex] || null;
  }

  function matchTokenLexeme(expectedLexeme) {
    if (currentToken && currentToken.lexeme === expectedLexeme) {
      advance();
      return true;
    }
    return false;
  }

  function matchTokenType(expectedType) {
    if (currentToken && currentToken.type === expectedType) {
      advance();
      return true;
    }
    return false;
  }

  function error(expectedMessage) {
    const got = currentToken ? `'${currentToken.lexeme}'` : "fin de código inesperado";
    const line = currentToken ? currentToken.line : (tokens.length > 0 ? tokens[tokens.length - 1].line : 1);
    throw new Error(`Línea ${line}: Se esperaba ${expectedMessage}, pero se encontró ${got}.`);
  }

  // <programa> ::= <sentencias>
  function programa() {
    sentencias();
    if (currentToken !== null) {
      error("fin de código o sentencia válida");
    }
  }

  // <sentencias> ::= <sentencia> <sentencias> | ε
  function sentencias() {
    while (currentToken !== null && currentToken.lexeme !== '}') {
      sentencia();
    }
  }

  // <sentencia> ::= <declaracion> | <asignacion> | <condicional> | <ciclo> | <impresion>
  function sentencia() {
    if (!currentToken) return;

    if (currentToken.type === 'KEYWORD') {
      const lex = currentToken.lexeme;
      if (lex === 'int' || lex === 'float' || lex === 'string' || lex === 'bool') {
        declaracion();
      } else if (lex === 'if') {
        condicional();
      } else if (lex === 'while') {
        ciclo();
      } else if (lex === 'print') {
        impresion();
      } else if (lex === 'return') {
        advance();
        expr();
        if (!matchTokenLexeme(';')) error("';' al final del return");
      } else {
        error("una sentencia válida");
      }
    } else if (currentToken.type === 'IDENTIFIER') {
      asignacion();
    } else {
      error("una declaración, asignación, if, while o print");
    }
  }

  // <declaracion> ::= <tipo> ID "=" <expr> ";"
  function declaracion() {
    advance(); // Consumir tipo
    if (!matchTokenType('IDENTIFIER')) error("el nombre de la variable (identificador)");
    if (!matchTokenType('ASSIGN_OP')) error("el operador de asignación '='");
    expr();
    if (!matchTokenLexeme(';')) error("un punto y coma ';' al final de la declaración");
  }

  // <asignacion> ::= ID "=" <expr> ";"
  function asignacion() {
    advance(); // Consumir ID
    if (!matchTokenType('ASSIGN_OP')) error("el operador de asignación '='");
    expr();
    if (!matchTokenLexeme(';')) error("un punto y coma ';' al final de la asignación");
  }

  // <condicional> ::= "if" "(" <cond> ")" "{" <sentencias> "}" <else_opt>
  function condicional() {
    advance(); // Consumir 'if'
    if (!matchTokenLexeme('(')) error("abrir paréntesis '('");
    cond();
    if (!matchTokenLexeme(')')) error("cerrar paréntesis ')'");
    if (!matchTokenLexeme('{')) error("abrir llaves '{'");
    sentencias();
    if (!matchTokenLexeme('}')) error("cerrar llaves '}'");
    
    // <else_opt> ::= "else" "{" <sentencias> "}" | ε
    if (currentToken && currentToken.type === 'KEYWORD' && currentToken.lexeme === 'else') {
      advance();
      if (!matchTokenLexeme('{')) error("abrir llaves '{' para el bloque else");
      sentencias();
      if (!matchTokenLexeme('}')) error("cerrar llaves '}' para el bloque else");
    }
  }

  // <ciclo> ::= "while" "(" <cond> ")" "{" <sentencias> "}"
  function ciclo() {
    advance(); // Consumir 'while'
    if (!matchTokenLexeme('(')) error("abrir paréntesis '('");
    cond();
    if (!matchTokenLexeme(')')) error("cerrar paréntesis ')'");
    if (!matchTokenLexeme('{')) error("abrir llaves '{'");
    sentencias();
    if (!matchTokenLexeme('}')) error("cerrar llaves '}'");
  }

  // <impresion> ::= "print" "(" <expr> ")" ";"
  function impresion() {
    advance(); // Consumir 'print'
    if (!matchTokenLexeme('(')) error("abrir paréntesis '('");
    expr();
    if (!matchTokenLexeme(')')) error("cerrar paréntesis ')'");
    if (!matchTokenLexeme(';')) error("un punto y coma ';' al final de la impresión");
  }

  // <cond> ::= <expr> RELATIONAL_OP <expr>
  function cond() {
    expr();
    if (matchTokenType('RELATIONAL_OP')) {
      expr();
    } else {
      error("un operador relacional (==, !=, >, <, >=, <=) para la condición");
    }
  }

  // <expr> ::= <term> <expr'>
  function expr() {
    term();
    exprPrime();
  }

  // <expr'> ::= "+" <term> <expr'> | "-" <term> <expr'> | ε
  function exprPrime() {
    if (currentToken && currentToken.type === 'ARITHMETIC_OP' && (currentToken.lexeme === '+' || currentToken.lexeme === '-')) {
      advance();
      term();
      exprPrime();
    }
  }

  // <term> ::= <factor> <term'>
  function term() {
    factor();
    termPrime();
  }

  // <term'> ::= "*" <factor> <term'> | "/" <factor> <term'> | ε
  function termPrime() {
    if (currentToken && currentToken.type === 'ARITHMETIC_OP' && (currentToken.lexeme === '*' || currentToken.lexeme === '/')) {
      advance();
      factor();
      termPrime();
    }
  }

  // <factor> ::= ID | NUM | "(" <expr> ")"
  function factor() {
    if (matchTokenType('IDENTIFIER') || matchTokenType('INTEGER_LITERAL') || matchTokenType('DECIMAL_LITERAL') || matchTokenType('STRING_LITERAL')) {
      return;
    } else if (matchTokenLexeme('(')) {
      expr();
      if (!matchTokenLexeme(')')) error("cerrar paréntesis ')' en la expresión");
    } else {
      error("un identificador, un número o abrir paréntesis '('");
    }
  }

  try {
    // 1. Revisar si hay errores léxicos primero
    const lexicalError = tokens.find(t => t.type === 'LEXICAL_ERROR');
    if (lexicalError) {
      return { 
        success: false, 
        error: `Error Léxico en línea ${lexicalError.line}: Carácter no válido '${lexicalError.lexeme}'` 
      };
    }

    if (tokens.length === 0) {
      return { success: true, message: "Sin código" };
    }

    // 2. Iniciar el parseo descendente recursivo (LL1)
    programa();
    return { 
      success: true, 
      message: "¡Análisis Sintáctico Exitoso! La estructura del código cumple con la gramática de MiniLang." 
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
