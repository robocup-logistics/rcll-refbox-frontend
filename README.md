# RCLL RefBox Frontend

Live spectator and referee interface for RoboCup Logistics League (RCLL) games, extended with a KPI analytics dashboard.

## Overview

This is the frontend used to watch and referee RCLL games in real time (live game state, machine and robot status, order tracking). The base application is developed by the RoboCup Logistics League community as part of the Knowledge-Based Systems Group, RWTH Aachen. As part of my bachelor's thesis, I added a KPI analytics dashboard on top of it: a single-game breakdown view, cross-game comparison charts, and a KPI panel integrated into the existing navigation.

## Authorship

This repository is a fork of the official RCLL RefBox frontend: https://github.com/robocup-logistics/rcll-refbox-frontend

The base application (live game view, referee controls, machine and robot visualization, order tracking) is the work of the RCLL project. My contribution, as part of my bachelor's thesis, is the KPI analytics dashboard: 38 Chart.js components, the single-game and cross-game analysis views, the KPI panel and popup, and the API integration in the report store that connects the dashboard to the KPI backend.

## Related repository and thesis

The backend that computes these KPIs (OCEL extraction, KPI engine, and the API this frontend calls) lives in a separate repository, which also contains the full thesis PDF: [mongodb-backend](https://github.com/hakanhkl/mongodb-backend)

Title: Deriving KPIs from OCEL in the RoboCup Logistics League
Author: Hakan Hökelekli
Adviser: Tarik Viehmann, Knowledge-Based Systems Group, RWTH Aachen University
Examiners: Prof. Dr. Gerhard Lakemeyer, Prof. Dr. Wil van der Aalst
Submitted: December 2025

## What the dashboard adds

Single-game view: per-match KPI breakdown (order completion, machine utilization, robot task distribution, timing) for one game.

Cross-game analytics: comparison charts across many games (efficiency versus utilization, success rate distribution, duration comparisons), validated against 562 simulated games and against the RoboCup 2025 championship final in Salvador, where the dashboard's findings on process reliability matched what happened in the real match.

KPI panel: embedded into the existing navigation bar for quick access during live games.

## Requirements

- To referee or watch a game in progress, the [RCLL RefBox](https://github.com/robocup-logistics/rcll-refbox/wiki/Install) is required.
- To load and analyze game reports and KPIs, the [mongodb-backend](https://github.com/hakanhkl/mongodb-backend) is required.

## Usage

The most convenient way to get the frontend running is through Docker. Get the image:

```
docker pull quay.io/robocup-logistics/rcll-refbox-frontend
```

and launch it, specifying the port mapping you prefer, e.g. `4173`:

```
docker run -it -p 4173:80 quay.io/robocup-logistics/rcll-refbox-frontend
```

You may then access the frontend at `localhost:4173`.

> [!IMPORTANT]
> By default, the application is restricted to watching live games only. If you are a referee or want to review game reports and KPIs, you can unlock these options by pressing the secret key combination `Ctrl` + `Alt` + `O`. In the referee view, you will then find a `Help` option for instructions on how to referee a game.

> [!NOTE]
> Firefox currently has some issues with displaying vertical text. Even though a workaround was applied, expect some weird padding and scrollbars. For the best experience, use a web browser based on Chromium.

## Get it running locally

Follow these steps to get the frontend running locally instead:

- [Download](https://nodejs.org/en/download/current) and install `Node.js`. For most Linux versions, preferably install Node.js via your package manager instead, see this command for Fedora:

  ```
  dnf install nodejs
  ```

- Install `yarn` with npm (which should come preinstalled with Node.js):

  ```
  npm install --g yarn
  ```

- Install the dependencies, build and serve:

  ```
  yarn install
  yarn run build
  yarn run serve
  ```

## Tech stack

Frontend: Vue 3 (Composition API), TypeScript, Vite
State: Pinia
UI: Vuetify
Charts: Chart.js, vue-chartjs, chartjs-chart-boxplot
Communication: WebSocket to the RefBox, REST calls to the KPI backend

## Encountered an issue?

Please leave some feedback on [GitHub](https://github.com/robocup-logistics/rcll-refbox/issues).

## Note

This repository is preserved as a portfolio piece and thesis artifact. It is not actively maintained beyond the state submitted with the thesis.
