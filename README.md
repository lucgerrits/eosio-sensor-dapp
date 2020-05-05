# EOSIO Sensor dApp

This project uses EOSIO blockchain combined with a REACT single page application.

## Features

- login (to login in the app)
- log (to send a new data log from a sensor)

## Requirement

The easiest way to have all requirements is to use [EOS Studio](https://www.eosstudio.io/).

- At least one EOS instance running
- Accounts:
  - Use an account called **sensordapp** to deploy the smart contract.
  - Create a *bob* account and use its private key to login the app.
- 

## Installation

**dev mode**: By starting REACT dev mode :

```bash
cd frontend
npm run start
```

**production mode**: First build, then open the app:

```bash
cd frontend
npm run build
```
Now run the app localy using *serve* :
```bash
#install serve globally
npm install -g serve 
serve -s ./build
```


## Usage

First login using a created account on your instance :

![Login](./docs/Screenshot_2020-04-30%20EOSIO%20Sensor%20dApp%20login.png "icon")

Then you should see this :

![Dashboard](./docs/Screenshot_2020-04-30%20EOSIO%20Sensor%20dApp.png "icon")


After that you can add & view the sensors logs you sended via the dapp.


## Perspectives

- Build a C++ client to use the EOS app:
  - -> Combine EOS SDK with a custom library.

- Run benchmarks with this app to see limits of tables & EOS smart contracts

## TODO

- ~~Fix sensor log count using an increment in the smart contract~~
- Add Ricardian contract
- Add en/decryption
- share system between accounts

