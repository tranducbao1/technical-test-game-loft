const prisma = require('../../../utils/prisma');

const getAllTodosService = async (settings = {}) => {
  return await prisma.todo.findMany(settings);
};

module.exports = getAllTodosService;
