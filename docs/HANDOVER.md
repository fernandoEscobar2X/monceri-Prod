# Como generar zip limpio para entregar

NUNCA usar `zip -r monceri.zip .` porque incluye `.env`, `.pem`, `node_modules` y artefactos locales.

Usar siempre:

```bash
git archive --format=zip --output=monceri-clean.zip HEAD
```

Esto solo incluye archivos rastreados por git. Limpio garantizado.
