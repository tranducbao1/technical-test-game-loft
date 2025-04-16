const fs = require('fs');
const path = require('path');

const loadRouters = (modulesPathRelative) => {
    const modulesPath = path.resolve(modulesPathRelative);

    return fs.readdirSync(modulesPath).flatMap((moduleName) => {
        const routerPath = path.join(modulesPath, moduleName, 'routes.js');

        // Check if router file exists before requiring
        if (fs.existsSync(routerPath)) {
            return require(routerPath);
        }

        return [];
    });
};

module.exports = loadRouters;