import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function canonicalConceptPaths() {
  const redirect = (server) => {
    server.middlewares.use((req, res, next) => {
      const path = req.url?.split('?')[0];
      if (path === '/concept-2' || path === '/concept-3') {
        res.statusCode = 302;
        res.setHeader('Location', `${path}/`);
        res.end();
        return;
      }
      next();
    });
  };
  return {
    name: 'canonical-concept-paths',
    configureServer: redirect,
    configurePreviewServer: redirect,
  };
}

export default defineConfig({
  plugins: [canonicalConceptPaths()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        concept2: resolve(process.cwd(), 'concept-2/index.html'),
        concept3: resolve(process.cwd(), 'concept-3/index.html'),
      },
    },
  },
});
