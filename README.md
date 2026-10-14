# Care concepts

One local Vite app serves a small concept orchestrator and three standalone React concepts:

- `/` — concept selector / orchestrator
- `/concept-1` — daily care at home, medication reminders, family and devices
- `/concept-2` — GP consultation assistant
- `/concept-3` — patient care overview

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints, then choose a concept or navigate directly to `/concept-1`, `/concept-2` or `/concept-3`. You can also run the `dev:concept-*` scripts to open a concept directly.

`npm run build` creates a production build containing all four pages. The concepts use fictional sample data and have no backend integration.

## Deploy with Docker Compose

On the Linux server, clone the repository and start the app:

```bash
git clone <your-repository-url> 3-concepts
cd 3-concepts
docker compose up -d --build
docker compose ps
```

The app listens on `127.0.0.1:8080` on the Linux server. Check it there with `curl -I http://127.0.0.1:8080/`. The same server serves the orchestrator, `/concept-2/`, and `/concept-3/`.

## Publish it at 3concepts.arda.study

Use Cloudflare Tunnel so the server does not need a public web port:

1. In Cloudflare Zero Trust, open **Networks → Tunnels** and create a Cloudflared tunnel for the Linux server.
2. Open that tunnel's **Public Hostnames** and add:
   - Subdomain: `3concepts`
   - Domain: `arda.study`
   - Service type: `HTTP`
   - URL: `http://web:80`
3. Copy the tunnel token from Cloudflare. On the Linux server, create the ignored `.env` file and paste the token:

   ```bash
   cp .env.example .env
   nano .env
   ```

4. Start the tunnel service alongside the app:

   ```bash
   docker compose --profile cloudflare up -d
   docker compose logs -f cloudflared
   ```

Saving the public hostname creates its Cloudflare DNS route. Once the tunnel is connected, use `https://3concepts.arda.study/` for the orchestrator and `https://3concepts.arda.study/concept-2/` for Concept 2. No A record or inbound firewall port is needed.

After a Git pull, run `docker compose up -d --build` to update the app. To stop it, run `docker compose down`.
