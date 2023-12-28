# Announcement Bot Dashboard (Bot)

- [Link to Frontend repository](https://github.com/bubbzDotDev/bot-dashboard)
- [Link to API repository](https://github.com/bubbzDotDev/bot-dashboard-api)

## Installation

```bash
$ npm install
```

## Configure .env file
```bash
# Discord
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=

# DB 
MYSQL_DB_HOST=
MYSQL_DB_PORT=
MYSQL_DB_USERNAME=
MYSQL_DB_PASSWORD=
MYSQL_DB_DATABASE=
MYSQL_DB_SYNCHRONIZE= #true in development; false in production

# Server
API_HOST=
(Locally, it will be http://localhost:3001)
```

## Running the app

```bash
# development
$ npm run dev

# build
$ npm run build

# production mode
$ npm run start
```
## Special Thanks
[Anson The Developer](https://www.youtube.com/c/AnsontheDeveloper): 
Anson's [2022 Discord Bot Dashboard Tutorial](https://youtube.com/playlist?list=PL_cUvD4qzbkyX4Wp8TAfjpttjUldDWJnp) got this project off the ground.