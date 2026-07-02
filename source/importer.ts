
const fs = require('fs');

class pTSImporter {
    async import(_path: any, options: any) {
        console.log('{STRAT >>} >>', _path, options);

        const content = fs.readFileSync(_path, 'utf8');
        return {
            type: 'pts',
            data: content
        }
    }
}
