const {createServer} = require('http');
const next = require('next');
const routes = require('./routes');

const port = process.env.PORT || 3000;
const app = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(port, (err) => {
        if(err){
            throw err;
        }
        console.log(`Server initialized and running on port ${port}`);
    }); 
});