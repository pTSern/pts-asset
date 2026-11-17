const SUBMODULES = [
    './pts-fixer',
    './inheritance',
    './lazy-registry',
    './preview-subscriptions',
    './asset-menu',
];

for (const mod of SUBMODULES) {
    try {
        const resolved = require.resolve(mod);
        if (require.cache && require.cache[resolved]) {
            delete require.cache[resolved];
        }
    } catch {}
}

try {
    const selfResolved = require.resolve('./cache-bust');
    if (require.cache && require.cache[selfResolved]) {
        delete require.cache[selfResolved];
    }
} catch {}
