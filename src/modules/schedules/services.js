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
          isDeleted: false
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

  const repeatSchedule = async (body) => {
    try {
      const { startTime, endTime, numberOfWeeks, repeatFor, part } = body;

      const sourceSchedules = await prisma.schedule.findMany({
        where: {
          isDeleted: false,
          type: { in: repeatFor },
          calendarDate: {
            date: {
              gte: new Date(startTime),
              lte: new Date(endTime),
            },
          },
          part: part === 'FULL' ? 'FULL' : { in: ['AM', 'PM'] },
        },
        include: {
          calendarDate: true,
        },
      });

      const promises = sourceSchedules.map(async (schedule) => {
        const list = [];
        const baseDate = new Date(schedule.calendarDate.date);

        for (let i = 1; i <= numberOfWeeks; i++) {
          const newDate = new Date(baseDate);
          newDate.setDate(newDate.getDate() + i * 7);
          list.push(newDate.toISOString().slice(0, 10));
        }

        const uniqueDates = [...new Set(list)];

        const calendars = await prisma.calendarDate.findMany({
          where: {
            date: { in: uniqueDates.map((d) => new Date(d)) },
            isDeleted: false,
          },
        });

        const calendarMap = new Map(
          calendars.map((c) => [c.date.toISOString().slice(0, 10), c.id]),
        );

        const allTargetSchedule = await prisma.schedule.findMany({
          where: {
            isDeleted: false,
            calendarDateId: { in: calendars.map((c) => c.id) },
            part: part === 'FULL' ? 'FULL' : { in: ['AM', 'PM'] },
          },
          select: {
            id: true,
            calendarDateId: true,
            part: true,
          },
        });

        const scheduleMap = new Map();
        allTargetSchedule.forEach((s) => {
          scheduleMap.set(`${s.calendarDateId}_${s.part}`, s.id);
        });

        const updates = [];

        for (const newDate of uniqueDates) {
          const calendarId = calendarMap.get(newDate);
          if (!calendarId) continue;

          const scheduleKey = `${calendarId}_${schedule.part}`;
          const scheduleId = scheduleMap.get(scheduleKey);

          if (scheduleId) {
            updates.push(
              prisma.schedule.update({
                where: { id: scheduleId },
                data: { type: schedule.type },
              }),
            );
          }
        }

        await prisma.$transaction(updates);
      });

      await Promise.all(promises);
    } catch (err) {
      console.log(err);
      CustomError.throwError({
        status: 500,
        message: 'Repeat Schedule failed',
        errors: ['Error Repeat Schedule'],
      });
    }
  };

  return {
    getSchedules, updateSchedules, repeatSchedule
  };
}

module.exports = ScheduleService;
