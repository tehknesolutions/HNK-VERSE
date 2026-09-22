# HNK-VERSE — ZERO HOME + LAND DESIGN V0.1

**Status:** PROPOSAL — awaiting Creator lock  
**Date:** 2026-09-22  
**Parent:** HNK-VERSE GDD V0.1 / ZERO Content Selection V0.1 LOCK  
**Scope:** ZERO / Malkuth / first 10-minute playable environment

## 1. Design objective

ZERO HOME + LAND must prove the product thesis spatially:

> **The player inhabits a place, learns something, works with matter, creates an object, changes the place, forms history with an Agent, leaves, returns, and the place remembers.**

The environment must be:

- small enough to understand in seconds;
- large enough to feel like a place rather than a menu;
- readable in isometric / near-isometric projection;
- touch-friendly on mobile;
- deterministic enough for automated fixtures;
- expandable without replacing its world model.

## 2. Spatial principle

HOME is the first life anchor.

LAND is the first owned/controlled manifestation surface.

They remain separate domain concepts even when rendered as one continuous scene:

LAND
→ contains HOME footprint
→ contains exterior work/resource spaces
→ exposes ownership + placement permissions

HOME
→ contains rest/storage/history functions
→ expresses the player's persistent modifications

## 3. Logical grid

**Implementation proposal:** use a logical orthogonal grid beneath isometric projection.

ZERO Land logical bounds:

- width: 18 cells;
- height: 14 cells;
- origin: northwest logical corner;
- coordinate system: X eastward, Y southward.

This is a GDD implementation decision, not HNK canon.

The renderer may project each logical cell isometrically while domain positions remain renderer-independent.

## 4. Area zoning

ZERO Land is divided into six readable functional zones:

1. HOME INTERIOR
2. PORCH / THRESHOLD
3. WORK AREA
4. METATRON / CARTOGRAPHY AREA
5. WOOD SOURCE
6. OPEN PLACEMENT / WALKING LAND

The player should understand these zones through environment layout before relying on labels.

## 5. Proposed logical map

Legend:

- H = Home interior
- B = Bed / Rest
- P = player spawn
- S = initial editable Storage Placement Zone
- D = doorway
- W = workbench / work locus
- V = VALI discovery surface
- M = Metatron
- C = cartography table / map object
- R = Wood resource node
- . = walkable owned Land
- # = visual/property boundary

Logical sketch, not final art:

~~~text
Y
01  ##################
02  # H H H H H H....#
03  # H B H H H H....#
04  # H H P H H H....#
05  # H H S S H H....#
06  # H H S S H D W..#
07  # H H H H H H V..#
08  # .........M C...#
09  # ...............#
10  # ............R..#
11  # ............R..#
12  # ...............#
13  # ...............#
14  ##################
    123456789012345678
                X →
~~~

Exact art silhouettes may adjust, but the functional topology should remain stable unless explicitly amended.

## 6. HOME footprint

Candidate logical footprint:

- X = 2..7
- Y = 2..7

The Home starts as a modest one-room structure.

Required initial fixed functions:

### Bed / Rest
- fixed world entity;
- recovers the ZERO soft Energy/Rest state;
- not movable in first ZERO implementation.

### Spawn
- Avatar starts inside Home at a stable spawn cell.
- Returning sessions restore the Avatar to last safe position when valid; otherwise Home spawn acts as fallback.

### Storage Placement Zone
- starts empty;
- reserved area visually suggests that the Home can be changed;
- the first Wooden Box may be placed here;
- after placement, the previously empty zone becomes visible history.

The Home deliberately starts slightly incomplete.

The first player creation completes a missing function instead of adding meaningless decoration.

## 7. Threshold / doorway

The door/threshold is the first transition from private Home to owned Land.

ZERO does not require interior scene loading.

Preferred first implementation:

- Home and exterior exist in one continuous World Instance;
- walls use controlled occlusion/fade;
- crossing the doorway requires no loading screen.

This keeps the first loop spatially coherent.

## 8. Work Area

The work area sits directly outside/adjacent to Home.

It contains one pre-existing Workbench / Work Locus.

The Workbench is not the first player creation.

Its purpose is to provide the first transformation process:

WOOD
+ KNOWLEDGE
+ VALID WORK ACTION
→ WOODEN BOX

Minimum Workbench actions:

- inspect;
- work/create;
- show locked requirement before knowledge;
- show available Wooden Box process after requirements are met.

## 9. VALI discovery surface

The Work Area contains one readable HNK-language discovery surface.

Selected source asset:

**VALI / LEX-013 — trabalho / trabalhar**

ZERO must use the recovered/FROZEN source form without pretending it is L07 vocabulary.

### Before discovery

The player can see:

**VALI**

but the UI does not automatically reveal its meaning.

Inspection records:

- form observed;
- meaning unknown to Persona;
- source reference preserved.

### Discovery

Metatron may provide source-bounded teaching/context after the player inspects the form.

The game then records:

PERSONA_KNOWS_LEXEME(LEX-013)

### After discovery

The same surface may reveal:

**VALI — trabalho / trabalhar**

and the Workbench action vocabulary becomes semantically clearer.

This is ZERO's first perception/knowledge gate.

The physical object does not change.

The Persona's available information changes.

## 10. Metatron area

Metatron begins near a small cartography/work table outside Home.

Stable Agent ID:

**AGENT-ZERO-CARTOGRAPHER-001**

Display name:

**Metatron**

Locked ZERO role:

- Witness;
- Mirror;
- Cartographer;
- Critic;
- Investigation Companion;
- Builder.

### Spatial purpose

Metatron should be:

- visible soon after the player exits Home;
- near enough to the Work Area to react naturally;
- not blocking the player's path;
- clearly part of the place rather than a floating dialogue UI.

### Initial Agent goal

Candidate:

**Help the player understand the first material transformation without performing it for them.**

### Initial knowledge boundary

Metatron knows:

- the local Workbench exists;
- the source meaning of VALI;
- Wood can be gathered locally;
- the player can attempt the first practical construction.

Metatron does not know everything about the Personal Verse.

## 11. Wood source

ZERO uses one finite deterministic Wood source.

Recommended fixture:

**RESOURCE-NODE-WOOD-ZERO-001**

Initial stock:

**4 Wood units**

Rationale:

- 3 Wood units are consumed by the Wooden Box process;
- 1 Wood unit remains for the ownership-transfer/social proof.

This produces a deterministic economy loop without adding currency or respawn complexity.

### Resource interaction

Before the practical-knowledge gate:
- the node may be inspectable;
- gather action may be hidden or unavailable depending on final interaction spec.

After the gate:
- gather action becomes available/clear;
- each gather produces an authoritative event;
- node quantity decreases;
- player inventory quantity increases.

No infinite resource generation is required in ZERO.

## 12. First creation cost

Locked ZERO content:

**Wooden Box**

Candidate deterministic recipe:

**3 × Wood → 1 × Wooden Box**

No additional material is required in ZERO.

The recipe is a gameplay simplification for the vertical slice and does not claim a canonical real-world woodworking procedure.

## 13. Wooden Box placement

The first Wooden Box is:

- player-owned;
- placeable;
- movable by owner;
- inspectable;
- a storage container.

### Initial preferred placement

The Home Storage Placement Zone provides the tutorial/default location.

The player may preview other valid owned cells, but the tutorial should guide toward the Home storage zone.

### Placement validation

Valid if:

- target cell belongs to player's owned Land/Home permission scope;
- target is unoccupied;
- object footprint fits;
- player owns the Box;
- no canonical/system lock blocks the cell.

Invalid placement must explain why.

## 14. First visible world-history change

Before creation:

HOME_STORAGE_ZONE = EMPTY

After creation:

HOME_STORAGE_ZONE = WOODEN_BOX_INSTANCE

This must persist.

On return, the box is not reconstructed from tutorial progress; it is loaded from authoritative World State.

That distinction is mandatory.

## 15. First Agent reaction

Metatron subscribes to or observes the relevant world event.

After the box is successfully placed, Agent memory records a bounded episode such as:

- player created a Wooden Box;
- player placed it at Home;
- world state changed.

The exact dialogue remains narrative content, but it must be derived from the event, not fabricated without state.

## 16. First ownership transfer

After the Box is placed, one Wood unit remains.

Candidate social proof:

PLAYER offers 1 Wood to Metatron.

Deterministic Agent policy for ZERO:

### Before player completes the Box
Metatron refuses transfer for tutorial/system reason:
- the material is still needed for the player's first manifestation task.

### After Box placement
Metatron may accept the remaining 1 Wood.

If accepted:

- Player ownership decreases by 1 Wood;
- Metatron ownership/inventory increases by 1 Wood;
- an OwnershipTransfer event is written;
- relationship history records the gift;
- Agent episodic memory records the exchange.

Exact numeric Trust delta remains a balancing implementation detail; the historical relationship event is authoritative.

## 17. Chronicle point

After creation + Agent exchange, ZERO opens or offers the Chronicle surface.

Required generated record references:

- VALI discovery;
- first Wood gathering;
- first successful practical creation;
- Wooden Box placement;
- first meaningful exchange with Metatron.

The player may add one free-form reflection.

The reflection remains HUMAN_AUTHORED_INTERPRETATION, not Event Ledger truth.

## 18. Ten-minute spatial choreography

### Phase A — Inhabit
1. Spawn inside Home.
2. Move toward doorway.
3. Observe that the storage zone is empty.

### Phase B — Encounter
4. Exit to porch/work area.
5. See Metatron and Workbench.
6. Inspect VALI surface.

### Phase C — Learn
7. Persona registers unknown VALI form.
8. Interact with Metatron.
9. Metatron provides bounded teaching/context.
10. Persona knowledge records VALI meaning.
11. Practical-manifestation knowledge gate becomes available.

### Phase D — Gather
12. Walk to nearby Wood source.
13. Gather 4 Wood units.

### Phase E — Practice/Create
14. Return to Workbench.
15. Perform Basic Practical Work.
16. Domain records practice attempt/result.
17. Skill receives evidence.
18. Consume 3 Wood.
19. Create Wooden Box.

### Phase F — Manifest
20. Enter placement mode.
21. Preview Box in Home storage zone.
22. Validate permission/occupancy.
23. Place Box.
24. World State changes.
25. Renderer reflects state.

### Phase G — Relationship
26. Metatron reacts to placement.
27. Offer remaining 1 Wood.
28. Transfer succeeds under post-creation rule.
29. Relationship/history/memory update.

### Phase H — Record/Persist
30. Chronicle displays derived events.
31. Player writes optional reflection.
32. Exit/save.
33. Reload.
34. Verify Home, Box, knowledge, skill, Agent memory, ownership and Chronicle.

## 19. Camera and occlusion

ZERO should prioritize reliable interaction.

Candidate camera behavior:

- fixed isometric/near-isometric angle;
- bounded zoom;
- no free rotation in ZERO;
- walls fade/cut when they obstruct Avatar or target;
- selectable entities maintain reliable hit areas at default mobile zoom.

No camera feature should require duplicate directional asset production before it is proven valuable.

## 20. Mobile readability

Mobile must complete the same loop.

Requirements:

- Home, Workbench, Metatron and Wood node remain distinguishable at default mobile scale;
- minimum touch targets are expanded beyond the exact sprite silhouette;
- overlapping object selection can use contextual cycling;
- placement ghost snaps to logical cell;
- invalid placement reason appears near the bottom interaction sheet;
- dialogue/knowledge surfaces use sheets rather than tiny desktop panels.

## 21. Accessibility

The environment must not rely only on color for:

- ownership;
- valid placement;
- resource availability;
- Agent focus;
- knowledge state.

Use shape/icon/text feedback.

Reduced motion disables nonessential pulses/transitions without removing state feedback.

## 22. Initial entity set

ZERO Home/Land requires only these concrete runtime entities:

1. LAND-ZERO-MALKUTH-001
2. HOME-ZERO-MALKUTH-001
3. AVATAR-ZERO-PLAYER-001
4. AGENT-ZERO-CARTOGRAPHER-001 / Metatron
5. ENTITY-BED-ZERO-001
6. ENTITY-WORKBENCH-ZERO-001
7. ENTITY-VALI-SURFACE-ZERO-001
8. ENTITY-CARTOGRAPHY-TABLE-ZERO-001
9. RESOURCE-NODE-WOOD-ZERO-001
10. RESOURCE-WOOD-ZERO-V0
11. ENTITY-WOODEN-BOX-ZERO-V0 / created instance at runtime

Decorative entities may exist, but none may become hidden progression dependencies.

## 23. Initial ownership

Candidate fixture:

- Land → Player HNK Identity / Personal Verse scope;
- Home → Player-controlled;
- Bed → Home-fixed;
- Workbench → Home/Land fixture usable by Player;
- VALI Surface → Home/Land fixture;
- Cartography Table → Metatron/local fixture;
- Wood Node → gatherable local resource source governed by Land rules;
- gathered Wood → Player ownership;
- created Box → Player ownership;
- gifted Wood → Metatron ownership after transfer.

## 24. Initial permissions

Player:

- ENTER Home/Land;
- USE Bed;
- USE Workbench;
- INSPECT VALI Surface;
- GATHER allowed Wood;
- PLACE/MOVE/REMOVE own Wooden Box within valid placement zone;
- TRANSFER owned Wood.

Metatron:

- MOVE within bounded local area;
- INTERACT;
- RECEIVE transfer when Agent policy permits;
- OBSERVE allowed local world events;
- no authority to move/destroy the player's Box;
- no authority to alter HNK canon.

## 25. Persistence proof matrix

After reload verify:

| State | Must persist |
| --- | --- |
| Personal Verse ID | yes |
| World ID | yes |
| Avatar state | yes |
| VALI Persona knowledge | yes |
| Practical knowledge gate | yes |
| Skill evidence/state | yes |
| Wood node remaining quantity | yes |
| Player inventory | yes |
| Wooden Box ID | yes |
| Wooden Box position | yes |
| Wooden Box ownership | yes |
| Metatron ID | yes |
| Metatron episodic memory | yes |
| Metatron inventory after gift | yes |
| Relationship history | yes |
| Chronicle entries | yes |

## 26. Deterministic fixture target

Suggested fixture identity:

**HNK-ZERO-MALKUTH-FIXTURE-V1**

Initial state must deterministically define:

- world/land/home IDs;
- logical coordinates;
- fixed entities;
- Wood stock = 4;
- Player knows neither VALI meaning nor practical-manifestation runtime gate;
- Skill evidence = empty;
- no Wooden Box instance exists;
- Metatron has no player-created-box memory;
- relationship history has no gift event.

Golden completion state must prove the inverse where applicable.

## 27. What HOME + LAND V0.1 does not add

This proposal does not add:

- farming;
- combat;
- creatures;
- portals;
- neighbors/population;
- shop/currency;
- weather simulation;
- seasons;
- city streets;
- multiple rooms;
- advanced furniture catalog;
- free world terraforming;
- unrestricted Creator Studio;
- new HNK words;
- a canonical CODEX-HNK Malkuth ID.

## 28. Candidate lock decisions

1. ZERO begins in one continuous Home + owned Land scene in Malkuth.
2. The logical world uses an 18×14 deterministic grid beneath isometric projection for ZERO.
3. Home begins deliberately incomplete, with an empty storage placement zone.
4. A fixed Workbench provides the first material transformation locus.
5. VALI is discovered at the Work Area and gains meaning through a Persona knowledge/perception transition.
6. Metatron is spatially present near the Work Area as the first persistent Agent.
7. The Wood resource node starts with exactly 4 deterministic units.
8. The Wooden Box costs 3 Wood in ZERO.
9. The remaining Wood unit supports the first ownership-transfer/social proof.
10. Wooden Box placement at Home is the first persistent visible manifestation.
11. Metatron's reaction and memory are downstream of the authoritative placement event.
12. The first gift/transfer is gated after successful Box creation/placement.
13. Home, Workbench, Agent and Wood source exist in one continuous scene without loading transition.
14. ZERO uses fixed/controlled isometric camera with bounded zoom and no free rotation.
15. Desktop and mobile execute the same core spatial loop.
16. Reload must restore the exact placed Box, resource quantities, Agent memory and relationship history from authoritative state.
