const CustomError = require('../../utils/Error.js');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../../utils/prisma');

const calendarService = async () => {
  const generateCalendarScheduleByYear = async () => {
    try {
      const year = new Date().getFullYear()
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);

      const days = [];
      let current = new Date(start);

      while (current <= end) {
        const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday

        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Only Monday to Friday
          const dateCopy = new Date(current);
          days.push({
            id: uuidv4(),
            date: dateCopy,
            weekday: weekdays[dateCopy.getDay()],
            day: dateCopy.getDate(),
            month: dateCopy.getMonth() + 1,
            year: dateCopy.getFullYear(),
          });
        }

        current.setDate(current.getDate() + 1);
      }

      await prisma.calendarDate.createMany({
        data: days,
        skipDuplicates: true,
      });

      const allDates = await prisma.calendarDate.findMany(
        {
          where: {
            isDeleted: false,
            year: year
          }
        }
      );

      const scheduleSeed = allDates.flatMap(date => ([
        {
          id: uuidv4(),
          calendarDateId: date.id,
          part: 'FULL',
          type: null,
        },
        {
          id: uuidv4(),
          calendarDateId: date.id,
          part: 'AM',
          type: null,
        },
        {
          id: uuidv4(),
          calendarDateId: date.id,
          part: 'PM',
          type: null,
        },
      ]));

      const chunkSize = 1000;
      for (let i = 0; i < scheduleSeed.length; i += chunkSize) {
        const chunk = scheduleSeed.slice(i, i + chunkSize);
        await prisma.schedule.createMany({ data: chunk, skipDuplicates: true });
      }

    } catch (err) {
      console.log(err);
      CustomError.throwError({
        status: 500,
        message: 'Generate Calendar By Year failed',
        errors: ['Error Generate Calendar'],
      });
    }
  };


  return {
    generateCalendarScheduleByYear
  };
}

module.exports = calendarService;
