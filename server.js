const app = require('./app')

port  =process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Application is working on port ${port}`);
})