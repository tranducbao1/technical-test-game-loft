const fs = require('fs');
const path = require('path');

const loadRouters = (modulesPathRelative) => {
    const modulesPath = path.resolve(__dirname, modulesPathRelative);

    if (!fs.existsSync(modulesPath)) {
        return [];
    }

    return fs.readdirSync(modulesPath).flatMap((moduleName) => {
        const routerPath = path.join(modulesPath, moduleName, 'routes.js');

        if (fs.existsSync(routerPath)) {
            const route = require(routerPath);
            return Array.isArray(route) ? route : [route];
        }

        return [];
    });
};

module.exports = loadRouters;