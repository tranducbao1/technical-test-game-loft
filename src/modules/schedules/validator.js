const CustomError = require('../../utils/Error'); // adjust path as needed

const validateRepeatPayload = (payload) => {
    const { startTime, endTime, numberOfWeeks, repeatFor, part } = payload;
    const errors = [];

    // Check endTime
    if (!startTime || isNaN(Date.parse(startTime))) {
        errors.push('startTime must be a valid ISO date string');
    } else if (new Date(startTime) > new Date(endTime)) {
        errors.push('endTime cannot lager than startTime');
    }

    // Check endTime
    if (!endTime || isNaN(Date.parse(endTime))) {
        errors.push('endTime must be a valid ISO date string');
    }

    // Check numberOfWeeks
    if (
        typeof numberOfWeeks !== 'number' ||
        !Number.isInteger(numberOfWeeks) ||
        numberOfWeeks <= 0 || numberOfWeeks > 7
    ) {
        errors.push('numberOfWeeks must be a positive integer');
    }

    // Check repeatFor
    if (
        !Array.isArray(repeatFor) ||
        repeatFor.length === 0 ||
        repeatFor.some((val) => !validRepeatFor.includes(val))
    ) {
        errors.push('repeatFor must be one or more of: WFH, WAO');
    }

    // Check part
    const validParts = ['FULL', 'HAFT'];
    if (!validParts.includes(part)) {
        errors.push('part must be one of: FULL, HAFT');
    }

    // Throw if any errors
    if (errors.length > 0) {
        throw CustomError.throwError({
            status: 400,
            message: 'Validation Error',
            errors,
        });
    }
};

const validateUpdateSchedulesPayload = (data) => {
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
            !item.hasOwnProperty('type')
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
}

module.exports = {
    validateRepeatPayload, validateUpdateSchedulesPayload
};