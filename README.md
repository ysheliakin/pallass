# pallass

## Development Set Up

#### Prerequisites

- bash
- ssh client
- [Node.js](https://nodejs.org/en/) v20.17.0
- [Go](https://go.dev/) v1.22.4+
- (optional) [Air](https://github.com/air-verse/air)

### Client

#### To run react.js dev server

```bash
cd client
npm i
npm run dev
```

### Server

#### To run dev server

```bash
cd server
go run .
```

Alternatively, run live reload dev server using Air:

```bash
cd server
air
```

### Database

#### To start the database server (ssh into AWS RDS)

```bash
chmod +x ./db.sh
./db.sh [PRIVATE_KEY_FILE] [RDS_ENDPOINT] [IP_ADDRESS]
```

Then, connect in your database client on localhost:5432 using the credentials.

## Wireframes

Links to the wireframes:

- https://whimsical.com/pallas-s-hub-LnWKcsU2XitfD4pW3dvw4t

- https://whimsical.com/wireframes-DXojwAJLUYZzp9LyYJf1Zq
