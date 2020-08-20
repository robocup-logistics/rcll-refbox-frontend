# rcll-refbox-frontend
A web frontend for the RCLL RefBox

## Requirements
1. nodejs (node version 11.10.1 or above)

   On fedora you may install it via
   ```
   dnf install nodejs
   ```
2. the [rcll refbox](https://github.com/robocup-logistics/rcll-refbox/wiki/Install)

   The latest master is required as the backend to this frontend got introduced in
   [this pull request](https://github.com/robocup-logistics/rcll-refbox/pull/79).


## Bugs and Limitations
Report any issues you encounter on [github](https://github.com/carologistics/rcll-refbox-frontend/issues).

Currently only playing as team cyan is supported.


## Project setup
```
cd frontend-client/
npm install
```

### To run locally
```
npm run serve
```

The frontend runs on [port 8080](http://localhost:8080) per default and connects
via a tcp websocket on port 1234 (configurable in the refbox and via a button
in the frontend).

In order to start a game through the frontend follow these steps:
1. type in your team name on cyan (corresponds to old refbox `<f4>` -> `<cyan>` -> `<teamname>`)
2. press the resume button in the middle (on startup this equivalents to pressing `<space>`)
3. navigate through the phases using the clickable list or the arrow buttons
