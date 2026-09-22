# HNK-VERSE — ZERO AUTHORITATIVE AVATAR MOVEMENT V1

**Status:** IMPLEMENTED_LOCAL_GREEN  
**Date:** 2026-09-22  
**Parent:** ZERO Web Playable V1  
**Scope:** persisted safe Avatar position without per-frame Event Ledger noise

## 1. Goal

Close the authority gap left intentionally by the first Web playable:

VISUAL AVATAR POSITION  
→ AUTHORITATIVE SAFE POSITION CHECKPOINT  
→ EVENT LEDGER  
→ RESTORE

The renderer remains responsive immediately while the domain owns the last accepted safe position.

## 2. Domain state

`ZeroWorldState` now includes:

- `avatarPosition.logicalX`
- `avatarPosition.logicalY`

Fixture initial position:

`(4, 4)`

This matches the locked Home spawn context.

## 3. Command

`MoveAvatar` is now a real domain command.

Payload:

- logicalX
- logicalY

Validation:

- integer logical coordinates;
- inside ZERO Land bounds 1..18 × 1..14.

Out-of-bounds movement is rejected with:

`OUT_OF_BOUNDS`.

## 4. Event

Accepted movement produces:

`AvatarPositionCheckpointed`

Payload:

- avatarId;
- logicalX;
- logicalY.

Reducer updates the authoritative safe position.

If the requested checkpoint already equals the current authoritative position, the command is accepted without emitting a duplicate event.

## 5. Web behavior

The original V1 used a short debounce between visual movement and authoritative checkpointing.

After single-cardinal-step movement became a domain invariant, that debounce was superseded by `ZERO-CLICK-TO-WALK-PATH-ROUTING-V1.md`.

Current rule:

keyboard/touch/click route  
→ one logical tile  
→ `MoveAvatar`  
→ validation  
→ `AvatarPositionCheckpointed`  
→ renderer advances.

The renderer may still interpolate between accepted logical cells without producing frame-level events.

## 6. Reload behavior

When the PWA/runtime starts:

`avatarVisual`

is initialized from:

`runtime.state.avatarPosition`.

If the runtime reloads after a concurrency conflict, the visual Avatar is resynchronized from the restored authoritative position.

Reset restores the fixture spawn.

## 7. Event-volume boundary

V1 does not treat animation frames as domain events.

The persisted contract is a logical safe-position checkpoint.

Future movement systems may introduce:

- collision;
- pathing;
- terrain cost;
- locomotion mode;
- travel events;
- region transitions;
- authoritative interpolation/session state.

Those do not change the current invariant:

RENDERED MOTION != EVENT LEDGER FRAME STREAM.

## 8. Verification

Local branch-equivalent verification executed:

- strict TypeScript → PASS;
- existing ZERO runtime → PASS;
- movement checkpoint execution → PASS;
- discard runtime / restore from persisted events → PASS.

Evidence result:

`MOVEMENT_CHECK_PASS`.

The browser-local persistence check in repo is also extended to verify checkpoint persistence through runtime recreation.

## 9. Current limitations

The next spatial layer is implemented in `ZERO-INTERACTION-RANGE-COLLISION-V1.md`.

Now implemented:

- fixture collision;
- Home wall collision;
- explicit traversable threshold;
- single-step movement;
- domain-enforced interaction range.

Still deferred:

- stateful doors;
- generalized Agent pathfinding;
- terrain traversal capabilities/costs;
- movement Energy/time costs.

## 10. Classification

`VISUAL_MOVEMENT = RESPONSIVE`

`SAFE_POSITION = AUTHORITATIVE`

`SAFE_POSITION_PERSISTENCE = LOCAL_GREEN`

`COLLISION = IMPLEMENTED`

`PATH_ROUTING = IMPLEMENTED / RUNNER_PENDING`
