const router = require('express').Router();
const { getSchedules, updateSchedules } = require('./controllers');

router.get('/', getSchedules);

router.put('/update-schedules', updateSchedules);

module.exports = router;