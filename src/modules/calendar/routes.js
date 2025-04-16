const router = require('express').Router();
const { generateCalendarScheduleByYear, getCalendar } = require('./controllers');

router.post('/generate-calendar-schedule', generateCalendarScheduleByYear);

module.exports = router;