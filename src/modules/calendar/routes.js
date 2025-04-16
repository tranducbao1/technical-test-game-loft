const router = require('express').Router();
const { generateCalendarScheduleByYear, getCalendar } = require('./controllers');

router.post('/generate', generateCalendarScheduleByYear);

module.exports = router;