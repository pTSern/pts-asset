const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = __dirname;
const nodeModulesPath = path.join(rootDir, 'node_modules');
const mainJsPath = path.join(rootDir, 'dist/main.js');

function runCmd(cmd, args) {
    const isWin = process.platform === 'win32';
    const resolvedCmd = isWin ? `${cmd}.cmd` : cmd;
    console.log(`[Bootstrap] Running: ${cmd} ${args.join(' ')}`);
    const result = spawnSync(resolvedCmd, args, { cwd: rootDir, shell: true, stdio: 'inherit' });
    return result.status === 0;
}

if (!fs.existsSync(nodeModulesPath)) {
    console.log('[Bootstrap] node_modules not found. Auto-running npm install...');
    runCmd('npm', ['install']);
}

if (!fs.existsSync(mainJsPath)) {
    console.log('[Bootstrap] dist/main.js not found. Auto-running npm run build...');
    runCmd('npm', ['run', 'build']);
}

let mainModule = null;

function loadMain() {
    if (fs.existsSync(mainJsPath)) {
        try {
            mainModule = require(mainJsPath);
        } catch (err) {
            console.error('[Bootstrap] Failed to require dist/main.js:', err);
        }
    }
}

function reloadMain() {
    console.log('[Bootstrap] Hot-reloading dist/main.js...');
    try {
        if (mainModule && typeof mainModule.unload === 'function') {
            mainModule.unload();
        }
    } catch (e) {}
    try {
        const resolved = require.resolve(mainJsPath);
        delete require.cache[resolved];
        loadMain();
        if (mainModule && typeof mainModule.load === 'function') {
            mainModule.load();
        }
        console.log('[Bootstrap] Hot-reload complete!');
    } catch (err) {
        console.error('[Bootstrap] Failed to reload dist/main.js:', err);
    }
}

loadMain();

exports.load = function() {
    if (mainModule && typeof mainModule.load === 'function') {
        return mainModule.load();
    }
};

exports.unload = function() {
    if (mainModule && typeof mainModule.unload === 'function') {
        return mainModule.unload();
    }
};

exports.methods = new Proxy({}, {
    get(target, prop) {
        if (prop === 'reload') {
            return async function(...args) {
                reloadMain();
                if (mainModule && mainModule.methods && mainModule.methods.reload) {
                    return mainModule.methods.reload(...args);
                }
            };
        }
        if (mainModule && mainModule.methods && mainModule.methods[prop]) {
            return mainModule.methods[prop];
        }
        return undefined;
    },
    has(target, prop) {
        return prop === 'reload' || !!(mainModule && mainModule.methods && prop in mainModule.methods);
    }
});
