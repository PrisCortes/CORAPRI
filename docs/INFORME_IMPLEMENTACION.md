# Informe de implementación CoRaPri

## Alcance realizado

- Lexer basado en AFN/NFA con trazas por carácter, preservación de posiciones y normalización de signos.
- Parser recursivo que consume exclusivamente los tokens del lexer y construye AST con rangos, asignación simultánea, clases, herencia, constructores, `new`, miembros y lambdas.
- Análisis semántico con registro previo de firmas, por lo que las llamadas antes de la declaración son válidas; también informa incompatibilidades, uso antes de inicialización, constantes, desbordamientos y advertencias de variables no utilizadas.
- Intérprete con límites de pasos y profundidad, currificación, rangos, paralelismo por tareas, asignación `par`, cierres, lambdas, clases, `this`, constructores, herencia de métodos y funciones funcionales.
- IR de tres direcciones y optimizador de expresiones constantes.
- Depurador por pasos conservado y perfilador por línea integrado en una pestaña `Perfil`.
- Coloración del editor implementada con un tokenizador carácter a carácter; el código propio no usa expresiones regulares.

## Decisiones confirmadas

1. Las firmas de funciones se registran antes de analizar los cuerpos y el programa principal.
2. `par { ... }` evalúa las expresiones antes de escribir destinos, preservando semántica simultánea.
3. `parallel { task { ... } }` usa tareas independientes y no sustituye a `par`.
4. `range<T>` conserva límites y paso; las transformaciones aritméticas mantienen la representación perezosa.
5. Los enteros se validan en el intervalo firmado de 32 bits y los flotantes deben ser finitos.
6. El motor del lenguaje no importa React; la UI consume sus tipos y funciones públicas.

## Verificación

- Vitest: 12 archivos, 67 pruebas aprobadas.
- Build TypeScript/Vite: aprobado.
- Pruebas nuevas: POO con herencia y constructor; lambdas con `map`, `filter`, `reduce`, `head`, `tail`; perfilador.
- Guía PDF: 50 ejemplos, texto extraíble verificado y render visual revisado.

## Límites conocidos

- La representación de tipos de funciones todavía es deliberadamente compacta (`fn`) y no expone firmas genéricas en la tabla de símbolos.
- La IR representa clases y lambdas de forma resumida; la ejecución completa ocurre en el intérprete.
- La salida de tareas paralelas no garantiza orden entre tareas, por diseño.
