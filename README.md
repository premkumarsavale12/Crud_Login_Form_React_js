# task-react-js

React (JavaScript) demo app that performs CRUD on students and stores encrypted data in db.json using json-server.

## Setup

1. Install dependencies

```bash
npm install
```

2. Start json-server (runs on port 3001)

```bash
npm run json-server
```

3. In another terminal start Vite dev server

```bash
npm run dev
```

4. Open http://localhost:5173 and use the app.

## Notes
- All student data is encrypted client-side using AES (crypto-js) before sending to json-server. db.json will contain `encryptedData` strings.
- This is a demo. In a real app, encryption keys must never be kept on the client.
