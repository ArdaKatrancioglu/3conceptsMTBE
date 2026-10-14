FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY concept-2/package.json ./concept-2/package.json
COPY concept-3/package.json ./concept-3/package.json
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
