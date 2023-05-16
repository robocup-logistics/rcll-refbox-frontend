# rcll-refbox-frontend

A web frontend for the RCLL RefBox

## Requirements

1. nodejs (node version 11.10.1 or above)

   On fedora you may install it via

   ```
   dnf install nodejs
   ```

2. yarn

   Install it globally via npm (should be automatically installed with nodejs)

   '''
   npm install --g yarn
   '''

3. the [rcll refbox](https://github.com/robocup-logistics/rcll-refbox/wiki/Install)

   The latest master is required as the backend to this frontend got introduced in
   [this pull request](https://github.com/robocup-logistics/rcll-refbox/pull/79).

## Bugs and Limitations

Report any issues you encounter on [github](https://github.com/carologistics/rcll-refbox-frontend/issues).

## Docker setup

You can get the docker image via:

```
docker pull quay.io/robocup-logistics/rcll-refbox-frontend
```

Launch it by by specifying the port mapping that you prefer, here 4173 is chosen:

```
docker run -it -p 4173:80 quay.io/robocup-logistics/rcll-refbox-frontend
```

## Project setup

```
yarn install
yarn run build
```

### To run locally

```
yarn run serve
```

The frontend runs on [port 4173](http://localhost:4173) per default and connects
via a tcp websocket on port 1234 (configurable in the refbox and via a button
in the frontend).

In order to start a game through the frontend follow these steps:

1. type in your team name on cyan (corresponds to old refbox `<f4>` -> `<cyan>` -> `<teamname>`)
2. press the resume button in the middle (on startup this equivalents to pressing `<space>`)
3. navigate through the phases using the clickable list or the arrow buttons
