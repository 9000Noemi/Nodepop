<h1 align="center"> NODEPOP </h1>

### Backend Web Practice: Node.js-MongoDB

***
### Clone the repository
Use the following command in Visual Studio Code terminal:
```
git clone https://github.com/9000Noemi/Nodepop
```

### Install dependencies

To install all dependencies:
```sh
npm install
```
### Deploy

On first deploy copy .env.example to .env and custimize environment variables

```sh
cp .env.example .env
```

Then, you can run next command to empty the database and create initial data:

```js
npm run initDB
```

## Start

To start in production mode:

```sh
npm start
```

To start in development mode:

```sh
npm run dev
```

## API

Base URL: http://localhost:3000/api

### Product list

GET /api/products

```
{
    "result": [
        { "_id": "6763ff000c637d5c9bc6ff74",
            "name": "Libro",
            "owner": "6730cca48b5bbac69211d066",
            "price": 13,
            "tags": [
                "lifestyle"
            ],
            "photo": "photo-1734606592275-libro.png",
            "__v": 0
        },
        // ...
        ]
}
```