# Teoría del Analizador Léxico

Este documento resume los conceptos fundamentales del análisis léxico, tal como se implementan en este proyecto.

## ¿Qué es el Análisis Léxico?
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
- **Patrón**: Regla que define qué cadenas corresponden a un tipo de token. Se expresan mediante **expresiones regulares**. Ejemplo: identificadores -> `[a-zA-Z_][a-zA-Z0-9_]*`
- **Tabla de Símbolos**: Estructura donde se almacenan los identificadores y sus atributos (tipo, valor, scope). El analizador léxico la alimenta conforme detecta tokens.

---

## Funciones del Analizador Léxico

- **Lectura carácter a carácter**: Procesa el flujo de entrada del programa fuente de forma secuencial, manteniendo un apuntador a la posición actual.
- **Agrupación en lexemas**: Aplica reglas (patrones) para agrupar caracteres en la unidad más larga posible que forme un lexema válido.
- **Clasificación en tokens**: Asigna la categoría correspondiente a cada lexema reconocido y lo envía al analizador sintáctico.
- **Eliminación de espacios y comentarios**: Los espacios en blanco, tabulaciones y comentarios son descartados, ya que no son parte de la gramática del lenguaje.
- **Detección de errores léxicos**: Reporta caracteres ilegales o cadenas que no corresponden a ningún patrón definido. Ejemplo: `@variable` o `1abc`.

---

## Tipos de Tokens

| Tipo de Token | Ejemplo | Descripción |
| --- | --- | --- |
| **Palabras reservadas** | `int`, `float`, `if`, `while`, `return` | Términos definidos por el lenguaje, no reutilizables como identificadores |
| **Identificadores** | `edad`, `promedio`, `nombre` | Nombres definidos por el programador para variables, funciones, etc. |
| **Números enteros** | `0`, `5`, `100`, `-3` | Constantes numéricas sin parte decimal |
| **Números decimales** | `3.14`, `9.5`, `0.001` | Constantes de punto flotante |
| **Cadenas** | `"Hola"`, `"Ana"` | Secuencias de caracteres entre comillas dobles |
| **Operadores aritméticos** | `+`, `-`, `*`, `/` | Realizan operaciones matemáticas |
| **Operadores relacionales** | `>`, `<`, `>=`, `<=`, `==`, `!=` | Comparan dos valores; retornan booleano |
| **Operadores lógicos** | `&&`, `||`, `!` | Operaciones de lógica booleana |
| **Delimitadores** | `;`, `,`, `(`, `)`, `{`, `}` | Separan o agrupan elementos del programa |
