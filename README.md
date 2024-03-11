# rcll-refbox-frontend

A web frontend for the RoboCup Logistics League. Connect to the RCLL refbox and
watch a game in progress with excitement or moderate the game as a referee. The
frontend additionally offers the possibility to connect to a MongoDB backend to
and analyze load game reports in the familiar interface but with extended
possibilities like watching at the desired speed and jumping straight in to the
interesting action.

## Requirements

- In order to referee or watch a game in progress, the [RCLL RefBox](https://github.com/robocup-logistics/rcll-refbox/wiki/Install) is required.
- In order to load and analyze game reports stored in a MongoDB, the [MongoDB Backend](https://github.com/robocup-logistics/mongodb-backend) is required.

## Usage

The most convenient way to get the frontend running is through docker.Simply get
the docker image via

```
docker pull quay.io/robocup-logistics/rcll-refbox-frontend
```

and launch it by by specifying the port mapping that you prefer, e.g. `4173`:

```
docker run -it -p 4173:80 quay.io/robocup-logistics/rcll-refbox-frontend
```

You may then access the frontend at `localhost:4173`.

> [!IMPORTANT]
> By default, the application is restricted to watching live games only. If you
> are an referee or want to review a game reports, you can unlock these options
> by pressing the secret key combination `Ctrl` + `Alt` + `O`. In the referee
> view, you will then find a `Help` option for instructions on how to referee a
> game.

> [!NOTE]
> Firefox currently has some issues with displaying vertical text. Eventhough a
> workaround was applied, expect some weird padding and scrollbars. For the best
> experience, use a web browser based on Chromium.

## Get it running locally

Follow these steps to get the frontend running locally instead

- [Download](https://nodejs.org/en/download/current) and install `Node.js`. For
  most Linux versions, preferably install Node.js via your package manager
  instead, see this command for Fedora:

  ```
  dnf install nodejs
  ```

- Install `yarn` with npm (which should come preinstalled with Node.js)

  ```
  npm install --g yarn
  ```

- Install the dependencies, build and serve

  ```
  yarn install
  yarn run build
  yarn run serve
  ```

## Encountered an issue?

Please leave some Feedback on
[GitHub](https://github.com/robocup-logistics/rcll-refbox/issues).
