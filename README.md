## Tech Stack:
1. nodeJS (>=20.10.0)
2. express
3. npm
4. gRPC
5. hbs

Note: Please use npm only.

## How to start:
1. check node version compatiblity from package.json
2. create `.env` file , by reference of `.env.sample` and setup all required key values
3. Run: `npm run build:firstTime `
4. Run: `npm run dev`

## Health Check APIs:
- `/liveness`

# Api Curl 
`curl --location 'http://localhost:8021/liveness'`
## Test Application
Run : `npm run test`

## Note
1. In Case package-lock.json already exist in repo then `npm run build` else `npm run build:firstTime`
   
2. By Default App runs on Port 8021 but can modified by changing value of `PORT` in .env file
