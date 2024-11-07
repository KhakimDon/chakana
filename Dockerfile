FROM registry.uicgroup.tech/xolodilnik/xolodilnik-frontend:prod AS modules

FROM node:18.20-alpine3.19 as build

WORKDIR /app 

COPY . . 

RUN ls -all /app


COPY --from=modules /app/node_modules /app/node_modules 

RUN yarn build 

FROM node:18.20-alpine3.19 as prod

RUN npm install pm2 -g

WORKDIR /app 

COPY --from=build /app/.output /app/.output

COPY --from=build /app/ecosystem.config.cjs /app/ecosystem.config.cjs

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]


