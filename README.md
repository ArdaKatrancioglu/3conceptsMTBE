# Care concepts

One local Vite app serves a small concept orchestrator and both standalone React concepts:

- `/` — concept selector / orchestrator
- `/concept-2` — GP consultation assistant
- `/concept-3` — patient care overview

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints, then choose a concept or navigate directly to `/concept-2` or `/concept-3`. You can also run `npm run dev:concept-2` or `npm run dev:concept-3` to open a concept directly.

`npm run build` creates a production build containing all three pages. The concepts use fictional sample data and have no backend integration.

## Deploy with Docker Compose and Cloudflare Tunnel

The Compose setup serves the built pages with Nginx and connects them to Cloudflare Tunnel. The tunnel keeps the Linux server's web port closed to the public internet.

1. In Cloudflare Zero Trust, open **Networks → Tunnels** and create a Cloudflared tunnel for this server.
2. In the tunnel's **Public Hostnames** section, add:
   - Subdomain: `3concepts`
   - Domain: `arda.study`
   - Type: `HTTP`
   - URL: `http://web:80`
3. Copy the tunnel token. On the Linux server, clone this repository, then create the local environment file:

   ```bash
   cp .env.example .env
   nano .env
   ```

   Replace the example value with the token. Keep `.env` private; Git ignores it.
4. Start the app and tunnel:

   ```bash
   docker compose up -d --build
   docker compose ps
   docker compose logs -f cloudflared
   ```

Cloudflare creates the DNS route for `3concepts.arda.study` when you save the public hostname. No separate A record or inbound firewall port is needed. Once the tunnel reports healthy, the orchestrator is at `https://3concepts.arda.study/` and Concept 2 is at `https://3concepts.arda.study/concept-2/`.

To update after a Git pull, run `docker compose up -d --build`. To stop the stack, run `docker compose down`.
