const { asyncHandler } = require('../../utils/asyncHandler.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const CustomError = require('../../utils/Error.js');
const scheduleService = require('./services.js');
const { validateRepeatPayload, validateUpdateSchedulesPayload } = require('./validator.js');

const getSchedules = asyncHandler(async (req, res, next) => {
  try {
    const { startTime, endTime, part } = req.query;

    if (!startTime || !endTime) {
      const error = CustomError.badRequest({
        message: 'Validation Error',
        errors: ['startTime and endTime are required'],
        hints: 'Please provide startTime and endTime to get schedules',
      });

      return next(error);
    }

    const { getSchedules } = await scheduleService();

    const data = await getSchedules(startTime, endTime, part);

    return res
      .status(200)
      .json(new ApiResponse(200, data, 'Get Schedules Successfully'));
  } catch (err) {
    console.log(err);
    CustomError.throwError({
      status: 500,
      message: 'Get Schedules failed',
      errors: ['Error Get Schedules'],
    });
  }
});

const updateSchedules = asyncHandler(async (req, res, next) => {
  try {
    const { data } = req.body;

    validateUpdateSchedulesPayload(data)

    const { updateSchedules } = await scheduleService();

    await updateSchedules(data);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Update Schedules Successfully'));
  } catch (err) {
    console.log(err);
    CustomError.throwError({
      status: 500,
      message: 'Update Schedules failed',
      errors: ['Error Update Schedules'],
    });
  }
});

const repeatSchedule = asyncHandler(async (req, res, next) => {
  try {
    validateRepeatPayload(req.body)

    const { repeatSchedule } = await scheduleService();

    await repeatSchedule(req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Repeat Schedule Successfully'));
  } catch (err) {
    console.log(err);
    CustomError.throwError({
      status: 500,
      message: 'Repeat Schedule failed',
      errors: ['Error Repeat Schedule'],
    });
  }
});

module.exports = { getSchedules, updateSchedules, repeatSchedule };
