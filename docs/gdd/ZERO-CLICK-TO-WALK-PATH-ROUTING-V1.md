# HNK-VERSE — ZERO CLICK-TO-WALK + PATH ROUTING V1

**Status:** IMPLEMENTED / EXECUTION_RUNNER_PENDING  
**Date:** 2026-09-22  
**Parent:** ZERO Interaction Range + Collision V1  
**Scope:** deterministic path planning, route preview, click-to-walk and interaction routing

## 1. Core rule

Pathfinding may plan movement.

It may not bypass movement authority.

The executable chain is:

```text
CLICK / TOUCH / KEYBOARD
→ PATH PLAN
→ ROUTE PREVIEW
→ ONE LOGICAL STEP
→ MoveAvatar
→ DOMAIN VALIDATION
→ AvatarPositionCheckpointed
→ NEXT STEP
```

Therefore:

`PATH PLAN != WORLD MUTATION`.

Every traversed logical cell remains subject to current World rules.

## 2. World pathfinder

`@hnk-verse/world` now owns deterministic path planning.

Added:

- `zeroCardinalNeighbors()`;
- `isZeroWalkableCell()`;
- `findZeroPath()`;
- `zeroInteractionGoals()`;
- `findZeroInteractionRoute()`;
- `zeroPointKey()`.

The pathfinder uses deterministic breadth-first search over the 18×14 logical grid.

Neighbor order is stable, making equivalent topology produce the same route.

## 3. Two route contracts

### Click-to-walk

`findZeroPath(start, goal, dynamicBlocked)`

Used when the user selects a free Land cell.

The route:

- ends on the selected free cell;
- never crosses static solids;
- never crosses supplied dynamic blockers;
- consists only of cardinal steps;
- returns null if the destination is not walkable/reachable.

### Interaction routing

`findZeroInteractionRoute(start, target, dynamicBlocked)`

Used for fixtures/entities.

The target itself may be solid.

The route instead finds a reachable walkable cell adjacent to the target.

Thus:

```text
CLICK METATRON
→ PATH TO VALID ADJACENT CELL
→ STOP IN RANGE
→ CONTEXT ACTION BECOMES AVAILABLE
```

The route does not automatically execute the interaction.

Movement and action remain separate verbs.

## 4. Dynamic blockers

The Web supplies current placed World entities as dynamic blockers.

Static topology remains owned by `@hnk-verse/world`.

Example:

- Home wall → static blocker;
- Bed → static blocker;
- Metatron → static blocker for movement;
- Wooden Box after placement → dynamic blocker.

The pathfinder plans against the current snapshot.

The domain validates each step again at execution time.

## 5. World-change safety

A planned route is provisional.

During route execution:

1. issue one `MoveAvatar`;
2. await domain result;
3. update visual Avatar from authoritative state;
4. continue only if accepted.

If a step fails:

- route execution stops;
- concurrency reload occurs when requested;
- visual Avatar resynchronizes to authoritative position;
- remaining route is discarded;
- rejection is surfaced.

This prevents stale routes from crossing a World that changed after planning.

## 6. Route preview

The Web renders:

- route tiles;
- highlighted route goal;
- isometric dashed route polyline;
- route nodes;
- current destination label;
- remaining step count.

The preview is presentation state only.

It is never persisted as World truth.

## 7. Fixture click behavior

Click/tap/keyboard activation on an interactive fixture:

1. selects the fixture;
2. computes an interaction route;
3. displays the route;
4. walks step-by-step;
5. stops adjacent;
6. leaves the contextual action for explicit player activation.

Non-interactive scenery remains selectable/inspectable without navigation.

## 8. Land-cell click behavior

Clicking a logical tile:

1. clears fixture selection;
2. requests `findZeroPath`;
3. rejects unreachable/solid targets locally as a planning failure;
4. previews the route;
5. executes each step through the runtime.

The domain still remains the final authority for every step.

## 9. Keyboard/touch movement reconciliation

The previous Web movement implementation used a 240 ms debounced safe-position checkpoint.

That model became inconsistent once `MoveAvatar` was locked to one cardinal logical step: fast visual input could move multiple cells before one checkpoint.

V1 resolves this by unifying all logical movement:

- keyboard directional input → one planned step;
- mobile directional input → one planned step;
- click route → N planned steps;
- every logical step → one `MoveAvatar`.

This does **not** mean animation-frame logging.

The invariant is:

`ONE LOGICAL TILE != ONE RENDER FRAME`.

A renderer may interpolate visually between two accepted logical cells without authoring extra World events.

## 10. Reduced motion

Route step delay is removed when the browser requests:

`prefers-reduced-motion: reduce`.

The logical command sequence remains identical.

Only presentation timing changes.

## 11. Deterministic route test

New executable gate:

`scripts/zero-path-routing-check.ts`

It verifies:

- route from spawn to VALI interaction range exists;
- route consists only of cardinal walkable cells;
- VALI route ends adjacent, not on the solid target;
- repeated route query is deterministic;
- route from Home interior toward Metatron crosses the Home threshold;
- a dynamic blocker at the threshold exterior can make the route unreachable;
- click-to-walk reaches an exact free tile;
- click-to-walk refuses a static fixture cell;
- planned VALI steps are individually accepted by `ZeroCommandRuntime`;
- reaching the planned goal makes `ObserveLexeme` acceptable.

Expected success marker:

`ZERO_PATH_ROUTING_CHECK_PASS`.

## 12. Current verification boundary

The implementation and test are committed to the branch.

The current container cannot resolve `github.com`, so it cannot clone the repository or install missing workspace dependencies for a fresh full `pnpm check`.

Hosted GitHub Actions has repeatedly failed before any step executes.

Therefore current classification before hosted execution is:

- path algorithm implementation: `IMPLEMENTED`;
- Web route integration: `IMPLEMENTED`;
- route test: `IMPLEMENTED`;
- structural audit: `PASS`;
- fresh full workspace execution: `RUNNER_PENDING`.

No hosted green claim is made until checkout/tests actually execute.

## 13. Next navigation layers

Possible later extensions:

- click-to-interact as an optional user setting;
- path cancellation/replanning;
- moving Agent blockers;
- path cost by terrain;
- diagonal movement if a World ruleset permits it;
- doors with open/closed costs;
- locomotion capabilities;
- accessibility destination list;
- Agent path planning using the same topology package;
- journey aggregation/read models to avoid presenting every movement checkpoint as narrative history.

The same authority invariant remains:

`PLANNER PROPOSES; DOMAIN AUTHORIZES`.
