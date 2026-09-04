# Cocos Creator ScriptableObject (`.pts`) Architecture & Implementation Spec

> **Conversation Reference:** [Previous Investigation](conversation://9e6fde96-cc8d-4943-a2d8-a3865481087c)  
> **Engine Version:** Cocos Creator 3.8.8  
> **Extension Target:** `extensions/pts-asset`  
> **Repository:** `E:/__pTSern/KingdomMatch`

---

## 1. Executive Summary & Objective

The goal is to build a Unity-style **ScriptableObject** system in Cocos Creator 3.8.8:
- Custom data files with `.pts` extension containing JSON data (`__type__` and `__values__`).
- TypeScript scriptable classes extending `pTSAsset extends cc.Asset` (e.g. `export class Test extends pTSAsset`).
- Component script usage: `@property({ type: Test }) myData: Test = null;`.
- **The Core Goal:** Be able to drag `test.pts` directly into the `@property({ type: Test })` slot in the Inspector, have the Editor recognize it as a valid `Test` instance, and have `AssetManager` instantiate and hydrate the concrete class at runtime.

---

## 2. Current State (What Already Works ~90%)

1. **Base Class Definition:**
   - [`Json_pTSAsset.ts`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/assets/scripts/json/Json.pTSAsset.ts) defines `Json_pTSAsset extends Asset`.
2. **Runtime Pipeline Registration:**
   - [`Json.Register.ts`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/assets/scripts/json/Json.Register.ts) registers:
     - `assetManager.downloader.register('.pts', ...)`
     - `assetManager.parser.register('.pts', ...)`
     - `assetManager.factory.register('.pts', ...)`
     - `assetManager.pipeline.append(...)` hydration hook for value types (`cc.Vec2`, `cc.Vec3`, `cc.Rect`, `cc.Color`) and asset references.
3. **Editor Extension (`pts-asset`):**
   - [`extensions/pts-asset/package.json`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/package.json):
     - Registers asset type `"pts"` extending `"cc.Asset"`.
     - Mounts `assets/` directory.
     - Registers custom Inspector for `.pts` assets ([`pts.ts`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/source/pts.ts)).
   - [`extensions/pts-asset/source/main.ts`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/source/main.ts):
     - Listens to `asset-db:asset-change`.
     - Automatically parses `.pts` files, reads `__type__`, and writes `meta.userData.__type__ = ptsContent.__type__`.
     - Patches `library/...json` to ensure `_native: ".pts"`.

---

## 3. The Core Root Cause (Why Editor Rejects `.pts` in Inspector)

When a component declares:
```ts
@property({ type: Test })
myData: Test = null;
```

### The Inspection & Drag-Drop Sequence:
1. **Scene Dump:** The scene script generates component serialization for Inspector. Because `Test extends pTSAsset extends cc.Asset`, the Editor creates:
   ```html
   <ui-asset droppable="Test" type="Test"></ui-asset>
   ```
2. **User Drags `test.pts`:** The UI component receives the drag event with the asset's UUID.
3. **Asset DB Query:** `<ui-asset>` queries `Editor.Message.request('asset-db', 'query-asset-info', uuid)`.
4. **The Returned AssetInfo:**
   Because `.pts` is not a hardcoded engine type, `asset-db` processes it using the fallback `*` importer. It returns:
   ```json
   {
     "name": "test.pts",
     "uuid": "...",
     "type": "cc.Asset",
     "extends": ["cc.Asset"]
   }
   ```
5. **The Type Check Failure:**
   `<ui-asset>` checks whether the dragged item's type satisfies `droppable="Test"`:
   ```ts
   isSubclass(draggedType, droppableType) // isSubclass("cc.Asset", "Test") -> FALSE!
   ```
   - `cc.Asset` is the **base class**, NOT a subclass of `Test` (or `pTSAsset`).
   - The Editor marks the drag cursor as **forbidden** and blocks dropping.

---

## 4. Architectural Solutions

### Option A: Dynamic `query-asset-info` Interception (Recommended / Cleanest)
Native Cocos Creator UI feel. Uses built-in `<ui-asset>`.

#### Mechanism:
In [`extensions/pts-asset/source/main.ts`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/source/main.ts):
1. In the extension main process, hook/proxy `query-asset-info` from `asset-db`:
   - When the queried asset is `.pts`:
   - Read `meta.userData.__type__` (already synchronized by `_patchPtsLibrary`, e.g., `"Test"`).
   - If `meta.userData.__type__` exists, modify the returned `AssetInfo`:
     ```ts
     info.type = meta.userData.__type__; // e.g. "Test"
     info.extends = ['cc.Asset', 'pTSAsset', meta.userData.__type__];
     ```
2. **Behavior Matrix:**
   - Drag `test.pts` (type: `"Test"`) into `@property({ type: Test })` -> **ACCEPTED** (`Test === Test`).
   - Drag `test.pts` into `@property({ type: pTSAsset })` -> **ACCEPTED** (`pTSAsset` in `extends`).
   - Drag `test.pts` into `@property({ type: Asset })` -> **ACCEPTED** (`cc.Asset` in `extends`).
   - Drag `test.pts` into `@property({ type: LevelConfig })` -> **REJECTED** (type mismatch).

---

### Option B: Custom Property Drawer for `pTSAsset` (Unity Style)
Gives full control over UI and drag validation, plus inline ScriptableObject editing in the Inspector.

#### Mechanism:
1. In [`extensions/pts-asset/package.json`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/package.json), register custom property drawer:
   ```json
   "contributions": {
       "ui-kit": {
           "ui-prop": {
               "render": {
                   "pTSAsset": "./dist/pts-prop-drawer.js"
               }
           }
       }
   }
   ```
2. When the Inspector encounters any property inheriting from `pTSAsset`:
   - Instead of default `<ui-asset>`, it renders your custom `ui-pts-drawer`.
   - On dragover/drop:
     - Extracts dropped UUID.
     - Reads `meta.userData.__type__`.
     - Validates via `cc.js.isChildClassOf(droppedType, targetPropertyType)`.
     - Sets value `{ __uuid__: uuid }` if valid, displays warning if invalid.
   - Bonus: Renders an expandable foldout directly in the component inspector to view/edit the `.pts` values inline without clicking away to the asset!

---

### Option C: Cocos 3.8 `asset-handler` Registration
Cocos Creator 3.8 supports `asset-handler` in `contributions["asset-db"]["asset-handler"]`:
```json
"contributions": {
    "asset-db": {
        "asset-handler": [
            {
                "name": "pts",
                "extnames": [".pts"],
                "handler": "./dist/pts-asset-handler.js"
            }
        ]
    }
}
```
In `pts-asset-handler.js`, implement `AssetHandlerBase`:
- `assetType`: Base asset type (`pTSAsset`).
- Combined with Option A to resolve concrete dynamic subtypes (`Test`).

---

## 5. Implementation Roadmap for the Next Agent

1. **Step 1:** In [`extensions/pts-asset/source/main.ts`](file:///E:/__pTSern/KingdomMatch/extensions/pts-asset/source/main.ts), implement the `query-asset-info` IPC hook to enrich `.pts` assets with `type = meta.userData.__type__` and `extends = ['cc.Asset', 'pTSAsset', meta.userData.__type__]`.
2. **Step 2:** Ensure `package.json` declares `"extends": "pTSAsset"` under `contributions.assets.types`.
3. **Step 3:** Verify in the Cocos Creator Inspector:
   - Create test component with `@property({ type: Test }) myTest = null;`.
   - Drag `test.pts` onto `myTest`. Verify that `<ui-asset>` highlights green and accepts the drop.
4. **Step 4 (Optional Polish):** If inline ScriptableObject editing is desired, implement the Option B Property Drawer for `pTSAsset`.
