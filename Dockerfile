FROM node:lts-alpine

# устанавливаем простой HTTP-сервер для статики
RUN npm install -g http-server

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /demo

# копируем оба 'package.json' и 'package-lock.json' (если есть)
COPY package*.json ./

# устанавливаем зависимости проекта
RUN npm install

# копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
COPY . .

# собираем приложение для production с минификацией
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]

#docker build -t vuejs-home/dockerize-vuejs-app .
#docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-home/dockerize-vuejs-app
#npm install --global http-server
#http-server ./dist