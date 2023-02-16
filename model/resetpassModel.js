const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const ResetPass = sequelize.define('reset', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    
    isActive: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = ResetPass