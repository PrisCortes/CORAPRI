# Guía de ejemplos ejecutables de CoRaPri

Documento generado desde `src/ui/examples.ts`.

## Índice

1. [Hola mundo](#1-hola-mundo)
2. [Variables](#2-variables)
3. [Constantes](#3-constantes)
4. [Operaciones](#4-operaciones)
5. [Condicionales](#5-condicionales)
6. [While](#6-while)
7. [Do While](#7-do-while)
8. [For](#8-for)
9. [Funciones](#9-funciones)
10. [Recursividad](#10-recursividad)
11. [Arrays](#11-arrays)
12. [Rangos](#12-rangos)
13. [Asignación par](#13-asignación-par)
14. [Entrada](#14-entrada)
15. [Optimización](#15-optimización)
16. [Notaciones](#16-notaciones)
17. [Lógicos](#17-lógicos)
18. [Error léxico](#18-error-léxico)
19. [Error sintáctico](#19-error-sintáctico)
20. [Error semántico](#20-error-semántico)
21. [Error de ejecución](#21-error-de-ejecución)
22. [Print — Correcto](#22-print-—-correcto)
23. [Print — Error](#23-print-—-error)
24. [Input — Correcto](#24-input-—-correcto)
25. [Input — Error](#25-input-—-error)
26. [Aritmética — Correcto](#26-aritmética-—-correcto)
27. [Aritmética — Error](#27-aritmética-—-error)
28. [Lógica — Correcto](#28-lógica-—-correcto)
29. [Lógica — Error](#29-lógica-—-error)
30. [If — Correcto](#30-if-—-correcto)
31. [If — Error](#31-if-—-error)
32. [While — Correcto](#32-while-—-correcto)
33. [While — Error](#33-while-—-error)
34. [For — Correcto](#34-for-—-correcto)
35. [For — Error](#35-for-—-error)
36. [Relacional — Correcto](#36-relacional-—-correcto)
37. [Relacional — Error](#37-relacional-—-error)
38. [Asignación — Correcto](#38-asignación-—-correcto)
39. [Asignación — Error](#39-asignación-—-error)
40. [Constante — Correcto](#40-constante-—-correcto)
41. [Constante — Error](#41-constante-—-error)
42. [Función — Correcto](#42-función-—-correcto)
43. [Función — Error](#43-función-—-error)
44. [Operador especial — Correcto](#44-operador-especial-—-correcto)
45. [Operador especial — Error](#45-operador-especial-—-error)
46. [Currificación — Correcto](#46-currificación-—-correcto)
47. [Currificación — Error](#47-currificación-—-error)
48. [Clase y herencia](#48-clase-y-herencia)
49. [Lambdas y listas](#49-lambdas-y-listas)
50. [Tareas paralelas](#50-tareas-paralelas)

## Cómo leer los resultados

Cada bloque conserva el código que aparece en el selector de ejemplos. La explicación acompaña cada línea y el resultado indica la salida observada o el diagnóstico esperado.

## 1. Hola mundo

**Descripción:** Salida básica

<a id="1-hola-mundo"></a>
```crp
program Hola {
  print("Hola mundo");
}
```

### Explicación línea por línea

1. `program Hola {` — Declara el programa y abre su bloque principal.
2. `  print("Hola mundo");` — Evalúa la expresión y agrega su representación a la salida.
3. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Hola mundo
```

## 2. Variables

**Descripción:** Tipos primitivos

<a id="2-variables"></a>
```crp
program Variables {
  int edad = 20;
  float promedio = 9.5;
  char inicial = 'A';
  boolean activo = true;
  print("Edad: " + edad);
}
```

### Explicación línea por línea

1. `program Variables {` — Declara el programa y abre su bloque principal.
2. `  int edad = 20;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  float promedio = 9.5;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  char inicial = 'A';` — Declara o actualiza un valor; el analizador verifica su tipo.
5. `  boolean activo = true;` — Declara o actualiza un valor; el analizador verifica su tipo.
6. `  print("Edad: " + edad);` — Evalúa la expresión y agrega su representación a la salida.
7. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Edad: 20
```

## 3. Constantes

**Descripción:** Valores no reasignables

<a id="3-constantes"></a>
```crp
program Constantes {
  const float PI = 3.1416;
  print(PI);
}
```

### Explicación línea por línea

1. `program Constantes {` — Declara el programa y abre su bloque principal.
2. `  const float PI = 3.1416;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  print(PI);` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
3.1416
```

## 4. Operaciones

**Descripción:** Precedencia aritmética

<a id="4-operaciones"></a>
```crp
program Operaciones {
  int resultado = 10 + 20 * 2;
  print(resultado);
}
```

### Explicación línea por línea

1. `program Operaciones {` — Declara el programa y abre su bloque principal.
2. `  int resultado = 10 + 20 * 2;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  print(resultado);` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
50
```

## 5. Condicionales

**Descripción:** if / else

<a id="5-condicionales"></a>
```crp
program Condicionales {
  int edad = 18;
  if (edad >= 18) { print("Mayor de edad"); } else { print("Menor de edad"); }
}
```

### Explicación línea por línea

1. `program Condicionales {` — Declara el programa y abre su bloque principal.
2. `  int edad = 18;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  if (edad >= 18) { print("Mayor de edad"); } else { print("Menor de edad"); }` — Controla el flujo de ejecución mediante una condición o ciclo.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Mayor de edad
```

## 6. While

**Descripción:** Ciclo while

<a id="6-while"></a>
```crp
program WhileDemo {
  int i = 0;
  while (i < 3) { print(i); i = i + 1; }
}
```

### Explicación línea por línea

1. `program WhileDemo {` — Declara el programa y abre su bloque principal.
2. `  int i = 0;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  while (i < 3) { print(i); i = i + 1; }` — Controla el flujo de ejecución mediante una condición o ciclo.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
0
1
2
```

## 7. Do While

**Descripción:** Ciclo do while

<a id="7-do-while"></a>
```crp
program DoWhileDemo {
  int i = 0;
  do { print(i); i = i + 1; } while (i < 3);
}
```

### Explicación línea por línea

1. `program DoWhileDemo {` — Declara el programa y abre su bloque principal.
2. `  int i = 0;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  do { print(i); i = i + 1; } while (i < 3);` — Controla el flujo de ejecución mediante una condición o ciclo.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
0
1
2
```

## 8. For

**Descripción:** Ciclo for

<a id="8-for"></a>
```crp
program ForDemo {
  for (int i = 0; i < 5; i = i + 1) { print(i); }
}
```

### Explicación línea por línea

1. `program ForDemo {` — Declara el programa y abre su bloque principal.
2. `  for (int i = 0; i < 5; i = i + 1) { print(i); }` — Controla el flujo de ejecución mediante una condición o ciclo.
3. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
0
1
2
3
4
```

## 9. Funciones

**Descripción:** Parámetros y retorno

<a id="9-funciones"></a>
```crp
program Funciones {
  function sumar(int a, int b) : int { return a + b; }
  print(sumar(10, 20));
}
```

### Explicación línea por línea

1. `program Funciones {` — Declara el programa y abre su bloque principal.
2. `  function sumar(int a, int b) : int { return a + b; }` — Declara una función o constructor con parámetros y cuerpo.
3. `  print(sumar(10, 20));` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
30
```

## 10. Recursividad

**Descripción:** Factorial

<a id="10-recursividad"></a>
```crp
program Factorial {
  function factorial(int n) : int { if (n <= 1) { return 1; } return n * factorial(n - 1); }
  print(factorial(5));
}
```

### Explicación línea por línea

1. `program Factorial {` — Declara el programa y abre su bloque principal.
2. `  function factorial(int n) : int { if (n <= 1) { return 1; } return n * factorial(n - 1); }` — Declara una función o constructor con parámetros y cuerpo.
3. `  print(factorial(5));` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
120
```

## 11. Arrays

**Descripción:** Lectura y escritura

<a id="11-arrays"></a>
```crp
program Arrays {
  array<int> numeros = [10, 20, 30];
  numeros[1] = 50;
  print(numeros[1]);
}
```

### Explicación línea por línea

1. `program Arrays {` — Declara el programa y abre su bloque principal.
2. `  array<int> numeros = [10, 20, 30];` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  numeros[1] = 50;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  print(numeros[1]);` — Evalúa la expresión y agrega su representación a la salida.
5. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
50
```

## 12. Rangos

**Descripción:** Rango perezoso y transformación aritmética

<a id="12-rangos"></a>
```crp
program Rangos {
  range<int> x = [1,...,5];
  x = x * 3 + 1;
  print(x);
}
```

### Explicación línea por línea

1. `program Rangos {` — Declara el programa y abre su bloque principal.
2. `  range<int> x = [1,...,5];` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  x = x * 3 + 1;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  print(x);` — Evalúa la expresión y agrega su representación a la salida.
5. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
[4, 7, 10, 13, 16]
```

## 13. Asignación par

**Descripción:** Actualización simultánea

<a id="13-asignación-par"></a>
```crp
program Paralelo {
  int x = 2;
  int y = 100;
  par { x = y, y = x; }
  print(x);
  print(y);
}
```

### Explicación línea por línea

1. `program Paralelo {` — Declara el programa y abre su bloque principal.
2. `  int x = 2;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  int y = 100;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  par { x = y, y = x; }` — Marca trabajo concurrente o una asignación simultánea.
5. `  print(x);` — Evalúa la expresión y agrega su representación a la salida.
6. `  print(y);` — Evalúa la expresión y agrega su representación a la salida.
7. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
100
2
```

## 14. Entrada

**Descripción:** inputInt

<a id="14-entrada"></a>
```crp
program Entrada {
  int numero = inputInt("Número: ");
  print(numero * 2);
}
```

### Explicación línea por línea

1. `program Entrada {` — Declara el programa y abre su bloque principal.
2. `  int numero = inputInt("Número: ");` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  print(numero * 2);` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 15. Optimización

**Descripción:** Constant folding

<a id="15-optimización"></a>
```crp
program Optimizar {
  int x = (10 + 20) * 2;
  print(x);
}
```

### Explicación línea por línea

1. `program Optimizar {` — Declara el programa y abre su bloque principal.
2. `  int x = (10 + 20) * 2;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  print(x);` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
50
```

## 16. Notaciones

**Descripción:** Infija, prefija, postfija y funcional

<a id="16-notaciones"></a>
```crp
program Notaciones {
  int a = 5;
  int b = 3;
  int infija = a + b;
  int prefija = + a b;
  int postfija = a b +;
  int funcional = +(a,b);
  int anidada = +(+(5,3),2);
}
```

### Explicación línea por línea

1. `program Notaciones {` — Declara el programa y abre su bloque principal.
2. `  int a = 5;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  int b = 3;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  int infija = a + b;` — Declara o actualiza un valor; el analizador verifica su tipo.
5. `  int prefija = + a b;` — Declara o actualiza un valor; el analizador verifica su tipo.
6. `  int postfija = a b +;` — Declara o actualiza un valor; el analizador verifica su tipo.
7. `  int funcional = +(a,b);` — Declara o actualiza un valor; el analizador verifica su tipo.
8. `  int anidada = +(+(5,3),2);` — Declara o actualiza un valor; el analizador verifica su tipo.
9. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 17. Lógicos

**Descripción:** Operadores lógicos por palabra y símbolo

<a id="17-lógicos"></a>
```crp
program Logicos {
  boolean a = true;
  boolean b = false;
  boolean r1 = a and b;
  boolean r2 = a or b;
  boolean r3 = not a;
  boolean r4 = a xor b;
  boolean r5 = a nor b;
  boolean r6 = a nand b;
  boolean r7 = a && b;
  boolean r8 = a || b;
  boolean r9 = !a;
}
```

### Explicación línea por línea

1. `program Logicos {` — Declara el programa y abre su bloque principal.
2. `  boolean a = true;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  boolean b = false;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  boolean r1 = a and b;` — Declara o actualiza un valor; el analizador verifica su tipo.
5. `  boolean r2 = a or b;` — Declara o actualiza un valor; el analizador verifica su tipo.
6. `  boolean r3 = not a;` — Declara o actualiza un valor; el analizador verifica su tipo.
7. `  boolean r4 = a xor b;` — Declara o actualiza un valor; el analizador verifica su tipo.
8. `  boolean r5 = a nor b;` — Declara o actualiza un valor; el analizador verifica su tipo.
9. `  boolean r6 = a nand b;` — Declara o actualiza un valor; el analizador verifica su tipo.
10. `  boolean r7 = a && b;` — Declara o actualiza un valor; el analizador verifica su tipo.
11. `  boolean r8 = a || b;` — Declara o actualiza un valor; el analizador verifica su tipo.
12. `  boolean r9 = !a;` — Declara o actualiza un valor; el analizador verifica su tipo.
13. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 18. Error léxico

**Descripción:** Carácter inválido

<a id="18-error-léxico"></a>
```crp
program ErrorLexico {
  int x = @;
}
```

### Explicación línea por línea

1. `program ErrorLexico {` — Declara el programa y abre su bloque principal.
2. `  int x = @;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 19. Error sintáctico

**Descripción:** Falta punto y coma

<a id="19-error-sintáctico"></a>
```crp
program ErrorSintaxis {
  int x = 10
}
```

### Explicación línea por línea

1. `program ErrorSintaxis {` — Declara el programa y abre su bloque principal.
2. `  int x = 10` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 20. Error semántico

**Descripción:** Constante reasignada

<a id="20-error-semántico"></a>
```crp
program ErrorSemantico {
  const int A = 1;
  A = 2;
}
```

### Explicación línea por línea

1. `program ErrorSemantico {` — Declara el programa y abre su bloque principal.
2. `  const int A = 1;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  A = 2;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 21. Error de ejecución

**Descripción:** División por cero

<a id="21-error-de-ejecución"></a>
```crp
program ErrorRuntime {
  int x = 10 / 0;
  print(x);
}
```

### Explicación línea por línea

1. `program ErrorRuntime {` — Declara el programa y abre su bloque principal.
2. `  int x = 10 / 0;` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  print(x);` — Evalúa la expresión y agrega su representación a la salida.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 22. Print — Correcto

**Descripción:** Reconocimiento de print

<a id="22-print-—-correcto"></a>
```crp
program P { print("Hola"); }
```

### Explicación línea por línea

1. `program P { print("Hola"); }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 23. Print — Error

**Descripción:** Falta expresión en print

<a id="23-print-—-error"></a>
```crp
program P { print(; }
```

### Explicación línea por línea

1. `program P { print(; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 24. Input — Correcto

**Descripción:** Reconocimiento de inputInt

<a id="24-input-—-correcto"></a>
```crp
program P { int edad = inputInt("Edad: " ); }
```

### Explicación línea por línea

1. `program P { int edad = inputInt("Edad: " ); }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 25. Input — Error

**Descripción:** Falta cierre de llamada

<a id="25-input-—-error"></a>
```crp
program P { int edad = inputInt("Edad: "; }
```

### Explicación línea por línea

1. `program P { int edad = inputInt("Edad: "; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 26. Aritmética — Correcto

**Descripción:** Expresión aritmética

<a id="26-aritmética-—-correcto"></a>
```crp
program P { int x = 5 + 3; }
```

### Explicación línea por línea

1. `program P { int x = 5 + 3; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 27. Aritmética — Error

**Descripción:** Operador sin operando

<a id="27-aritmética-—-error"></a>
```crp
program P { int x = 5 + ; }
```

### Explicación línea por línea

1. `program P { int x = 5 + ; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 28. Lógica — Correcto

**Descripción:** Operadores lógicos

<a id="28-lógica-—-correcto"></a>
```crp
program P { boolean a = true; boolean b = false; boolean r = a and not b; }
```

### Explicación línea por línea

1. `program P { boolean a = true; boolean b = false; boolean r = a and not b; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 29. Lógica — Error

**Descripción:** Operador lógico sin operando

<a id="29-lógica-—-error"></a>
```crp
program P { boolean a = true; boolean r = a and ; }
```

### Explicación línea por línea

1. `program P { boolean a = true; boolean r = a and ; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 30. If — Correcto

**Descripción:** if / else if / else

<a id="30-if-—-correcto"></a>
```crp
program P { int x = 1; if (x < 5) { } else if (x == 5) { } else { } }
```

### Explicación línea por línea

1. `program P { int x = 1; if (x < 5) { } else if (x == 5) { } else { } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 31. If — Error

**Descripción:** Falta paréntesis

<a id="31-if-—-error"></a>
```crp
program P { int x = 1; if (x < 5 { } }
```

### Explicación línea por línea

1. `program P { int x = 1; if (x < 5 { } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 32. While — Correcto

**Descripción:** Ciclo while

<a id="32-while-—-correcto"></a>
```crp
program P { int x = 0; while (x < 5) { x++; } }
```

### Explicación línea por línea

1. `program P { int x = 0; while (x < 5) { x++; } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 33. While — Error

**Descripción:** Falta paréntesis

<a id="33-while-—-error"></a>
```crp
program P { int x = 0; while (x < 5 { x++; } }
```

### Explicación línea por línea

1. `program P { int x = 0; while (x < 5 { x++; } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 34. For — Correcto

**Descripción:** Ciclo for

<a id="34-for-—-correcto"></a>
```crp
program P { for (int i = 0; i < 5; i++) { } }
```

### Explicación línea por línea

1. `program P { for (int i = 0; i < 5; i++) { } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 35. For — Error

**Descripción:** Falta punto y coma

<a id="35-for-—-error"></a>
```crp
program P { for (int i = 0 i < 5; i++) { } }
```

### Explicación línea por línea

1. `program P { for (int i = 0 i < 5; i++) { } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 36. Relacional — Correcto

**Descripción:** Operador relacional

<a id="36-relacional-—-correcto"></a>
```crp
program P { int x = 1; boolean r = x <= 10; }
```

### Explicación línea por línea

1. `program P { int x = 1; boolean r = x <= 10; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 37. Relacional — Error

**Descripción:** Relacional sin operando

<a id="37-relacional-—-error"></a>
```crp
program P { int x = 1; boolean r = x <= ; }
```

### Explicación línea por línea

1. `program P { int x = 1; boolean r = x <= ; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 38. Asignación — Correcto

**Descripción:** Declaración y asignación

<a id="38-asignación-—-correcto"></a>
```crp
program P { int x; x = 10; }
```

### Explicación línea por línea

1. `program P { int x; x = 10; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 39. Asignación — Error

**Descripción:** Asignación sin valor

<a id="39-asignación-—-error"></a>
```crp
program P { int x; x = ; }
```

### Explicación línea por línea

1. `program P { int x; x = ; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 40. Constante — Correcto

**Descripción:** Declaración de constante

<a id="40-constante-—-correcto"></a>
```crp
program P { const int MAX = 100; }
```

### Explicación línea por línea

1. `program P { const int MAX = 100; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 41. Constante — Error

**Descripción:** Constante sin valor

<a id="41-constante-—-error"></a>
```crp
program P { const int MAX = ; }
```

### Explicación línea por línea

1. `program P { const int MAX = ; }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 42. Función — Correcto

**Descripción:** Función con retorno

<a id="42-función-—-correcto"></a>
```crp
program P { function suma(int a, int b) : int { return a + b; } }
```

### Explicación línea por línea

1. `program P { function suma(int a, int b) : int { return a + b; } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 43. Función — Error

**Descripción:** Firma incompleta

<a id="43-función-—-error"></a>
```crp
program P { function suma(int a, int b : int { return a + b; } }
```

### Explicación línea por línea

1. `program P { function suma(int a, int b : int { return a + b; } }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 44. Operador especial — Correcto

**Descripción:** root funcional

<a id="44-operador-especial-—-correcto"></a>
```crp
program P { float r = root(2, 9); }
```

### Explicación línea por línea

1. `program P { float r = root(2, 9); }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 45. Operador especial — Error

**Descripción:** Argumento faltante

<a id="45-operador-especial-—-error"></a>
```crp
program P { float r = root(2, ); }
```

### Explicación línea por línea

1. `program P { float r = root(2, ); }` — Declara el programa y abre su bloque principal.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 46. Currificación — Correcto

**Descripción:** Normal y currificada

<a id="46-currificación-—-correcto"></a>
```crp
program Currificacion {
  function sumar3(int a, int b, int c) : int { return a + b + c; }
  int normal = sumar3(6,4,2);
  int currificada = sumar3(6)(4)(2);
  print(normal);
  print(currificada);
}
```

### Explicación línea por línea

1. `program Currificacion {` — Declara el programa y abre su bloque principal.
2. `  function sumar3(int a, int b, int c) : int { return a + b + c; }` — Declara una función o constructor con parámetros y cuerpo.
3. `  int normal = sumar3(6,4,2);` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `  int currificada = sumar3(6)(4)(2);` — Declara o actualiza un valor; el analizador verifica su tipo.
5. `  print(normal);` — Evalúa la expresión y agrega su representación a la salida.
6. `  print(currificada);` — Evalúa la expresión y agrega su representación a la salida.
7. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```

## 47. Currificación — Error

**Descripción:** Grupo de argumentos incompleto

<a id="47-currificación-—-error"></a>
```crp
program ErrorCurrificacion {
  function sumar3(int a, int b, int c) : int { return a + b + c; }
  int x = sumar3(6)(4)(;
}
```

### Explicación línea por línea

1. `program ErrorCurrificacion {` — Declara el programa y abre su bloque principal.
2. `  function sumar3(int a, int b, int c) : int { return a + b + c; }` — Declara una función o constructor con parámetros y cuerpo.
3. `  int x = sumar3(6)(4)(;` — Declara o actualiza un valor; el analizador verifica su tipo.
4. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada.
```

## 48. Clase y herencia

**Descripción:** Constructor, this, método heredado y polimorfismo

<a id="48-clase-y-herencia"></a>
```crp
program Objetos {
  class Base { int value; constructor(int initial) { this.value = initial; } function get() : int { return this.value; } }
  class Child extends Base { function twice() : int { return this.value * 2; } }
  Child item = new Child(7);
  print(item.get());
  print(item.twice());
}
```

### Explicación línea por línea

1. `program Objetos {` — Declara el programa y abre su bloque principal.
2. `  class Base { int value; constructor(int initial) { this.value = initial; } function get() : int { return this.value; } }` — Declara una clase; `extends` expresa herencia cuando aparece.
3. `  class Child extends Base { function twice() : int { return this.value * 2; } }` — Declara una clase; `extends` expresa herencia cuando aparece.
4. `  Child item = new Child(7);` — Declara o actualiza un valor; el analizador verifica su tipo.
5. `  print(item.get());` — Evalúa la expresión y agrega su representación a la salida.
6. `  print(item.twice());` — Evalúa la expresión y agrega su representación a la salida.
7. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
7
14
```

## 49. Lambdas y listas

**Descripción:** map, filter, reduce, head y tail

<a id="49-lambdas-y-listas"></a>
```crp
program Funciones {
  array<int> values = [1, 2, 3, 4];
  array<int> doubled = map(values, lambda(x) => x * 2);
  array<int> even = filter(doubled, lambda(x) => x % 4 == 0);
  print(head(even));
  print(reduce(even, lambda(a, b) => a + b, 0));
  print(tail(even));
}
```

### Explicación línea por línea

1. `program Funciones {` — Declara el programa y abre su bloque principal.
2. `  array<int> values = [1, 2, 3, 4];` — Declara o actualiza un valor; el analizador verifica su tipo.
3. `  array<int> doubled = map(values, lambda(x) => x * 2);` — Construye una función anónima que captura su entorno léxico.
4. `  array<int> even = filter(doubled, lambda(x) => x % 4 == 0);` — Construye una función anónima que captura su entorno léxico.
5. `  print(head(even));` — Evalúa la expresión y agrega su representación a la salida.
6. `  print(reduce(even, lambda(a, b) => a + b, 0));` — Evalúa la expresión y agrega su representación a la salida.
7. `  print(tail(even));` — Evalúa la expresión y agrega su representación a la salida.
8. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
4
12
[8]
```

## 50. Tareas paralelas

**Descripción:** Bloques task ejecutados de forma concurrente

<a id="50-tareas-paralelas"></a>
```crp
program Tareas {
  parallel {
    task { print("tarea A"); }
    task { print("tarea B"); }
  }
}
```

### Explicación línea por línea

1. `program Tareas {` — Declara el programa y abre su bloque principal.
2. `  parallel {` — Marca trabajo concurrente o una asignación simultánea.
3. `    task { print("tarea A"); }` — Marca trabajo concurrente o una asignación simultánea.
4. `    task { print("tarea B"); }` — Marca trabajo concurrente o una asignación simultánea.
5. `  }` — Forma parte de la expresión o del bloque que se está ejecutando.
6. `}` — Forma parte de la expresión o del bloque que se está ejecutando.

### Resultado

```text
Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.
```
