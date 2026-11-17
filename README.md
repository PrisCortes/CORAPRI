# CORAPRI

CORAPRI es un IDE educativo local para un lenguaje propio. Implementa un lexer, parser recursive-descent, AST, análisis semántico con tabla de símbolos, código de tres direcciones, optimizador e intérprete propio en TypeScript; React solo presenta los resultados del motor.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test
```

El flujo es `source → lexer → parser/AST → semantic/symbols → IR → optimizer → interpreter`. Los errores se detienen en su fase crítica, preservando las etapas completadas. La extensión de programas CORAPRI es `.crp`.
