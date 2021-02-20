const mongoose = require('mongoose');
const colors = require('colors');

class ConnectMongo {

    constructor() {
        this.gfs = null;
    }

    static getConnect() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true
        }).then(() => console.log(`DB MongoDB is connected`.yellow))

        const conn = mongoose.connection
            // khoi tao bucket ngay luc ket noi mongodb
        conn.once("open", () => {
            // console.log(`DB is connected`.cyan);
            this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: process.env.MONGO_BUCKET
            })
        })
    }
}

exports.ConnectMongo = ConnectMongo