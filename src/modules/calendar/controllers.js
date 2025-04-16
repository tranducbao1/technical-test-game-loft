const { asyncHandler } = require('../../utils/asyncHandler.js');
const { ApiResponse } = require('../../utils/ApiResponse.js');
const CustomError = require('../../utils/Error.js');
const calendarService = require('./services.js');

const generateCalendarScheduleByYear = asyncHandler(async (req, res, next) => {
  try {
    const { generateCalendarScheduleByYear } = await calendarService();

    await generateCalendarScheduleByYear();

    return res
      .status(200)
      .json(new ApiResponse(200, 'Generate Calendar By Year Successfully'));
  } catch (err) {
    console.log(err);
    CustomError.throwError({
      status: 500,
      message: 'Generate Calendar By Year failed',
      errors: ['Error Generate Calendar'],
    });
  }
});

module.exports = { generateCalendarScheduleByYear };
