# HNK-VERSE — ZERO INTERACTION RANGE + COLLISION V1

**Status:** IMPLEMENTED / VERIFICATION_RUNNER_PENDING  
**Date:** 2026-09-22  
**Parent:** ZERO Web Playable V1 + Authoritative Movement V1  
**Scope:** logical topology, collision, single-step movement, proximity-gated interactions and Home threshold

## 1. Core rule

The ZERO is no longer a set of remotely clickable stations.

The spatial contract is now:

```text
PLAYER INPUT
→ LOGICAL MOVEMENT
→ WORLD TOPOLOGY VALIDATION
→ SAFE POSITION
→ PROXIMITY
→ DOMAIN COMMAND
→ WORLD EVENT
```

Therefore:

`CLICKABLE TARGET != INTERACTION PERMISSION`

and:

`RENDERED POSITION != COLLISION AUTHORITY`.

## 2. New package — @hnk-verse/world

`@hnk-verse/world` is the authoritative logical topology package for ZERO.

It owns:

- Land dimensions: 18×14;
- Home footprint;
- Home threshold;
- deterministic fixture positions;
- static collision cells;
- interaction range;
- Manhattan distance;
- Land bounds;
- threshold/wall classification.

The renderer now consumes this package instead of maintaining a second independent geometry definition.

## 3. Home topology

Home footprint:

- X: 2..9
- Y: 2..7

The perimeter is logically solid except for one explicit east threshold:

- threshold ID: `THRESHOLD-ZERO-HOME-EAST-001`;
- logical coordinate: `(9,6)`;
- orientation: EAST.

The threshold is:

- part of the Home boundary;
- not a wall;
- not a solid collision cell;
- traversable by the Avatar.

This creates the first explicit:

`HOME ↔ THRESHOLD ↔ LAND`

spatial transition in ZERO.

## 4. Static fixture collision

These ZERO fixtures are static solid cells:

- Bed;
- Workbench;
- VALI surface;
- Metatron;
- Cartography table;
- Wood resource node.

The Avatar may stand adjacent to them but may not occupy the same logical cell.

The Home wall perimeter is also static collision.

The storage zone is not solid by itself.

After the Wooden Box is placed, its persisted spatial binding becomes dynamic collision.

## 5. Single-step authoritative movement

`MoveAvatar` now accepts only:

- same-cell idempotent checkpoint; or
- one cardinal logical step.

A movement with Manhattan distance > 1 is rejected with:

`OUT_OF_RANGE`

and reason:

`MOVE_STEP_TOO_LARGE`.

A movement into a static/dynamic occupied cell is rejected with:

`CELL_OCCUPIED`.

A movement outside the 18×14 Land is rejected with:

`OUT_OF_BOUNDS`.

Thus the domain no longer permits logical teleportation.

## 6. Interaction range

ZERO V1 interaction range is:

`Manhattan distance <= 1`.

Domain-enforced proximity applies to:

- Observe VALI;
- Request teaching from Metatron;
- Discover practical knowledge through Metatron;
- Gather Wood;
- Attempt Practice;
- Craft Wooden Box;
- Validate placement;
- Place entity;
- Offer transfer;
- Transfer ownership;
- Interact with Agent;
- Rest in Bed.

`AppendReflection`, session commands and non-spatial system operations are not proximity-gated.

## 7. Range rejection

If the Avatar is too far from a spatial target, the domain returns:

`OUT_OF_RANGE`

with diagnostic data containing:

- target ID;
- current distance;
- max distance;
- Avatar position;
- target position.

The renderer cannot override this decision.

## 8. Placement collision

Placement validation now rejects:

- outside Land bounds;
- static solid cells;
- existing dynamic entity cells;
- current Avatar cell.

The Box must therefore be placed into actual free World space.

## 9. Web affordance

The Web layer mirrors, but does not own, the rule.

It now:

- displays current distance to selected fixture;
- disables contextual actions outside range;
- displays "Aproxime-se" with current distance;
- prevents visual movement into known solid cells;
- visually distinguishes Home walls;
- visually highlights the Home threshold;
- synchronizes the latest visual position before executing an interaction.

That final synchronization closes the debounce race:

```text
visual move
→ immediate click
→ flush authoritative MoveAvatar
→ interaction command
```

so the player is not incorrectly rejected while visually adjacent.

## 10. Movement rejection recovery

If a movement checkpoint is rejected:

- the visual Avatar is returned to the current authoritative position;
- the rejection reason is surfaced;
- the renderer does not retain an impossible local position.

## 11. Test path behavior

The existing deterministic ZERO runtime test has been upgraded.

Before spatial commands it now computes a cardinal walkable path to an adjacent interaction cell.

The pathfinder respects:

- Land bounds;
- Home walls;
- static fixtures;
- dynamic placed entities.

This means the golden runtime no longer succeeds by remotely invoking every station.

## 12. Dedicated spatial contract gate

New executable gate:

`scripts/zero-spatial-check.ts`

It verifies:

1. remote VALI observation → `OUT_OF_RANGE`;
2. two-cell movement → `OUT_OF_RANGE`;
3. walking onto Bed → `CELL_OCCUPIED`;
4. walking into Home wall → `CELL_OCCUPIED`;
5. cardinal path through Home interior;
6. threshold at `(9,6)` is traversable;
7. threshold is not classified as wall/solid;
8. movement event records threshold context;
9. Avatar can step from threshold to exterior Land.

The browser-local persistence gate was also updated to use legal single-step movement.

## 13. Authority graph

```text
@hnk-verse/contracts
        ↓
@hnk-verse/world
        ↓
@hnk-verse/domain
        ↓
@hnk-verse/simulation
        ↓
@hnk-verse/persistence
        ↓
apps/web
        ↑
@hnk-verse/renderer
```

Important:

`@hnk-verse/world` owns logical topology.

`@hnk-verse/renderer` owns isometric projection.

They are not interchangeable.

## 14. Verification classification

Repository structural audit confirms:

- workspace dependencies reference `@hnk-verse/world`;
- tsconfig resolves `@hnk-verse/world`;
- renderer no longer hardcodes the ZERO topology constants;
- old `withinZeroLand` duplication is removed;
- storage zone ID is canonicalized through `ZERO_IDS`;
- no merge conflict markers are present.

The current execution container cannot resolve `github.com`, so it cannot clone/install the branch for a fresh external `pnpm` run.

GitHub-hosted Actions has repeatedly failed before executing any step in prior runs.

Therefore current classification is:

- spatial implementation: `IMPLEMENTED`;
- structural audit: `PASS`;
- topology/path audit: `PASS`;
- fresh external TypeScript/test/build execution: `RUNNER_PENDING`.

No CI-green claim is made until a runner actually executes the commands.

## 15. Next spatial gates

After V1:

- interaction line-of-sight if required by world rules;
- doors with open/closed state;
- terrain traversal costs;
- collision footprints larger than one tile;
- pathfinding for Agents;
- locomotion modes;
- Region transitions;
- movement Energy/time costs where appropriate;
- click-to-walk/path preview;
- accessibility navigation alternatives.

These are extensions of the same topology authority, not renderer-only features.
