const CustomError = require('../../utils/Error.js');
const prisma = require('../../utils/prisma');
const { promise } = require('zod');

const ScheduleService = async () => {
  const getSchedules = async (startTime, endTime, part) => {
    try {
      const schedules = await prisma.schedule.findMany({
        where: {
          isDeleted: false,
          calendarDate: {
            date: {
              gte: new Date(startTime),
              lte: new Date(endTime),
            },
            year: new Date().getFullYear(),
          },
          part: part === 'FULL' ? 'FULL' : { in: ['AM', 'PM'] },
        },
        select: {
          id: true,
          calendarDate: {
            select: {
              date: true,
              day: true,
              month: true,
              year: true,
              weekday: true,
            }
          },
          part: true,
          type: true,
        },
        orderBy: {
          calendarDate: {
            date: 'asc',
          },
        },
      });

      return schedules


    } catch (err) {
      console.log(err);
      CustomError.throwError({
        status: 500,
        message: 'Get Schedules failed',
        errors: ['Error Get Schedules'],
      });
    }
  };

  const updateSchedules = async (data) => {
    try {
      const existedSchedules = await prisma.schedule.findMany({
        where: {
          id: {
            in: data.map((item) => item.id),
          },
        },
        select: {
          id: true
        }
      });

      if (existedSchedules.length !== data.length) {
        const error = CustomError.badRequest({
          message: 'Validation Error',
          errors: ['Schedule not found'],
          hints: 'Please provide all the required fields',
        });
        return error;
      }

      await Promise.all(
        data.map(async (item) => {
          await prisma.schedule.update({
            where: {
              id: item.id,
            },
            data: {
              type: item.type,
            },
          });
        })
      )

    } catch (err) {
      console.log(err);
      CustomError.throwError({
        status: 500,
        message: 'Update Schedules failed',
        errors: ['Error Update Schedules'],
      });
    }
  }

  return {
    getSchedules, updateSchedules
  };
}

module.exports = ScheduleService;
