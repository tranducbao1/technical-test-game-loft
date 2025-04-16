const fs = require('fs');
const path = require('path');

const loadRouters = () => {
    const modulesPath = path.join(__dirname, '../modules');

    return fs.readdirSync(modulesPath).flatMap((moduleFolder) => {
        const routeFolderPath = path.join(modulesPath, moduleFolder);
        const routeFile = fs.readdirSync(routeFolderPath).find((file) => file.startsWith('routes'));

        if (!routeFile) return;

        const routeFilePath = path.join(modulesPath, moduleFolder, routeFile);

        // Check if router file exists before requiring
        if (fs.existsSync(routeFilePath)) {
            return require(routeFilePath);
        }

        return [];
    });
};

module.exports = loadRouters;