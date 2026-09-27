# Tecnomage Prime V2.8 — migration checkpoint

Source package is locked from `tehknesolutions/alakazam-strangeverse@main`, source tree `c51709d4481ec3763de42fb1cbdd52aa4d8d82eb`.

The exact source SHA-256 manifest is stored beside this file as `MANIFEST.source.sha256`. `provenance.json` records source Git blob SHA, SHA-256, byte size and role for every confirmed file.

## Current state

`PROVENANCE_LOCKED_BINARY_COPY_PENDING`

The GitHub connector used for this migration can enumerate the binary files and their exact Git blob identities, but binary blob fetch currently fails at UTF-8 decoding. Therefore the GLB/PNG/BIN files have **not** been claimed as copied.

No asset may be regenerated, substituted, recompressed or silently renamed to bypass that boundary. The next binary-capable executor must copy the source bytes and verify every SHA-256 against the locked manifest before marking the package physically converged.

## Runtime target

`apps/web/public/assets/characters/`

Primary runtime candidate: `tecnomage-prime-v2.8-runtime-q.glb`
Fallback: `tecnomage-prime-v2.8-runtime-optimized.glb`
