# Wake on LAN

A simple web app for managing and sending wake-up-packet(magic packet) to local devices.

## How to use

1. Use `schema.sql` to create the database schema for this app.
2. Make sure the config files in `/config/` and `/frontend/config/` match the environment settings.
3. Run `npm run build` in the `frontend` folder to build the frontend react app.
4. Run `npm run start` in the project root folder to start the backend service.
5. Open your browser and enter `http://localhost:2021/` to check out the app.
