const { asyncHandler } = require('../../utils/asyncHandler.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const CustomError = require('../../utils/Error.js');
const scheduleService = require('./services.js');

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

    if (!Array.isArray(data) || data.length === 0) {
      const error = CustomError.badRequest({
        message: 'Validation Error',
        errors: ['Request body must be a non-empty array'],
        hints: 'Provide an array of objects with id and type',
      });

      return next(error);
    }

    const errors = [];

    data.forEach((item, index) => {
      if (
        typeof item !== 'object' ||
        !item.hasOwnProperty('id') ||
        !item.hasOwnProperty('type') ||
        typeof item.id !== 'string' ||
        typeof item.type !== 'string'
      ) {
        errors.push(`Item at index ${index} must have string 'id' and 'type'`);
      }
    });

    if (errors.length > 0) {
      const error =
        CustomError.badRequest({
          message: 'Validation Error',
          errors,
          hints: 'Each item in the array should be an object like { id: string, type: string }',
        })

      return next(error);
    }

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

module.exports = { getSchedules, updateSchedules };
