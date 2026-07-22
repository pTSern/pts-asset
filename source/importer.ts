
const fs = require('fs');

class pTSImporter {
    async import(_path: any, options: any) {
        console.log('{STRAT >>} >>', _path, options);

        const content = fs.readFileSync(_path, 'utf8');

        // Extract every `__uuid__` referenced inside the .pts JSON so the Cocos
        // build database registers them as dependencies and never prunes them.
        const dependencies: string[] = [];
        try {
            this.extractUuids(JSON.parse(content), dependencies);
        } catch (err) {
            console.warn('[pTSImporter].{import} >> Failed to parse .pts for dependency scan >>', _path, err);
        }

        return {
            type: 'pts',
            data: content,
            dependencies,
        }
    }

    private extractUuids(obj: any, list: string[]) {
        if (!obj || typeof obj !== 'object') return;

        if (typeof obj.__uuid__ === 'string' && obj.__uuid__) {
            if (!list.includes(obj.__uuid__)) list.push(obj.__uuid__);
            return;
        }

        for (const key in obj) {
            this.extractUuids(obj[key], list);
        }
    }
}
