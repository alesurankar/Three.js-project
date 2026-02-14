
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
Before running the app for the first time you must: 

1. Create a free MongoDB Atlas account (or use a local MongoDB instance)
[MongoDB Atlas Signup](https://account.mongodb.com/account/login)
Follow instructions to create a cluster.

2. Get your connection string
In Atlas, go to Database → Connect → Connect your application
Copy the connection string, it will look like:
mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


3. configure your environment variables.
- open [/server/example.env](./server/example.env).

4. Run the seed script:
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
.env should not be committed to GitHub (added to .gitignore).



🚀 Start Development

After seeding:
```bash
npm run dev
```

Open:
http://localhost:3000
