# wow-addon-backup

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
./node_modules/.bin/vue-cli-service electron:build --windows
```

### Enable Google drive backup
1. Edit .env file (environment variable)
```
VUE_APP_GOOGLE_CLIENT_ID=your google api client ID
VUE_APP_GOOGLE_CLIENT_SECRET=your google api client secret
```
2. Compiles and minifies for production
