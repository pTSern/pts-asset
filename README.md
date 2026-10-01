# `pts-asset` - ScriptableObject Engine for Cocos Creator

> **Author**: pTSern  
> **Version**: `1.0.0`  
> **Cocos Creator Compatibility**: `>= 3.8.0`  
> **Category**: Editor Extension & Asset Architecture  
> **Detailed Pipeline Spec**: [`extensions/pts-asset/.agents/PIPLINE.md`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/.agents/PIPLINE.md)

---

## 1. Overview

`pts-asset` brings **Unity ScriptableObject-style workflows** to Cocos Creator 3.8.x. In native Cocos Creator, data assets are typically stored as raw JSON, which lacks first-class engine integration: they cannot be decorated with `@property`, do not support type-safe drag-and-drop validation into Component inspector slots, cannot display custom thumbnails in the Asset panel, and are vulnerable to build-time tree-shaking when not referenced by a scene or prefab.

`pts-asset` solves this comprehensively by introducing:
1. **`.pts` Custom Asset Format**: Strongly-typed data assets containing metadata, versioning, and serialized class properties.
2. **First-Class Editor Integration**: Custom file icon rendering in the Assets tree, asset picker ("More" dialog), and Inspector header.
3. **Type-Safe Drag & Drop**: Inheritance-aware validation permitting only assets whose `@ccclass` derives from the target slot's declared type.
4. **Interactive Asset Picker**: Full compatibility with Cocos Creator's asset picker popup dialog.
5. **Build Tree-Shaking Protection**: Automated `_lazy.prefab` registry ensuring `.pts` assets are retained during production builds.
6. **Dedicated Inspector Panel**: Dockable editor panel for viewing, editing, creating, and diagnosing `.pts` assets.

---

## 2. Process Architecture & Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Editor / Main Process                              │
│                                                                             │
│  ┌────────────────────┐   ┌───────────────────────┐   ┌──────────────────┐  │
│  │ Custom Importer    │   │  Inheritance Cache    │   │  Lazy Registry   │  │
│  │ (source/importer)  │   │ (source/inheritance)  │   │ (_lazy.prefab)   │  │
│  └─────────┬──────────┘   └───────────┬───────────┘   └────────┬─────────┘  │
│            │                          │                        │            │
│            ▼                          ▼                        ▼            │
│  ┌────────────────────┐   ┌───────────────────────┐   ┌──────────────────┐  │
│  │ AssetDB Hook       │   │ Drag & Drop Intercept │   │ Inspector Panel  │  │
│  │ (query-assets/icon)│   │ (type validation)     │   │ (source/panel)   │  │
│  └────────────────────┘   └───────────────────────┘   └──────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ IPC (`execute-scene-script`)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Engine Scene Process                                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ `pts-core/src/_cc.js` -> `get_all_pts_inheritance_chains()`           │  │
│  │ Inspects `cc.js._getClassById()`, `@ccclass` registry, & inheritance  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The `.pts` Asset Format

`.pts` files are serialized JSON documents containing typed payload structures:

```json
{
  "__type__": "HeroConfig",
  "__version__": "1.0.0",
  "data": {
    "heroName": "Arthur",
    "baseHp": 1500,
    "attackPower": 120,
    "skillPrefab": {
      "__uuid__": "78b4d9a2-9f3b-4171-a477-90c239420045"
    }
  }
}
```

### Accompanying Meta File (`.pts.meta`):
The Cocos Creator asset pipeline assigns a unique UUID to each `.pts` file and associates it with the custom `pts-importer`:
```json
{
  "ver": "1.0.0",
  "importer": "pts-importer",
  "imported": true,
  "uuid": "d38a0864-...",
  "files": [".json"],
  "subMetas": {},
  "userData": {
    "type": "HeroConfig"
  }
}
```

---

## 4. Key Subsystems

### 4.1. Multi-Tier Icon Injection
Cocos Creator 3.8.x resolves asset tree icons via internal web components. `pts-asset` registers the custom icon (`assets/icons/pts.png`) across three distinct editor tiers:
1. **Asset Tree View**: Injects CSS and protocol handlers so `.pts` entries display the purple pTS badge instead of generic text icons.
2. **Asset Picker Dialog ("More" Button)**: Preserves thumbnail and badge rendering within the modal asset search popup.
3. **Inspector Header**: Displays the custom icon when inspecting `.pts` assets.

### 4.2. Drag-and-Drop Inheritance Validation (`source/inheritance.ts`)
When dragging a `.pts` asset into an `@property({ type: TargetClass })` slot:
1. The extension intercepts the drag payload to retrieve the source asset's `__type__`.
2. Queries the live inheritance chain from `pts-core/src/_cc.js`.
3. Validates whether `SourceClass` extends or matches `TargetClass`:
   * **Allowed**: `HeroConfig` -> slot accepting `CharacterConfig` (where `HeroConfig extends CharacterConfig`).
   * **Rejected**: `EnemyConfig` -> slot accepting `HeroConfig`.
4. Visual feedback reflects valid drop targets immediately.

### 4.3. Asset Picker Filtering ("More" Button)
When clicking the search magnifying glass / "More" button on a component property slot:
* Native Cocos Creator passes type filters (e.g. `cc.Asset` or specific class names) to `Editor.Message.request('asset-db', 'query-assets')`.
* `pts-asset` hooks into the query pipeline to resolve asset types dynamically while filtering out negation globs (such as `!*.pts`) that would otherwise hide custom assets.

### 4.4. Tree-Shaking Protection via `_lazy.prefab` (`source/lazy-registry.ts`)
Cocos Creator strips assets from release builds if they are not referenced by an active scene or bundle root.
* `pts-asset` maintains a dedicated hidden prefab (`_lazy.prefab`) in the project root.
* All `.pts` assets are registered as dependencies on this prefab.
* During project build, Cocos Creator sees the dependencies and bundles all `.pts` assets safely without stripping.

---

## 5. Editor Contributions

### 5.1. Dockable Panel (`panels.default`)
* Accessible via menu: **Extension -> pTS Asset -> Open Panel**.
* **Features**:
  * **Asset Browser**: Filter, inspect, and search all `.pts` assets in the project.
  * **Asset Creator**: Wizard to instantiate new `.pts` assets from any registered `pTSAsset` subclass.
  * **Integrity Diagnostics**: Detects orphaned assets, mismatched `__type__` definitions, or missing schemas.
  * **Auto-Save Toggle**: Configurable in Project Settings (`profile.project.isAutoSave`).

### 5.2. Menu Contributions

| Menu Path | Label | Triggered Message |
|---|---|---|
| `Extension/pTS Asset` | **Open Panel** | `open-panel` |
| `Extension/pTS Asset` | **Reload** | `reload` |
| `Extension/pTS Asset` | **Create** | `createz` |
| `Extension/pTS Asset` | **Log** | `_cc:log` |
| `Extension/pTS Asset` | **Update .pts Assets** | `pts::importer::lookup` |
| `Extension/pTS Asset` | **Re-Scan & Sync Lazy Prefab** | `sync-lazy-prefab` |

### 5.3. Core IPC Messages

| Message Name | Type | Description |
|---|---|---|
| `open-panel` | Send | Opens or focuses the dockable pTS Asset inspector panel. |
| `sync-lazy-prefab` | Request | Re-scans all `.pts` assets and synchronizes references in `_lazy.prefab`. |
| `create-pts-asset` | Request | Programmatically creates a new `.pts` asset with specified class type and path. |
| `pts::importer::lookup` | Send | Re-evaluates importer bindings and re-imports dirty `.pts` assets. |
| `fix-all-pts-assets` | Request | Batch migrates legacy or malformed `.pts` files across the project. |
| `sync-preview-data` | Send | Pushes live inspector property changes to the runtime preview context. |
| `query-preview-data` | Request | Retrieves active preview state for a given asset UUID. |

---

## 6. How to Define & Use a `pTSAsset`

### Step 1: Declare the TypeScript Class
```typescript
import { _decorator } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';

const { ccclass, property } = _decorator;

@ccclass('WeaponConfig')
export class WeaponConfig extends pTSAsset {
    @property({ tooltip: 'Weapon display name' })
    public weaponName: string = 'Excalibur';

    @property({ tooltip: 'Damage multiplier' })
    public damageMultiplier: number = 2.5;

    @property({ tooltip: 'Durability points' })
    public durability: number = 100;
}
```

### Step 2: Create the Asset
1. In Cocos Creator, open **Extension -> pTS Asset -> Open Panel**.
2. Select `WeaponConfig` from the class dropdown and click **Create Asset**.
3. Choose destination folder (e.g. `assets/configs/weapons/excalibur.pts`).
4. Edit properties in the Inspector.

### Step 3: Reference in a Component
```typescript
import { _decorator, Component } from 'cc';
import { WeaponConfig } from './configs/WeaponConfig';

const { ccclass, property } = _decorator;

@ccclass('CombatController')
export class CombatController extends Component {
    @property({ type: WeaponConfig })
    public equippedWeapon: WeaponConfig | null = null;

    start() {
        if (this.equippedWeapon) {
            console.log(`Equipped: ${this.equippedWeapon.weaponName}`);
        }
    }
}
```
* You can now drag `excalibur.pts` directly into the `equippedWeapon` slot in the Inspector, or pick it via the "More" button!

---

## 7. Directory Structure

```
pts-asset/
├── .agents/                         # Architectural documentation & pipeline specs
│   └── PIPLINE.md                   # Full internal pipeline specification
├── assets/
│   ├── icons/pts.png                # Custom .pts asset badge icon
│   └── scripts/                     # Runtime json registers and components
├── dist/                            # Compiled extension JavaScript
├── i18n/                            # Localization (en, zh)
├── package.json                     # Extension manifest, panels, messages, menus
├── source/                          # TypeScript source for editor extension
│   ├── asset-db.ts                  # AssetDB query & icon hooks
│   ├── asset-menu.ts                # Context menu integrations
│   ├── importer.ts                  # Custom pts-importer implementation
│   ├── inheritance.ts               # Type reflection & drag-and-drop validation
│   ├── lazy-registry.ts             # _lazy.prefab tree-shaking protection
│   ├── main.ts                      # Extension lifecycle & IPC dispatcher
│   ├── panel.ts                     # Dockable Inspector UI panel
│   └── pts.ts                       # Format serialization & deserialization
└── tsconfig.json
```