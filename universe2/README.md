![status](https://img.shields.io/badge/status-active-brightgreen)

## Universe2 (Next.js) — Active Project

## Prerequisites

Before running the project, make sure you have the Node.js (with npm) installed:

Download and install from https://nodejs.org/

Recommended: LTS version (e.g., 20.x)

Verify installation:

```bash
node -v
npm -v
```

### Quick Start

```bash
# install client dependencies 
cd universe2
npm install

# install server dependencies
cd server
npm install
cd ..
```

---

🌱 Database Setup (Optional)

This project uses MongoDB to store universe entities (stars, planets, etc.), 
but you can also run it entirely with local seed data for development or sharing purposes.


Option 1: Use Local Seed Data

If you don’t have MongoDB, you can still run the app:

1. configure your environment variables.
- open [/server/example.env](./server/example.env).
- rename "example.env" to ".env"


Option 2: Use MongoDB

1. Create a free MongoDB Atlas account

- [MongoDB Atlas Signup](https://account.mongodb.com/account/login)
Follow instructions to create a cluster.

2. Get your connection string

- In Atlas, go to Database → Connect → Connect your application.
Copy the connection string, it will look like this:
mongodb+srv://<"username">:<"password">@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


3. configure your environment variables.
- open [/server/example.env](./server/example.env).
- rename "example.env" to ".env"


4. Run the seed script:
```bash
npm run seed
```

This will:
- connect to MongoDB
- create default entities
- prepare the universe for rendering



---


⚠️ Requirements

Make sure your .env file contains: MONGO_URI=your_connection_string. if in database mode



⚠️ Warning

- Your .env file contains sensitive information (like MONGO_URI) and should not be committed to GitHub.
- It is already included in .gitignore, so it will be ignored by Git.

---

🚀 Start Development

After seeding:
```bash
npm run dev
```

Open:
http://localhost:3000
