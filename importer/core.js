const fs = require('fs')
module.exports = class Importer {
    get version() { return 1 }
    get name() { return "pts" }
    get assetType() { return "cc.Asset" }

    async import(file) {
        try {
            const rawData = fs.readFileSync(file.path, 'utf8');
            const _data = { rawData };
            console.log("WRIIIIIIIIIIIIIIIII")
            await this.saveToLibrary(file.uuid, JSON.stringify(_data))
            return true;
        } catch(e) {
            console.error(e);
            return false
        }

    }

}
