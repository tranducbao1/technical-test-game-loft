const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    __internal: {
      useUds: false,
      engine: {
        enableExperimentalFeatures: [],
        env: {
          PRISMA_DISABLE_PREPARED_STATEMENTS: 'true',
        },
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      __internal: {
        engine: {
          env: {
            PRISMA_DISABLE_PREPARED_STATEMENTS: 'true',
          },
        },
      },
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
