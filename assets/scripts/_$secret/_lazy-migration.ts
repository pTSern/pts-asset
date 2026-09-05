
/**
 * UI 的渲染在 v3.0 变为使用 node.layer 来判断可见性，为了保证老版本项目升级后表现一致，
 * Creator 会在运行时动态分配一个未使用的 layer 给常驻节点的 UI，避免常驻节点的 UI 与场景中
 * 的其他 UI 的 layer 发生冲突，当你确定不会发生冲突时，你可以移除此脚本.
 *
 * UI rendering has changed in v3.0 to use node.layer to determine visibility.
 * To ensure consistent performance after upgrading old projects.
 * Creator will dynamically assign an unused layer to the UI node in the persist node at
 * runtime to avoid conflicts between the layer of UI in the persist node and the
 * layer of other UI in the scene. You can remove this script when you
 * are sure there is no conflict
 */

import { _decorator, Node, director, Director, game, BaseNode, Canvas, Camera, assetManager, Prefab, instantiate } from 'cc';
import { BUILD } from 'cc/env';
import { pConst } from 'db://pts-core/scripts/utils';

director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
    const _is = pConst.EDITOR_ONLY_IN_PREVIEW || BUILD
    console.log("[Lazy Migration] Loading '_lazy' prefab from bundle '_$secret'...", _is);
    if(_is) {
        //setTimeout( () => {

        assetManager.loadBundle('_$secret', (err, bundle) => {
            if (err) {
                console.error('[Lazy Migration] Failed to load bundle "_$secret":', err);
                return;
            }
            bundle.load('_lazy', Prefab, (err, prefab) => {
                if (err || !prefab) {
                    console.error('[Lazy Migration] Failed to load prefab "_lazy":', err);
                    return;
                }
                console.log('[Lazy Migration] Successfully added "_lazy" prefab to the scene and made it persistent.');
                const _node = instantiate(prefab);
                director.getScene().addChild(_node);
                director.addPersistRootNode(_node);
            })
        })
        //}, 5000 )
    }
});

