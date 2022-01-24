const express = require('express')
const next = require('next')
var axios = require('axios')


const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.post('/fetchDataFromApi', (req, res) => {
            var config = {
                method: 'get',
                url: 'https://jsonkeeper.com/b/HU8U',
                headers: {
                    'Cookie': 'amber.session=eyJfZmxhc2giOiJ7fSJ9--0C2vcgFqVbFBZoDC1tR0QGmaZY8%3D'
                }
            };
            axios(config)
                .then((response) => {
                    if (response) {
                        console.log("Data Fetched")
                        res.json(response.data)
                    }
                    else{
                        console.log("Data NOT Fetched")
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return handle(req, res)
                });
        })

        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })