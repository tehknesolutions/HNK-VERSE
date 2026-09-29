# haKodan — HNK-VERSE Consumer Contract v0.1

**Data:** 2026-09-29  
**Status:** Integration Contract  
**Upstream:** `tehknesolutions/HNK-KODE`

## Boundary

HNK-VERSE não define HNK-KODE nem haKodan. Ele consome seus contratos.

```text
CODEX-HNK
   ↓ canon / knowledge contracts
HNK-KODE
   ↓ language
haKodan
   ↓ AST / HNK-IR / runtime / adapters
HNK-VERSE
   ↓
WORLD / VERSE / KODAN / EXPERIENCE
```

## Consumer rules

HNK-VERSE deve:
- consumir HNK-IR/SDKs versionados de haKodan;
- preservar Semantic IDs independentemente do profile HNK/PT-BR/EN;
- respeitar HNK como perfil canônico, PT-BR como principal superfície humana e EN como interoperabilidade;
- preservar provenance até WorldEvent/Chronicle quando aplicável;
- não inventar palavras-chave HNK locais;
- não redefinir MHCM/Mandala-HNK;
- manter documentos KODE anteriores como histórico, não como nova autoridade da linguagem.

## Primeiro vertical slice esperado

```text
KODE SOURCE
  ↓
AST
  ↓
HNK-IR
  ↓
haKodan Adapter
  ↓
world → entity → property → event → action
```

## Proveniência upstream

- Canon: `6f37fea9caf9f7398f53c7ad09bf2fe7a52880b3`
- Architecture: `ce22c6eb446da2fd8f7a8d1deeb60bda939f5b2f`
- Token Registry: `5418e9297925470433838b068ded50bad418d54b`
