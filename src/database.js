const mongoose = require('mongoose');


async function databaseConnector(databaseURL){ // specified URL
    await mongoose.connect(databaseURL); // pass to mongoose to connect
}

async function databaseDisconnector(){ // disconnect
    await mongoose.connection.close();
}

module.exports = {
    databaseConnector,
    databaseDisconnector
}
