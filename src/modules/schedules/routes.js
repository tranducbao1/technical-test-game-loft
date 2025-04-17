const router = require('express').Router();
const { getSchedules, updateSchedules, repeatSchedule } = require('./controllers');

router.get('/', getSchedules);

router.put('/update-schedules', updateSchedules);

router.put('/repeat', repeatSchedule)

module.exports = router;