const { z } = require('zod');

const scheduleSchema = z.object({
    startTime: z
        .string({ message: 'startTime is required' }),
    endTime: z
        .string({ message: 'endTime is required' })
});

module.exports = scheduleSchema;