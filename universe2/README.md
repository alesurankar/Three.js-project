🌱 Database Setup

This project uses MongoDB to store universe entities (stars, planets, etc.).
Before running the app for the first time, seed the database:
`npm run seed`

This will:
- connect to MongoDB
- create default entities
- prepare the universe for rendering



⚠️ Requirements

Make sure your .env file contains:
MONGO_URI=your_connection_string



🚀 Start Development

After seeding:
`npm run dev`

Open:
http://localhost:3000
