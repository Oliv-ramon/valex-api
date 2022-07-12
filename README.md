<details>
  <summary>
    Table of Content
  </summary>

- [Description](#description)
- [Motivation](#motivation)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Creating the database](#creating-the-database)
  - [Running](#running)
- [Documentation](#documentation)
  - [POST /cards](#create-card)
  - [PATCH /cards/:cardId/activate](#get-health)
  - [PATCH /cards/:cardId/block](#get-health)
  - [PATCH /cards/:cardId/unblock](#get-health)
  - [POST /cards/:originalCardId/virtuals](#get-health)
  - [DELETE /cards/virtuals/:virtualCardId](#get-health)
  - [GET /transactions/:cardId/balance](#get-health)
  - [POST /transactions/:cardId/recharge](#get-health)
  - [POST /transactions/:cardId/purchase/:businessId](#get-health)
  - [POST /transactions/purchase/online/:businessId](#get-health)

</details>

## Description

A RESTful API that gives you the power to create, recharge, activate, block and delete a benefits card, it can also process purchases using these cards! This project has study porpose, so the context here is fictionary.

## Motivation

I build this project to validate my knowledge about RESTful APIs, typescript, DRY code concept, layered architecture and global error handling usage.

This project is part of my portfolio, so any feedback about the project, code, or anything you can report that could make me a better developer will be welcome!

## Technologies

- NodeJs
- Express
- Typescript
- PostgreSql
- Joi
- Bcrypt
- Dayjs
- FakerJs

## Features

- [x] [Create a card](#get-health)
- [x] [Activate a card](#post-authlogin)
- [x] [Block a card](#post-authlogin)
- [x] [Unblock a card](#post-authlogin)
- [x] [Create a virtual card given an existing card](#post-authsign-up)
- [x] [Delete a virtual card given an existing card ]()
- [x] [List transactions and the balance of a card]()
- [x] [Reacharge a card]()
- [x] [Make a purchase with a card on a business]()
- [x] [Make an online purchase]()

## Getting Started

### Prerequisites

You'll need a basic environment with NodeJS 15+ installed and PostgreSql installed.

### Installation

```bash
# cloning the Repository
$ git clone https://github.com/Oliv-ramon/valex-api

$ cd valex-api

# installing dependencies
$ npm install
```

### Creating the database

```bash
# navigating to the database folder
$ cd database

# running the creating script
bash ./create-database
```

### Running

You need a `.env` file just like the `.env.example`.

```bash
$ npm run dev
```

## Documentation

The schemas of the bodies can be found in the schemas folder.

- POST /cards
  - Companies with a valid API key can create cards with the MASTERCARD flag for their employees (the database already have a company with 2 employees). Employees can have just one card per type ("groceries", "restaurant", "transport", "education", "health").
  - Headers example:
    <br>
    `{ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" }`
  - Body example:
    <br>
    `{ "employeeId": "2", "type": "education", "flag": "MASTERCARD" }`
  - Response example:
    <br>
    `{ "id": 1, "employeeId": "2", "type": "education", "flag": "MASTERCARD", "originalCardId": null, "number": "4681 4651 3244 5940", "cardholderName": "CICLANA M MADEIRA", "securityCode": "285", "expirationDate": "07/27", "password": null, "isVirtual": false, "isBlocked": true }`

<br>

- PATCH /cards/:cardId/activate
  - Employees can activate their cards by giving a password for the card and it's CVC.
  - Url example: http://localhost:4000/cards/1/activate
  - Body example:
    <br>
    `{ "CVV": "285", "password": "2309" }`
  - Response example: "OK"

<br>

- PATCH /cards/:cardId/block
  - Employees can block their cards by giving the card password and CVC.
  - Url example: http://localhost:4000/cards/1/block
  - Body example:
    <br>
    `{ "CVV": "285", "password": "2309" }`
  - Response example: "OK"

<br>

- PATCH /cards/:cardId/unblock
  - Employees can unblock their cards by giving the card password and CVC.
  - Url example: http://localhost:4000/cards/1/unblock
  - Body example:
    <br>
    `{ "CVV": "285", "password": "2309" }`
  - Response example: "OK"

<br>

Employees can create virtual cards and link them to existing cards giving the identifier of the original card and its password.

- POST /cards/:originalCardId/virtuals
  - Employees can create virtual cards and link them to existing cards giving the identifier of the original card and its password.
  - Url example: http://localhost:4000/cards/1/virtuals
  - Body example:
    <br>
    `{ "password": "2309", "flag": "MASTERCARD" }`
  - Response example:
    <br>
    `{ "id": 8, "employeeId": 2, "number": "6324 2035 8976 0546", "cardholderName": "CICLANA M MADEIRA", "securityCode": "$2b$10$xeoMufqcU36jv7NgMRPiOOLLacGa9.KNqfisArlpnIBkcI3pUz6Uq", "expirationDate": "07/27", "password": null, "isVirtual": true, "originalCardId": 1, "isBlocked": false, "type": "education" }`

<br>

- DELETE /cards/virtuals/:virtualCardId
  - Employees can delete their virtual cards giving the identifier of the virtual card and its password.
  - Url example: http://localhost:4000/cards/virtuals/8
  - Body example:
    <br>
    `{ "password": "2309" }`
  - Response example: "OK"

<br>

- GET /transactions/:cardId/balance
- POST /transactions/:cardId/recharge
- POST /transactions/:cardId/purchase/:businessId
- POST /transactions/purchase/online/:businessId
