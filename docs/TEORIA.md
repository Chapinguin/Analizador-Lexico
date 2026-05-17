# Teoría del Analizador Léxico y Sintáctico

Este documento resume los conceptos fundamentales del análisis léxico y sintáctico, tal como se implementan en este proyecto.

## ¿Qué es el Análisis Léxico? (Capítulo 1)
El **análisis léxico** es la primera fase del compilador. Lee el código fuente carácter por carácter, agrupa los caracteres en unidades significativas llamadas **lexemas**, y les asigna una categoría llamada **token**.

El proceso sigue 4 pasos:
1. **Texto fuente**: Ej. `int x = 10;`
2. **Agrupación**: Identificar palabras y símbolos.
3. **Clasificación**: Asignar tipo a cada grupo.
4. **Flujo de tokens**: Salida hacia el parser.

---

## Conceptos Fundamentales

- **Lexema**: Secuencia concreta de caracteres en el código fuente. Ejemplo: `int`, `edad`, `=`, `20`, `;`.
- **Token**: Par (categoría, valor). Representa la clasificación del lexema. Ejemplo: `<KEYWORD, int>`, `<ID, edad>`, `<NUM, 20>`.
- **Patrón**: Regla que define qué cadenas corresponden a un tipo de token. Se expresan mediante **expresiones regulares**.
- **Tabla de Símbolos**: Estructura donde se almacenan los identificadores y sus atributos (tipo, valor, scope).

---

## Base Formal: Expresiones Regulares y DFA (Capítulo 2)

### Expresiones Regulares
Definen el **patrón** de cada tipo de token. Son la especificación formal de lo que el analizador léxico debe reconocer.
- **Identificador**: `[a-zA-Z_][a-zA-Z0-9_]*`
- **Entero**: `[0-9]+`
- **Decimal**: `[0-9]+\.[0-9]+`
- **Cadena**: `"[^"]*"`

### Autómata Finito Determinista (DFA)
Un DFA es un modelo computacional que reconoce si una cadena pertenece al lenguaje de un patrón. Tiene:
- **Estados**: nodos del autómata (q0, q1, q2...).
- **Transiciones**: cambios de estado según el carácter leído.
- **Estado inicial**: punto de entrada (q0).
- **Estados de aceptación**: indican token reconocido.
Cada expresión regular se convierte en un DFA que el analizador léxico ejecuta sobre la entrada.

---

## Tipos de Tokens

| Tipo de Token | Ejemplo | Descripción |
| --- | --- | --- |
| **Palabras reservadas** | `int`, `float`, `if`, `while`, `return` | Términos definidos por el lenguaje |
| **Identificadores** | `edad`, `promedio`, `nombre` | Nombres definidos por el programador |
| **Números enteros** | `0`, `5`, `100`, `-3` | Constantes numéricas sin parte decimal |
| **Números decimales** | `3.14`, `9.5`, `0.001` | Constantes de punto flotante |
| **Cadenas** | `"Hola"`, `"Ana"` | Secuencias de caracteres entre comillas dobles |
| **Operadores aritméticos** | `+`, `-`, `*`, `/` | Realizan operaciones matemáticas |
| **Operadores relacionales** | `>`, `<`, `>=`, `<=`, `==`, `!=` | Comparan dos valores; retornan booleano |
| **Operadores lógicos** | `&&`, `||`, `!` | Operaciones de lógica booleana |
| **Delimitadores** | `;`, `,`, `(`, `)`, `{`, `}` | Separan o agrupan elementos del programa |

---

## Análisis Sintáctico y Gramáticas (Capítulo 3)

### Gramáticas Formales y Recursión Izquierda
Una gramática define la **estructura sintáctica** de un lenguaje mediante reglas de producción. Se compone de: terminales (tokens), no-terminales, reglas de producción y símbolo inicial. El análisis léxico provee los tokens que el análisis sintáctico usa para verificar que el programa siga la gramática.

- **Problema**: Las gramáticas con **recursión izquierda** (ej. `E -> E + T | T`) no son válidas para parsers LL(1).
- **Solución**: Transformar eliminando la recursión izquierda (ej. `E -> T E'`, `E' -> + T E' | ε`). Esta transformación permite que el parser prediga la siguiente producción usando solo el token actual, sin retroceder.

### Gramática de MiniLang
MiniLang es un lenguaje didáctico simplificado. Su gramática libre de contexto define las construcciones válidas:
- **Estructura del Programa**: `<programa> ::= <sentencias>`, `<sentencias> ::= <sentencia> <sentencias> | ε`
- **Declaración y Asignación**: `<declaracion> ::= <tipo> ID "=" <expr> ";"`, `<asignacion> ::= ID "=" <expr> ";"`
- **Condicional y Ciclo**: `<condicional> ::= "if" "(" <cond> ")" "{" <sentencias> "}" <else_opt>`, `<ciclo> ::= "while" "(" <cond> ")" "{" <sentencias> "}"`
- **Impresión**: `<impresion> ::= "print" "(" <expr> ")" ";"`

### Expresiones sin Recursión Izquierda
Las expresiones aritméticas en MiniLang están definidas de forma que el parser LL(1) pueda procesarlas sin ambigüedad ni retroceso:
- **Precedencia de operadores**: `<term>` maneja `*` y `/` (mayor precedencia); `<expr>` maneja `+` y `-` (menor precedencia).
- **Asociatividad izquierda**: La producción iterativa `<expr'>` garantiza que `a + b + c` se evalúe de izquierda a derecha.
- **Compatibilidad LL(1)**: No hay recursión izquierda, por lo que el parser puede predecir cada producción con un solo token de anticipación.
