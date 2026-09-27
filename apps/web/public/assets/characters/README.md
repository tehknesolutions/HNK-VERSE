# Binary-copy gate

This directory intentionally contains only migration metadata until the exact Tecnomage V2.8 binaries are copied from the locked source.

Required source files:
- tecnomage-prime-v2.8-runtime-q.glb
- tecnomage-prime-v2.8-runtime-optimized.glb
- tecnomage.gltf
- tecnomage.bin
- body.png
- hair.png
- eye.png

Do not create placeholders with those filenames. A placeholder could falsely satisfy runtime path checks while corrupting the asset gate.

Promotion condition: exact bytes copied + SHA-256 verified against `MANIFEST.source.sha256`.
