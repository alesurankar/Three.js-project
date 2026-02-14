
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


🌱 Database Setup

This project uses MongoDB to store universe entities (stars, planets, etc.). 
Before running the app for the first time, you must configure your environment variables.
- here [/server/example.env](./server/example.env).
```bash
npm run seed
```


This will:
- connect to MongoDB
- create default entities
- prepare the universe for rendering



⚠️ Requirements

Make sure your .env file contains:
MONGO_URI=your_connection_string



🚀 Start Development

After seeding:
```bash
npm run dev
```


Open:
http://localhost:3000
