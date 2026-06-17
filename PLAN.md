# Jones in the Fast Lane — Remake: PLAN.md

## Art Style Decision

**Clean Geometric Flat** — intentional, not programmer-art:
- Overhead/slightly-angled top-down city map, NOT true isometric (too brittle to
  code correctly without real assets). Roads form a readable grid; buildings are
  bold solid-color shapes with distinct silhouettes and icon labels.
- Color system: each district/location has a signature hue (e.g. bank = deep navy,
  university = warm amber, hospital = teal). Dark charcoal roads, cream sidewalks.
- Player avatar: a small circular sprite with a colored halo, directional indicator,
  and a smooth lerp-movement tween. Clear `// ASSET: swap in character spritesheet
  here` comment where real art goes.
- HUD: dark semi-transparent sidebar left, action panel right. Accent color #F5A623
  (amber) for money, #4FC3F7 (sky) for time, status bars color-shift from green →
  yellow → red as needs drop.
- Week-progress cue: a subtle sky-tint gradient transitions from pale blue (morning)
  to warm orange (evening) to deep purple (night) as daily time units drain.
- All placeholder art uses the same shape + gradient language so the aesthetic is
  coherent; real sprites slot in without restructuring.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | TypeScript + Vite | Fast HMR, strong typing, no config hell |
| Game engine | **Phaser 3** | Scene graph, tweens, input, camera — saves ~2000 lines vs. raw Canvas for this feature set |
| State | Custom Zustand-style store (hand-rolled, ~80 lines) | No extra dependency; fully serializable; time-travel debug-friendly |
| UI overlays | HTML/CSS + vanilla DOM | Panels, menus, and stat displays are DOM — lets us use CSS transitions, flexbox, and real fonts without fighting Phaser's text rendering |
| Persistence | `localStorage` JSON | Client-only, simple, restorable |

> Phaser vs. plain Canvas: Phaser wins here because the avatar pathfinding, location
> hover/click zones, tween movement, and scene stack (city → location interior →
> modal) would all be manual scaffolding in raw Canvas. Phaser's overhead is
> negligible in a turn-based game with <50 sprites.

---

## Repository Structure

```
jones/
├── index.html                  # Mounts #game-container + #ui-root
├── vite.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── PLAN.md
│
├── public/
│   └── assets/
│       ├── sprites/            # PNG spritesheets (placeholder SVG exports for now)
│       ├── fonts/              # Inter + a display font
│       └── audio/              # (M5+) sfx/music stubs
│
└── src/
    ├── main.ts                 # Vite entry → mounts Phaser + UI root
    ├── game.ts                 # Phaser.Game config
    │
    ├── scenes/
    │   ├── BootScene.ts        # Preloads assets, shows progress bar
    │   ├── MenuScene.ts        # Title, difficulty, goal-setting wizard
    │   ├── CityScene.ts        # Main map: locations, avatar, HUD bridge
    │   └── GameOverScene.ts    # Win / lose summary screen
    │
    ├── state/
    │   ├── store.ts            # createStore() — subscribe/getState/setState
    │   ├── types.ts            # All interfaces (GameState, Player, Job, …)
    │   └── initialState.ts     # Factory for a fresh GameState per difficulty
    │
    ├── systems/                # Pure functions; receive/return state slices
    │   ├── TimeSystem.ts       # advanceTime(), endDay(), endWeek()
    │   ├── NeedsSystem.ts      # decayNeeds(), needsEffectOnPerformance()
    │   ├── EconomySystem.ts    # tickPrices(), applyInflation(), calcTax()
    │   ├── CareerSystem.ts     # applyForJob(), work(), calcPay(), promote()
    │   ├── InvestmentSystem.ts # tickMarket(), buy/sellStock()
    │   ├── HousingSystem.ts    # payRent(), upgradeHousing(), buyProperty()
    │   ├── EventSystem.ts      # rollEvents(), resolveEvent(), chainStep()
    │   ├── GoalSystem.ts       # checkWin(), checkLoss(), goalProgress()
    │   └── BankSystem.ts       # deposit(), withdraw(), takeLoan(), calcCredit()
    │
    ├── data/                   # Config files — tune without touching logic
    │   ├── locations.ts        # LocationDef[]: id, name, color, mapPos, actions
    │   ├── jobs.ts             # CareerTrack[], JobDef[]: reqs, pay, title
    │   ├── items.ts            # ItemDef[]: base price, category, effect
    │   ├── housing.ts          # HousingOption[]: cost, rent, prestige, effects
    │   ├── stocks.ts           # StockDef[]: name, volatility, basePrice
    │   └── events.ts           # EventDef[]: trigger, weight, effect, chains
    │
    ├── entities/
    │   ├── Avatar.ts           # Phaser sprite: position, movement tween, animation
    │   └── LocationSprite.ts   # Phaser interactive zone + building graphic
    │
    ├── ui/
    │   ├── HUD.ts              # Mounts/unmounts all DOM panels; bridges store → DOM
    │   ├── components/
    │   │   ├── StatBar.ts      # <div> progress bar, color-shifts by value
    │   │   ├── Toast.ts        # Slide-in event/money notifications
    │   │   ├── Modal.ts        # Blocking dialog (confirm, multi-choice)
    │   │   └── MoneyAnim.ts    # Floating +/- money delta over HUD
    │   └── panels/
    │       ├── StatsPanel.ts   # Left sidebar: needs, money, week, goals
    │       ├── ActionPanel.ts  # Right: location-contextual action list
    │       ├── GoalPanel.ts    # Goal tracker with progress bars
    │       ├── BankPanel.ts    # Account, loans, credit score
    │       ├── InvestmentPanel.ts
    │       ├── ShopPanel.ts    # Item browser with dynamic prices
    │       ├── JobPanel.ts     # Career board, apply/work/quit
    │       └── HousingPanel.ts
    │
    └── utils/
        ├── saveLoad.ts         # serialize/deserialize GameState ↔ localStorage
        ├── rng.ts              # seeded RNG for reproducible event rolls
        ├── math.ts             # clamp, lerp, weightedRandom
        └── format.ts           # formatMoney, formatTime, formatWeek
```

---

## State Model (core interfaces)

```typescript
// state/types.ts (abbreviated)

type CareerTrack = 'trades' | 'tech' | 'finance' | 'healthcare' | 'creative';
type Season      = 'spring' | 'summer' | 'fall' | 'winter';
type Difficulty  = 'easy' | 'normal' | 'hard';

interface Player {
  name: string;
  money: number;

  // Needs: 0–100; decay each time unit passes
  hunger: number;
  energy: number;
  health: number;
  morale: number;

  // Career
  jobId: string | null;
  careerTrack: CareerTrack | null;
  jobPerformance: number;     // 0–100; affects pay, promotion
  jobTenure: number;          // weeks
  experience: Record<CareerTrack, number>;
  education: number;          // cumulative points; maps to degree tiers

  // Finance
  bankBalance: number;
  debt: number;
  creditScore: number;        // 300–850
  portfolio: Record<string, number>; // stockId → shares owned

  // Housing
  housingId: string;
  isOwner: boolean;
  propertyValue: number;

  // Equipment (affects performance/morale/travel)
  wardrobe: number;           // 0–100
  hasComputer: boolean;
  hasTransport: boolean;
}

interface Calendar {
  week: number;               // 1–maxWeeks
  day: number;                // 1–7
  timeUnits: number;          // 0–100; depletes each action/move
  season: Season;
  maxWeeks: number;           // 26 easy / 20 normal / 16 hard
}

interface Economy {
  inflationAccum: number;     // compounds weekly
  taxRate: number;
  marketPrices: Record<string, number>;  // itemId → current price
  stockPrices:  Record<string, number>;  // stockId → current price
  stockHistory: Record<string, number[]>; // last 8 weeks for sparkline
}

interface Goals {
  targetWealth: number;
  targetEducation: number;    // education tier 0–5
  targetCareerRank: number;   // rank within track 0–5
  targetHappiness: number;    // morale ≥ this value at game end
}

interface ActiveEvent {
  id: string;
  chainStep: number;
  expiresWeek: number;
  payload: Record<string, unknown>;
}

interface GameState {
  player: Player;
  calendar: Calendar;
  economy: Economy;
  goals: Goals;
  goalsMet: Record<keyof Goals, boolean>;
  activeEvents: ActiveEvent[];
  eventLog: string[];         // last 20 event descriptions
  currentLocationId: string;
  difficulty: Difficulty;
  isGameOver: boolean;
  winCondition: 'won' | 'lost' | null;
  lossReason: string | null;
}
```

---

## Milestone Breakdown

### M1 — Map, Movement, Clock *(playable skeleton)*
- Vite + Phaser 3 + TS scaffold, `npm run dev` serves a game window
- CityScene renders the city map: 12 named locations as colored building shapes,
  roads, subtle district shading, week-progress sky tint
- LocationSprite: hover highlight, click-to-travel
- Avatar with smooth lerp-tween movement between locations; travel costs time units
- Time/day/week clock: time units drain → day advances → week advances → maxWeeks
  reached = game over (time-out loss)
- Minimal left-sidebar HUD: week, day, time-bar, current location
- **Milestone deliverable:** Walk around the city; watch time drain; week counter ticks.

### M2 — Jobs, Money, Needs, Win Condition *(core loop)*
- NeedsSystem: hunger/energy/health/morale decay per time unit; starvation/collapse
  loss conditions
- Locations activated: Employment Office (browse jobs, apply), Work (clock in), Home
  (sleep, restore energy), Restaurant/Grocery (eat, restore hunger), Clothing Store
- CareerSystem: 3 starter jobs (Gig, Entry Trades, Entry Tech); work action pays
  wages; performance = f(needs, wardrobe); pay-period at week end
- GoalSystem: goal-setting wizard at game start; goal progress panel; all-goals-met
  win screen
- ActionPanel: location-contextual actions with time cost shown; confirm modal
- Toast notifications for events (hired, paid, need warnings)
- **Deliverable:** Full playthrough possible — set goals, get a job, eat/sleep, hit
  goals or run out of time/starve.

### M3 — Economy, Bank, Investments *(financial depth)*
- EconomySystem: base prices per item, weekly inflation tick, season modifiers
  (groceries +15% winter), supply/demand nudge from player purchases
- Sales tax applied at checkout; price history tracked
- BankSystem: savings account (interest weekly), loans (credit-gated rate), credit
  score model (debt ratio, payment history, tenure)
- InvestmentSystem: 6 stocks across sectors; weekly price tick with volatility +
  correlation to season/events; buy/sell panel with sparkline history
- ShopPanel: Electronics Store, General Store activate with dynamic prices and
  "on sale" flags
- HousingSystem: rent due weekly; eviction if missed 2 weeks; RealtyOffice unlocks
  upgrade path
- **Deliverable:** Meaningful choice between saving, investing, and spending. Loan
  mechanic creates risk/reward.

### M4 — Events, Career Ladders, Housing Ladder *(systemic depth)*
- Full career tracks (Trades, Tech, Finance, Healthcare, Creative) each with 5 ranks;
  promotion requires: education tier + experience + performance; demotion/firing on
  sustained poor performance
- EventSystem: 30+ events in data file, weighted daily roll; 4 chained event chains
  (medical crisis, market boom/crash, apartment fire, job opportunity)
- Eviction → shelter (morale/health penalty) implemented; housing upgrades up to
  property ownership (asset appreciation)
- Pawn Shop activates: sell items for fast cash
- University: education courses with time + money cost; unlock career tiers
- End-game summary screen with career retrospective
- **Deliverable:** Rich, emergent playthrough with genuine setbacks and recoveries.

### M5 — Polish, Save/Load, README *(shippable quality)*
- Cohesive CSS design pass: typography, spacing, panel animations (slide in/out),
  color palette enforcement
- MoneyAnim floaters; need-bar color transitions; day/night sky gradient refined
- saveLoad.ts: Ctrl+S saves; load slot on menu; auto-save on week end
- Difficulty screen, tutorial tooltips on first play
- README with run instructions, controls, and system overview
- Sweep for console errors; test full win/loss paths
- **Deliverable:** Meets all acceptance criteria.

### M6 — Hot-seat Multiplayer *(optional stretch)*
- 2–4 players share one browser; after each player's turn the state switches
- Comparative goal/wealth leaderboard; first to complete all goals wins
- Minimal extra code: player array in state, turn-rotation logic in TimeSystem

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Map layout | Fixed grid, not procedural | Locations have narrative identity; fixed layout lets us tune the travel-time economy |
| Time unit | 1 unit = ~30 min in-world | 100 units/day → ~50 actions/day, enough choices without triviality |
| Needs decay rate | Tunable in `data/difficulty.ts` | Hard mode decays 2× faster, creating real urgency |
| Stock market | Deterministic seed + event modifiers | Reproducible; events (crash, boom) create narrative beats, not pure gambling |
| Event randomness | Seeded RNG per week | Same seed = same feel per week; new seed per week = varied playthrough |
| Save format | Single JSON blob in `localStorage['jones-save']` | Simple; survives page refresh; easy to inspect/debug |

---

## Open Questions (for your review)

1. **Multiplayer in scope?** M6 is significant scope; flag if you'd rather skip it.
2. **Audio?** Stubbed in M5 structure; implementing it would extend M5. Confirm if
   you want even placeholder beep-SFX.
3. **Mobile layout?** The sidebar + map layout works on desktop; a portrait-phone
   layout would need a redesign pass. In scope?

---

*Awaiting your OK to begin M1.*
