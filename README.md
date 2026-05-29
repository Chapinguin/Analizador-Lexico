# Analizador Léxico Web "Lexify"

Herramienta web interactiva para realizar análisis léxico y sintáctico en un lenguaje didáctico llamado MiniLang. Desarrollado con React 19 y Vite 8, permite escribir código, visualizar el flujo de tokens y verificar la corrección gramatical contra reglas de producción LL(1) .

## Instalación y Ejecución:

### Requisitos Previos:

- Node.js (versión recomendada: 18+)
- npm o yarn

### Pasos de Instalación
1. Clonar el repositorio:
```
git clone https://github.com/Chapinguin/Analizador-Lexico.git  
cd Analizador-Lexico
```
2. Instalar dependencias:
```
npm install
```
3. Ejecutar en modo desarrollo:
```
npm run dev
```
4. Construir para producción:
```
npm run build
```
5. Previsualizar producción:
```
npm run preview
```

## Punto de Entrada:
La aplicación se inicializa mediante `src/main.jsx`, que monta el componente `App` en el elemento `root` del DOM dentro de un wrapper `StrictMode`.

## Componentes Principales:

### Capa de UI (src/components/App.jsx)

El componente `App.jsx` actúa como controlador principal, gestionando el estado para:

- Código fuente de entrada (`code`)
- Tokens resultantes (`tokens`)
- Estado de validación del parser (`parseResult`)

Funciones clave:

- handleAnalyze(): Orquesta el análisis léxico y sintáctico.
- handleDownloadCSV(): Exporta resultados a formato CSV.
- handleImportFile(): Importa archivos .minilang o .txt.


## Especificaciones técnicas:

### Stack Tecnológico:
- __Frontend Framework:__ React con Vite como herramienta de construcción.
- __Lenguaje de Implementación:__ JavaScript (ES6+).
- __Estilos:__ CSS con efecto Glassmorphism y animaciones CSS.

### Estructura del Proyecto:

```
src/  
├── components/  
│   ├── App.jsx          # Componente principal y controlador UI  
│   └── App.css          # Estilos Glassmorphism  
├── utils/  
│   ├── analyzer.js      # Analizador léxico (DFA-based)  
│   └── parser.js        # Parser sintáctico (LL1 Recursive Descent)  
└── main.jsx             # Punto de entrada  
```

### Características de la Interfaz:

- Editor de código con límite de 1000 caracteres.
- Importación de archivos (.txt, .minilang, .json, .cpp, .java, .c).
- Exportación de resultados a CSV con soporte UTF-8 (BOM para Excel).
- Ejemplos predefinidos de código (básico, condicional, ciclo, con error).

## Funcionamiento y Modelo/Motor de Análisis:

### Motor de Análisis Léxico (analyzer.js):

El analizador léxico implementa un Autómata Finito Determinista (DFA) que transforma el código fuente en un flujo de tokens mediante expresiones regulares.

#### Proceso de Tokenización:

1. __Entrada:__ Código fuente dividido por líneas.
2. __Patrones Regex:__ Se aplican 13 patrones diferentes en orden específico.
3. __Clasificación:__ Cada lexema se clasifica en una categoría de token.
4. __Manejo de Errores:__ Caracteres no reconocidos generan tokens LEXICAL_ERROR.

#### Tipos de Tokens Reconocidos:

 Tipo | Ejemplo | Descripción |
|------|---------|-------------|
| KEYWORD | int, float, if, while | Palabras reservadas |
| IDENTIFIER | edad, nombre | Nombres de variables |
| INTEGER_LITERAL | 25, 100 | Constantes enteras |
| DECIMAL_LITERAL | 9.5, 3.14 | Constantes decimales |
| STRING_LITERAL | "Hola" | Cadenas de texto |
| ARITHMETIC_OP | +, -, *, / | Operadores matemáticos |
| RELATIONAL_OP | ==, !=, >, < | Operadores de comparación |
| LOGICAL_OP | &&, \|\|, ! | Operadores lógicos |

### Motor de Análisis Sintáctico (`parser.js`):
El parser implementa un **parser LL(1) de descenso recursivo** que valida la gramática del lenguaje MiniLang

#### Lenguaje MiniLang
MiniLang es un lenguaje didáctico simplificado que incluye:
- **Tipos de datos**: int, float, string, bool
- **Estructuras de control**: if-else, while
- **Funciones**: print (salida estándar)
- **Operadores**: aritméticos, relacionales, lógicos

#### Gramática de MiniLang
El lenguaje soporta las siguientes construcciones sintácticas.

- **Declaración**: `<tipo> ID = <expr>;`
- **Asignación**: `ID = <expr>;`
- **Condicional**: `if (<cond>) { <sentencias> } [else { <sentencias> }]`
- **Ciclo**: `while (<cond>) { <sentencias> }`
- **Impresión**: `print(<expr>);`

#### Precedencia de Operadores
Las expresiones aritméticas manejan la precedencia mediante producciones separadas:
- `<term>` maneja `*` y `/` (mayor precedencia)
- `<expr>` maneja `+` y `-` (menor precedencia)
- Producciones "prime" eliminan la recursión izquierda para compatibilidad LL(1)

## Flujo de Análisis Completo
```mermaid
graph TD
    A["Código Fuente"] --> B["analyzeCode"]
    B --> C["Tokens"]
    C --> D["parseCode"]
    D --> E{Resultado}
    E -->|Éxito| F["Sintaxis Válida"]
    E -->|Error| G["Error de Sintaxis"]
```

## Ejemplos de Código
El proyecto incluye archivos de prueba en el directorio :

**Ejemplo Básico**:
```minilang
int edad = 25;
float salario = 1500.50;
string puesto = "Desarrollador";
print(edad);
```

**Ejemplo Condicional**:
```minilang
int puntuacion = 85;
if (puntuacion >= 70.0) {
  print("Aprobado");
} else {
  print("Reprobado");
}
```

## Manejo de Errores
- **Errores Léxicos**: Caracteres no reconocidos se marcan como `LEXICAL_ERROR`.
- **Errores Sintácticos**: El parser proporciona mensajes detallados con línea y expectativa.
- **Validación previa**: El parser verifica errores léxicos antes de iniciar el análisis sintáctico.

## Contributors

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Chapinguin">
        <img src="https://github.com/Chapinguin.png" width="100px;" alt="Sebastian Chapa"/>
      </a>
      <br />
      <sub><b>Sebastian Chapa (Chapinguin)</b></sub>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/guco-17">
        <img src="https://github.com/guco-17.png" width="100px;" alt="Gustavo Cortes"/>
      </a>
      <br />
      <sub><b>Gustavo Cortes (guco-17)</b></sub>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

# Members
[@Chapinguin](https://github.com/Chapinguin)
[@guco-17](https://github.com/guco-17)