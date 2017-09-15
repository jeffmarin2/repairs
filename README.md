# React Repairs

Installation
npm install

Build
npm run webpack

Execution
Client - npm start
uses port 8080

In webpack.config.js:
proxy: {
    "/api": {
        target: "http://localhost:8081"
    }
}        

Server - node server/index.js
uses port 8081