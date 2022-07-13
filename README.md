# 💳 Valex-Api

<details>
  <summary style="font-size: 19px;">
  Table of Content
    
  </summary>

- [Description](#-description)
- [Motivation](#-motivation)
- [Technologies](#-technologies)
- [Getting Started](#-getting-started)
  - [Installation](#installation)
  - [Creating the database](#creating-the-database)
  - [Running](#running)
- [Documentation](#-documentation)
  - [POST /cards](#-post-cards)
  - [PATCH /cards/:cardId/activate](#patch-cardscardidactivate)
  - [PATCH /cards/:cardId/block](#patch-cardscardidblock)
  - [PATCH /cards/:cardId/unblock](#patch-cardscardidunblock)
  - [POST /cards/:originalCardId/virtuals](#post-cardsoriginalcardidvirtuals)
  - [DELETE /cards/virtuals/:virtualCardId](#delete-cardsvirtualsvirtualcardid)
  - [GET /transactions/:cardId/balance](#get-transactionscardidbalance)
  - [POST /transactions/:cardId/recharge](#post-transactionscardidrecharge)
  - [POST /transactions/:cardId/purchase/:businessId](#post-transactionscardidpurchasebusinessid)
  - [POST /transactions/purchase/online/:businessId](#post-transactionspurchaseonlinebusinessid)

</details>

## 📝 Description

A RESTful API that gives you the power to create, recharge, activate, block, and delete a benefits card, it can also process purchases using these cards! This project has a study purpose, so the context here is fictionary.

In the API context, we have pre-signed companies with their employees and some business where employees can spend. Companies can create and recharge benefit cards for their employees. The employee can activate and block their cards, and create and delete a virtual card to their original card for online purchases.

## 🎯 Motivation

I build this project to test my knowledge about RESTful APIs, typescript, DRY code concept, layered architecture and global error handling usage.

This project is part of my portfolio, so any feedback about the project, code, or anything you can report that could make me a better developer will be welcome!

## 💻 Technologies

- NodeJs
- Express
- Typescript
- PostgreSql
- Joi
- Bcrypt
- Dayjs
- FakerJs

## ✨ Features

- [x] [Create a card](#post-cards)
- [x] [Activate a card](#patch-cardscardidactivate)
- [x] [Block a card](#patch-cardscardidblock)
- [x] [Unblock a card](#patch-cardscardidunblock)
- [x] [Create a virtual card given an existing card](#post-cardsoriginalcardidvirtuals)
- [x] [Delete a virtual card given an existing card ](#delete-cardsvirtualsvirtualcardid)
- [x] [List transactions and the balance of a card](#get-transactionscardidbalance)
- [x] [Reacharge a card](#post-transactionscardidrecharge)
- [x] [Make a purchase with a card on a business](#post-transactionscardidpurchasebusinessid)
- [x] [Make an online purchase](#post-transactionspurchaseonlinebusinessid)

## 🚀 Getting Started

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

## 📚 Documentation

The schemas of the bodies can be found in the schemas folder.

- #### POST /cards
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

- #### PATCH /cards/:cardId/activate
  - Employees can activate their cards by giving a password for the card and it's CVC.
  - Url example: http://localhost:4000/cards/1/activate
  - Body example:
    <br>
    `{ "CVV": "285", "password": "2309" }`
  - Response example: "OK"

<br>

- #### PATCH /cards/:cardId/block
  - Employees can block their cards by giving the card password and CVC.
  - Url example: http://localhost:4000/cards/1/block
  - Body example:
    <br>
    `{ "CVV": "285", "password": "2309" }`
  - Response example: "OK"

<br>

- #### PATCH /cards/:cardId/unblock
  - Employees can unblock their cards by giving the card password and CVC.
  - Url example: http://localhost:4000/cards/1/unblock
  - Body example:
    <br>
    `{ "CVV": "285", "password": "2309" }`
  - Response example: "OK"

<br>

Employees can create virtual cards and link them to existing cards by giving the identifier of the original card and its password.

- #### POST /cards/:originalCardId/virtuals
  - Employees can create virtual cards and link them to existing cards by giving the identifier of the original card and its password.
  - Url example: http://localhost:4000/cards/1/virtuals
  - Body example:
    <br>
    `{ "password": "2309", "flag": "MASTERCARD" }`
  - Response example:
    <br>
    `{ "id": 8, "employeeId": 2, "number": "6324 2035 8976 0546", "cardholderName": "CICLANA M MADEIRA", "securityCode": "$2b$10$xeoMufqcU36jv7NgMRPiOOLLacGa9.KNqfisArlpnIBkcI3pUz6Uq", "expirationDate": "07/27", "password": null, "isVirtual": true, "originalCardId": 1, "isBlocked": false, "type": "education" }`

<br>

- #### DELETE /cards/virtuals/:virtualCardId
  - Employees can delete their virtual cards by giving the identifier of the virtual card and its password.
  - Url example: http://localhost:4000/cards/virtuals/8
  - Body example:
    <br>
    `{ "password": "2309" }`
  - Response example: "OK"

<br>

- #### GET /transactions/:cardId/balance
  - Employees can list the card transactions and get their balance by giving the card identifier.
  - Url example: http://localhost:4000/cards/1/balance
  - Response example:
    <br>
    `"balance": 50000, "recharges": [ { "id": 1, "cardId": 1, "timestamp": "12/07/2022", "amount": 10000 }, { "id": 2, "cardId": 1, "timestamp": "12/07/2022", "amount": 50000 } ], "transactions": [ { "id": 1, "cardId": 1, "businessId": 1, "timestamp": "12/07/2022", "amount": 10000, "businessName": "Responde Aí" } ] }`

<br>

- #### POST /transactions/:cardId/recharge
  - Companies with a valid API key can recharge their employees' cards by giving the card identifier and the amount to recharge. Just non-virtuals cards can be recharged.
  - Url example: http://localhost:4000/cards/1/recharge
  - Headers example:
    <br>
    `{ "x-api-key": "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0" }`
  - Body example:
    <br>
    `{ "amount": 10000 }`
  - Response example: "OK"

<br>

- #### POST /transactions/:cardId/purchase/:businessId
  - Employees can make a presential purchase by giving the card identifier, its password, the business identifier, and the amount paid. Only non-virtuals cards can make this type of purchase.
  - Url example: http://localhost:4000/cards/1/purchase/2
  - Body example:
    <br>
    `{ "amount": 10000 }`
  - Response example: "OK"

 <br>

- #### POST /transactions/purchase/online/:businessId
  - Employees can buy online by giving the card details (number, cardholderName, expiration date, and CVC), card password, the business identifier, and the purchase amount. Only virtuals cards can make this type of purchase.
  - Url example: http://localhost:4000/transactions/purchase/online/1
  - Body example:
    <br>
    `{ "cardDetails": { "number": "7612 5600 8093 5153", "cardholderName": "FULANO R SILVA", "securityCode": "528", "expirationDate": "07/27" } , "amount": 1000, "password": "1234" }`
  - Response example: "OK"
