const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const DownloadFiles = sequelize.define('url', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
         
    },
    dlink: Sequelize.STRING

})

module.exports = DownloadFiles