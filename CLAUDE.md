# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CashFlow Online — a browser-based, multiplayer companion app for the "CashFlow" board game. There is no build step, no bundler, no package manager, and no test suite: it's plain HTML/CSS/JS served as static files, syncing game state through Firebase Realtime Database. Open `index.html` (player client) or `gm.html` (game master console) directly, or serve the directory with any static file server.

## Running / developing

- No install, build, or lint commands exist. Edit the files and reload the page in a browser.
- To test locally with Firebase sync working from `file://`, serve over HTTP instead (e.g. `npx serve .` or `python -m http.server`), since some browsers restrict service workers / modules on `file://`.
- There is a registered service worker (`sw.js`) that precaches the app shell. When iterating on `index.html`/`engine.js`/`board.js`/`cards.js`/`lang.js`, hard-reload (bypass cache) or bump the `CACHE` name in `sw.js`, otherwise stale files get served.
- Both `index.html` and `gm.html` embed their own copy of the Firebase config (`firebaseConfig`) and initialize Firebase independently via the modular SDK loaded from the `gstatic.com` CDN.

## Architecture

Two HTML entry points share the same set of plain `<script>` files but play different roles:

- **`index.html`** — the player client. One instance per player's device. Renders a 4-tab layout (Report / Income / Expenses / Skills), handles rolling dice on the player's turn, drawing cards, and submitting decisions.
- **`gm.html`** — the game master console. One instance run by whoever facilitates the session. Creates/manages the session, advances turns, resolves cards, and has visibility into all players' state.

Both files are large, self-contained single-page apps (HTML + inline `<style>` + inline `<script>` in the same file) — there's no component framework or module system splitting up the UI. Shared logic instead lives in plain global-scope `.js` files loaded via `<script>` tag (not ES modules, except for the Firebase SDK imports):

- **`engine.js`** — pure calculation functions, no DOM access and no implicit global state (the comment at the top says as much). Computes income (`fi`, `totalInc`), expenses (`totalExp`), cashflow (`bal`), and deposit interest, given a plain `state` object passed in as an argument. Also exports static reference data (`UNI_SPECS`, `COL_SPECS`, `FIELDS`) and is dual-loaded as a CommonJS module (`module.exports`) or a browser global, so it can be required directly in non-browser contexts (e.g. quick node-based checks) without touching the DOM.
- **`board.js`** — the 24-cell board (`BOARD_CELLS`), position math (`nextPosition`, `getCellAt`, `getCellCenter`), SVG token rendering (`updateBoardTokens`), and the bulk of the Firebase read/write helpers used by both clients (`window._fbJoinSession`, `window._fbGrantTurn`, `window._fbRollDice`, `window._fbListenSession`, `window._fbPlayerDecision`, `window._fbSetCard`). These helpers assume `window._fbRef`/`_fbSet`/`_fbGet`/`_fbUpdate`/`_fbOnValue` have already been set by the host HTML file's Firebase init `<script type="module">` block.
- **`cards.js`** — static card decks (`CARDS.emp/self/random/startup/deal/course/training/expense`) plus `drawCard(type)`. Card data and game logic constants (job requirements, deal multipliers, training bonuses, etc.) live here, not in the HTML.
- **`lang.js`** — UI string translations (`LANGS`), with `L(key, ...args)` / `setLang` / `getLang` / `applyLang` driving runtime i18n. Default/fallback language is Ukrainian (`LANGS.UA`).

### State model & sync

All session state lives in Firebase Realtime Database under `sessions/{sessionId}`, structured roughly as:

```
sessions/{sessionId}/
  status, currentTurn, turnPhase, lastRoll, currentCard, cardTypeRequest, playerDecision
  players/{playerKey}/
    playerName, position, laps, round, online, cash
    incomes[], courses[], trainings[], deals[], loans{ bankRem, microRem }, exp{...}
```

`turnPhase` is the single source of truth for where a turn is in its lifecycle (e.g. `rolling` → `choosing` → `deciding` → `done`) and both `index.html` and `gm.html` react to it via `window._fbOnValue` listeners on the whole session node. When adding a new turn step, thread it through `turnPhase` rather than introducing parallel ad-hoc flags — see the recent refactor "unify turn flow under single turnPhase source of truth" for precedent.

Income/expense math is centralized in `engine.js`: any change to how pay, multipliers, courses, or expenses are calculated should go there so both clients (and anything else that reads player state) stay consistent, rather than duplicating formulas inline in `index.html`/`gm.html`.

### Localization

Game/UI text is Ukrainian by default. New user-facing strings should be added to `lang.js`'s `LANGS` dict and referenced via `L('key')` rather than hardcoded in the HTML files, to keep translations centralized.
