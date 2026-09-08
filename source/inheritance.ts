import fs from 'fs';
import path from 'path';
import pkg from '../package.json';

declare const Editor: any;

const _parentMap = new Map<string, string>();
const _tsToCcMap = new Map<string, string>();
const _ccToTsMap = new Map<string, string>();
const _runtimeChains = new Map<string, string[]>();
let _hasScanned = false;

function getMountedAssetDirs(pkgJson: any, extDir: string): string[] {
    const dirs: string[] = [];
    const mount = pkgJson?.contributions?.['asset-db']?.mount;
    if (!mount) return dirs;

    if (typeof mount === 'string') {
        dirs.push(path.resolve(extDir, mount));
    } else if (Array.isArray(mount)) {
        for (const m of mount) {
            if (typeof m === 'string') {
                dirs.push(path.resolve(extDir, m));
            } else if (m && typeof m.path === 'string') {
                dirs.push(path.resolve(extDir, m.path));
            }
        }
    } else if (typeof mount === 'object') {
        for (const key of Object.keys(mount)) {
            const m = mount[key];
            if (typeof m === 'string') {
                dirs.push(path.resolve(extDir, m));
            } else if (m && typeof m.path === 'string') {
                dirs.push(path.resolve(extDir, m.path));
            }
        }
    }
    return dirs;
}

function parseTsFile(filePath: string): void {
    try {
        if (!fs.existsSync(filePath)) return;
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('class')) return;

        const classRegex = /((?:export\s+|default\s+|abstract\s+)*)class\s+([A-Za-z0-9_]+)(?:<[\s\S]*?>)?\s+extends\s+([A-Za-z0-9_.]+)(?:<[\s\S]*?>)?/g;

        for (const match of content.matchAll(classRegex)) {
            const tsClassName = match[2];
            const parentRaw = match[3];
            const parentClass = parentRaw.split('.').pop() || parentRaw;

            let finalClassName = tsClassName;
            const textBefore = content.substring(0, match.index);
            const ccMatches = [...textBefore.matchAll(/@ccclass\s*(?:\(\s*['"]([^'"]+)['"]\s*\))?/g)];
            if (ccMatches.length > 0) {
                const lastCc = ccMatches[ccMatches.length - 1];
                if (!textBefore.substring(lastCc.index!).includes('class ') && lastCc[1]) {
                    finalClassName = lastCc[1];
                }
            }

            _tsToCcMap.set(tsClassName, finalClassName);
            _ccToTsMap.set(finalClassName, tsClassName);

            _parentMap.set(tsClassName, parentClass);
            _parentMap.set(finalClassName, parentClass);
        }
    } catch {}
}

export function scanInheritance(force: boolean = false): void {
    if (_hasScanned && !force) return;
    _hasScanned = true;

    _parentMap.clear();
    _tsToCcMap.clear();
    _ccToTsMap.clear();

    const searchDirs = new Set<string>();

    const projectPath = typeof Editor !== 'undefined' && Editor.Project && Editor.Project.path
        ? Editor.Project.path
        : path.resolve(__dirname, '../../..');

    // 1. Project assets directory
    const projectAssetsDir = path.resolve(projectPath, 'assets');
    if (fs.existsSync(projectAssetsDir)) {
        searchDirs.add(projectAssetsDir);
    }

    // 2. Explicitly ensure pts-core and pts-asset directories are always included
    const knownExtNames = ['pts-core', 'pts-asset'];
    for (const extName of knownExtNames) {
        const candidates = [
            path.resolve(projectPath, 'extensions', extName, 'assets'),
            path.resolve(__dirname, '..', '..', extName, 'assets'),
            path.resolve(__dirname, '..', extName === pkg.name ? 'assets' : `../${extName}/assets`),
        ];
        for (const cand of candidates) {
            if (fs.existsSync(cand)) {
                searchDirs.add(cand);
            }
        }
    }

    // 3. Current extension asset-db mount directory
    const currentExtDir = path.resolve(__dirname, '..');
    const currentMountDirs = getMountedAssetDirs(pkg, currentExtDir);
    for (const d of currentMountDirs) {
        if (fs.existsSync(d)) {
            searchDirs.add(d);
        }
    }

    // 4. Peer extension directories
    try {
        const extensionsDir = path.resolve(projectPath, 'extensions');
        if (fs.existsSync(extensionsDir)) {
            const extEntries = fs.readdirSync(extensionsDir, { withFileTypes: true });
            for (const extEntry of extEntries) {
                if (!extEntry.isDirectory()) continue;
                const otherExtDir = path.resolve(extensionsDir, extEntry.name);
                const otherAssetsDir = path.resolve(otherExtDir, 'assets');
                if (fs.existsSync(otherAssetsDir)) {
                    searchDirs.add(otherAssetsDir);
                }
                const otherPkgPath = path.resolve(otherExtDir, 'package.json');
                if (fs.existsSync(otherPkgPath)) {
                    try {
                        const otherPkg = JSON.parse(fs.readFileSync(otherPkgPath, 'utf8'));
                        const otherMountDirs = getMountedAssetDirs(otherPkg, otherExtDir);
                        for (const d of otherMountDirs) {
                            if (fs.existsSync(d)) {
                                searchDirs.add(d);
                            }
                        }
                    } catch {}
                }
            }
        }
    } catch {}

    const allTsFiles: string[] = [];

    function walk(dir: string) {
        if (!fs.existsSync(dir)) return;
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'bin') continue;
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    walk(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                    allTsFiles.push(fullPath);
                }
            }
        } catch {}
    }

    for (const dir of searchDirs) {
        walk(dir);
    }

    for (const filePath of allTsFiles) {
        parseTsFile(filePath);
    }
}

export function scanSingleFile(filePath: string): void {
    if (!filePath || !filePath.endsWith('.ts') || filePath.endsWith('.d.ts')) return;
    parseTsFile(filePath);
}

export function hasScannedClass(className: string): boolean {
    if (!className) return true;
    return _runtimeChains.has(className) || _parentMap.has(className) || _tsToCcMap.has(className) || _ccToTsMap.has(className);
}

export function setRuntimeInheritanceChains(chains: Record<string, string[]>): void {
    if (!chains || typeof chains !== 'object') return;
    for (const [key, chain] of Object.entries(chains)) {
        if (Array.isArray(chain) && chain.length > 0) {
            _runtimeChains.set(key, chain);
        }
    }
}

export function clearInheritanceCache(): void {
    _hasScanned = false;
    _parentMap.clear();
    _tsToCcMap.clear();
    _ccToTsMap.clear();
    _runtimeChains.clear();
}

/**
 * Computes the complete inheritance chain (from root to leaf) for any class name.
 * e.g. 'pTSAsset_Number' -> ['cc.Object', 'Eventified', 'cc.Asset', 'Asset', 'pTSAsset', 'pTSAsset_Data', 'pTSAsset_Number']
 */
export function getExtendsChain(className: string): string[] {
    if (!className) {
        return ['cc.Object', 'Eventified', 'cc.Asset', 'Asset', 'pTSAsset'];
    }

    if (_runtimeChains.has(className)) {
        return _runtimeChains.get(className)!;
    }

    if (!hasScannedClass(className)) {
        scanInheritance(true);
    } else {
        scanInheritance(false);
    }

    const chain: string[] = [];
    const visited = new Set<string>();

    let cur: string | undefined = className;

    while (cur && !visited.has(cur)) {
        visited.add(cur);

        if (!chain.includes(cur)) {
            chain.unshift(cur);
        }

        const ccName = _tsToCcMap.get(cur);
        if (ccName && !visited.has(ccName) && !chain.includes(ccName)) {
            visited.add(ccName);
            chain.unshift(ccName);
        }

        const tsName = _ccToTsMap.get(cur);
        if (tsName && !visited.has(tsName) && !chain.includes(tsName)) {
            visited.add(tsName);
            chain.unshift(tsName);
        }

        let parent: string | undefined = _parentMap.get(cur);
        if (!parent && tsName) {
            parent = _parentMap.get(tsName);
        }
        if (!parent && ccName) {
            parent = _parentMap.get(ccName);
        }

        if (!parent || parent === 'Asset' || parent === 'cc.Asset' || parent === 'Object') {
            break;
        }

        const parentCc = _tsToCcMap.get(parent);
        cur = parentCc || parent;
    }

    if (!chain.includes('pTSAsset')) {
        chain.unshift('pTSAsset');
    }
    if (!chain.includes('Asset')) {
        chain.unshift('Asset');
    }
    if (!chain.includes('cc.Asset')) {
        chain.unshift('cc.Asset');
    }
    if (!chain.includes('Eventified')) {
        chain.unshift('Eventified');
    }
    if (!chain.includes('cc.Object')) {
        chain.unshift('cc.Object');
    }

    return chain;
}
