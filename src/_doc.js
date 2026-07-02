// LMAOOO

/**
 * @namespace cc
 */

/**
 * @typedef {Object} Vec2
 * @property {number} x
 * @property {number} y
 * @property {function(v: Vec2): Vec2} clone
 * @property {function(x: number, y: number): Vec2} set
 */

/**
 * @typedef {Object} Vec3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {function(v: Vec3): Vec3} clone
 * @property {function(x: number, y: number, z: number): Vec3} set
 */

/**
 * @typedef {Object} Node
 * @property {string} name
 * @property {Vec3} position
 * @property {function(name: string): Node} getChildByName
 */

/**
 * @typedef {Object} cc * @property { AABB } AABB
 * @property { AABBPool } AABBPool
 * @property { AABBView } AABBView
 * @property { Acceleration } Acceleration
 * @property { AccelerometerInputSource } AccelerometerInputSource
 * @property { AccessFlagBit } AccessFlagBit
 * @property { AccessType } AccessType
 * @property { Action } Action
 * @property { ActionCustomUpdate } ActionCustomUpdate
 * @property { ActionEnum } ActionEnum
 * @property { ActionInstant } ActionInstant
 * @property { ActionInterval } ActionInterval
 * @property { ActionManager } ActionManager
 * @property { ActionUnknownDuration } ActionUnknownDuration
 * @property { addEmbeddedPlayerTag } addEmbeddedPlayerTag
 * @property { additiveSettingsTag } additiveSettingsTag
 * @property { AddNonFreestandingNodeError } AddNonFreestandingNodeError
 * @property { Address } Address
 * @property { AdjI } AdjI
 * @property { AdjPI } AdjPI
 * @property { AffineTransform } AffineTransform
 * @property { AlignFlags } AlignFlags
 * @property { AlignMode } AlignMode
 * @property { ALIPAY } ALIPAY
 * @property { AlphaKey } AlphaKey
 * @property { Ambient } Ambient
 * @property { AmbientInfo } AmbientInfo
 * @property { ANDROID } ANDROID
 * @property { AngularDriverSettings } AngularDriverSettings
 * @property { AngularLimitSettings } AngularLimitSettings
 * @property { Animation } Animation
 * @property { AnimationBlend } AnimationBlend
 * @property { AnimationBlend1D } AnimationBlend1D
 * @property { AnimationBlend2D } AnimationBlend2D
 * @property { AnimationBlendDirect } AnimationBlendDirect
 * @property { AnimationBlendEval } AnimationBlendEval
 * @property { AnimationBlendItem } AnimationBlendItem
 * @property { AnimationCache } AnimationCache
 * @property { AnimationCacheMode } AnimationCacheMode
 * @property { AnimationClip } AnimationClip
 * @property { AnimationClipAdditiveSettings } AnimationClipAdditiveSettings
 * @property { AnimationClipLegacyData } AnimationClipLegacyData
 * @property { AnimationComponent } AnimationComponent
 * @property { AnimationController } AnimationController
 * @property { AnimationCurve } AnimationCurve
 * @property { AnimationData } AnimationData
 * @property { AnimationEventType } AnimationEventType
 * @property { AnimationFadeOutMode } AnimationFadeOutMode
 * @property { AnimationGraph } AnimationGraph
 * @property { AnimationGraphBindingContext } AnimationGraphBindingContext
 * @property { AnimationGraphEval } AnimationGraphEval
 * @property { AnimationGraphEventBinding } AnimationGraphEventBinding
 * @property { AnimationGraphLike } AnimationGraphLike
 * @property { AnimationGraphPoseLayoutMaintainer } AnimationGraphPoseLayoutMaintainer
 * @property { AnimationGraphSettleContext } AnimationGraphSettleContext
 * @property { AnimationGraphUpdateContextGenerator } AnimationGraphUpdateContextGenerator
 * @property { AnimationGraphVariant } AnimationGraphVariant
 * @property { AnimationManager } AnimationManager
 * @property { AnimationMask } AnimationMask
 * @property { AnimationState } AnimationState
 * @property { AnimationStateEventType } AnimationStateEventType
 * @property { AnimCurve } AnimCurve
 * @property { AntiAliasing } AntiAliasing
 * @property { API } API
 * @property { applyDecs2203R } applyDecs2203R
 * @property { applyDecs2301 } applyDecs2301
 * @property { applyDefaultGeometryOptions } applyDefaultGeometryOptions
 * @property { applyMixins } applyMixins
 * @property { Armature } Armature
 * @property { ArmatureCache } ArmatureCache
 * @property { ArmatureCacheMgr } ArmatureCacheMgr
 * @property { ArmatureData } ArmatureData
 * @property { ArmatureDisplay } ArmatureDisplay
 * @property { ArmatureSystem } ArmatureSystem
 * @property { array } array
 * @property { ArrayCollisionMatrix } ArrayCollisionMatrix
 * @property { Asset } Asset
 * @property { AssetLibrary } AssetLibrary
 * @property { AssetManager } AssetManager
 * @property { assets } assets
 * @property { assetsOverrideMap } assetsOverrideMap
 * @property { AsyncDelegate } AsyncDelegate
 * @property { Atlas } Atlas
 * @property { ATTACHMENT_TYPE } ATTACHMENT_TYPE
 * @property { AttachmentType } AttachmentType
 * @property { AttachUtil } AttachUtil
 * @property { Attribute } Attribute
 * @property { AttributeName } AttributeName
 * @property { AttrUInt16ArrayView } AttrUInt16ArrayView
 * @property { AttrUInt32ArrayView } AttrUInt32ArrayView
 * @property { AttrUInt8ArrayView } AttrUInt8ArrayView
 * @property { audioBufferManager } audioBufferManager
 * @property { AudioClip } AudioClip
 * @property { AudioContextAgent } AudioContextAgent
 * @property { AudioEvent } AudioEvent
 * @property { audioManager } audioManager
 * @property { AudioPCMDataView } AudioPCMDataView
 * @property { AudioPlayer } AudioPlayer
 * @property { AudioPlayerDOM } AudioPlayerDOM
 * @property { AudioPlayerMinigame } AudioPlayerMinigame
 * @property { AudioPlayerWeb } AudioPlayerWeb
 * @property { AudioSource } AudioSource
 * @property { AudioSourceComponent } AudioSourceComponent
 * @property { AudioState } AudioState
 * @property { AudioType } AudioType
 * @property { AutoPlacement } AutoPlacement
 * @property { AuxiliaryCurveEntry } AuxiliaryCurveEntry
 * @property { AuxiliaryCurveRegistry } AuxiliaryCurveRegistry
 * @property { B2 } B2
 * @property { b2BoxShape } b2BoxShape
 * @property { B2CircleShape } B2CircleShape
 * @property { b2DistanceJoint } b2DistanceJoint
 * @property { b2EmptyInstance } b2EmptyInstance
 * @property { b2FixedJoint } b2FixedJoint
 * @property { b2HingeJoint } b2HingeJoint
 * @property { b2Joint } b2Joint
 * @property { b2MouseJoint } b2MouseJoint
 * @property { B2ObjectType } B2ObjectType
 * @property { B2PhysicsWorld } B2PhysicsWorld
 * @property { b2PolygonShape } b2PolygonShape
 * @property { b2RelativeJoint } b2RelativeJoint
 * @property { B2RigidBody2D } B2RigidBody2D
 * @property { b2Shape2D } b2Shape2D
 * @property { b2SliderJoint } b2SliderJoint
 * @property { B2SpringJoint } B2SpringJoint
 * @property { B2WheelJoint } B2WheelJoint
 * @property { backOutIn } backOutIn
 * @property { BAKE_SKELETON_CURVE_SYMBOL } BAKE_SKELETON_CURVE_SYMBOL
 * @property { BakedSkinningModel } BakedSkinningModel
 * @property { barFilled } barFilled
 * @property { BarrierType } BarrierType
 * @property { BASE64_VALUES } BASE64_VALUES
 * @property { BaseFactory } BaseFactory
 * @property { BASELINE_RATIO } BASELINE_RATIO
 * @property { BaseObject } BaseObject
 * @property { BasePass } BasePass
 * @property { BaseRenderData } BaseRenderData
 * @property { BatchedSkinningModelComponent } BatchedSkinningModelComponent
 * @property { Batcher2D } Batcher2D
 * @property { BatchingSchemes } BatchingSchemes
 * @property { BatchingUtility } BatchingUtility
 * @property { Billboard } Billboard
 * @property { BillboardComponent } BillboardComponent
 * @property { BinaryCondition } BinaryCondition
 * @property { BinaryInputArchive } BinaryInputArchive
 * @property { BinaryOutputArchive } BinaryOutputArchive
 * @property { BindableBoolean } BindableBoolean
 * @property { BindableNumber } BindableNumber
 * @property { BindingMappingInfo } BindingMappingInfo
 * @property { binPackageUnpack } binPackageUnpack
 * @property { BitmapFont } BitmapFont
 * @property { BitMask } BitMask
 * @property { BITMASK_TAG } BITMASK_TAG
 * @property { bits } bits
 * @property { blend1D } blend1D
 * @property { BlendFactor } BlendFactor
 * @property { BlendOp } BlendOp
 * @property { blendSimpleDirectional } blendSimpleDirectional
 * @property { BlendState } BlendState
 * @property { BlendStateBuffer } BlendStateBuffer
 * @property { BlendStateEditor } BlendStateEditor
 * @property { BlendTarget } BlendTarget
 * @property { BlendTargetEditor } BlendTargetEditor
 * @property { Blit } Blit
 * @property { BlitScreen } BlitScreen
 * @property { BlitScreenPass } BlitScreenPass
 * @property { BlitType } BlitType
 * @property { BlockInputEvents } BlockInputEvents
 * @property { BlockInputEventsComponent } BlockInputEventsComponent
 * @property { Bloom } Bloom
 * @property { BLOOM_COMBINEPASS_INDEX } BLOOM_COMBINEPASS_INDEX
 * @property { BLOOM_DOWNSAMPLEPASS_INDEX } BLOOM_DOWNSAMPLEPASS_INDEX
 * @property { BLOOM_PREFILTERPASS_INDEX } BLOOM_PREFILTERPASS_INDEX
 * @property { BLOOM_UPSAMPLEPASS_INDEX } BLOOM_UPSAMPLEPASS_INDEX
 * @property { BloomPass } BloomPass
 * @property { BloomRenderData } BloomRenderData
 * @property { BloomStage } BloomStage
 * @property { bmfont } bmfont
 * @property { BmfontUtils } BmfontUtils
 * @property { Bone } Bone
 * @property { BoneData } BoneData
 * @property { boolean } boolean
 * @property { bounceOutIn } bounceOutIn
 * @property { BoundingBoxData } BoundingBoxData
 * @property { box } box
 * @property { BoxCharacterController } BoxCharacterController
 * @property { BoxCollider } BoxCollider
 * @property { BoxCollider2D } BoxCollider2D
 * @property { BoxColliderComponent } BoxColliderComponent
 * @property { BrowserType } BrowserType
 * @property { bt } bt
 * @property { btCache } btCache
 * @property { btCollisionFlags } btCollisionFlags
 * @property { btCollisionObjectStates } btCollisionObjectStates
 * @property { btCollisionObjectTypes } btCollisionObjectTypes
 * @property { btRigidBodyFlags } btRigidBodyFlags
 * @property { Buffer } Buffer
 * @property { BufferAccessor } BufferAccessor
 * @property { BufferAsset } BufferAsset
 * @property { BufferBarrier } BufferBarrier
 * @property { BufferBarrierInfo } BufferBarrierInfo
 * @property { BufferBlob } BufferBlob
 * @property { BufferBuilder } BufferBuilder
 * @property { BufferFlagBit } BufferFlagBit
 * @property { BufferInfo } BufferInfo
 * @property { BufferTextureCopy } BufferTextureCopy
 * @property { BufferUsageBit } BufferUsageBit
 * @property { BufferViewInfo } BufferViewInfo
 * @property { BUILD } BUILD
 * @property { BUILTIN_CLASSID_RE } BUILTIN_CLASSID_RE
 * @property { BuiltinBoxShape } BuiltinBoxShape
 * @property { BuiltinBundleName } BuiltinBundleName
 * @property { BuiltinCapsuleShape } BuiltinCapsuleShape
 * @property { BuiltinCircleShape } BuiltinCircleShape
 * @property { BuiltinContact } BuiltinContact
 * @property { BuiltinObject } BuiltinObject
 * @property { BuiltinPhysicsWorld } BuiltinPhysicsWorld
 * @property { BuiltinPolygonShape } BuiltinPolygonShape
 * @property { builtinResMgr } builtinResMgr
 * @property { BuiltinRigidBody } BuiltinRigidBody
 * @property { BuiltinShape } BuiltinShape
 * @property { BuiltinShape2D } BuiltinShape2D
 * @property { BuiltinSharedBody } BuiltinSharedBody
 * @property { BuiltinSphereShape } BuiltinSphereShape
 * @property { BuiltInWorld } BuiltInWorld
 * @property { BulletBoxCharacterController } BulletBoxCharacterController
 * @property { BulletBoxShape } BulletBoxShape
 * @property { BulletBvhTriangleMeshShape } BulletBvhTriangleMeshShape
 * @property { BulletCache } BulletCache
 * @property { BulletCapsuleCharacterController } BulletCapsuleCharacterController
 * @property { BulletCapsuleShape } BulletCapsuleShape
 * @property { BulletCharacterController } BulletCharacterController
 * @property { BulletConeShape } BulletConeShape
 * @property { BulletConfigurableConstraint } BulletConfigurableConstraint
 * @property { BulletConstraint } BulletConstraint
 * @property { BulletContactData } BulletContactData
 * @property { BulletCylinderShape } BulletCylinderShape
 * @property { BulletFixedConstraint } BulletFixedConstraint
 * @property { BulletHingeConstraint } BulletHingeConstraint
 * @property { BulletP2PConstraint } BulletP2PConstraint
 * @property { BulletPlaneShape } BulletPlaneShape
 * @property { BulletRigidBody } BulletRigidBody
 * @property { BulletShape } BulletShape
 * @property { BulletSharedBody } BulletSharedBody
 * @property { BulletSimplexShape } BulletSimplexShape
 * @property { BulletSphereShape } BulletSphereShape
 * @property { BulletTerrainShape } BulletTerrainShape
 * @property { BulletTrimeshShape } BulletTrimeshShape
 * @property { BulletWorld } BulletWorld
 * @property { bundles } bundles
 * @property { Burst } Burst
 * @property { Button } Button
 * @property { ButtonComponent } ButtonComponent
 * @property { ButtonEventType } ButtonEventType
 * @property { BYTEDANCE } BYTEDANCE
 * @property { CACHE_KEY } CACHE_KEY
 * @property { CachedArray } CachedArray
 * @property { CacheMode } CacheMode
 * @property { CallbackList } CallbackList
 * @property { CallbacksInvoker } CallbacksInvoker
 * @property { CallFunc } CallFunc
 * @property { Camera } Camera
 * @property { CAMERA_DEFAULT_MASK } CAMERA_DEFAULT_MASK
 * @property { CAMERA_EDITOR_MASK } CAMERA_EDITOR_MASK
 * @property { CameraAperture } CameraAperture
 * @property { CameraComponent } CameraComponent
 * @property { CameraEvent } CameraEvent
 * @property { CameraFOVAxis } CameraFOVAxis
 * @property { CameraISO } CameraISO
 * @property { CameraProjection } CameraProjection
 * @property { CameraShutter } CameraShutter
 * @property { CameraType } CameraType
 * @property { CameraUsage } CameraUsage
 * @property { CameraVisFlags } CameraVisFlags
 * @property { CannonBoxShape } CannonBoxShape
 * @property { CannonConeShape } CannonConeShape
 * @property { CannonConstraint } CannonConstraint
 * @property { CannonContactEquation } CannonContactEquation
 * @property { CannonCylinderShape } CannonCylinderShape
 * @property { CannonHingeConstraint } CannonHingeConstraint
 * @property { CannonLockConstraint } CannonLockConstraint
 * @property { CannonPlaneShape } CannonPlaneShape
 * @property { CannonPointToPointConstraint } CannonPointToPointConstraint
 * @property { CannonRigidBody } CannonRigidBody
 * @property { CannonShape } CannonShape
 * @property { CannonSharedBody } CannonSharedBody
 * @property { CannonSimplexShape } CannonSimplexShape
 * @property { CannonSphereShape } CannonSphereShape
 * @property { CannonTerrainShape } CannonTerrainShape
 * @property { CannonTrimeshShape } CannonTrimeshShape
 * @property { CannonWorld } CannonWorld
 * @property { Canvas } Canvas
 * @property { CanvasComponent } CanvasComponent
 * @property { CanvasPool } CanvasPool
 * @property { Capsule } Capsule
 * @property { CapsuleCharacterController } CapsuleCharacterController
 * @property { CapsuleCollider } CapsuleCollider
 * @property { CapsuleColliderComponent } CapsuleColliderComponent
 * @property { CC_COLOR_0 } CC_COLOR_0
 * @property { CC_MAT4_0 } CC_MAT4_0
 * @property { CC_MAT4_1 } CC_MAT4_1
 * @property { CC_QUAT_0 } CC_QUAT_0
 * @property { CC_QUAT_1 } CC_QUAT_1
 * @property { CC_V3_0 } CC_V3_0
 * @property { CC_V3_1 } CC_V3_1
 * @property { CC_V3_2 } CC_V3_2
 * @property { CCArmatureCacheDisplay } CCArmatureCacheDisplay
 * @property { CCArmatureDisplay } CCArmatureDisplay
 * @property { CCBoolean } CCBoolean
 * @property { ccclass } ccclass
 * @property { CCFactory } CCFactory
 * @property { CCFloat } CCFloat
 * @property { CCInteger } CCInteger
 * @property { cclegacy } cclegacy
 * @property { CCLoader } CCLoader
 * @property { CCObject } CCObject
 * @property { CCObjectFlags } CCObjectFlags
 * @property { CCON } CCON
 * @property { CCSlot } CCSlot
 * @property { CCString } CCString
 * @property { CCTextureAtlasData } CCTextureAtlasData
 * @property { CCTextureData } CCTextureData
 * @property { ccwindow } ccwindow
 * @property { Channel } Channel
 * @property { CharacterController } CharacterController
 * @property { CharacterControllerContact } CharacterControllerContact
 * @property { CharacterTriggerEventObject } CharacterTriggerEventObject
 * @property { circle } circle
 * @property { CircleCollider2D } CircleCollider2D
 * @property { circOutIn } circOutIn
 * @property { CircumSphere } CircumSphere
 * @property { CLASS_NAME_PREFIX_ANIM } CLASS_NAME_PREFIX_ANIM
 * @property { clearEmbeddedPlayersTag } clearEmbeddedPlayersTag
 * @property { ClearFlag } ClearFlag
 * @property { ClearFlagBit } ClearFlagBit
 * @property { ClearValue } ClearValue
 * @property { ClearValueType } ClearValueType
 * @property { ClearView } ClearView
 * @property { ClipMotion } ClipMotion
 * @property { cloneAnimationGraphEditorExtrasFrom } cloneAnimationGraphEditorExtrasFrom
 * @property { COCOS_RUNTIME } COCOS_RUNTIME
 * @property { code2KeyCode } code2KeyCode
 * @property { codec } codec
 * @property { Collider } Collider
 * @property { Collider2D } Collider2D
 * @property { ColliderComponent } ColliderComponent
 * @property { CollisionEventObject } CollisionEventObject
 * @property { CollisionMatrix } CollisionMatrix
 * @property { Color } Color
 * @property { ColorAttachment } ColorAttachment
 * @property { ColorDesc } ColorDesc
 * @property { ColorGrading } ColorGrading
 * @property { ColorGradingPass } ColorGradingPass
 * @property { ColorKey } ColorKey
 * @property { ColorMask } ColorMask
 * @property { ColorTrack } ColorTrack
 * @property { ColorTrackEval } ColorTrackEval
 * @property { CommandBuffer } CommandBuffer
 * @property { CommandBufferInfo } CommandBufferInfo
 * @property { CommandBufferType } CommandBufferType
 * @property { CommonStagePriority } CommonStagePriority
 * @property { CompactValueTypeArray } CompactValueTypeArray
 * @property { ComparisonFunc } ComparisonFunc
 * @property { Compiler } Compiler
 * @property { Component } Component
 * @property { ComponentPath } ComponentPath
 * @property { ComponentScheduler } ComponentScheduler
 * @property { CompositeInputSourceAxis1D } CompositeInputSourceAxis1D
 * @property { CompositeInputSourceAxis2D } CompositeInputSourceAxis2D
 * @property { CompositeInputSourceAxis3D } CompositeInputSourceAxis3D
 * @property { CompPrefabInfo } CompPrefabInfo
 * @property { compressType } compressType
 * @property { ComputePass } ComputePass
 * @property { ComputeSubpass } ComputeSubpass
 * @property { ComputeView } ComputeView
 * @property { cone } cone
 * @property { ConeCollider } ConeCollider
 * @property { ConfigurableConstraint } ConfigurableConstraint
 * @property { ConstantForce } ConstantForce
 * @property { constget } constget
 * @property { Constraint } Constraint
 * @property { construct } construct
 * @property { Contact2DType } Contact2DType
 * @property { convertUtils } convertUtils
 * @property { ConvexPartition } ConvexPartition
 * @property { COPY_INPUT_DS_PASS_INDEX } COPY_INPUT_DS_PASS_INDEX
 * @property { CopyPair } CopyPair
 * @property { CopyPass } CopyPass
 * @property { CopySpace } CopySpace
 * @property { Counter } Counter
 * @property { createAnimationAGEvaluation } createAnimationAGEvaluation
 * @property { createDefaultPipeline } createDefaultPipeline
 * @property { createDynamicMesh } createDynamicMesh
 * @property { createEval } createEval
 * @property { createEvalSymbol } createEvalSymbol
 * @property { createIA } createIA
 * @property { createInstanceofProxy } createInstanceofProxy
 * @property { createInstanceTag } createInstanceTag
 * @property { createMesh } createMesh
 * @property { createVariable } createVariable
 * @property { CrossFade } CrossFade
 * @property { CSMLayers } CSMLayers
 * @property { CSMLevel } CSMLevel
 * @property { CSMOptimizationMode } CSMOptimizationMode
 * @property { CSMShadowLayer } CSMShadowLayer
 * @property { cubicOutIn } cubicOutIn
 * @property { CubicSplineNumberValue } CubicSplineNumberValue
 * @property { CubicSplineQuatValue } CubicSplineQuatValue
 * @property { CubicSplineVec2Value } CubicSplineVec2Value
 * @property { CubicSplineVec3Value } CubicSplineVec3Value
 * @property { CubicSplineVec4Value } CubicSplineVec4Value
 * @property { CULL_MESHOPT } CULL_MESHOPT
 * @property { CullingFlags } CullingFlags
 * @property { CullMode } CullMode
 * @property { CurveRange } CurveRange
 * @property { customizeType } customizeType
 * @property { customPipelineBuilderMap } customPipelineBuilderMap
 * @property { cylinder } cylinder
 * @property { CylinderCollider } CylinderCollider
 * @property { CylinderColliderComponent } CylinderColliderComponent
 * @property { DataInput } DataInput
 * @property { DataPoolManager } DataPoolManager
 * @property { DEBUG } DEBUG
 * @property { DebugMode } DebugMode
 * @property { DebugView } DebugView
 * @property { DebugViewCompositeType } DebugViewCompositeType
 * @property { DebugViewSingleType } DebugViewSingleType
 * @property { decodeUuid } decodeUuid
 * @property { default } default
 * @property { DEFAULT_OCTREE_DEPTH } DEFAULT_OCTREE_DEPTH
 * @property { DEFAULT_UNIFORM_COUNTS } DEFAULT_UNIFORM_COUNTS
 * @property { DEFAULT_WORLD_MAX_POS } DEFAULT_WORLD_MAX_POS
 * @property { DEFAULT_WORLD_MIN_POS } DEFAULT_WORLD_MIN_POS
 * @property { DefaultAnimsEnum } DefaultAnimsEnum
 * @property { DefaultResource } DefaultResource
 * @property { DefaultResources } DefaultResources
 * @property { DefaultSkinsEnum } DefaultSkinsEnum
 * @property { DefaultTopLevelPoseNode } DefaultTopLevelPoseNode
 * @property { defaultTransformsTag } defaultTransformsTag
 * @property { DefaultVisitor } DefaultVisitor
 * @property { DeferredAntiAliasing } DeferredAntiAliasing
 * @property { DeferredFlowPriority } DeferredFlowPriority
 * @property { DeferredPipeline } DeferredPipeline
 * @property { DeferredPipelineSceneData } DeferredPipelineSceneData
 * @property { DeferredPoseStashAllocator } DeferredPoseStashAllocator
 * @property { DeferredRenderData } DeferredRenderData
 * @property { DeferredStagePriority } DeferredStagePriority
 * @property { Delaunay } Delaunay
 * @property { DELIMETER } DELIMETER
 * @property { dependMap } dependMap
 * @property { DependUtil } DependUtil
 * @property { DepthStencilAttachment } DepthStencilAttachment
 * @property { DepthStencilDesc } DepthStencilDesc
 * @property { DepthStencilState } DepthStencilState
 * @property { DepthStencilStateEditor } DepthStencilStateEditor
 * @property { Descriptor } Descriptor
 * @property { DESCRIPTOR_BUFFER_TYPE } DESCRIPTOR_BUFFER_TYPE
 * @property { DESCRIPTOR_DYNAMIC_TYPE } DESCRIPTOR_DYNAMIC_TYPE
 * @property { DESCRIPTOR_SAMPLER_TYPE } DESCRIPTOR_SAMPLER_TYPE
 * @property { DESCRIPTOR_STORAGE_BUFFER_TYPE } DESCRIPTOR_STORAGE_BUFFER_TYPE
 * @property { DescriptorBlock } DescriptorBlock
 * @property { DescriptorBlockData } DescriptorBlockData
 * @property { DescriptorBlockFlattened } DescriptorBlockFlattened
 * @property { DescriptorBlockIndex } DescriptorBlockIndex
 * @property { DescriptorData } DescriptorData
 * @property { DescriptorDB } DescriptorDB
 * @property { DescriptorGroupBlockIndex } DescriptorGroupBlockIndex
 * @property { DescriptorSet } DescriptorSet
 * @property { DescriptorSetData } DescriptorSetData
 * @property { DescriptorSetInfo } DescriptorSetInfo
 * @property { DescriptorSetLayout } DescriptorSetLayout
 * @property { DescriptorSetLayoutBinding } DescriptorSetLayoutBinding
 * @property { DescriptorSetLayoutData } DescriptorSetLayoutData
 * @property { DescriptorSetLayoutInfo } DescriptorSetLayoutInfo
 * @property { DescriptorType } DescriptorType
 * @property { DescriptorTypeOrder } DescriptorTypeOrder
 * @property { DescUpdateFrequency } DescUpdateFrequency
 * @property { deserializeTag } deserializeTag
 * @property { Details } Details
 * @property { DEV } DEV
 * @property { Device } Device
 * @property { DeviceCaps } DeviceCaps
 * @property { DeviceInfo } DeviceInfo
 * @property { deviceManager } deviceManager
 * @property { DeviceOptions } DeviceOptions
 * @property { DeviceType } DeviceType
 * @property { directional } directional
 * @property { DirectionalLight } DirectionalLight
 * @property { DirectionalLightComponent } DirectionalLightComponent
 * @property { director } director
 * @property { DirectorEvent } DirectorEvent
 * @property { disallowAnimation } disallowAnimation
 * @property { disallowMultiple } disallowMultiple
 * @property { Dispatch } Dispatch
 * @property { DispatcherEventType } DispatcherEventType
 * @property { DispatchInfo } DispatchInfo
 * @property { displayName } displayName
 * @property { displayOrder } displayOrder
 * @property { distance } distance
 * @property { DistanceJoint2D } DistanceJoint2D
 * @property { DOF } DOF
 * @property { DofPass } DofPass
 * @property { Downloader } Downloader
 * @property { downloadVideo } downloadVideo
 * @property { dragonBones } dragonBones
 * @property { DragonBonesAsset } DragonBonesAsset
 * @property { DragonBonesAtlasAsset } DragonBonesAtlasAsset
 * @property { DragonBonesData } DragonBonesData
 * @property { DragonBonesEventType } DragonBonesEventType
 * @property { DragonBoneSocket } DragonBoneSocket
 * @property { DRAW_INFO_SIZE } DRAW_INFO_SIZE
 * @property { DrawBatch2D } DrawBatch2D
 * @property { DrawInfo } DrawInfo
 * @property { DrawInstance } DrawInstance
 * @property { DURATION_INFINITY } DURATION_INFINITY
 * @property { DYNAMIC_UNIFORM_BLOCK } DYNAMIC_UNIFORM_BLOCK
 * @property { DynamicAtlasManager } DynamicAtlasManager
 * @property { DynamicAtlasTexture } DynamicAtlasTexture
 * @property { DynamicStateFlagBit } DynamicStateFlagBit
 * @property { DynamicStates } DynamicStates
 * @property { DynamicStencilStates } DynamicStencilStates
 * @property { earcut } earcut
 * @property { easing } easing
 * @property { EasingMethod } EasingMethod
 * @property { EAxisDirection } EAxisDirection
 * @property { EBtSharedBodyDirty } EBtSharedBodyDirty
 * @property { EBulletDebugDrawModes } EBulletDebugDrawModes
 * @property { EBulletTriangleRaycastFlag } EBulletTriangleRaycastFlag
 * @property { EBulletType } EBulletType
 * @property { ECharacterControllerType } ECharacterControllerType
 * @property { ECollider2DType } ECollider2DType
 * @property { EColliderType } EColliderType
 * @property { EConstraintMode } EConstraintMode
 * @property { EConstraintType } EConstraintType
 * @property { ED } ED
 * @property { ED6Axis } ED6Axis
 * @property { editable } editable
 * @property { EditBox } EditBox
 * @property { EditBoxComponent } EditBoxComponent
 * @property { EditBoxImpl } EditBoxImpl
 * @property { EditBoxImplBase } EditBoxImplBase
 * @property { EDITOR } EDITOR
 * @property { EDITOR_NOT_IN_PREVIEW } EDITOR_NOT_IN_PREVIEW
 * @property { EditorExtendable } EditorExtendable
 * @property { EditorExtendableMixin } EditorExtendableMixin
 * @property { editorExtrasTag } editorExtrasTag
 * @property { editorOnly } editorOnly
 * @property { EDriverMode } EDriverMode
 * @property { EffectAsset } EffectAsset
 * @property { EffectData } EffectData
 * @property { effectSettings } effectSettings
 * @property { effectStructure } effectStructure
 * @property { EFilterDataWord3 } EFilterDataWord3
 * @property { EJoint2DType } EJoint2DType
 * @property { elasticOutIn } elasticOutIn
 * @property { ElementType } ElementType
 * @property { EllipseBoundingBoxData } EllipseBoundingBoxData
 * @property { EmbeddedAnimationClipPlayable } EmbeddedAnimationClipPlayable
 * @property { EmbeddedParticleSystemPlayable } EmbeddedParticleSystemPlayable
 * @property { EmbeddedPlayable } EmbeddedPlayable
 * @property { EmbeddedPlayableState } EmbeddedPlayableState
 * @property { EmbeddedPlayer } EmbeddedPlayer
 * @property { embeddedPlayerCountTag } embeddedPlayerCountTag
 * @property { EmitterMode } EmitterMode
 * @property { EmptyBuffer } EmptyBuffer
 * @property { EmptyCommandBuffer } EmptyCommandBuffer
 * @property { emptyDecorator } emptyDecorator
 * @property { emptyDecoratorFn } emptyDecoratorFn
 * @property { EmptyDescriptorSet } EmptyDescriptorSet
 * @property { EmptyDescriptorSetLayout } EmptyDescriptorSetLayout
 * @property { EmptyDevice } EmptyDevice
 * @property { EmptyFramebuffer } EmptyFramebuffer
 * @property { EmptyInputAssembler } EmptyInputAssembler
 * @property { EmptyPipelineLayout } EmptyPipelineLayout
 * @property { EmptyPipelineState } EmptyPipelineState
 * @property { EmptyQueue } EmptyQueue
 * @property { EmptyRenderPass } EmptyRenderPass
 * @property { EmptyShader } EmptyShader
 * @property { emptySmartClassDecorator } emptySmartClassDecorator
 * @property { EmptyState } EmptyState
 * @property { EmptyStateEval } EmptyStateEval
 * @property { EmptyStateTransition } EmptyStateTransition
 * @property { EmptySwapchain } EmptySwapchain
 * @property { EmptyTexture } EmptyTexture
 * @property { ENABLE_PROBE_BLEND } ENABLE_PROBE_BLEND
 * @property { ENABLE_SUBPASS } ENABLE_SUBPASS
 * @property { enableEffectImport } enableEffectImport
 * @property { enableIfCCON } enableIfCCON
 * @property { enqueueOperation } enqueueOperation
 * @property { Enum } Enum
 * @property { ENUM_TAG } ENUM_TAG
 * @property { enums } enums
 * @property { EnvironmentLightingType } EnvironmentLightingType
 * @property { EPD } EPD
 * @property { EPhysics2DDrawFlags } EPhysics2DDrawFlags
 * @property { EPhysicsDrawFlags } EPhysicsDrawFlags
 * @property { EPhysXShapeType } EPhysXShapeType
 * @property { EPSILON } EPSILON
 * @property { ERaycast2DType } ERaycast2DType
 * @property { ERaycastMode } ERaycastMode
 * @property { ERigidBody2DType } ERigidBody2DType
 * @property { ERigidBodyType } ERigidBodyType
 * @property { ESimplexType } ESimplexType
 * @property { Event } Event
 * @property { EventAcceleration } EventAcceleration
 * @property { EventDispatcherPriority } EventDispatcherPriority
 * @property { EventGamepad } EventGamepad
 * @property { EventHandheld } EventHandheld
 * @property { EventHandle } EventHandle
 * @property { EventHandler } EventHandler
 * @property { EventHMD } EventHMD
 * @property { Eventify } Eventify
 * @property { EventInfo } EventInfo
 * @property { EventKeyboard } EventKeyboard
 * @property { EventMouse } EventMouse
 * @property { EventObject } EventObject
 * @property { EventTarget } EventTarget
 * @property { EventTouch } EventTouch
 * @property { EventType } EventType
 * @property { executeInEditMode } executeInEditMode
 * @property { executionOrder } executionOrder
 * @property { Executor } Executor
 * @property { ExoticAnimation } ExoticAnimation
 * @property { exoticAnimationTag } exoticAnimationTag
 * @property { ExoticTrsAGEvaluation } ExoticTrsAGEvaluation
 * @property { EXPONENT } EXPONENT
 * @property { expoOutIn } expoOutIn
 * @property { extends } extends
 * @property { extendsEnum } extendsEnum
 * @property { ExtensionType } ExtensionType
 * @property { Extent } Extent
 * @property { ExtrapolationMode } ExtrapolationMode
 * @property { Factory } Factory
 * @property { Feature } Feature
 * @property { fetchPipeline } fetchPipeline
 * @property { files } files
 * @property { fillMat4WithTempFloatArray } fillMat4WithTempFloatArray
 * @property { Filter } Filter
 * @property { find } find
 * @property { FiniteTimeAction } FiniteTimeAction
 * @property { FixedConstraint } FixedConstraint
 * @property { FixedJoint2D } FixedJoint2D
 * @property { flattenCodeArray } flattenCodeArray
 * @property { float } float
 * @property { FloatOutputProcessPass } FloatOutputProcessPass
 * @property { Fog } Fog
 * @property { FOG_TYPE_NONE } FOG_TYPE_NONE
 * @property { FogInfo } FogInfo
 * @property { FogType } FogType
 * @property { Font } Font
 * @property { FontAtlas } FontAtlas
 * @property { FontLetterDefinition } FontLetterDefinition
 * @property { Format } Format
 * @property { FormatFeatureBit } FormatFeatureBit
 * @property { FormatInfo } FormatInfo
 * @property { FormatInfos } FormatInfos
 * @property { formatMap } formatMap
 * @property { FormatType } FormatType
 * @property { FormatView } FormatView
 * @property { formerlySerializedAs } formerlySerializedAs
 * @property { ForwardFinalPass } ForwardFinalPass
 * @property { ForwardFlow } ForwardFlow
 * @property { ForwardFlowPriority } ForwardFlowPriority
 * @property { ForwardPass } ForwardPass
 * @property { ForwardPipeline } ForwardPipeline
 * @property { ForwardStage } ForwardStage
 * @property { ForwardStagePriority } ForwardStagePriority
 * @property { ForwardTransparencyPass } ForwardTransparencyPass
 * @property { ForwardTransparencySimplePass } ForwardTransparencySimplePass
 * @property { FrameBoneInfo } FrameBoneInfo
 * @property { Framebuffer } Framebuffer
 * @property { FrameBufferDesc } FrameBufferDesc
 * @property { FramebufferInfo } FramebufferInfo
 * @property { Frustum } Frustum
 * @property { FSR } FSR
 * @property { FSRPass } FSRPass
 * @property { FXAA } FXAA
 * @property { FxaaPass } FxaaPass
 * @property { Game } Game
 * @property { GamepadInputDevice } GamepadInputDevice
 * @property { garbageCollectionManager } garbageCollectionManager
 * @property { GbufferStage } GbufferStage
 * @property { GCObject } GCObject
 * @property { GeneralBarrier } GeneralBarrier
 * @property { GeneralBarrierInfo } GeneralBarrierInfo
 * @property { genHandle } genHandle
 * @property { geometry } geometry
 * @property { GeometryRenderer } GeometryRenderer
 * @property { get } get
 * @property { getBindingFromHandle } getBindingFromHandle
 * @property { getCountFromHandle } getCountFromHandle
 * @property { getDescriptorType } getDescriptorType
 * @property { getDescriptorTypeOrderName } getDescriptorTypeOrderName
 * @property { getDeviceShaderVersion } getDeviceShaderVersion
 * @property { getEmbeddedPlayersTag } getEmbeddedPlayersTag
 * @property { getFormat } getFormat
 * @property { getGlobalAnimationManager } getGlobalAnimationManager
 * @property { getMemoryAccessFlag } getMemoryAccessFlag
 * @property { getMotionRuntimeID } getMotionRuntimeID
 * @property { getOffsetFromHandle } getOffsetFromHandle
 * @property { getOutputKeys } getOutputKeys
 * @property { getPhaseID } getPhaseID
 * @property { getPipelineSceneData } getPipelineSceneData
 * @property { getPrototypeOf } getPrototypeOf
 * @property { getSerializationMetadata } getSerializationMetadata
 * @property { getset } getset
 * @property { getShaderStage } getShaderStage
 * @property { getTypeFromHandle } getTypeFromHandle
 * @property { GetTypeSize } GetTypeSize
 * @property { getUpdateFrequencyName } getUpdateFrequencyName
 * @property { getVariableValueAttributes } getVariableValueAttributes
 * @property { gfx } gfx
 * @property { GFXObject } GFXObject
 * @property { globalDescriptorSetLayout } globalDescriptorSetLayout
 * @property { GlobalDSManager } GlobalDSManager
 * @property { globalPoseGraphNodeInputManager } globalPoseGraphNodeInputManager
 * @property { glslangWasmModule } glslangWasmModule
 * @property { Gradient } Gradient
 * @property { GradientRange } GradientRange
 * @property { GRAPH_DEBUG_ENABLED } GRAPH_DEBUG_ENABLED
 * @property { GraphColor } GraphColor
 * @property { Graphics } Graphics
 * @property { GraphicsAssembler } GraphicsAssembler
 * @property { GraphicsComponent } GraphicsComponent
 * @property { group } group
 * @property { HALF_PI } HALF_PI
 * @property { HandheldInputDevice } HandheldInputDevice
 * @property { HandleInputDevice } HandleInputDevice
 * @property { HBAO } HBAO
 * @property { HBAOPass } HBAOPass
 * @property { HeightField } HeightField
 * @property { help } help
 * @property { Hide } Hide
 * @property { HierarchyPath } HierarchyPath
 * @property { HingeConstraint } HingeConstraint
 * @property { HingeJoint2D } HingeJoint2D
 * @property { HingeLimitData } HingeLimitData
 * @property { HingeMotorData } HingeMotorData
 * @property { HMDInputDevice } HMDInputDevice
 * @property { HONOR } HONOR
 * @property { HorizontalTextAlignment } HorizontalTextAlignment
 * @property { HTML5 } HTML5
 * @property { HtmlTextParser } HtmlTextParser
 * @property { HUAWEI } HUAWEI
 * @property { I_SAMPLES_COUNT } I_SAMPLES_COUNT
 * @property { icon } icon
 * @property { IDGenerator } IDGenerator
 * @property { ImageAsset } ImageAsset
 * @property { ImageFormat } ImageFormat
 * @property { Impl } Impl
 * @property { importFunc } importFunc
 * @property { incomingsSymbol } incomingsSymbol
 * @property { IndirectBuffer } IndirectBuffer
 * @property { InEI } InEI
 * @property { InEPI } InEPI
 * @property { InitDecoder } InitDecoder
 * @property { Input } Input
 * @property { InputAssembler } InputAssembler
 * @property { InputAssemblerInfo } InputAssemblerInfo
 * @property { InputEventType } InputEventType
 * @property { InputFlag } InputFlag
 * @property { InputMode } InputMode
 * @property { InputSource } InputSource
 * @property { InputSourceAxis1D } InputSourceAxis1D
 * @property { InputSourceAxis2D } InputSourceAxis2D
 * @property { InputSourceAxis3D } InputSourceAxis3D
 * @property { InputSourceButton } InputSourceButton
 * @property { InputSourceDpad } InputSourceDpad
 * @property { InputSourceOrientation } InputSourceOrientation
 * @property { InputSourcePosition } InputSourcePosition
 * @property { InputSourceQuat } InputSourceQuat
 * @property { InputSourceStick } InputSourceStick
 * @property { InputSourceTouch } InputSourceTouch
 * @property { InputState } InputState
 * @property { inspector } inspector
 * @property { INST_JOINT_ANIM_INFO } INST_JOINT_ANIM_INFO
 * @property { INST_MAT_WORLD } INST_MAT_WORLD
 * @property { INST_SH } INST_SH
 * @property { InstancedBuffer } InstancedBuffer
 * @property { InstanceMaterialType } InstanceMaterialType
 * @property { instancePool } instancePool
 * @property { instantiate } instantiate
 * @property { instantiatePoseGraph } instantiatePoseGraph
 * @property { INT_BITS } INT_BITS
 * @property { INT_MAX } INT_MAX
 * @property { INT_MIN } INT_MIN
 * @property { integer } integer
 * @property { IntensitySpecification } IntensitySpecification
 * @property { InteractiveState } InteractiveState
 * @property { intersect } intersect
 * @property { Intersection2D } Intersection2D
 * @property { INVALID_ID } INVALID_ID
 * @property { InvalidCCONError } InvalidCCONError
 * @property { InvalidTransitionError } InvalidTransitionError
 * @property { invokeComponentMethodsEngagedInAnimationEvent } invokeComponentMethodsEngagedInAnimationEvent
 * @property { invokeOnEnable } invokeOnEnable
 * @property { IOS } IOS
 * @property { isIgnorableWeight } isIgnorableWeight
 * @property { isNormalized } isNormalized
 * @property { isPaddedMatrix } isPaddedMatrix
 * @property { isSampler } isSampler
 * @property { isTrsPropertyName } isTrsPropertyName
 * @property { IWebGL2BlitManager } IWebGL2BlitManager
 * @property { IWebGLBlitManager } IWebGLBlitManager
 * @property { IWebGPUBlitManager } IWebGPUBlitManager
 * @property { JavaScript } JavaScript
 * @property { JOINT_UNIFORM_CAPACITY } JOINT_UNIFORM_CAPACITY
 * @property { Joint2D } Joint2D
 * @property { JointAnimationInfo } JointAnimationInfo
 * @property { JointTexturePool } JointTexturePool
 * @property { jointTextureSamplerInfo } jointTextureSamplerInfo
 * @property { js } js
 * @property { JSB } JSB
 * @property { JsonAsset } JsonAsset
 * @property { KeyboardInputSource } KeyboardInputSource
 * @property { KeyboardReturnType } KeyboardReturnType
 * @property { KeyCode } KeyCode
 * @property { KeyEventType } KeyEventType
 * @property { Keyframe } Keyframe
 * @property { KeyframeCurve } KeyframeCurve
 * @property { KeySharedQuatCurves } KeySharedQuatCurves
 * @property { KeySharedRealCurves } KeySharedRealCurves
 * @property { Label } Label
 * @property { labelAssembler } labelAssembler
 * @property { LabelAtlas } LabelAtlas
 * @property { LabelComponent } LabelComponent
 * @property { LabelOutline } LabelOutline
 * @property { LabelOutlineComponent } LabelOutlineComponent
 * @property { LabelShadow } LabelShadow
 * @property { Language } Language
 * @property { Layer } Layer
 * @property { LayerBlending } LayerBlending
 * @property { Layers } Layers
 * @property { Layout } Layout
 * @property { LayoutAxisDirection } LayoutAxisDirection
 * @property { LayoutChangeFlag } LayoutChangeFlag
 * @property { LayoutComponent } LayoutComponent
 * @property { LayoutConstraint } LayoutConstraint
 * @property { LayoutGraph } LayoutGraph
 * @property { LayoutGraphComponent } LayoutGraphComponent
 * @property { LayoutGraphData } LayoutGraphData
 * @property { LayoutGraphDataComponent } LayoutGraphDataComponent
 * @property { LayoutGraphDataValue } LayoutGraphDataValue
 * @property { LayoutGraphDataVertex } LayoutGraphDataVertex
 * @property { LayoutGraphInfo } LayoutGraphInfo
 * @property { LayoutGraphObjectPool } LayoutGraphObjectPool
 * @property { LayoutGraphValue } LayoutGraphValue
 * @property { LayoutGraphVertex } LayoutGraphVertex
 * @property { LayoutHorizontalDirection } LayoutHorizontalDirection
 * @property { LayoutResizeMode } LayoutResizeMode
 * @property { LayoutType } LayoutType
 * @property { LayoutVerticalDirection } LayoutVerticalDirection
 * @property { LegacyBlendStateBuffer } LegacyBlendStateBuffer
 * @property { legacyCC } legacyCC
 * @property { LegacyRenderMode } LegacyRenderMode
 * @property { letter } letter
 * @property { LetterAtlas } LetterAtlas
 * @property { LetterFont } LetterFont
 * @property { LetterRenderTexture } LetterRenderTexture
 * @property { LifeCycleInvoker } LifeCycleInvoker
 * @property { Light } Light
 * @property { LightComponent } LightComponent
 * @property { LightInfo } LightInfo
 * @property { LightingMode } LightingMode
 * @property { LightingStage } LightingStage
 * @property { LightProbeGroup } LightProbeGroup
 * @property { LightProbeInfo } LightProbeInfo
 * @property { LightProbes } LightProbes
 * @property { LightProbeSampler } LightProbeSampler
 * @property { LightProbesData } LightProbesData
 * @property { LightResource } LightResource
 * @property { LightType } LightType
 * @property { Line } Line
 * @property { LinearBufferAccessor } LinearBufferAccessor
 * @property { LinearDriverSettings } LinearDriverSettings
 * @property { LinearLimitSettings } LinearLimitSettings
 * @property { linearToSrgb8Bit } linearToSrgb8Bit
 * @property { LineCap } LineCap
 * @property { LineComponent } LineComponent
 * @property { LineJoin } LineJoin
 * @property { LineModel } LineModel
 * @property { LINUX } LINUX
 * @property { LOAD_BOX2D_MANUALLY } LOAD_BOX2D_MANUALLY
 * @property { LOAD_BULLET_MANUALLY } LOAD_BULLET_MANUALLY
 * @property { LOAD_PHYSX_MANUALLY } LOAD_PHYSX_MANUALLY
 * @property { LOAD_SPINE_MANUALLY } LOAD_SPINE_MANUALLY
 * @property { loadAudioPlayer } loadAudioPlayer
 * @property { loader } loader
 * @property { LoadOp } LoadOp
 * @property { loadWasmModuleBox2D } loadWasmModuleBox2D
 * @property { loadWasmModuleBullet } loadWasmModuleBullet
 * @property { loadWasmModulePhysX } loadWasmModulePhysX
 * @property { loadWasmModuleSpine } loadWasmModuleSpine
 * @property { localDescriptorSetLayout } localDescriptorSetLayout
 * @property { LOD } LOD
 * @property { LODData } LODData
 * @property { LODGroup } LODGroup
 * @property { LODGroupEditorUtility } LODGroupEditorUtility
 * @property { LRUCache } LRUCache
 * @property { MAC } MAC
 * @property { macro } macro
 * @property { MainFlow } MainFlow
 * @property { ManagedBuffer } ManagedBuffer
 * @property { ManagedResource } ManagedResource
 * @property { ManagedTexture } ManagedTexture
 * @property { markAsWarning } markAsWarning
 * @property { MarkerInfo } MarkerInfo
 * @property { Mask } Mask
 * @property { MaskComponent } MaskComponent
 * @property { maskIfEmpty } maskIfEmpty
 * @property { MaskMode } MaskMode
 * @property { MaskType } MaskType
 * @property { Mat3 } Mat3
 * @property { Mat4 } Mat4
 * @property { Material } Material
 * @property { MaterialConfig } MaterialConfig
 * @property { MaterialInstance } MaterialInstance
 * @property { math } math
 * @property { MATH_FLOAT_ARRAY } MATH_FLOAT_ARRAY
 * @property { MathBase } MathBase
 * @property { MathType } MathType
 * @property { Matrix } Matrix
 * @property { MAX_ANIMATION_LAYER } MAX_ANIMATION_LAYER
 * @property { MAX_BLOOM_FILTER_PASS_NUM } MAX_BLOOM_FILTER_PASS_NUM
 * @property { MAX_TRANSITIONS_PER_FRAME } MAX_TRANSITIONS_PER_FRAME
 * @property { memop } memop
 * @property { MemoryAccessBit } MemoryAccessBit
 * @property { MemoryStatus } MemoryStatus
 * @property { MemoryUsageBit } MemoryUsageBit
 * @property { menu } menu
 * @property { Mesh } Mesh
 * @property { MeshBuffer } MeshBuffer
 * @property { MeshCollider } MeshCollider
 * @property { MeshColliderComponent } MeshColliderComponent
 * @property { MeshoptDecoder } MeshoptDecoder
 * @property { MeshRenderData } MeshRenderData
 * @property { MeshRenderer } MeshRenderer
 * @property { MeshUtils } MeshUtils
 * @property { MIDDLE_RATIO } MIDDLE_RATIO
 * @property { MIGU } MIGU
 * @property { minigame } minigame
 * @property { MINIMUM_JOINT_TEXTURE_SIZE } MINIMUM_JOINT_TEXTURE_SIZE
 * @property { MipmapMode } MipmapMode
 * @property { misc } misc
 * @property { MissingScript } MissingScript
 * @property { MobilityMode } MobilityMode
 * @property { Mode } Mode
 * @property { Model } Model
 * @property { MODEL_ALWAYS_MASK } MODEL_ALWAYS_MASK
 * @property { ModelComponent } ModelComponent
 * @property { ModelLocalBindings } ModelLocalBindings
 * @property { ModelRenderer } ModelRenderer
 * @property { ModelType } ModelType
 * @property { MorphModel } MorphModel
 * @property { MorphWeightsAllValueProxy } MorphWeightsAllValueProxy
 * @property { MorphWeightsValueProxy } MorphWeightsValueProxy
 * @property { MorphWeightValueProxy } MorphWeightValueProxy
 * @property { Motion } Motion
 * @property { MotionPreviewer } MotionPreviewer
 * @property { MotionState } MotionState
 * @property { MotionStreak } MotionStreak
 * @property { MotionStreakAssemblerManager } MotionStreakAssemblerManager
 * @property { MotionSyncInfo } MotionSyncInfo
 * @property { MountedChildrenInfo } MountedChildrenInfo
 * @property { MountedComponentsInfo } MountedComponentsInfo
 * @property { MouseInputSource } MouseInputSource
 * @property { MouseJoint2D } MouseJoint2D
 * @property { MovePair } MovePair
 * @property { MovePass } MovePass
 * @property { multiline } multiline
 * @property { murmurhash2_32_gc } murmurhash2_32_gc
 * @property { MutableForwardIterator } MutableForwardIterator
 * @property { NATIVE } NATIVE
 * @property { NATIVE_CODE_BUNDLE_MODE } NATIVE_CODE_BUNDLE_MODE
 * @property { NativeBatcher2d } NativeBatcher2d
 * @property { NativeBufferAllocator } NativeBufferAllocator
 * @property { NativeBufferPool } NativeBufferPool
 * @property { NativeCodeBundleMode } NativeCodeBundleMode
 * @property { nativeDependMap } nativeDependMap
 * @property { NativeObjectPool } NativeObjectPool
 * @property { NativeRenderDrawInfo } NativeRenderDrawInfo
 * @property { NativeRenderEntity } NativeRenderEntity
 * @property { NativeStencilManager } NativeStencilManager
 * @property { NativeUIMeshBuffer } NativeUIMeshBuffer
 * @property { NativeUIModelProxy } NativeUIModelProxy
 * @property { NET_MODE } NET_MODE
 * @property { NetworkType } NetworkType
 * @property { Node } Node
 * @property { NodeActivator } NodeActivator
 * @property { NodeEventProcessor } NodeEventProcessor
 * @property { NodeEventType } NodeEventType
 * @property { nodePolyfill } nodePolyfill
 * @property { NodePool } NodePool
 * @property { NodeSpace } NodeSpace
 * @property { NodeUIProperties } NodeUIProperties
 * @property { NodeView } NodeView
 * @property { NoiseModule } NoiseModule
 * @property { normalizedFollowTag } normalizedFollowTag
 * @property { NOT_PACK_PHYSX_LIBS } NOT_PACK_PHYSX_LIBS
 * @property { notepackDecode } notepackDecode
 * @property { notepackEncode } notepackEncode
 * @property { nt2lm } nt2lm
 * @property { NULL_HANDLE } NULL_HANDLE
 * @property { OBB } OBB
 * @property { ObjectCollisionMatrix } ObjectCollisionMatrix
 * @property { ObjectCurve } ObjectCurve
 * @property { ObjectPool } ObjectPool
 * @property { ObjectTrack } ObjectTrack
 * @property { ObjectType } ObjectType
 * @property { Octree } Octree
 * @property { OctreeInfo } OctreeInfo
 * @property { Offset } Offset
 * @property { OHOS } OHOS
 * @property { onAfterDeserializedTag } onAfterDeserializedTag
 * @property { OneOffInvoker } OneOffInvoker
 * @property { OneShotAudio } OneShotAudio
 * @property { OneShotAudioDOM } OneShotAudioDOM
 * @property { OneShotAudioMinigame } OneShotAudioMinigame
 * @property { OneShotAudioWeb } OneShotAudioWeb
 * @property { onLoadedInvokedMap } onLoadedInvokedMap
 * @property { OPEN_HARMONY } OPEN_HARMONY
 * @property { OperationOnFreestandingNodeError } OperationOnFreestandingNodeError
 * @property { OPPO } OPPO
 * @property { OptimizedCurve } OptimizedCurve
 * @property { OptimizedKey } OptimizedKey
 * @property { Orientation } Orientation
 * @property { OS } OS
 * @property { OutE } OutE
 * @property { OutEI } OutEI
 * @property { OutEP } OutEP
 * @property { OutEPI } OutEPI
 * @property { outgoingsSymbol } outgoingsSymbol
 * @property { Overflow } Overflow
 * @property { override } override
 * @property { overrideSpineDefine } overrideSpineDefine
 * @property { ownerSymbol } ownerSymbol
 * @property { Pacer } Pacer
 * @property { packGradientRange } packGradientRange
 * @property { PackManager } PackManager
 * @property { packRGBE } packRGBE
 * @property { PageView } PageView
 * @property { PageViewComponent } PageViewComponent
 * @property { PageViewIndicator } PageViewIndicator
 * @property { PageViewIndicatorComponent } PageViewIndicatorComponent
 * @property { parallel } parallel
 * @property { ParameterType } ParameterType
 * @property { parsed } parsed
 * @property { Parser } Parser
 * @property { Particle } Particle
 * @property { PARTICLE_MODULE_NAME } PARTICLE_MODULE_NAME
 * @property { PARTICLE_MODULE_ORDER } PARTICLE_MODULE_ORDER
 * @property { PARTICLE_MODULE_PROPERTY } PARTICLE_MODULE_PROPERTY
 * @property { Particle2DAssembler } Particle2DAssembler
 * @property { ParticleAlignmentSpace } ParticleAlignmentSpace
 * @property { ParticleArcMode } ParticleArcMode
 * @property { ParticleAsset } ParticleAsset
 * @property { ParticleCuller } ParticleCuller
 * @property { ParticleCullingMode } ParticleCullingMode
 * @property { ParticleEmitLocation } ParticleEmitLocation
 * @property { particleEmitZAxis } particleEmitZAxis
 * @property { ParticleModuleBase } ParticleModuleBase
 * @property { ParticleModuleRandSeed } ParticleModuleRandSeed
 * @property { ParticleNoise } ParticleNoise
 * @property { ParticleRenderMode } ParticleRenderMode
 * @property { ParticleShapeType } ParticleShapeType
 * @property { ParticleSpace } ParticleSpace
 * @property { ParticleSystem } ParticleSystem
 * @property { ParticleSystem2D } ParticleSystem2D
 * @property { ParticleSystem2DAssembler } ParticleSystem2DAssembler
 * @property { ParticleSystemComponent } ParticleSystemComponent
 * @property { ParticleSystemRendererBase } ParticleSystemRendererBase
 * @property { ParticleTextureMode } ParticleTextureMode
 * @property { ParticleTrailMode } ParticleTrailMode
 * @property { ParticleUtils } ParticleUtils
 * @property { partition } partition
 * @property { Pass } Pass
 * @property { passContext } passContext
 * @property { PassInstance } PassInstance
 * @property { passParams } passParams
 * @property { PassPool } PassPool
 * @property { PassStage } PassStage
 * @property { PassStatesEditor } PassStatesEditor
 * @property { PassType } PassType
 * @property { PassView } PassView
 * @property { path } path
 * @property { PCFType } PCFType
 * @property { PerfCounter } PerfCounter
 * @property { PersistentBuffer } PersistentBuffer
 * @property { PersistentRenderPassAndFramebuffer } PersistentRenderPassAndFramebuffer
 * @property { PersistentTexture } PersistentTexture
 * @property { PhotometricTerm } PhotometricTerm
 * @property { PhysicMaterial } PhysicMaterial
 * @property { physics } physics
 * @property { PHYSICS_2D_PTM_RATIO } PHYSICS_2D_PTM_RATIO
 * @property { Physics2DManifoldType } Physics2DManifoldType
 * @property { Physics2DUtils } Physics2DUtils
 * @property { PhysicsAABBQueryCallback } PhysicsAABBQueryCallback
 * @property { PhysicsContact } PhysicsContact
 * @property { PhysicsContactListener } PhysicsContactListener
 * @property { PhysicsDebugDraw } PhysicsDebugDraw
 * @property { PhysicsGroup } PhysicsGroup
 * @property { PhysicsGroup2D } PhysicsGroup2D
 * @property { PhysicsLineStripCastResult } PhysicsLineStripCastResult
 * @property { PhysicsMaterial } PhysicsMaterial
 * @property { PhysicsRayCastCallback } PhysicsRayCastCallback
 * @property { PhysicsRayResult } PhysicsRayResult
 * @property { PhysicsSystem } PhysicsSystem
 * @property { PhysicsSystem2D } PhysicsSystem2D
 * @property { PhysXBoxCharacterController } PhysXBoxCharacterController
 * @property { PhysXBoxShape } PhysXBoxShape
 * @property { PhysXCapsuleCharacterController } PhysXCapsuleCharacterController
 * @property { PhysXCapsuleShape } PhysXCapsuleShape
 * @property { PhysXCharacterController } PhysXCharacterController
 * @property { PhysXConeShape } PhysXConeShape
 * @property { PhysXConfigurableJoint } PhysXConfigurableJoint
 * @property { PhysXContactEquation } PhysXContactEquation
 * @property { PhysXCylinderShape } PhysXCylinderShape
 * @property { PhysXFixedJoint } PhysXFixedJoint
 * @property { PhysXInstance } PhysXInstance
 * @property { PhysXJoint } PhysXJoint
 * @property { PhysXPlaneShape } PhysXPlaneShape
 * @property { PhysXRevoluteJoint } PhysXRevoluteJoint
 * @property { PhysXRigidBody } PhysXRigidBody
 * @property { PhysXShape } PhysXShape
 * @property { PhysXSharedBody } PhysXSharedBody
 * @property { PhysXSphereShape } PhysXSphereShape
 * @property { PhysXSphericalJoint } PhysXSphericalJoint
 * @property { PhysXTerrainShape } PhysXTerrainShape
 * @property { PhysXTrimeshShape } PhysXTrimeshShape
 * @property { PhysXWorld } PhysXWorld
 * @property { pipeline } pipeline
 * @property { PIPELINE_FLOW_FORWARD } PIPELINE_FLOW_FORWARD
 * @property { PIPELINE_FLOW_MAIN } PIPELINE_FLOW_MAIN
 * @property { PIPELINE_FLOW_SHADOW } PIPELINE_FLOW_SHADOW
 * @property { PIPELINE_FLOW_SMAA } PIPELINE_FLOW_SMAA
 * @property { PIPELINE_FLOW_TONEMAP } PIPELINE_FLOW_TONEMAP
 * @property { PipelineBindPoint } PipelineBindPoint
 * @property { PipelineCapabilities } PipelineCapabilities
 * @property { PipelineEventProcessor } PipelineEventProcessor
 * @property { PipelineEventType } PipelineEventType
 * @property { PipelineGlobalBindings } PipelineGlobalBindings
 * @property { PipelineInputAssemblerData } PipelineInputAssemblerData
 * @property { PipelineLayout } PipelineLayout
 * @property { PipelineLayoutData } PipelineLayoutData
 * @property { PipelineLayoutInfo } PipelineLayoutInfo
 * @property { PipelineRenderData } PipelineRenderData
 * @property { PipelineSceneData } PipelineSceneData
 * @property { PipelineState } PipelineState
 * @property { PipelineStateInfo } PipelineStateInfo
 * @property { PipelineStateManager } PipelineStateManager
 * @property { PipelineStatistics } PipelineStatistics
 * @property { PipelineType } PipelineType
 * @property { PipelineUBO } PipelineUBO
 * @property { PixelFormat } PixelFormat
 * @property { PlaceMethod } PlaceMethod
 * @property { PlainVariable } PlainVariable
 * @property { PlanarShadowQueue } PlanarShadowQueue
 * @property { plane } plane
 * @property { PlaneCollider } PlaneCollider
 * @property { Platform } Platform
 * @property { Playable } Playable
 * @property { playOnFocus } playOnFocus
 * @property { PNGReader } PNGReader
 * @property { Point } Point
 * @property { pointerEventDispatcher } pointerEventDispatcher
 * @property { PointFlags } PointFlags
 * @property { PointLight } PointLight
 * @property { PointToPointConstraint } PointToPointConstraint
 * @property { PolarSpaceGradientBandInterpolator2D } PolarSpaceGradientBandInterpolator2D
 * @property { PolygonBoundingBoxData } PolygonBoundingBoxData
 * @property { PolygonCollider2D } PolygonCollider2D
 * @property { PolygonMode } PolygonMode
 * @property { PolynomialSolver } PolynomialSolver
 * @property { Pool } Pool
 * @property { PoolType } PoolType
 * @property { Pose } Pose
 * @property { POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE } POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE
 * @property { POSE_GRAPH_NODE_MENU_PREFIX_IK } POSE_GRAPH_NODE_MENU_PREFIX_IK
 * @property { POSE_GRAPH_NODE_MENU_PREFIX_POSE } POSE_GRAPH_NODE_MENU_PREFIX_POSE
 * @property { POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND } POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND
 * @property { PoseGraph } PoseGraph
 * @property { poseGraphCreateNodeFactory } poseGraphCreateNodeFactory
 * @property { PoseGraphNode } PoseGraphNode
 * @property { poseGraphNodeAppearance } poseGraphNodeAppearance
 * @property { poseGraphNodeCategory } poseGraphNodeCategory
 * @property { poseGraphNodeHide } poseGraphNodeHide
 * @property { PoseGraphNodeShell } PoseGraphNodeShell
 * @property { poseGraphOp } poseGraphOp
 * @property { PoseGraphOutputNode } PoseGraphOutputNode
 * @property { PoseGraphStash } PoseGraphStash
 * @property { PoseGraphType } PoseGraphType
 * @property { PoseHeapAllocator } PoseHeapAllocator
 * @property { PoseNode } PoseNode
 * @property { PoseNodeAdditivelyBlend } PoseNodeAdditivelyBlend
 * @property { PoseNodeApplyTransform } PoseNodeApplyTransform
 * @property { PoseNodeBlendInProportion } PoseNodeBlendInProportion
 * @property { PoseNodeBlendTwoPose } PoseNodeBlendTwoPose
 * @property { PoseNodeBlendTwoPoseBase } PoseNodeBlendTwoPoseBase
 * @property { PoseNodeChoosePoseBase } PoseNodeChoosePoseBase
 * @property { PoseNodeChoosePoseByBoolean } PoseNodeChoosePoseByBoolean
 * @property { PoseNodeChoosePoseByIndex } PoseNodeChoosePoseByIndex
 * @property { PoseNodeCopyTransform } PoseNodeCopyTransform
 * @property { PoseNodeFilteringBlend } PoseNodeFilteringBlend
 * @property { PoseNodeModifyPoseBase } PoseNodeModifyPoseBase
 * @property { PoseNodePlayMotion } PoseNodePlayMotion
 * @property { PoseNodeSampleMotion } PoseNodeSampleMotion
 * @property { PoseNodeSetAuxiliaryCurve } PoseNodeSetAuxiliaryCurve
 * @property { PoseNodeStateMachine } PoseNodeStateMachine
 * @property { PoseNodeTwoBoneIKSolver } PoseNodeTwoBoneIKSolver
 * @property { PoseNodeUseStashedPose } PoseNodeUseStashedPose
 * @property { PoseOutput } PoseOutput
 * @property { PoseStackAllocator } PoseStackAllocator
 * @property { PoseTransformSpace } PoseTransformSpace
 * @property { PoseTransformSpaceRequirement } PoseTransformSpaceRequirement
 * @property { PositionType } PositionType
 * @property { PostFinalPass } PostFinalPass
 * @property { PostProcess } PostProcess
 * @property { PostProcessBuilder } PostProcessBuilder
 * @property { PostProcessSetting } PostProcessSetting
 * @property { PostProcessStage } PostProcessStage
 * @property { PostSettings } PostSettings
 * @property { PostSettingsInfo } PostSettingsInfo
 * @property { Prefab } Prefab
 * @property { PrefabInfo } PrefabInfo
 * @property { PrefabInstance } PrefabInstance
 * @property { PrefabLink } PrefabLink
 * @property { presets } presets
 * @property { preTransforms } preTransforms
 * @property { PREVIEW } PREVIEW
 * @property { Primitive } Primitive
 * @property { PrimitiveMode } PrimitiveMode
 * @property { primitives } primitives
 * @property { PrimitiveType } PrimitiveType
 * @property { PrintVisitor } PrintVisitor
 * @property { PrivateNode } PrivateNode
 * @property { ProbeClearFlag } ProbeClearFlag
 * @property { ProbeHelperQueue } ProbeHelperQueue
 * @property { ProbeResolution } ProbeResolution
 * @property { ProbeType } ProbeType
 * @property { ProceduralPoseState } ProceduralPoseState
 * @property { ProceduralPoseTransition } ProceduralPoseTransition
 * @property { profiler } profiler
 * @property { ProgramGroup } ProgramGroup
 * @property { ProgramInfo } ProgramInfo
 * @property { programLib } programLib
 * @property { ProgressBar } ProgressBar
 * @property { ProgressBarComponent } ProgressBarComponent
 * @property { promiseForWebGPUInstantiation } promiseForWebGPUInstantiation
 * @property { Property } Property
 * @property { PropertyOverrideInfo } PropertyOverrideInfo
 * @property { PropertyStashInternalFlag } PropertyStashInternalFlag
 * @property { provide } provide
 * @property { PureValueNode } PureValueNode
 * @property { PVData } PVData
 * @property { PVNodeGetVariableBase } PVNodeGetVariableBase
 * @property { PVNodeGetVariableBoolean } PVNodeGetVariableBoolean
 * @property { PVNodeGetVariableFloat } PVNodeGetVariableFloat
 * @property { PVNodeGetVariableInteger } PVNodeGetVariableInteger
 * @property { PVNodeGetVariableQuat } PVNodeGetVariableQuat
 * @property { PVNodeGetVariableVec3 } PVNodeGetVariableVec3
 * @property { PX } PX
 * @property { PxContactPairFlag } PxContactPairFlag
 * @property { PxHitFlag } PxHitFlag
 * @property { PxPairFlag } PxPairFlag
 * @property { PxQueryFlag } PxQueryFlag
 * @property { PxTriggerPairFlag } PxTriggerPairFlag
 * @property { quad } quad
 * @property { quadOutIn } quadOutIn
 * @property { QuadRenderData } QuadRenderData
 * @property { quartOutIn } quartOutIn
 * @property { Quat } Quat
 * @property { QuatCurve } QuatCurve
 * @property { QuatInterpolationMode } QuatInterpolationMode
 * @property { QuatTrack } QuatTrack
 * @property { QuatTrackEval } QuatTrackEval
 * @property { QuatVariable } QuatVariable
 * @property { QueryPoolInfo } QueryPoolInfo
 * @property { QueryType } QueryType
 * @property { Queue } Queue
 * @property { QueueHint } QueueHint
 * @property { QueueInfo } QueueInfo
 * @property { QueueType } QueueType
 * @property { quintOutIn } quintOutIn
 * @property { radialFilled } radialFilled
 * @property { radian } radian
 * @property { radioGroup } radioGroup
 * @property { range } range
 * @property { RangedDirectionalLight } RangedDirectionalLight
 * @property { rangeMax } rangeMax
 * @property { rangeMin } rangeMin
 * @property { rangeStep } rangeStep
 * @property { RasterizerState } RasterizerState
 * @property { RasterizerStateEditor } RasterizerStateEditor
 * @property { RasterPass } RasterPass
 * @property { RasterSubpass } RasterSubpass
 * @property { RasterView } RasterView
 * @property { RatioSampler } RatioSampler
 * @property { Ray } Ray
 * @property { RaytracePass } RaytracePass
 * @property { readMesh } readMesh
 * @property { readOnly } readOnly
 * @property { READY_STATE } READY_STATE
 * @property { RealArrayTrack } RealArrayTrack
 * @property { RealArrayTrackEval } RealArrayTrackEval
 * @property { RealCurve } RealCurve
 * @property { RealInterpolationMode } RealInterpolationMode
 * @property { RealTrack } RealTrack
 * @property { Rect } Rect
 * @property { RectangleBoundingBoxData } RectangleBoundingBoxData
 * @property { RecyclePool } RecyclePool
 * @property { ReferenceGraphView } ReferenceGraphView
 * @property { references } references
 * @property { ReflectionProbe } ReflectionProbe
 * @property { ReflectionProbeFlow } ReflectionProbeFlow
 * @property { ReflectionProbeManager } ReflectionProbeManager
 * @property { ReflectionProbeStage } ReflectionProbeStage
 * @property { ReflectionProbeType } ReflectionProbeType
 * @property { regeneratorRuntime } regeneratorRuntime
 * @property { RelativeJoint2D } RelativeJoint2D
 * @property { ReleaseManager } ReleaseManager
 * @property { removeEmbeddedPlayerTag } removeEmbeddedPlayerTag
 * @property { removeProperty } removeProperty
 * @property { RemoveSelf } RemoveSelf
 * @property { renameObjectProperty } renameObjectProperty
 * @property { Render2dPool } Render2dPool
 * @property { Render2dView } Render2dView
 * @property { Renderable2D } Renderable2D
 * @property { RenderableComponent } RenderableComponent
 * @property { RenderAdditiveLightQueue } RenderAdditiveLightQueue
 * @property { RenderCommonObjectPool } RenderCommonObjectPool
 * @property { RenderComponent } RenderComponent
 * @property { RenderData } RenderData
 * @property { RenderDrawInfo } RenderDrawInfo
 * @property { RenderDrawInfoType } RenderDrawInfoType
 * @property { RenderDrawQueue } RenderDrawQueue
 * @property { RenderEntity } RenderEntity
 * @property { RenderEntityFillColorType } RenderEntityFillColorType
 * @property { RenderEntityType } RenderEntityType
 * @property { Renderer } Renderer
 * @property { RenderFlow } RenderFlow
 * @property { RenderFlowTag } RenderFlowTag
 * @property { RenderGraph } RenderGraph
 * @property { RenderGraphComponent } RenderGraphComponent
 * @property { RenderGraphObjectPool } RenderGraphObjectPool
 * @property { RenderGraphValue } RenderGraphValue
 * @property { RenderGraphVertex } RenderGraphVertex
 * @property { rendering } rendering
 * @property { RenderingSubMesh } RenderingSubMesh
 * @property { RenderInstancedQueue } RenderInstancedQueue
 * @property { RenderInstancingQueue } RenderInstancingQueue
 * @property { RenderOrder } RenderOrder
 * @property { RenderPass } RenderPass
 * @property { RenderPassDesc } RenderPassDesc
 * @property { RenderPassInfo } RenderPassInfo
 * @property { RenderPassMergeInfo } RenderPassMergeInfo
 * @property { RenderPassStage } RenderPassStage
 * @property { RenderPassType } RenderPassType
 * @property { RenderPhase } RenderPhase
 * @property { RenderPhaseData } RenderPhaseData
 * @property { RenderPipeline } RenderPipeline
 * @property { RenderPriority } RenderPriority
 * @property { RenderQueue } RenderQueue
 * @property { RenderQueueDesc } RenderQueueDesc
 * @property { RenderQueueQuery } RenderQueueQuery
 * @property { RenderQueueSortMode } RenderQueueSortMode
 * @property { RenderReflectionProbeQueue } RenderReflectionProbeQueue
 * @property { RenderRoot2D } RenderRoot2D
 * @property { RenderScene } RenderScene
 * @property { RenderShadowMapBatchedQueue } RenderShadowMapBatchedQueue
 * @property { RenderStage } RenderStage
 * @property { RenderStageData } RenderStageData
 * @property { RenderSwapchain } RenderSwapchain
 * @property { RenderTexture } RenderTexture
 * @property { RenderTextureConfig } RenderTextureConfig
 * @property { RenderTextureDesc } RenderTextureDesc
 * @property { RenderType } RenderType
 * @property { RenderVisitor } RenderVisitor
 * @property { RenderWindow } RenderWindow
 * @property { Repeat } Repeat
 * @property { RepeatForever } RepeatForever
 * @property { replaceProperty } replaceProperty
 * @property { reportMissingClass } reportMissingClass
 * @property { RequestType } RequestType
 * @property { requireComponent } requireComponent
 * @property { ResolutionPolicy } ResolutionPolicy
 * @property { ResolveFlags } ResolveFlags
 * @property { ResolveMode } ResolveMode
 * @property { ResolvePair } ResolvePair
 * @property { ResolvePass } ResolvePass
 * @property { ResourceDesc } ResourceDesc
 * @property { ResourceDimension } ResourceDimension
 * @property { ResourceFlags } ResourceFlags
 * @property { ResourceGraph } ResourceGraph
 * @property { ResourceGraphComponent } ResourceGraphComponent
 * @property { ResourceGraphValue } ResourceGraphValue
 * @property { ResourceGraphVertex } ResourceGraphVertex
 * @property { ResourceManagerVisitor } ResourceManagerVisitor
 * @property { ResourceRange } ResourceRange
 * @property { ResourceResidency } ResourceResidency
 * @property { resources } resources
 * @property { ResourceStates } ResourceStates
 * @property { ResourceTraits } ResourceTraits
 * @property { ResourceType } ResourceType
 * @property { ReverseTime } ReverseTime
 * @property { RichText } RichText
 * @property { RichTextComponent } RichTextComponent
 * @property { RigidBody } RigidBody
 * @property { RigidBody2D } RigidBody2D
 * @property { RigidBodyComponent } RigidBodyComponent
 * @property { Root } Root
 * @property { rpMergeInfos } rpMergeInfos
 * @property { RUNTIME_BASED } RUNTIME_BASED
 * @property { RUNTIME_ID_ENABLED } RUNTIME_ID_ENABLED
 * @property { RuntimeMotionSyncManager } RuntimeMotionSyncManager
 * @property { RuntimeStashManager } RuntimeStashManager
 * @property { SafeArea } SafeArea
 * @property { SafeAreaComponent } SafeAreaComponent
 * @property { SampleCount } SampleCount
 * @property { Sampler } Sampler
 * @property { SamplerInfo } SamplerInfo
 * @property { SampleType } SampleType
 * @property { SAXParser } SAXParser
 * @property { ScalableContainer } ScalableContainer
 * @property { scalableContainerManager } scalableContainerManager
 * @property { Scene } Scene
 * @property { SceneAsset } SceneAsset
 * @property { SceneCulling } SceneCulling
 * @property { SceneData } SceneData
 * @property { SceneFlags } SceneFlags
 * @property { SceneGlobals } SceneGlobals
 * @property { Scheduler } Scheduler
 * @property { Screen } Screen
 * @property { screenAdapter } screenAdapter
 * @property { Script } Script
 * @property { ScrollBar } ScrollBar
 * @property { ScrollBarComponent } ScrollBarComponent
 * @property { ScrollView } ScrollView
 * @property { ScrollViewComponent } ScrollViewComponent
 * @property { ScrollViewEventType } ScrollViewEventType
 * @property { searchForRootBonePathSymbol } searchForRootBonePathSymbol
 * @property { selector } selector
 * @property { SEPARATE_SAMPLER_BINDING_OFFSET } SEPARATE_SAMPLER_BINDING_OFFSET
 * @property { Sequence } Sequence
 * @property { serializable } serializable
 * @property { serializeBuiltinValueType } serializeBuiltinValueType
 * @property { serializeTag } serializeTag
 * @property { SERVER_MODE } SERVER_MODE
 * @property { set } set
 * @property { SetAction } SetAction
 * @property { SetIndex } SetIndex
 * @property { setPrototypeOf } setPrototypeOf
 * @property { SettingPass } SettingPass
 * @property { Settings } Settings
 * @property { SettingsCategory } SettingsCategory
 * @property { SH } SH
 * @property { ShadeModel } ShadeModel
 * @property { Shader } Shader
 * @property { ShaderBindingData } ShaderBindingData
 * @property { ShaderInfo } ShaderInfo
 * @property { ShaderLayoutData } ShaderLayoutData
 * @property { ShaderProgramData } ShaderProgramData
 * @property { ShaderStage } ShaderStage
 * @property { ShaderStageFlagBit } ShaderStageFlagBit
 * @property { ShadowFlow } ShadowFlow
 * @property { ShadowInfo } ShadowInfo
 * @property { ShadowLayerVolume } ShadowLayerVolume
 * @property { ShadowPass } ShadowPass
 * @property { Shadows } Shadows
 * @property { ShadowsInfo } ShadowsInfo
 * @property { ShadowSize } ShadowSize
 * @property { ShadowStage } ShadowStage
 * @property { ShadowType } ShadowType
 * @property { ShapeType } ShapeType
 * @property { SharedStackBasedAllocatorManager } SharedStackBasedAllocatorManager
 * @property { shareLabelInfo } shareLabelInfo
 * @property { shift } shift
 * @property { Show } Show
 * @property { simple } simple
 * @property { SimpleDirectionalIssueSameDirection } SimpleDirectionalIssueSameDirection
 * @property { simpleDragonBoneAssembler } simpleDragonBoneAssembler
 * @property { simpleSpineAssembler } simpleSpineAssembler
 * @property { SimpleTexture } SimpleTexture
 * @property { SimplexCollider } SimplexCollider
 * @property { Simulator } Simulator
 * @property { sineOutIn } sineOutIn
 * @property { SingleChannelTrack } SingleChannelTrack
 * @property { SingleOutputPVNode } SingleOutputPVNode
 * @property { Size } Size
 * @property { SizeTrack } SizeTrack
 * @property { SizeTrackEval } SizeTrackEval
 * @property { SkelAnimDataHub } SkelAnimDataHub
 * @property { SkeletalAnimation } SkeletalAnimation
 * @property { SkeletalAnimationComponent } SkeletalAnimationComponent
 * @property { SkeletalAnimationState } SkeletalAnimationState
 * @property { Skeleton } Skeleton
 * @property { SkeletonBinary } SkeletonBinary
 * @property { SkeletonData } SkeletonData
 * @property { SkeletonSystem } SkeletonSystem
 * @property { Skin } Skin
 * @property { SkinData } SkinData
 * @property { SkinInfo } SkinInfo
 * @property { SkinnedMeshBatchRenderer } SkinnedMeshBatchRenderer
 * @property { SkinnedMeshRenderer } SkinnedMeshRenderer
 * @property { SkinnedMeshUnit } SkinnedMeshUnit
 * @property { SkinningModel } SkinningModel
 * @property { SkinningModelComponent } SkinningModelComponent
 * @property { SkinningModelUnit } SkinningModelUnit
 * @property { SkinPass } SkinPass
 * @property { Skybox } Skybox
 * @property { SKYBOX_FLAG } SKYBOX_FLAG
 * @property { SkyBoxFlagValue } SkyBoxFlagValue
 * @property { SkyboxInfo } SkyboxInfo
 * @property { sliced } sliced
 * @property { slide } slide
 * @property { Slider } Slider
 * @property { SliderComponent } SliderComponent
 * @property { SliderJoint2D } SliderJoint2D
 * @property { Slot } Slot
 * @property { SlotData } SlotData
 * @property { Socket } Socket
 * @property { solveCubic } solveCubic
 * @property { solveTwoBoneIK } solveTwoBoneIK
 * @property { solveTwoBoneIKPositions } solveTwoBoneIKPositions
 * @property { Sorting } Sorting
 * @property { Sorting2D } Sorting2D
 * @property { SortingLayers } SortingLayers
 * @property { sp } sp
 * @property { Spawn } Spawn
 * @property { SpecialStateEval } SpecialStateEval
 * @property { Sphere } Sphere
 * @property { SphereCollider } SphereCollider
 * @property { SphereColliderComponent } SphereColliderComponent
 * @property { SphereLight } SphereLight
 * @property { SphereLightComponent } SphereLightComponent
 * @property { spine } spine
 * @property { SPINE_VERSION } SPINE_VERSION
 * @property { SPINE_WASM } SPINE_WASM
 * @property { SpineAnimationCacheMode } SpineAnimationCacheMode
 * @property { SpineDefaultAnimsEnum } SpineDefaultAnimsEnum
 * @property { SpineMaterialType } SpineMaterialType
 * @property { SpineSocket } SpineSocket
 * @property { SplashScreen } SplashScreen
 * @property { Spline } Spline
 * @property { SplineMode } SplineMode
 * @property { SpotLight } SpotLight
 * @property { SpotLightComponent } SpotLightComponent
 * @property { SpringJoint2D } SpringJoint2D
 * @property { Sprite } Sprite
 * @property { spriteAssembler } spriteAssembler
 * @property { SpriteAtlas } SpriteAtlas
 * @property { SpriteComponent } SpriteComponent
 * @property { SpriteEventType } SpriteEventType
 * @property { SpriteFrame } SpriteFrame
 * @property { SpriteFrameEvent } SpriteFrameEvent
 * @property { SpriteRenderer } SpriteRenderer
 * @property { SpriteType } SpriteType
 * @property { srgbToLinear } srgbToLinear
 * @property { SSSS_BLUR_X_PASS_INDEX } SSSS_BLUR_X_PASS_INDEX
 * @property { SSSS_BLUR_Y_PASS_INDEX } SSSS_BLUR_Y_PASS_INDEX
 * @property { SSSSBlurData } SSSSBlurData
 * @property { Stage } Stage
 * @property { StaggerAxis } StaggerAxis
 * @property { StaggerIndex } StaggerIndex
 * @property { START_RADIUS_EQUAL_TO_END_RADIUS } START_RADIUS_EQUAL_TO_END_RADIUS
 * @property { START_SIZE_EQUAL_TO_END_SIZE } START_SIZE_EQUAL_TO_END_SIZE
 * @property { State } State
 * @property { StateEval } StateEval
 * @property { StateMachine } StateMachine
 * @property { StateMachineComponent } StateMachineComponent
 * @property { StaticVBAccessor } StaticVBAccessor
 * @property { StaticVBChunk } StaticVBChunk
 * @property { Status } Status
 * @property { StdMorphRendering } StdMorphRendering
 * @property { StencilFace } StencilFace
 * @property { StencilManager } StencilManager
 * @property { StencilOp } StencilOp
 * @property { StencilSharedBufferView } StencilSharedBufferView
 * @property { StorageUnit } StorageUnit
 * @property { StoreOp } StoreOp
 * @property { string } string
 * @property { SubContextView } SubContextView
 * @property { SubModel } SubModel
 * @property { Subpass } Subpass
 * @property { SubpassCapabilities } SubpassCapabilities
 * @property { SubpassDependency } SubpassDependency
 * @property { SubpassGraph } SubpassGraph
 * @property { SubpassGraphComponent } SubpassGraphComponent
 * @property { SubpassGraphVertex } SubpassGraphVertex
 * @property { SubpassInfo } SubpassInfo
 * @property { SubresourceView } SubresourceView
 * @property { SubStateMachine } SubStateMachine
 * @property { support } support
 * @property { SUPPORT_JIT } SUPPORT_JIT
 * @property { SurfaceTransform } SurfaceTransform
 * @property { Swapchain } Swapchain
 * @property { SwapchainInfo } SwapchainInfo
 * @property { sys } sys
 * @property { System } System
 * @property { SystemEvent } SystemEvent
 * @property { SystemEventType } SystemEventType
 * @property { systemInfo } systemInfo
 * @property { SystemPriority } SystemPriority
 * @property { TAA } TAA
 * @property { TAAMask } TAAMask
 * @property { TAAPass } TAAPass
 * @property { tabIndexUtil } tabIndexUtil
 * @property { TangentWeightMode } TangentWeightMode
 * @property { TAOBAO } TAOBAO
 * @property { TAOBAO_MINIGAME } TAOBAO_MINIGAME
 * @property { TargetInfo } TargetInfo
 * @property { TargetOverrideInfo } TargetOverrideInfo
 * @property { TaskType } TaskType
 * @property { TCAuxiliaryCurveBinding } TCAuxiliaryCurveBinding
 * @property { TCBinding } TCBinding
 * @property { TCBindingTransitionSourceFilter } TCBindingTransitionSourceFilter
 * @property { TCBindingValueType } TCBindingValueType
 * @property { TCStateMotionTimeBinding } TCStateMotionTimeBinding
 * @property { TCStateWeightBinding } TCStateWeightBinding
 * @property { TCVariableBinding } TCVariableBinding
 * @property { TechniqueData } TechniqueData
 * @property { Terrain } Terrain
 * @property { TERRAIN_BLOCK_TILE_COMPLEXITY } TERRAIN_BLOCK_TILE_COMPLEXITY
 * @property { TERRAIN_BLOCK_VERTEX_COMPLEXITY } TERRAIN_BLOCK_VERTEX_COMPLEXITY
 * @property { TERRAIN_BLOCK_VERTEX_SIZE } TERRAIN_BLOCK_VERTEX_SIZE
 * @property { TERRAIN_DATA_VERSION } TERRAIN_DATA_VERSION
 * @property { TERRAIN_DATA_VERSION_DEFAULT } TERRAIN_DATA_VERSION_DEFAULT
 * @property { TERRAIN_DATA_VERSION2 } TERRAIN_DATA_VERSION2
 * @property { TERRAIN_DATA_VERSION3 } TERRAIN_DATA_VERSION3
 * @property { TERRAIN_DATA_VERSION4 } TERRAIN_DATA_VERSION4
 * @property { TERRAIN_DATA_VERSION5 } TERRAIN_DATA_VERSION5
 * @property { TERRAIN_DATA_VERSION6 } TERRAIN_DATA_VERSION6
 * @property { TERRAIN_DATA_VERSION7 } TERRAIN_DATA_VERSION7
 * @property { TERRAIN_DATA_VERSION8 } TERRAIN_DATA_VERSION8
 * @property { TERRAIN_EAST_INDEX } TERRAIN_EAST_INDEX
 * @property { TERRAIN_HEIGHT_BASE } TERRAIN_HEIGHT_BASE
 * @property { TERRAIN_HEIGHT_FACTORY } TERRAIN_HEIGHT_FACTORY
 * @property { TERRAIN_HEIGHT_FACTORY_V7 } TERRAIN_HEIGHT_FACTORY_V7
 * @property { TERRAIN_HEIGHT_FMAX } TERRAIN_HEIGHT_FMAX
 * @property { TERRAIN_HEIGHT_FMIN } TERRAIN_HEIGHT_FMIN
 * @property { TERRAIN_LOD_EAST_INDEX } TERRAIN_LOD_EAST_INDEX
 * @property { TERRAIN_LOD_LEVELS } TERRAIN_LOD_LEVELS
 * @property { TERRAIN_LOD_MAX_DISTANCE } TERRAIN_LOD_MAX_DISTANCE
 * @property { TERRAIN_LOD_NORTH_INDEX } TERRAIN_LOD_NORTH_INDEX
 * @property { TERRAIN_LOD_SOUTH_INDEX } TERRAIN_LOD_SOUTH_INDEX
 * @property { TERRAIN_LOD_TILES } TERRAIN_LOD_TILES
 * @property { TERRAIN_LOD_VERTS } TERRAIN_LOD_VERTS
 * @property { TERRAIN_LOD_WEST_INDEX } TERRAIN_LOD_WEST_INDEX
 * @property { TERRAIN_MAX_BLEND_LAYERS } TERRAIN_MAX_BLEND_LAYERS
 * @property { TERRAIN_MAX_LAYER_COUNT } TERRAIN_MAX_LAYER_COUNT
 * @property { TERRAIN_MAX_LEVELS } TERRAIN_MAX_LEVELS
 * @property { TERRAIN_NORTH_INDEX } TERRAIN_NORTH_INDEX
 * @property { TERRAIN_SOUTH_INDEX } TERRAIN_SOUTH_INDEX
 * @property { TERRAIN_WEST_INDEX } TERRAIN_WEST_INDEX
 * @property { TerrainAsset } TerrainAsset
 * @property { TerrainBlock } TerrainBlock
 * @property { TerrainBlockLightmapInfo } TerrainBlockLightmapInfo
 * @property { TerrainCollider } TerrainCollider
 * @property { TerrainIndexData } TerrainIndexData
 * @property { TerrainIndexPool } TerrainIndexPool
 * @property { TerrainInfo } TerrainInfo
 * @property { TerrainLayer } TerrainLayer
 * @property { TerrainLayerBinaryInfo } TerrainLayerBinaryInfo
 * @property { TerrainLayerInfo } TerrainLayerInfo
 * @property { TerrainLod } TerrainLod
 * @property { TerrainLodKey } TerrainLodKey
 * @property { TEST } TEST
 * @property { Tetrahedron } Tetrahedron
 * @property { TextAsset } TextAsset
 * @property { TextLayout } TextLayout
 * @property { TextOutputLayoutData } TextOutputLayoutData
 * @property { TextOutputRenderData } TextOutputRenderData
 * @property { TextProcessing } TextProcessing
 * @property { TextStyle } TextStyle
 * @property { Texture } Texture
 * @property { Texture2D } Texture2D
 * @property { TextureAtlasData } TextureAtlasData
 * @property { TextureBarrier } TextureBarrier
 * @property { TextureBarrierInfo } TextureBarrierInfo
 * @property { TextureBase } TextureBase
 * @property { TextureBlit } TextureBlit
 * @property { TextureBufferPool } TextureBufferPool
 * @property { TextureCopy } TextureCopy
 * @property { TextureCube } TextureCube
 * @property { TextureData } TextureData
 * @property { TextureFlagBit } TextureFlagBit
 * @property { TextureInfo } TextureInfo
 * @property { TextureSubresLayers } TextureSubresLayers
 * @property { TextureSubresRange } TextureSubresRange
 * @property { TextureType } TextureType
 * @property { TextureUsageBit } TextureUsageBit
 * @property { TextureViewInfo } TextureViewInfo
 * @property { TiffReader } TiffReader
 * @property { tiled } tiled
 * @property { TiledLayer } TiledLayer
 * @property { tiledLayerAssembler } tiledLayerAssembler
 * @property { TiledMap } TiledMap
 * @property { TiledMapAsset } TiledMapAsset
 * @property { TiledObjectGroup } TiledObjectGroup
 * @property { TiledTile } TiledTile
 * @property { TiledUserNodeData } TiledUserNodeData
 * @property { TileFlag } TileFlag
 * @property { timeScale } timeScale
 * @property { TMXImageLayerInfo } TMXImageLayerInfo
 * @property { TMXLayerInfo } TMXLayerInfo
 * @property { TMXMapInfo } TMXMapInfo
 * @property { TMXObjectGroupInfo } TMXObjectGroupInfo
 * @property { TMXObjectType } TMXObjectType
 * @property { TMXTilesetInfo } TMXTilesetInfo
 * @property { Toggle } Toggle
 * @property { ToggleComponent } ToggleComponent
 * @property { ToggleContainer } ToggleContainer
 * @property { ToggleContainerComponent } ToggleContainerComponent
 * @property { ToggleVisibility } ToggleVisibility
 * @property { ToneMappingType } ToneMappingType
 * @property { tooltip } tooltip
 * @property { TopLevelStateMachineEvaluation } TopLevelStateMachineEvaluation
 * @property { toPPM } toPPM
 * @property { torus } torus
 * @property { Touch } Touch
 * @property { TouchInputSource } TouchInputSource
 * @property { touchManager } touchManager
 * @property { Track } Track
 * @property { TrackBinding } TrackBinding
 * @property { trackBindingTag } trackBindingTag
 * @property { TrackEntryListeners } TrackEntryListeners
 * @property { TrackingType } TrackingType
 * @property { TrackPath } TrackPath
 * @property { Transform } Transform
 * @property { TRANSFORM_ON } TRANSFORM_ON
 * @property { TransformArray } TransformArray
 * @property { TransformBit } TransformBit
 * @property { TransformFilter } TransformFilter
 * @property { TransformObject } TransformObject
 * @property { TransformOperation } TransformOperation
 * @property { transformPipeline } transformPipeline
 * @property { TransformSpace } TransformSpace
 * @property { TransitionPreviewer } TransitionPreviewer
 * @property { traversal } traversal
 * @property { Triangle } Triangle
 * @property { TriggerCondition } TriggerCondition
 * @property { TriggerEventObject } TriggerEventObject
 * @property { TriggerResetMode } TriggerResetMode
 * @property { TriggerVariable } TriggerVariable
 * @property { ttf } ttf
 * @property { TTFFont } TTFFont
 * @property { TTFUtils } TTFUtils
 * @property { TupleDictionary } TupleDictionary
 * @property { Tween } Tween
 * @property { TweenAction } TweenAction
 * @property { tweenProgress } tweenProgress
 * @property { TweenSystem } TweenSystem
 * @property { twgslModule } twgslModule
 * @property { TWO_PI } TWO_PI
 * @property { TwoBoneIKDebugger } TwoBoneIKDebugger
 * @property { type } type
 * @property { type2reader } type2reader
 * @property { type2validator } type2validator
 * @property { type2writer } type2writer
 * @property { typeMap } typeMap
 * @property { typeof } typeof
 * @property { TypeScript } TypeScript
 * @property { UBOCamera } UBOCamera
 * @property { UBOCameraEnum } UBOCameraEnum
 * @property { UBOCSM } UBOCSM
 * @property { UBOCSMEnum } UBOCSMEnum
 * @property { UBODeferredLight } UBODeferredLight
 * @property { UBOForwardLight } UBOForwardLight
 * @property { UBOForwardLightEnum } UBOForwardLightEnum
 * @property { UBOGlobal } UBOGlobal
 * @property { UBOGlobalEnum } UBOGlobalEnum
 * @property { UBOLocal } UBOLocal
 * @property { UBOLocalBatched } UBOLocalBatched
 * @property { UBOLocalEnum } UBOLocalEnum
 * @property { UBOMorph } UBOMorph
 * @property { UBOMorphEnum } UBOMorphEnum
 * @property { UBOSH } UBOSH
 * @property { UBOShadow } UBOShadow
 * @property { UBOShadowEnum } UBOShadowEnum
 * @property { UBOSHEnum } UBOSHEnum
 * @property { UBOSkinning } UBOSkinning
 * @property { UBOSkinningAnimation } UBOSkinningAnimation
 * @property { UBOSkinningTexture } UBOSkinningTexture
 * @property { UBOUILocal } UBOUILocal
 * @property { UBOWorldBound } UBOWorldBound
 * @property { UI } UI
 * @property { UIComponent } UIComponent
 * @property { UICoordinateTracker } UICoordinateTracker
 * @property { UICoordinateTrackerComponent } UICoordinateTrackerComponent
 * @property { UIDrawBatch } UIDrawBatch
 * @property { UIMeshRenderer } UIMeshRenderer
 * @property { UIModelComponent } UIModelComponent
 * @property { UIOpacity } UIOpacity
 * @property { UIOpacityComponent } UIOpacityComponent
 * @property { UIPhase } UIPhase
 * @property { UIRenderable } UIRenderable
 * @property { UIRenderer } UIRenderer
 * @property { UIRendererManager } UIRendererManager
 * @property { UIReorderComponent } UIReorderComponent
 * @property { UISkew } UISkew
 * @property { UIStaticBatch } UIStaticBatch
 * @property { UIStaticBatchComponent } UIStaticBatchComponent
 * @property { UITransform } UITransform
 * @property { UITransformComponent } UITransformComponent
 * @property { UIVertexFormat } UIVertexFormat
 * @property { UnaryCondition } UnaryCondition
 * @property { Uniform } Uniform
 * @property { UNIFORM_DIFFUSEMAP_BINDING } UNIFORM_DIFFUSEMAP_BINDING
 * @property { UNIFORM_ENVIRONMENT_BINDING } UNIFORM_ENVIRONMENT_BINDING
 * @property { UNIFORM_JOINT_TEXTURE_BINDING } UNIFORM_JOINT_TEXTURE_BINDING
 * @property { UNIFORM_LIGHTMAP_TEXTURE_BINDING } UNIFORM_LIGHTMAP_TEXTURE_BINDING
 * @property { UNIFORM_NORMAL_MORPH_TEXTURE_BINDING } UNIFORM_NORMAL_MORPH_TEXTURE_BINDING
 * @property { UNIFORM_POSITION_MORPH_TEXTURE_BINDING } UNIFORM_POSITION_MORPH_TEXTURE_BINDING
 * @property { UNIFORM_REALTIME_JOINT_TEXTURE_BINDING } UNIFORM_REALTIME_JOINT_TEXTURE_BINDING
 * @property { UNIFORM_REFLECTION_PROBE_BLEND_CUBEMAP_BINDING } UNIFORM_REFLECTION_PROBE_BLEND_CUBEMAP_BINDING
 * @property { UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING } UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING
 * @property { UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING } UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING
 * @property { UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING } UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING
 * @property { UNIFORM_SHADOWMAP_BINDING } UNIFORM_SHADOWMAP_BINDING
 * @property { UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING } UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING
 * @property { UNIFORM_SPRITE_TEXTURE_BINDING } UNIFORM_SPRITE_TEXTURE_BINDING
 * @property { UNIFORM_TANGENT_MORPH_TEXTURE_BINDING } UNIFORM_TANGENT_MORPH_TEXTURE_BINDING
 * @property { UniformBlock } UniformBlock
 * @property { UniformBlockData } UniformBlockData
 * @property { UniformData } UniformData
 * @property { UniformInputAttachment } UniformInputAttachment
 * @property { UniformProxyFactory } UniformProxyFactory
 * @property { UniformSampler } UniformSampler
 * @property { UniformSamplerTexture } UniformSamplerTexture
 * @property { UniformStorageBuffer } UniformStorageBuffer
 * @property { UniformStorageImage } UniformStorageImage
 * @property { UniformTexture } UniformTexture
 * @property { uniquelyReferenced } uniquelyReferenced
 * @property { unit } unit
 * @property { UntypedTrack } UntypedTrack
 * @property { UpdateFrequency } UpdateFrequency
 * @property { uploadJointData } uploadJointData
 * @property { UploadPair } UploadPair
 * @property { url } url
 * @property { USE_3D } USE_3D
 * @property { USE_SORTING_2D } USE_SORTING_2D
 * @property { USE_UI_SKEW } USE_UI_SKEW
 * @property { USE_XR } USE_XR
 * @property { utils } utils
 * @property { value } value
 * @property { ValueType } ValueType
 * @property { VariableNotDefinedError } VariableNotDefinedError
 * @property { VariableType } VariableType
 * @property { VariableTypeMismatchedError } VariableTypeMismatchedError
 * @property { VarInstanceBase } VarInstanceBase
 * @property { VarInstancePrimitive } VarInstancePrimitive
 * @property { VarInstanceTrigger } VarInstanceTrigger
 * @property { Vec2 } Vec2
 * @property { Vec2TrackEval } Vec2TrackEval
 * @property { Vec3 } Vec3
 * @property { VEC3_0 } VEC3_0
 * @property { Vec3TrackEval } Vec3TrackEval
 * @property { Vec3Variable } Vec3Variable
 * @property { Vec4 } Vec4
 * @property { Vec4TrackEval } Vec4TrackEval
 * @property { VectorGraphColorMap } VectorGraphColorMap
 * @property { VectorTrack } VectorTrack
 * @property { VERSION } VERSION
 * @property { Vertex } Vertex
 * @property { VertexEffectDelegate } VertexEffectDelegate
 * @property { VerticalTextAlignment } VerticalTextAlignment
 * @property { vfmt } vfmt
 * @property { vfmtPosColor } vfmtPosColor
 * @property { vfmtPosUvColor } vfmtPosUvColor
 * @property { vfmtPosUvColor4B } vfmtPosUvColor4B
 * @property { vfmtPosUvTwoColor } vfmtPosUvTwoColor
 * @property { vfmtPosUvTwoColor4B } vfmtPosUvTwoColor4B
 * @property { VideoClip } VideoClip
 * @property { VideoPlayer } VideoPlayer
 * @property { VideoPlayerEventType } VideoPlayerEventType
 * @property { VideoPlayerImpl } VideoPlayerImpl
 * @property { VideoPlayerImplManager } VideoPlayerImplManager
 * @property { VideoPlayerImplWeb } VideoPlayerImplWeb
 * @property { View } View
 * @property { ViewDimension } ViewDimension
 * @property { ViewGroup } ViewGroup
 * @property { Viewport } Viewport
 * @property { viewVariableBindings } viewVariableBindings
 * @property { VisibilityBlock } VisibilityBlock
 * @property { VisibilityDB } VisibilityDB
 * @property { VisibilityFlags } VisibilityFlags
 * @property { VisibilityGraph } VisibilityGraph
 * @property { VisibilityIndex } VisibilityIndex
 * @property { VisibilityPass } VisibilityPass
 * @property { visible } visible
 * @property { visibleRect } visibleRect
 * @property { VIVO } VIVO
 * @property { vmath } vmath
 * @property { VsyncMode } VsyncMode
 * @property { waitForSpineWasmInstantiation } waitForSpineWasmInstantiation
 * @property { waitForWebGPUWasmInstantiation } waitForWebGPUWasmInstantiation
 * @property { WASM_SUBPACKAGE } WASM_SUBPACKAGE
 * @property { WebComputePassBuilder } WebComputePassBuilder
 * @property { WebComputeQueueBuilder } WebComputeQueueBuilder
 * @property { WebCopyPassBuilder } WebCopyPassBuilder
 * @property { WebGL2Buffer } WebGL2Buffer
 * @property { WebGL2CommandBuffer } WebGL2CommandBuffer
 * @property { WebGL2DescriptorSet } WebGL2DescriptorSet
 * @property { WebGL2DescriptorSetLayout } WebGL2DescriptorSetLayout
 * @property { WebGL2Device } WebGL2Device
 * @property { WebGL2DeviceManager } WebGL2DeviceManager
 * @property { WebGL2EXT } WebGL2EXT
 * @property { WebGL2Framebuffer } WebGL2Framebuffer
 * @property { WebGL2IndirectDrawInfos } WebGL2IndirectDrawInfos
 * @property { WebGL2InputAssembler } WebGL2InputAssembler
 * @property { WebGL2PipelineLayout } WebGL2PipelineLayout
 * @property { WebGL2PipelineState } WebGL2PipelineState
 * @property { WebGL2PrimaryCommandBuffer } WebGL2PrimaryCommandBuffer
 * @property { WebGL2Queue } WebGL2Queue
 * @property { WebGL2RenderPass } WebGL2RenderPass
 * @property { WebGL2Sampler } WebGL2Sampler
 * @property { WebGL2Shader } WebGL2Shader
 * @property { WebGL2StateCache } WebGL2StateCache
 * @property { WebGL2Swapchain } WebGL2Swapchain
 * @property { WebGL2Texture } WebGL2Texture
 * @property { WebGLBuffer } WebGLBuffer
 * @property { WebGLCommandBuffer } WebGLCommandBuffer
 * @property { WebGLConstants } WebGLConstants
 * @property { WebGLDescriptorSet } WebGLDescriptorSet
 * @property { WebGLDescriptorSetLayout } WebGLDescriptorSetLayout
 * @property { WebGLDevice } WebGLDevice
 * @property { WebGLDeviceManager } WebGLDeviceManager
 * @property { WebGLEXT } WebGLEXT
 * @property { WebGLFramebuffer } WebGLFramebuffer
 * @property { WebGLIndirectDrawInfos } WebGLIndirectDrawInfos
 * @property { WebGLInputAssembler } WebGLInputAssembler
 * @property { WebGLPipelineLayout } WebGLPipelineLayout
 * @property { WebGLPipelineState } WebGLPipelineState
 * @property { WebGLPrimaryCommandBuffer } WebGLPrimaryCommandBuffer
 * @property { WebGLQueue } WebGLQueue
 * @property { WebGLRenderPass } WebGLRenderPass
 * @property { WebGLSampler } WebGLSampler
 * @property { WebGLShader } WebGLShader
 * @property { WebGLStateCache } WebGLStateCache
 * @property { WebGLSwapchain } WebGLSwapchain
 * @property { WebGLTexture } WebGLTexture
 * @property { webGPU } webGPU
 * @property { WEBGPU_WASM } WEBGPU_WASM
 * @property { webgpuAdapter } webgpuAdapter
 * @property { WebGPUBlendFactors } WebGPUBlendFactors
 * @property { WebGPUBlendOps } WebGPUBlendOps
 * @property { WebGPUBuffer } WebGPUBuffer
 * @property { WebGPUCmd } WebGPUCmd
 * @property { WebGPUCmdBeginRenderPass } WebGPUCmdBeginRenderPass
 * @property { WebGPUCmdBindStates } WebGPUCmdBindStates
 * @property { WebGPUCmdCopyBufferToTexture } WebGPUCmdCopyBufferToTexture
 * @property { WebGPUCmdDraw } WebGPUCmdDraw
 * @property { WebGPUCmdObject } WebGPUCmdObject
 * @property { WebGPUCmdPackage } WebGPUCmdPackage
 * @property { WebGPUCmdUpdateBuffer } WebGPUCmdUpdateBuffer
 * @property { WebGPUCommandAllocator } WebGPUCommandAllocator
 * @property { WebGPUCommandBuffer } WebGPUCommandBuffer
 * @property { WebGPUCommandPool } WebGPUCommandPool
 * @property { WebGPUCompereFunc } WebGPUCompereFunc
 * @property { WebGPUDescriptorSet } WebGPUDescriptorSet
 * @property { WebGPUDescriptorSetLayout } WebGPUDescriptorSetLayout
 * @property { WebGPUDevice } WebGPUDevice
 * @property { WebGPUDeviceManager } WebGPUDeviceManager
 * @property { WebGPUFramebuffer } WebGPUFramebuffer
 * @property { WebGPUInputAssembler } WebGPUInputAssembler
 * @property { WebGPUPipelineLayout } WebGPUPipelineLayout
 * @property { WebGPUPipelineState } WebGPUPipelineState
 * @property { WebGPUQueue } WebGPUQueue
 * @property { WebGPURenderPass } WebGPURenderPass
 * @property { WebGPUSampler } WebGPUSampler
 * @property { WebGPUShader } WebGPUShader
 * @property { WebGPUStateCache } WebGPUStateCache
 * @property { WebGPUStencilOp } WebGPUStencilOp
 * @property { WebGPUSwapchain } WebGPUSwapchain
 * @property { WebGPUTexture } WebGPUTexture
 * @property { WebMovePassBuilder } WebMovePassBuilder
 * @property { WebPipeline } WebPipeline
 * @property { WebProgramLibrary } WebProgramLibrary
 * @property { WebProgramProxy } WebProgramProxy
 * @property { WebRenderPassBuilder } WebRenderPassBuilder
 * @property { WebRenderQueueBuilder } WebRenderQueueBuilder
 * @property { WebRenderSubpassBuilder } WebRenderSubpassBuilder
 * @property { WebSceneBuilder } WebSceneBuilder
 * @property { WebSetter } WebSetter
 * @property { WebView } WebView
 * @property { WebViewEventType } WebViewEventType
 * @property { WebViewImpl } WebViewImpl
 * @property { WebViewImplManager } WebViewImplManager
 * @property { WebViewImplWeb } WebViewImplWeb
 * @property { WECHAT } WECHAT
 * @property { WECHAT_MINI_PROGRAM } WECHAT_MINI_PROGRAM
 * @property { WGPU_WASM } WGPU_WASM
 * @property { WheelJoint2D } WheelJoint2D
 * @property { Widget } Widget
 * @property { WidgetComponent } WidgetComponent
 * @property { widgetManager } widgetManager
 * @property { WINDOWS } WINDOWS
 * @property { WorldClock } WorldClock
 * @property { wrap } wrap
 * @property { WrapMode } WrapMode
 * @property { WrapModeMask } WrapModeMask
 * @property { wrapNativeSuper } wrapNativeSuper
 * @property { WrappedInfo } WrappedInfo
 * @property { wrapRegExp } wrapRegExp
 * @property { XIAOMI } XIAOMI
 * @property { XRConfigKey } XRConfigKey
 * @property { XREye } XREye
 * @property { XrKeyboardEventType } XrKeyboardEventType
 * @property { XRPoseType } XRPoseType
 * @property { XrUIPressEvent } XrUIPressEvent
 * @property { XrUIPressEventType } XrUIPressEventType
 * @property { ZERO_DELTA_TRANSFORM } ZERO_DELTA_TRANSFORM
 */

/**
 * @global
 * @type {cc}
 */
var cc;

/**
 * @global
 * @interface Window
 * @property {cc} cc
 *//** @type {AABB} */
var AABB;
/** @type {AABBPool} */
var AABBPool;
/** @type {AABBView} */
var AABBView;
/** @type {Acceleration} */
var Acceleration;
/** @type {AccelerometerInputSource} */
var AccelerometerInputSource;
/** @type {AccessFlagBit} */
var AccessFlagBit;
/** @type {AccessType} */
var AccessType;
/** @type {Action} */
var Action;
/** @type {ActionCustomUpdate} */
var ActionCustomUpdate;
/** @type {ActionEnum} */
var ActionEnum;
/** @type {ActionInstant} */
var ActionInstant;
/** @type {ActionInterval} */
var ActionInterval;
/** @type {ActionManager} */
var ActionManager;
/** @type {ActionUnknownDuration} */
var ActionUnknownDuration;
/** @type {addEmbeddedPlayerTag} */
var addEmbeddedPlayerTag;
/** @type {additiveSettingsTag} */
var additiveSettingsTag;
/** @type {AddNonFreestandingNodeError} */
var AddNonFreestandingNodeError;
/** @type {Address} */
var Address;
/** @type {AdjI} */
var AdjI;
/** @type {AdjPI} */
var AdjPI;
/** @type {AffineTransform} */
var AffineTransform;
/** @type {AlignFlags} */
var AlignFlags;
/** @type {AlignMode} */
var AlignMode;
/** @type {ALIPAY} */
var ALIPAY;
/** @type {AlphaKey} */
var AlphaKey;
/** @type {Ambient} */
var Ambient;
/** @type {AmbientInfo} */
var AmbientInfo;
/** @type {ANDROID} */
var ANDROID;
/** @type {AngularDriverSettings} */
var AngularDriverSettings;
/** @type {AngularLimitSettings} */
var AngularLimitSettings;
/** @type {Animation} */
var Animation;
/** @type {AnimationBlend} */
var AnimationBlend;
/** @type {AnimationBlend1D} */
var AnimationBlend1D;
/** @type {AnimationBlend2D} */
var AnimationBlend2D;
/** @type {AnimationBlendDirect} */
var AnimationBlendDirect;
/** @type {AnimationBlendEval} */
var AnimationBlendEval;
/** @type {AnimationBlendItem} */
var AnimationBlendItem;
/** @type {AnimationCache} */
var AnimationCache;
/** @type {AnimationCacheMode} */
var AnimationCacheMode;
/** @type {AnimationClip} */
var AnimationClip;
/** @type {AnimationClipAdditiveSettings} */
var AnimationClipAdditiveSettings;
/** @type {AnimationClipLegacyData} */
var AnimationClipLegacyData;
/** @type {AnimationComponent} */
var AnimationComponent;
/** @type {AnimationController} */
var AnimationController;
/** @type {AnimationCurve} */
var AnimationCurve;
/** @type {AnimationData} */
var AnimationData;
/** @type {AnimationEventType} */
var AnimationEventType;
/** @type {AnimationFadeOutMode} */
var AnimationFadeOutMode;
/** @type {AnimationGraph} */
var AnimationGraph;
/** @type {AnimationGraphBindingContext} */
var AnimationGraphBindingContext;
/** @type {AnimationGraphEval} */
var AnimationGraphEval;
/** @type {AnimationGraphEventBinding} */
var AnimationGraphEventBinding;
/** @type {AnimationGraphLike} */
var AnimationGraphLike;
/** @type {AnimationGraphPoseLayoutMaintainer} */
var AnimationGraphPoseLayoutMaintainer;
/** @type {AnimationGraphSettleContext} */
var AnimationGraphSettleContext;
/** @type {AnimationGraphUpdateContextGenerator} */
var AnimationGraphUpdateContextGenerator;
/** @type {AnimationGraphVariant} */
var AnimationGraphVariant;
/** @type {AnimationManager} */
var AnimationManager;
/** @type {AnimationMask} */
var AnimationMask;
/** @type {AnimationState} */
var AnimationState;
/** @type {AnimationStateEventType} */
var AnimationStateEventType;
/** @type {AnimCurve} */
var AnimCurve;
/** @type {AntiAliasing} */
var AntiAliasing;
/** @type {API} */
var API;
/** @type {applyDecs2203R} */
var applyDecs2203R;
/** @type {applyDecs2301} */
var applyDecs2301;
/** @type {applyDefaultGeometryOptions} */
var applyDefaultGeometryOptions;
/** @type {applyMixins} */
var applyMixins;
/** @type {Armature} */
var Armature;
/** @type {ArmatureCache} */
var ArmatureCache;
/** @type {ArmatureCacheMgr} */
var ArmatureCacheMgr;
/** @type {ArmatureData} */
var ArmatureData;
/** @type {ArmatureDisplay} */
var ArmatureDisplay;
/** @type {ArmatureSystem} */
var ArmatureSystem;
/** @type {array} */
var array;
/** @type {ArrayCollisionMatrix} */
var ArrayCollisionMatrix;
/** @type {Asset} */
var Asset;
/** @type {AssetLibrary} */
var AssetLibrary;
/** @type {AssetManager} */
var AssetManager;
/** @type {assets} */
var assets;
/** @type {assetsOverrideMap} */
var assetsOverrideMap;
/** @type {AsyncDelegate} */
var AsyncDelegate;
/** @type {Atlas} */
var Atlas;
/** @type {ATTACHMENT_TYPE} */
var ATTACHMENT_TYPE;
/** @type {AttachmentType} */
var AttachmentType;
/** @type {AttachUtil} */
var AttachUtil;
/** @type {Attribute} */
var Attribute;
/** @type {AttributeName} */
var AttributeName;
/** @type {AttrUInt16ArrayView} */
var AttrUInt16ArrayView;
/** @type {AttrUInt32ArrayView} */
var AttrUInt32ArrayView;
/** @type {AttrUInt8ArrayView} */
var AttrUInt8ArrayView;
/** @type {audioBufferManager} */
var audioBufferManager;
/** @type {AudioClip} */
var AudioClip;
/** @type {AudioContextAgent} */
var AudioContextAgent;
/** @type {AudioEvent} */
var AudioEvent;
/** @type {audioManager} */
var audioManager;
/** @type {AudioPCMDataView} */
var AudioPCMDataView;
/** @type {AudioPlayer} */
var AudioPlayer;
/** @type {AudioPlayerDOM} */
var AudioPlayerDOM;
/** @type {AudioPlayerMinigame} */
var AudioPlayerMinigame;
/** @type {AudioPlayerWeb} */
var AudioPlayerWeb;
/** @type {AudioSource} */
var AudioSource;
/** @type {AudioSourceComponent} */
var AudioSourceComponent;
/** @type {AudioState} */
var AudioState;
/** @type {AudioType} */
var AudioType;
/** @type {AutoPlacement} */
var AutoPlacement;
/** @type {AuxiliaryCurveEntry} */
var AuxiliaryCurveEntry;
/** @type {AuxiliaryCurveRegistry} */
var AuxiliaryCurveRegistry;
/** @type {B2} */
var B2;
/** @type {b2BoxShape} */
var b2BoxShape;
/** @type {B2CircleShape} */
var B2CircleShape;
/** @type {b2DistanceJoint} */
var b2DistanceJoint;
/** @type {b2EmptyInstance} */
var b2EmptyInstance;
/** @type {b2FixedJoint} */
var b2FixedJoint;
/** @type {b2HingeJoint} */
var b2HingeJoint;
/** @type {b2Joint} */
var b2Joint;
/** @type {b2MouseJoint} */
var b2MouseJoint;
/** @type {B2ObjectType} */
var B2ObjectType;
/** @type {B2PhysicsWorld} */
var B2PhysicsWorld;
/** @type {b2PolygonShape} */
var b2PolygonShape;
/** @type {b2RelativeJoint} */
var b2RelativeJoint;
/** @type {B2RigidBody2D} */
var B2RigidBody2D;
/** @type {b2Shape2D} */
var b2Shape2D;
/** @type {b2SliderJoint} */
var b2SliderJoint;
/** @type {B2SpringJoint} */
var B2SpringJoint;
/** @type {B2WheelJoint} */
var B2WheelJoint;
/** @type {backOutIn} */
var backOutIn;
/** @type {BAKE_SKELETON_CURVE_SYMBOL} */
var BAKE_SKELETON_CURVE_SYMBOL;
/** @type {BakedSkinningModel} */
var BakedSkinningModel;
/** @type {barFilled} */
var barFilled;
/** @type {BarrierType} */
var BarrierType;
/** @type {BASE64_VALUES} */
var BASE64_VALUES;
/** @type {BaseFactory} */
var BaseFactory;
/** @type {BASELINE_RATIO} */
var BASELINE_RATIO;
/** @type {BaseObject} */
var BaseObject;
/** @type {BasePass} */
var BasePass;
/** @type {BaseRenderData} */
var BaseRenderData;
/** @type {BatchedSkinningModelComponent} */
var BatchedSkinningModelComponent;
/** @type {Batcher2D} */
var Batcher2D;
/** @type {BatchingSchemes} */
var BatchingSchemes;
/** @type {BatchingUtility} */
var BatchingUtility;
/** @type {Billboard} */
var Billboard;
/** @type {BillboardComponent} */
var BillboardComponent;
/** @type {BinaryCondition} */
var BinaryCondition;
/** @type {BinaryInputArchive} */
var BinaryInputArchive;
/** @type {BinaryOutputArchive} */
var BinaryOutputArchive;
/** @type {BindableBoolean} */
var BindableBoolean;
/** @type {BindableNumber} */
var BindableNumber;
/** @type {BindingMappingInfo} */
var BindingMappingInfo;
/** @type {binPackageUnpack} */
var binPackageUnpack;
/** @type {BitmapFont} */
var BitmapFont;
/** @type {BitMask} */
var BitMask;
/** @type {BITMASK_TAG} */
var BITMASK_TAG;
/** @type {bits} */
var bits;
/** @type {blend1D} */
var blend1D;
/** @type {BlendFactor} */
var BlendFactor;
/** @type {BlendOp} */
var BlendOp;
/** @type {blendSimpleDirectional} */
var blendSimpleDirectional;
/** @type {BlendState} */
var BlendState;
/** @type {BlendStateBuffer} */
var BlendStateBuffer;
/** @type {BlendStateEditor} */
var BlendStateEditor;
/** @type {BlendTarget} */
var BlendTarget;
/** @type {BlendTargetEditor} */
var BlendTargetEditor;
/** @type {Blit} */
var Blit;
/** @type {BlitScreen} */
var BlitScreen;
/** @type {BlitScreenPass} */
var BlitScreenPass;
/** @type {BlitType} */
var BlitType;
/** @type {BlockInputEvents} */
var BlockInputEvents;
/** @type {BlockInputEventsComponent} */
var BlockInputEventsComponent;
/** @type {Bloom} */
var Bloom;
/** @type {BLOOM_COMBINEPASS_INDEX} */
var BLOOM_COMBINEPASS_INDEX;
/** @type {BLOOM_DOWNSAMPLEPASS_INDEX} */
var BLOOM_DOWNSAMPLEPASS_INDEX;
/** @type {BLOOM_PREFILTERPASS_INDEX} */
var BLOOM_PREFILTERPASS_INDEX;
/** @type {BLOOM_UPSAMPLEPASS_INDEX} */
var BLOOM_UPSAMPLEPASS_INDEX;
/** @type {BloomPass} */
var BloomPass;
/** @type {BloomRenderData} */
var BloomRenderData;
/** @type {BloomStage} */
var BloomStage;
/** @type {bmfont} */
var bmfont;
/** @type {BmfontUtils} */
var BmfontUtils;
/** @type {Bone} */
var Bone;
/** @type {BoneData} */
var BoneData;
/** @type {boolean} */
var boolean;
/** @type {bounceOutIn} */
var bounceOutIn;
/** @type {BoundingBoxData} */
var BoundingBoxData;
/** @type {box} */
var box;
/** @type {BoxCharacterController} */
var BoxCharacterController;
/** @type {BoxCollider} */
var BoxCollider;
/** @type {BoxCollider2D} */
var BoxCollider2D;
/** @type {BoxColliderComponent} */
var BoxColliderComponent;
/** @type {BrowserType} */
var BrowserType;
/** @type {bt} */
var bt;
/** @type {btCache} */
var btCache;
/** @type {btCollisionFlags} */
var btCollisionFlags;
/** @type {btCollisionObjectStates} */
var btCollisionObjectStates;
/** @type {btCollisionObjectTypes} */
var btCollisionObjectTypes;
/** @type {btRigidBodyFlags} */
var btRigidBodyFlags;
/** @type {Buffer} */
var Buffer;
/** @type {BufferAccessor} */
var BufferAccessor;
/** @type {BufferAsset} */
var BufferAsset;
/** @type {BufferBarrier} */
var BufferBarrier;
/** @type {BufferBarrierInfo} */
var BufferBarrierInfo;
/** @type {BufferBlob} */
var BufferBlob;
/** @type {BufferBuilder} */
var BufferBuilder;
/** @type {BufferFlagBit} */
var BufferFlagBit;
/** @type {BufferInfo} */
var BufferInfo;
/** @type {BufferTextureCopy} */
var BufferTextureCopy;
/** @type {BufferUsageBit} */
var BufferUsageBit;
/** @type {BufferViewInfo} */
var BufferViewInfo;
/** @type {BUILD} */
var BUILD;
/** @type {BUILTIN_CLASSID_RE} */
var BUILTIN_CLASSID_RE;
/** @type {BuiltinBoxShape} */
var BuiltinBoxShape;
/** @type {BuiltinBundleName} */
var BuiltinBundleName;
/** @type {BuiltinCapsuleShape} */
var BuiltinCapsuleShape;
/** @type {BuiltinCircleShape} */
var BuiltinCircleShape;
/** @type {BuiltinContact} */
var BuiltinContact;
/** @type {BuiltinObject} */
var BuiltinObject;
/** @type {BuiltinPhysicsWorld} */
var BuiltinPhysicsWorld;
/** @type {BuiltinPolygonShape} */
var BuiltinPolygonShape;
/** @type {builtinResMgr} */
var builtinResMgr;
/** @type {BuiltinRigidBody} */
var BuiltinRigidBody;
/** @type {BuiltinShape} */
var BuiltinShape;
/** @type {BuiltinShape2D} */
var BuiltinShape2D;
/** @type {BuiltinSharedBody} */
var BuiltinSharedBody;
/** @type {BuiltinSphereShape} */
var BuiltinSphereShape;
/** @type {BuiltInWorld} */
var BuiltInWorld;
/** @type {BulletBoxCharacterController} */
var BulletBoxCharacterController;
/** @type {BulletBoxShape} */
var BulletBoxShape;
/** @type {BulletBvhTriangleMeshShape} */
var BulletBvhTriangleMeshShape;
/** @type {BulletCache} */
var BulletCache;
/** @type {BulletCapsuleCharacterController} */
var BulletCapsuleCharacterController;
/** @type {BulletCapsuleShape} */
var BulletCapsuleShape;
/** @type {BulletCharacterController} */
var BulletCharacterController;
/** @type {BulletConeShape} */
var BulletConeShape;
/** @type {BulletConfigurableConstraint} */
var BulletConfigurableConstraint;
/** @type {BulletConstraint} */
var BulletConstraint;
/** @type {BulletContactData} */
var BulletContactData;
/** @type {BulletCylinderShape} */
var BulletCylinderShape;
/** @type {BulletFixedConstraint} */
var BulletFixedConstraint;
/** @type {BulletHingeConstraint} */
var BulletHingeConstraint;
/** @type {BulletP2PConstraint} */
var BulletP2PConstraint;
/** @type {BulletPlaneShape} */
var BulletPlaneShape;
/** @type {BulletRigidBody} */
var BulletRigidBody;
/** @type {BulletShape} */
var BulletShape;
/** @type {BulletSharedBody} */
var BulletSharedBody;
/** @type {BulletSimplexShape} */
var BulletSimplexShape;
/** @type {BulletSphereShape} */
var BulletSphereShape;
/** @type {BulletTerrainShape} */
var BulletTerrainShape;
/** @type {BulletTrimeshShape} */
var BulletTrimeshShape;
/** @type {BulletWorld} */
var BulletWorld;
/** @type {bundles} */
var bundles;
/** @type {Burst} */
var Burst;
/** @type {Button} */
var Button;
/** @type {ButtonComponent} */
var ButtonComponent;
/** @type {ButtonEventType} */
var ButtonEventType;
/** @type {BYTEDANCE} */
var BYTEDANCE;
/** @type {CACHE_KEY} */
var CACHE_KEY;
/** @type {CachedArray} */
var CachedArray;
/** @type {CacheMode} */
var CacheMode;
/** @type {CallbackList} */
var CallbackList;
/** @type {CallbacksInvoker} */
var CallbacksInvoker;
/** @type {CallFunc} */
var CallFunc;
/** @type {Camera} */
var Camera;
/** @type {CAMERA_DEFAULT_MASK} */
var CAMERA_DEFAULT_MASK;
/** @type {CAMERA_EDITOR_MASK} */
var CAMERA_EDITOR_MASK;
/** @type {CameraAperture} */
var CameraAperture;
/** @type {CameraComponent} */
var CameraComponent;
/** @type {CameraEvent} */
var CameraEvent;
/** @type {CameraFOVAxis} */
var CameraFOVAxis;
/** @type {CameraISO} */
var CameraISO;
/** @type {CameraProjection} */
var CameraProjection;
/** @type {CameraShutter} */
var CameraShutter;
/** @type {CameraType} */
var CameraType;
/** @type {CameraUsage} */
var CameraUsage;
/** @type {CameraVisFlags} */
var CameraVisFlags;
/** @type {CannonBoxShape} */
var CannonBoxShape;
/** @type {CannonConeShape} */
var CannonConeShape;
/** @type {CannonConstraint} */
var CannonConstraint;
/** @type {CannonContactEquation} */
var CannonContactEquation;
/** @type {CannonCylinderShape} */
var CannonCylinderShape;
/** @type {CannonHingeConstraint} */
var CannonHingeConstraint;
/** @type {CannonLockConstraint} */
var CannonLockConstraint;
/** @type {CannonPlaneShape} */
var CannonPlaneShape;
/** @type {CannonPointToPointConstraint} */
var CannonPointToPointConstraint;
/** @type {CannonRigidBody} */
var CannonRigidBody;
/** @type {CannonShape} */
var CannonShape;
/** @type {CannonSharedBody} */
var CannonSharedBody;
/** @type {CannonSimplexShape} */
var CannonSimplexShape;
/** @type {CannonSphereShape} */
var CannonSphereShape;
/** @type {CannonTerrainShape} */
var CannonTerrainShape;
/** @type {CannonTrimeshShape} */
var CannonTrimeshShape;
/** @type {CannonWorld} */
var CannonWorld;
/** @type {Canvas} */
var Canvas;
/** @type {CanvasComponent} */
var CanvasComponent;
/** @type {CanvasPool} */
var CanvasPool;
/** @type {Capsule} */
var Capsule;
/** @type {CapsuleCharacterController} */
var CapsuleCharacterController;
/** @type {CapsuleCollider} */
var CapsuleCollider;
/** @type {CapsuleColliderComponent} */
var CapsuleColliderComponent;
/** @type {CC_COLOR_0} */
var CC_COLOR_0;
/** @type {CC_MAT4_0} */
var CC_MAT4_0;
/** @type {CC_MAT4_1} */
var CC_MAT4_1;
/** @type {CC_QUAT_0} */
var CC_QUAT_0;
/** @type {CC_QUAT_1} */
var CC_QUAT_1;
/** @type {CC_V3_0} */
var CC_V3_0;
/** @type {CC_V3_1} */
var CC_V3_1;
/** @type {CC_V3_2} */
var CC_V3_2;
/** @type {CCArmatureCacheDisplay} */
var CCArmatureCacheDisplay;
/** @type {CCArmatureDisplay} */
var CCArmatureDisplay;
/** @type {CCBoolean} */
var CCBoolean;
/** @type {ccclass} */
var ccclass;
/** @type {CCFactory} */
var CCFactory;
/** @type {CCFloat} */
var CCFloat;
/** @type {CCInteger} */
var CCInteger;
/** @type {cclegacy} */
var cclegacy;
/** @type {CCLoader} */
var CCLoader;
/** @type {CCObject} */
var CCObject;
/** @type {CCObjectFlags} */
var CCObjectFlags;
/** @type {CCON} */
var CCON;
/** @type {CCSlot} */
var CCSlot;
/** @type {CCString} */
var CCString;
/** @type {CCTextureAtlasData} */
var CCTextureAtlasData;
/** @type {CCTextureData} */
var CCTextureData;
/** @type {ccwindow} */
var ccwindow;
/** @type {Channel} */
var Channel;
/** @type {CharacterController} */
var CharacterController;
/** @type {CharacterControllerContact} */
var CharacterControllerContact;
/** @type {CharacterTriggerEventObject} */
var CharacterTriggerEventObject;
/** @type {circle} */
var circle;
/** @type {CircleCollider2D} */
var CircleCollider2D;
/** @type {circOutIn} */
var circOutIn;
/** @type {CircumSphere} */
var CircumSphere;
/** @type {CLASS_NAME_PREFIX_ANIM} */
var CLASS_NAME_PREFIX_ANIM;
/** @type {clearEmbeddedPlayersTag} */
var clearEmbeddedPlayersTag;
/** @type {ClearFlag} */
var ClearFlag;
/** @type {ClearFlagBit} */
var ClearFlagBit;
/** @type {ClearValue} */
var ClearValue;
/** @type {ClearValueType} */
var ClearValueType;
/** @type {ClearView} */
var ClearView;
/** @type {ClipMotion} */
var ClipMotion;
/** @type {cloneAnimationGraphEditorExtrasFrom} */
var cloneAnimationGraphEditorExtrasFrom;
/** @type {COCOS_RUNTIME} */
var COCOS_RUNTIME;
/** @type {code2KeyCode} */
var code2KeyCode;
/** @type {codec} */
var codec;
/** @type {Collider} */
var Collider;
/** @type {Collider2D} */
var Collider2D;
/** @type {ColliderComponent} */
var ColliderComponent;
/** @type {CollisionEventObject} */
var CollisionEventObject;
/** @type {CollisionMatrix} */
var CollisionMatrix;
/** @type {Color} */
var Color;
/** @type {ColorAttachment} */
var ColorAttachment;
/** @type {ColorDesc} */
var ColorDesc;
/** @type {ColorGrading} */
var ColorGrading;
/** @type {ColorGradingPass} */
var ColorGradingPass;
/** @type {ColorKey} */
var ColorKey;
/** @type {ColorMask} */
var ColorMask;
/** @type {ColorTrack} */
var ColorTrack;
/** @type {ColorTrackEval} */
var ColorTrackEval;
/** @type {CommandBuffer} */
var CommandBuffer;
/** @type {CommandBufferInfo} */
var CommandBufferInfo;
/** @type {CommandBufferType} */
var CommandBufferType;
/** @type {CommonStagePriority} */
var CommonStagePriority;
/** @type {CompactValueTypeArray} */
var CompactValueTypeArray;
/** @type {ComparisonFunc} */
var ComparisonFunc;
/** @type {Compiler} */
var Compiler;
/** @type {Component} */
var Component;
/** @type {ComponentPath} */
var ComponentPath;
/** @type {ComponentScheduler} */
var ComponentScheduler;
/** @type {CompositeInputSourceAxis1D} */
var CompositeInputSourceAxis1D;
/** @type {CompositeInputSourceAxis2D} */
var CompositeInputSourceAxis2D;
/** @type {CompositeInputSourceAxis3D} */
var CompositeInputSourceAxis3D;
/** @type {CompPrefabInfo} */
var CompPrefabInfo;
/** @type {compressType} */
var compressType;
/** @type {ComputePass} */
var ComputePass;
/** @type {ComputeSubpass} */
var ComputeSubpass;
/** @type {ComputeView} */
var ComputeView;
/** @type {cone} */
var cone;
/** @type {ConeCollider} */
var ConeCollider;
/** @type {ConfigurableConstraint} */
var ConfigurableConstraint;
/** @type {ConstantForce} */
var ConstantForce;
/** @type {constget} */
var constget;
/** @type {Constraint} */
var Constraint;
/** @type {construct} */
var construct;
/** @type {Contact2DType} */
var Contact2DType;
/** @type {convertUtils} */
var convertUtils;
/** @type {ConvexPartition} */
var ConvexPartition;
/** @type {COPY_INPUT_DS_PASS_INDEX} */
var COPY_INPUT_DS_PASS_INDEX;
/** @type {CopyPair} */
var CopyPair;
/** @type {CopyPass} */
var CopyPass;
/** @type {CopySpace} */
var CopySpace;
/** @type {Counter} */
var Counter;
/** @type {createAnimationAGEvaluation} */
var createAnimationAGEvaluation;
/** @type {createDefaultPipeline} */
var createDefaultPipeline;
/** @type {createDynamicMesh} */
var createDynamicMesh;
/** @type {createEval} */
var createEval;
/** @type {createEvalSymbol} */
var createEvalSymbol;
/** @type {createIA} */
var createIA;
/** @type {createInstanceofProxy} */
var createInstanceofProxy;
/** @type {createInstanceTag} */
var createInstanceTag;
/** @type {createMesh} */
var createMesh;
/** @type {createVariable} */
var createVariable;
/** @type {CrossFade} */
var CrossFade;
/** @type {CSMLayers} */
var CSMLayers;
/** @type {CSMLevel} */
var CSMLevel;
/** @type {CSMOptimizationMode} */
var CSMOptimizationMode;
/** @type {CSMShadowLayer} */
var CSMShadowLayer;
/** @type {cubicOutIn} */
var cubicOutIn;
/** @type {CubicSplineNumberValue} */
var CubicSplineNumberValue;
/** @type {CubicSplineQuatValue} */
var CubicSplineQuatValue;
/** @type {CubicSplineVec2Value} */
var CubicSplineVec2Value;
/** @type {CubicSplineVec3Value} */
var CubicSplineVec3Value;
/** @type {CubicSplineVec4Value} */
var CubicSplineVec4Value;
/** @type {CULL_MESHOPT} */
var CULL_MESHOPT;
/** @type {CullingFlags} */
var CullingFlags;
/** @type {CullMode} */
var CullMode;
/** @type {CurveRange} */
var CurveRange;
/** @type {customizeType} */
var customizeType;
/** @type {customPipelineBuilderMap} */
var customPipelineBuilderMap;
/** @type {cylinder} */
var cylinder;
/** @type {CylinderCollider} */
var CylinderCollider;
/** @type {CylinderColliderComponent} */
var CylinderColliderComponent;
/** @type {DataInput} */
var DataInput;
/** @type {DataPoolManager} */
var DataPoolManager;
/** @type {DEBUG} */
var DEBUG;
/** @type {DebugMode} */
var DebugMode;
/** @type {DebugView} */
var DebugView;
/** @type {DebugViewCompositeType} */
var DebugViewCompositeType;
/** @type {DebugViewSingleType} */
var DebugViewSingleType;
/** @type {decodeUuid} */
var decodeUuid;
/** @type {DEFAULT_OCTREE_DEPTH} */
var DEFAULT_OCTREE_DEPTH;
/** @type {DEFAULT_UNIFORM_COUNTS} */
var DEFAULT_UNIFORM_COUNTS;
/** @type {DEFAULT_WORLD_MAX_POS} */
var DEFAULT_WORLD_MAX_POS;
/** @type {DEFAULT_WORLD_MIN_POS} */
var DEFAULT_WORLD_MIN_POS;
/** @type {DefaultAnimsEnum} */
var DefaultAnimsEnum;
/** @type {DefaultResource} */
var DefaultResource;
/** @type {DefaultResources} */
var DefaultResources;
/** @type {DefaultSkinsEnum} */
var DefaultSkinsEnum;
/** @type {DefaultTopLevelPoseNode} */
var DefaultTopLevelPoseNode;
/** @type {defaultTransformsTag} */
var defaultTransformsTag;
/** @type {DefaultVisitor} */
var DefaultVisitor;
/** @type {DeferredAntiAliasing} */
var DeferredAntiAliasing;
/** @type {DeferredFlowPriority} */
var DeferredFlowPriority;
/** @type {DeferredPipeline} */
var DeferredPipeline;
/** @type {DeferredPipelineSceneData} */
var DeferredPipelineSceneData;
/** @type {DeferredPoseStashAllocator} */
var DeferredPoseStashAllocator;
/** @type {DeferredRenderData} */
var DeferredRenderData;
/** @type {DeferredStagePriority} */
var DeferredStagePriority;
/** @type {Delaunay} */
var Delaunay;
/** @type {DELIMETER} */
var DELIMETER;
/** @type {dependMap} */
var dependMap;
/** @type {DependUtil} */
var DependUtil;
/** @type {DepthStencilAttachment} */
var DepthStencilAttachment;
/** @type {DepthStencilDesc} */
var DepthStencilDesc;
/** @type {DepthStencilState} */
var DepthStencilState;
/** @type {DepthStencilStateEditor} */
var DepthStencilStateEditor;
/** @type {Descriptor} */
var Descriptor;
/** @type {DESCRIPTOR_BUFFER_TYPE} */
var DESCRIPTOR_BUFFER_TYPE;
/** @type {DESCRIPTOR_DYNAMIC_TYPE} */
var DESCRIPTOR_DYNAMIC_TYPE;
/** @type {DESCRIPTOR_SAMPLER_TYPE} */
var DESCRIPTOR_SAMPLER_TYPE;
/** @type {DESCRIPTOR_STORAGE_BUFFER_TYPE} */
var DESCRIPTOR_STORAGE_BUFFER_TYPE;
/** @type {DescriptorBlock} */
var DescriptorBlock;
/** @type {DescriptorBlockData} */
var DescriptorBlockData;
/** @type {DescriptorBlockFlattened} */
var DescriptorBlockFlattened;
/** @type {DescriptorBlockIndex} */
var DescriptorBlockIndex;
/** @type {DescriptorData} */
var DescriptorData;
/** @type {DescriptorDB} */
var DescriptorDB;
/** @type {DescriptorGroupBlockIndex} */
var DescriptorGroupBlockIndex;
/** @type {DescriptorSet} */
var DescriptorSet;
/** @type {DescriptorSetData} */
var DescriptorSetData;
/** @type {DescriptorSetInfo} */
var DescriptorSetInfo;
/** @type {DescriptorSetLayout} */
var DescriptorSetLayout;
/** @type {DescriptorSetLayoutBinding} */
var DescriptorSetLayoutBinding;
/** @type {DescriptorSetLayoutData} */
var DescriptorSetLayoutData;
/** @type {DescriptorSetLayoutInfo} */
var DescriptorSetLayoutInfo;
/** @type {DescriptorType} */
var DescriptorType;
/** @type {DescriptorTypeOrder} */
var DescriptorTypeOrder;
/** @type {DescUpdateFrequency} */
var DescUpdateFrequency;
/** @type {deserializeTag} */
var deserializeTag;
/** @type {Details} */
var Details;
/** @type {DEV} */
var DEV;
/** @type {Device} */
var Device;
/** @type {DeviceCaps} */
var DeviceCaps;
/** @type {DeviceInfo} */
var DeviceInfo;
/** @type {deviceManager} */
var deviceManager;
/** @type {DeviceOptions} */
var DeviceOptions;
/** @type {DeviceType} */
var DeviceType;
/** @type {directional} */
var directional;
/** @type {DirectionalLight} */
var DirectionalLight;
/** @type {DirectionalLightComponent} */
var DirectionalLightComponent;
/** @type {director} */
var director;
/** @type {DirectorEvent} */
var DirectorEvent;
/** @type {disallowAnimation} */
var disallowAnimation;
/** @type {disallowMultiple} */
var disallowMultiple;
/** @type {Dispatch} */
var Dispatch;
/** @type {DispatcherEventType} */
var DispatcherEventType;
/** @type {DispatchInfo} */
var DispatchInfo;
/** @type {displayName} */
var displayName;
/** @type {displayOrder} */
var displayOrder;
/** @type {distance} */
var distance;
/** @type {DistanceJoint2D} */
var DistanceJoint2D;
/** @type {DOF} */
var DOF;
/** @type {DofPass} */
var DofPass;
/** @type {Downloader} */
var Downloader;
/** @type {downloadVideo} */
var downloadVideo;
/** @type {dragonBones} */
var dragonBones;
/** @type {DragonBonesAsset} */
var DragonBonesAsset;
/** @type {DragonBonesAtlasAsset} */
var DragonBonesAtlasAsset;
/** @type {DragonBonesData} */
var DragonBonesData;
/** @type {DragonBonesEventType} */
var DragonBonesEventType;
/** @type {DragonBoneSocket} */
var DragonBoneSocket;
/** @type {DRAW_INFO_SIZE} */
var DRAW_INFO_SIZE;
/** @type {DrawBatch2D} */
var DrawBatch2D;
/** @type {DrawInfo} */
var DrawInfo;
/** @type {DrawInstance} */
var DrawInstance;
/** @type {DURATION_INFINITY} */
var DURATION_INFINITY;
/** @type {DYNAMIC_UNIFORM_BLOCK} */
var DYNAMIC_UNIFORM_BLOCK;
/** @type {DynamicAtlasManager} */
var DynamicAtlasManager;
/** @type {DynamicAtlasTexture} */
var DynamicAtlasTexture;
/** @type {DynamicStateFlagBit} */
var DynamicStateFlagBit;
/** @type {DynamicStates} */
var DynamicStates;
/** @type {DynamicStencilStates} */
var DynamicStencilStates;
/** @type {earcut} */
var earcut;
/** @type {easing} */
var easing;
/** @type {EasingMethod} */
var EasingMethod;
/** @type {EAxisDirection} */
var EAxisDirection;
/** @type {EBtSharedBodyDirty} */
var EBtSharedBodyDirty;
/** @type {EBulletDebugDrawModes} */
var EBulletDebugDrawModes;
/** @type {EBulletTriangleRaycastFlag} */
var EBulletTriangleRaycastFlag;
/** @type {EBulletType} */
var EBulletType;
/** @type {ECharacterControllerType} */
var ECharacterControllerType;
/** @type {ECollider2DType} */
var ECollider2DType;
/** @type {EColliderType} */
var EColliderType;
/** @type {EConstraintMode} */
var EConstraintMode;
/** @type {EConstraintType} */
var EConstraintType;
/** @type {ED} */
var ED;
/** @type {ED6Axis} */
var ED6Axis;
/** @type {editable} */
var editable;
/** @type {EditBox} */
var EditBox;
/** @type {EditBoxComponent} */
var EditBoxComponent;
/** @type {EditBoxImpl} */
var EditBoxImpl;
/** @type {EditBoxImplBase} */
var EditBoxImplBase;
/** @type {EDITOR} */
var EDITOR;
/** @type {EDITOR_NOT_IN_PREVIEW} */
var EDITOR_NOT_IN_PREVIEW;
/** @type {EditorExtendable} */
var EditorExtendable;
/** @type {EditorExtendableMixin} */
var EditorExtendableMixin;
/** @type {editorExtrasTag} */
var editorExtrasTag;
/** @type {editorOnly} */
var editorOnly;
/** @type {EDriverMode} */
var EDriverMode;
/** @type {EffectAsset} */
var EffectAsset;
/** @type {EffectData} */
var EffectData;
/** @type {effectSettings} */
var effectSettings;
/** @type {effectStructure} */
var effectStructure;
/** @type {EFilterDataWord3} */
var EFilterDataWord3;
/** @type {EJoint2DType} */
var EJoint2DType;
/** @type {elasticOutIn} */
var elasticOutIn;
/** @type {ElementType} */
var ElementType;
/** @type {EllipseBoundingBoxData} */
var EllipseBoundingBoxData;
/** @type {EmbeddedAnimationClipPlayable} */
var EmbeddedAnimationClipPlayable;
/** @type {EmbeddedParticleSystemPlayable} */
var EmbeddedParticleSystemPlayable;
/** @type {EmbeddedPlayable} */
var EmbeddedPlayable;
/** @type {EmbeddedPlayableState} */
var EmbeddedPlayableState;
/** @type {EmbeddedPlayer} */
var EmbeddedPlayer;
/** @type {embeddedPlayerCountTag} */
var embeddedPlayerCountTag;
/** @type {EmitterMode} */
var EmitterMode;
/** @type {EmptyBuffer} */
var EmptyBuffer;
/** @type {EmptyCommandBuffer} */
var EmptyCommandBuffer;
/** @type {emptyDecorator} */
var emptyDecorator;
/** @type {emptyDecoratorFn} */
var emptyDecoratorFn;
/** @type {EmptyDescriptorSet} */
var EmptyDescriptorSet;
/** @type {EmptyDescriptorSetLayout} */
var EmptyDescriptorSetLayout;
/** @type {EmptyDevice} */
var EmptyDevice;
/** @type {EmptyFramebuffer} */
var EmptyFramebuffer;
/** @type {EmptyInputAssembler} */
var EmptyInputAssembler;
/** @type {EmptyPipelineLayout} */
var EmptyPipelineLayout;
/** @type {EmptyPipelineState} */
var EmptyPipelineState;
/** @type {EmptyQueue} */
var EmptyQueue;
/** @type {EmptyRenderPass} */
var EmptyRenderPass;
/** @type {EmptyShader} */
var EmptyShader;
/** @type {emptySmartClassDecorator} */
var emptySmartClassDecorator;
/** @type {EmptyState} */
var EmptyState;
/** @type {EmptyStateEval} */
var EmptyStateEval;
/** @type {EmptyStateTransition} */
var EmptyStateTransition;
/** @type {EmptySwapchain} */
var EmptySwapchain;
/** @type {EmptyTexture} */
var EmptyTexture;
/** @type {ENABLE_PROBE_BLEND} */
var ENABLE_PROBE_BLEND;
/** @type {ENABLE_SUBPASS} */
var ENABLE_SUBPASS;
/** @type {enableEffectImport} */
var enableEffectImport;
/** @type {enableIfCCON} */
var enableIfCCON;
/** @type {enqueueOperation} */
var enqueueOperation;
/** @type {ENUM_TAG} */
var ENUM_TAG;
/** @type {enums} */
var enums;
/** @type {EnvironmentLightingType} */
var EnvironmentLightingType;
/** @type {EPD} */
var EPD;
/** @type {EPhysics2DDrawFlags} */
var EPhysics2DDrawFlags;
/** @type {EPhysicsDrawFlags} */
var EPhysicsDrawFlags;
/** @type {EPhysXShapeType} */
var EPhysXShapeType;
/** @type {EPSILON} */
var EPSILON;
/** @type {ERaycast2DType} */
var ERaycast2DType;
/** @type {ERaycastMode} */
var ERaycastMode;
/** @type {ERigidBody2DType} */
var ERigidBody2DType;
/** @type {ERigidBodyType} */
var ERigidBodyType;
/** @type {ESimplexType} */
var ESimplexType;
/** @type {Event} */
var Event;
/** @type {EventAcceleration} */
var EventAcceleration;
/** @type {EventDispatcherPriority} */
var EventDispatcherPriority;
/** @type {EventGamepad} */
var EventGamepad;
/** @type {EventHandheld} */
var EventHandheld;
/** @type {EventHandle} */
var EventHandle;
/** @type {EventHandler} */
var EventHandler;
/** @type {EventHMD} */
var EventHMD;
/** @type {Eventify} */
var Eventify;
/** @type {EventInfo} */
var EventInfo;
/** @type {EventKeyboard} */
var EventKeyboard;
/** @type {EventMouse} */
var EventMouse;
/** @type {EventObject} */
var EventObject;
/** @type {EventTarget} */
var EventTarget;
/** @type {EventTouch} */
var EventTouch;
/** @type {EventType} */
var EventType;
/** @type {executeInEditMode} */
var executeInEditMode;
/** @type {executionOrder} */
var executionOrder;
/** @type {Executor} */
var Executor;
/** @type {ExoticAnimation} */
var ExoticAnimation;
/** @type {exoticAnimationTag} */
var exoticAnimationTag;
/** @type {ExoticTrsAGEvaluation} */
var ExoticTrsAGEvaluation;
/** @type {EXPONENT} */
var EXPONENT;
/** @type {expoOutIn} */
var expoOutIn;
/** @type {extendsEnum} */
var extendsEnum;
/** @type {ExtensionType} */
var ExtensionType;
/** @type {Extent} */
var Extent;
/** @type {ExtrapolationMode} */
var ExtrapolationMode;
/** @type {Factory} */
var Factory;
/** @type {Feature} */
var Feature;
/** @type {fetchPipeline} */
var fetchPipeline;
/** @type {files} */
var files;
/** @type {fillMat4WithTempFloatArray} */
var fillMat4WithTempFloatArray;
/** @type {Filter} */
var Filter;
/** @type {find} */
var find;
/** @type {FiniteTimeAction} */
var FiniteTimeAction;
/** @type {FixedConstraint} */
var FixedConstraint;
/** @type {FixedJoint2D} */
var FixedJoint2D;
/** @type {flattenCodeArray} */
var flattenCodeArray;
/** @type {float} */
var float;
/** @type {FloatOutputProcessPass} */
var FloatOutputProcessPass;
/** @type {Fog} */
var Fog;
/** @type {FOG_TYPE_NONE} */
var FOG_TYPE_NONE;
/** @type {FogInfo} */
var FogInfo;
/** @type {FogType} */
var FogType;
/** @type {Font} */
var Font;
/** @type {FontAtlas} */
var FontAtlas;
/** @type {FontLetterDefinition} */
var FontLetterDefinition;
/** @type {Format} */
var Format;
/** @type {FormatFeatureBit} */
var FormatFeatureBit;
/** @type {FormatInfo} */
var FormatInfo;
/** @type {FormatInfos} */
var FormatInfos;
/** @type {formatMap} */
var formatMap;
/** @type {FormatType} */
var FormatType;
/** @type {FormatView} */
var FormatView;
/** @type {formerlySerializedAs} */
var formerlySerializedAs;
/** @type {ForwardFinalPass} */
var ForwardFinalPass;
/** @type {ForwardFlow} */
var ForwardFlow;
/** @type {ForwardFlowPriority} */
var ForwardFlowPriority;
/** @type {ForwardPass} */
var ForwardPass;
/** @type {ForwardPipeline} */
var ForwardPipeline;
/** @type {ForwardStage} */
var ForwardStage;
/** @type {ForwardStagePriority} */
var ForwardStagePriority;
/** @type {ForwardTransparencyPass} */
var ForwardTransparencyPass;
/** @type {ForwardTransparencySimplePass} */
var ForwardTransparencySimplePass;
/** @type {FrameBoneInfo} */
var FrameBoneInfo;
/** @type {Framebuffer} */
var Framebuffer;
/** @type {FrameBufferDesc} */
var FrameBufferDesc;
/** @type {FramebufferInfo} */
var FramebufferInfo;
/** @type {Frustum} */
var Frustum;
/** @type {FSR} */
var FSR;
/** @type {FSRPass} */
var FSRPass;
/** @type {FXAA} */
var FXAA;
/** @type {FxaaPass} */
var FxaaPass;
/** @type {Game} */
var Game;
/** @type {GamepadInputDevice} */
var GamepadInputDevice;
/** @type {garbageCollectionManager} */
var garbageCollectionManager;
/** @type {GbufferStage} */
var GbufferStage;
/** @type {GCObject} */
var GCObject;
/** @type {GeneralBarrier} */
var GeneralBarrier;
/** @type {GeneralBarrierInfo} */
var GeneralBarrierInfo;
/** @type {genHandle} */
var genHandle;
/** @type {geometry} */
var geometry;
/** @type {GeometryRenderer} */
var GeometryRenderer;
/** @type {get} */
var get;
/** @type {getBindingFromHandle} */
var getBindingFromHandle;
/** @type {getCountFromHandle} */
var getCountFromHandle;
/** @type {getDescriptorType} */
var getDescriptorType;
/** @type {getDescriptorTypeOrderName} */
var getDescriptorTypeOrderName;
/** @type {getDeviceShaderVersion} */
var getDeviceShaderVersion;
/** @type {getEmbeddedPlayersTag} */
var getEmbeddedPlayersTag;
/** @type {getFormat} */
var getFormat;
/** @type {getGlobalAnimationManager} */
var getGlobalAnimationManager;
/** @type {getMemoryAccessFlag} */
var getMemoryAccessFlag;
/** @type {getMotionRuntimeID} */
var getMotionRuntimeID;
/** @type {getOffsetFromHandle} */
var getOffsetFromHandle;
/** @type {getOutputKeys} */
var getOutputKeys;
/** @type {getPhaseID} */
var getPhaseID;
/** @type {getPipelineSceneData} */
var getPipelineSceneData;
/** @type {getPrototypeOf} */
var getPrototypeOf;
/** @type {getSerializationMetadata} */
var getSerializationMetadata;
/** @type {getset} */
var getset;
/** @type {getShaderStage} */
var getShaderStage;
/** @type {getTypeFromHandle} */
var getTypeFromHandle;
/** @type {GetTypeSize} */
var GetTypeSize;
/** @type {getUpdateFrequencyName} */
var getUpdateFrequencyName;
/** @type {getVariableValueAttributes} */
var getVariableValueAttributes;
/** @type {gfx} */
var gfx;
/** @type {GFXObject} */
var GFXObject;
/** @type {globalDescriptorSetLayout} */
var globalDescriptorSetLayout;
/** @type {GlobalDSManager} */
var GlobalDSManager;
/** @type {globalPoseGraphNodeInputManager} */
var globalPoseGraphNodeInputManager;
/** @type {glslangWasmModule} */
var glslangWasmModule;
/** @type {Gradient} */
var Gradient;
/** @type {GradientRange} */
var GradientRange;
/** @type {GRAPH_DEBUG_ENABLED} */
var GRAPH_DEBUG_ENABLED;
/** @type {GraphColor} */
var GraphColor;
/** @type {Graphics} */
var Graphics;
/** @type {GraphicsAssembler} */
var GraphicsAssembler;
/** @type {GraphicsComponent} */
var GraphicsComponent;
/** @type {group} */
var group;
/** @type {HALF_PI} */
var HALF_PI;
/** @type {HandheldInputDevice} */
var HandheldInputDevice;
/** @type {HandleInputDevice} */
var HandleInputDevice;
/** @type {HBAO} */
var HBAO;
/** @type {HBAOPass} */
var HBAOPass;
/** @type {HeightField} */
var HeightField;
/** @type {help} */
var help;
/** @type {Hide} */
var Hide;
/** @type {HierarchyPath} */
var HierarchyPath;
/** @type {HingeConstraint} */
var HingeConstraint;
/** @type {HingeJoint2D} */
var HingeJoint2D;
/** @type {HingeLimitData} */
var HingeLimitData;
/** @type {HingeMotorData} */
var HingeMotorData;
/** @type {HMDInputDevice} */
var HMDInputDevice;
/** @type {HONOR} */
var HONOR;
/** @type {HorizontalTextAlignment} */
var HorizontalTextAlignment;
/** @type {HTML5} */
var HTML5;
/** @type {HtmlTextParser} */
var HtmlTextParser;
/** @type {HUAWEI} */
var HUAWEI;
/** @type {I_SAMPLES_COUNT} */
var I_SAMPLES_COUNT;
/** @type {icon} */
var icon;
/** @type {IDGenerator} */
var IDGenerator;
/** @type {ImageAsset} */
var ImageAsset;
/** @type {ImageFormat} */
var ImageFormat;
/** @type {Impl} */
var Impl;
/** @type {importFunc} */
var importFunc;
/** @type {incomingsSymbol} */
var incomingsSymbol;
/** @type {IndirectBuffer} */
var IndirectBuffer;
/** @type {InEI} */
var InEI;
/** @type {InEPI} */
var InEPI;
/** @type {InitDecoder} */
var InitDecoder;
/** @type {Input} */
var Input;
/** @type {InputAssembler} */
var InputAssembler;
/** @type {InputAssemblerInfo} */
var InputAssemblerInfo;
/** @type {InputEventType} */
var InputEventType;
/** @type {InputFlag} */
var InputFlag;
/** @type {InputMode} */
var InputMode;
/** @type {InputSource} */
var InputSource;
/** @type {InputSourceAxis1D} */
var InputSourceAxis1D;
/** @type {InputSourceAxis2D} */
var InputSourceAxis2D;
/** @type {InputSourceAxis3D} */
var InputSourceAxis3D;
/** @type {InputSourceButton} */
var InputSourceButton;
/** @type {InputSourceDpad} */
var InputSourceDpad;
/** @type {InputSourceOrientation} */
var InputSourceOrientation;
/** @type {InputSourcePosition} */
var InputSourcePosition;
/** @type {InputSourceQuat} */
var InputSourceQuat;
/** @type {InputSourceStick} */
var InputSourceStick;
/** @type {InputSourceTouch} */
var InputSourceTouch;
/** @type {InputState} */
var InputState;
/** @type {inspector} */
var inspector;
/** @type {INST_JOINT_ANIM_INFO} */
var INST_JOINT_ANIM_INFO;
/** @type {INST_MAT_WORLD} */
var INST_MAT_WORLD;
/** @type {INST_SH} */
var INST_SH;
/** @type {InstancedBuffer} */
var InstancedBuffer;
/** @type {InstanceMaterialType} */
var InstanceMaterialType;
/** @type {instancePool} */
var instancePool;
/** @type {instantiate} */
var instantiate;
/** @type {instantiatePoseGraph} */
var instantiatePoseGraph;
/** @type {INT_BITS} */
var INT_BITS;
/** @type {INT_MAX} */
var INT_MAX;
/** @type {INT_MIN} */
var INT_MIN;
/** @type {integer} */
var integer;
/** @type {IntensitySpecification} */
var IntensitySpecification;
/** @type {InteractiveState} */
var InteractiveState;
/** @type {intersect} */
var intersect;
/** @type {Intersection2D} */
var Intersection2D;
/** @type {INVALID_ID} */
var INVALID_ID;
/** @type {InvalidCCONError} */
var InvalidCCONError;
/** @type {InvalidTransitionError} */
var InvalidTransitionError;
/** @type {invokeComponentMethodsEngagedInAnimationEvent} */
var invokeComponentMethodsEngagedInAnimationEvent;
/** @type {invokeOnEnable} */
var invokeOnEnable;
/** @type {IOS} */
var IOS;
/** @type {isIgnorableWeight} */
var isIgnorableWeight;
/** @type {isNormalized} */
var isNormalized;
/** @type {isPaddedMatrix} */
var isPaddedMatrix;
/** @type {isSampler} */
var isSampler;
/** @type {isTrsPropertyName} */
var isTrsPropertyName;
/** @type {IWebGL2BlitManager} */
var IWebGL2BlitManager;
/** @type {IWebGLBlitManager} */
var IWebGLBlitManager;
/** @type {IWebGPUBlitManager} */
var IWebGPUBlitManager;
/** @type {JavaScript} */
var JavaScript;
/** @type {JOINT_UNIFORM_CAPACITY} */
var JOINT_UNIFORM_CAPACITY;
/** @type {Joint2D} */
var Joint2D;
/** @type {JointAnimationInfo} */
var JointAnimationInfo;
/** @type {JointTexturePool} */
var JointTexturePool;
/** @type {jointTextureSamplerInfo} */
var jointTextureSamplerInfo;
/** @type {js} */
var js;
/** @type {JSB} */
var JSB;
/** @type {JsonAsset} */
var JsonAsset;
/** @type {KeyboardInputSource} */
var KeyboardInputSource;
/** @type {KeyboardReturnType} */
var KeyboardReturnType;
/** @type {KeyCode} */
var KeyCode;
/** @type {KeyEventType} */
var KeyEventType;
/** @type {Keyframe} */
var Keyframe;
/** @type {KeyframeCurve} */
var KeyframeCurve;
/** @type {KeySharedQuatCurves} */
var KeySharedQuatCurves;
/** @type {KeySharedRealCurves} */
var KeySharedRealCurves;
/** @type {Label} */
var Label;
/** @type {labelAssembler} */
var labelAssembler;
/** @type {LabelAtlas} */
var LabelAtlas;
/** @type {LabelComponent} */
var LabelComponent;
/** @type {LabelOutline} */
var LabelOutline;
/** @type {LabelOutlineComponent} */
var LabelOutlineComponent;
/** @type {LabelShadow} */
var LabelShadow;
/** @type {Language} */
var Language;
/** @type {Layer} */
var Layer;
/** @type {LayerBlending} */
var LayerBlending;
/** @type {Layers} */
var Layers;
/** @type {Layout} */
var Layout;
/** @type {LayoutAxisDirection} */
var LayoutAxisDirection;
/** @type {LayoutChangeFlag} */
var LayoutChangeFlag;
/** @type {LayoutComponent} */
var LayoutComponent;
/** @type {LayoutConstraint} */
var LayoutConstraint;
/** @type {LayoutGraph} */
var LayoutGraph;
/** @type {LayoutGraphComponent} */
var LayoutGraphComponent;
/** @type {LayoutGraphData} */
var LayoutGraphData;
/** @type {LayoutGraphDataComponent} */
var LayoutGraphDataComponent;
/** @type {LayoutGraphDataValue} */
var LayoutGraphDataValue;
/** @type {LayoutGraphDataVertex} */
var LayoutGraphDataVertex;
/** @type {LayoutGraphInfo} */
var LayoutGraphInfo;
/** @type {LayoutGraphObjectPool} */
var LayoutGraphObjectPool;
/** @type {LayoutGraphValue} */
var LayoutGraphValue;
/** @type {LayoutGraphVertex} */
var LayoutGraphVertex;
/** @type {LayoutHorizontalDirection} */
var LayoutHorizontalDirection;
/** @type {LayoutResizeMode} */
var LayoutResizeMode;
/** @type {LayoutType} */
var LayoutType;
/** @type {LayoutVerticalDirection} */
var LayoutVerticalDirection;
/** @type {LegacyBlendStateBuffer} */
var LegacyBlendStateBuffer;
/** @type {legacyCC} */
var legacyCC;
/** @type {LegacyRenderMode} */
var LegacyRenderMode;
/** @type {letter} */
var letter;
/** @type {LetterAtlas} */
var LetterAtlas;
/** @type {LetterFont} */
var LetterFont;
/** @type {LetterRenderTexture} */
var LetterRenderTexture;
/** @type {LifeCycleInvoker} */
var LifeCycleInvoker;
/** @type {Light} */
var Light;
/** @type {LightComponent} */
var LightComponent;
/** @type {LightInfo} */
var LightInfo;
/** @type {LightingMode} */
var LightingMode;
/** @type {LightingStage} */
var LightingStage;
/** @type {LightProbeGroup} */
var LightProbeGroup;
/** @type {LightProbeInfo} */
var LightProbeInfo;
/** @type {LightProbes} */
var LightProbes;
/** @type {LightProbeSampler} */
var LightProbeSampler;
/** @type {LightProbesData} */
var LightProbesData;
/** @type {LightResource} */
var LightResource;
/** @type {LightType} */
var LightType;
/** @type {Line} */
var Line;
/** @type {LinearBufferAccessor} */
var LinearBufferAccessor;
/** @type {LinearDriverSettings} */
var LinearDriverSettings;
/** @type {LinearLimitSettings} */
var LinearLimitSettings;
/** @type {linearToSrgb8Bit} */
var linearToSrgb8Bit;
/** @type {LineCap} */
var LineCap;
/** @type {LineComponent} */
var LineComponent;
/** @type {LineJoin} */
var LineJoin;
/** @type {LineModel} */
var LineModel;
/** @type {LINUX} */
var LINUX;
/** @type {LOAD_BOX2D_MANUALLY} */
var LOAD_BOX2D_MANUALLY;
/** @type {LOAD_BULLET_MANUALLY} */
var LOAD_BULLET_MANUALLY;
/** @type {LOAD_PHYSX_MANUALLY} */
var LOAD_PHYSX_MANUALLY;
/** @type {LOAD_SPINE_MANUALLY} */
var LOAD_SPINE_MANUALLY;
/** @type {loadAudioPlayer} */
var loadAudioPlayer;
/** @type {loader} */
var loader;
/** @type {LoadOp} */
var LoadOp;
/** @type {loadWasmModuleBox2D} */
var loadWasmModuleBox2D;
/** @type {loadWasmModuleBullet} */
var loadWasmModuleBullet;
/** @type {loadWasmModulePhysX} */
var loadWasmModulePhysX;
/** @type {loadWasmModuleSpine} */
var loadWasmModuleSpine;
/** @type {localDescriptorSetLayout} */
var localDescriptorSetLayout;
/** @type {LOD} */
var LOD;
/** @type {LODData} */
var LODData;
/** @type {LODGroup} */
var LODGroup;
/** @type {LODGroupEditorUtility} */
var LODGroupEditorUtility;
/** @type {LRUCache} */
var LRUCache;
/** @type {MAC} */
var MAC;
/** @type {macro} */
var macro;
/** @type {MainFlow} */
var MainFlow;
/** @type {ManagedBuffer} */
var ManagedBuffer;
/** @type {ManagedResource} */
var ManagedResource;
/** @type {ManagedTexture} */
var ManagedTexture;
/** @type {markAsWarning} */
var markAsWarning;
/** @type {MarkerInfo} */
var MarkerInfo;
/** @type {Mask} */
var Mask;
/** @type {MaskComponent} */
var MaskComponent;
/** @type {maskIfEmpty} */
var maskIfEmpty;
/** @type {MaskMode} */
var MaskMode;
/** @type {MaskType} */
var MaskType;
/** @type {Mat3} */
var Mat3;
/** @type {Mat4} */
var Mat4;
/** @type {Material} */
var Material;
/** @type {MaterialConfig} */
var MaterialConfig;
/** @type {MaterialInstance} */
var MaterialInstance;
/** @type {math} */
var math;
/** @type {MATH_FLOAT_ARRAY} */
var MATH_FLOAT_ARRAY;
/** @type {MathBase} */
var MathBase;
/** @type {MathType} */
var MathType;
/** @type {Matrix} */
var Matrix;
/** @type {MAX_ANIMATION_LAYER} */
var MAX_ANIMATION_LAYER;
/** @type {MAX_BLOOM_FILTER_PASS_NUM} */
var MAX_BLOOM_FILTER_PASS_NUM;
/** @type {MAX_TRANSITIONS_PER_FRAME} */
var MAX_TRANSITIONS_PER_FRAME;
/** @type {memop} */
var memop;
/** @type {MemoryAccessBit} */
var MemoryAccessBit;
/** @type {MemoryStatus} */
var MemoryStatus;
/** @type {MemoryUsageBit} */
var MemoryUsageBit;
/** @type {menu} */
var menu;
/** @type {Mesh} */
var Mesh;
/** @type {MeshBuffer} */
var MeshBuffer;
/** @type {MeshCollider} */
var MeshCollider;
/** @type {MeshColliderComponent} */
var MeshColliderComponent;
/** @type {MeshoptDecoder} */
var MeshoptDecoder;
/** @type {MeshRenderData} */
var MeshRenderData;
/** @type {MeshRenderer} */
var MeshRenderer;
/** @type {MeshUtils} */
var MeshUtils;
/** @type {MIDDLE_RATIO} */
var MIDDLE_RATIO;
/** @type {MIGU} */
var MIGU;
/** @type {minigame} */
var minigame;
/** @type {MINIMUM_JOINT_TEXTURE_SIZE} */
var MINIMUM_JOINT_TEXTURE_SIZE;
/** @type {MipmapMode} */
var MipmapMode;
/** @type {misc} */
var misc;
/** @type {MissingScript} */
var MissingScript;
/** @type {MobilityMode} */
var MobilityMode;
/** @type {Mode} */
var Mode;
/** @type {Model} */
var Model;
/** @type {MODEL_ALWAYS_MASK} */
var MODEL_ALWAYS_MASK;
/** @type {ModelComponent} */
var ModelComponent;
/** @type {ModelLocalBindings} */
var ModelLocalBindings;
/** @type {ModelRenderer} */
var ModelRenderer;
/** @type {ModelType} */
var ModelType;
/** @type {MorphModel} */
var MorphModel;
/** @type {MorphWeightsAllValueProxy} */
var MorphWeightsAllValueProxy;
/** @type {MorphWeightsValueProxy} */
var MorphWeightsValueProxy;
/** @type {MorphWeightValueProxy} */
var MorphWeightValueProxy;
/** @type {Motion} */
var Motion;
/** @type {MotionPreviewer} */
var MotionPreviewer;
/** @type {MotionState} */
var MotionState;
/** @type {MotionStreak} */
var MotionStreak;
/** @type {MotionStreakAssemblerManager} */
var MotionStreakAssemblerManager;
/** @type {MotionSyncInfo} */
var MotionSyncInfo;
/** @type {MountedChildrenInfo} */
var MountedChildrenInfo;
/** @type {MountedComponentsInfo} */
var MountedComponentsInfo;
/** @type {MouseInputSource} */
var MouseInputSource;
/** @type {MouseJoint2D} */
var MouseJoint2D;
/** @type {MovePair} */
var MovePair;
/** @type {MovePass} */
var MovePass;
/** @type {multiline} */
var multiline;
/** @type {murmurhash2_32_gc} */
var murmurhash2_32_gc;
/** @type {MutableForwardIterator} */
var MutableForwardIterator;
/** @type {NATIVE} */
var NATIVE;
/** @type {NATIVE_CODE_BUNDLE_MODE} */
var NATIVE_CODE_BUNDLE_MODE;
/** @type {NativeBatcher2d} */
var NativeBatcher2d;
/** @type {NativeBufferAllocator} */
var NativeBufferAllocator;
/** @type {NativeBufferPool} */
var NativeBufferPool;
/** @type {NativeCodeBundleMode} */
var NativeCodeBundleMode;
/** @type {nativeDependMap} */
var nativeDependMap;
/** @type {NativeObjectPool} */
var NativeObjectPool;
/** @type {NativeRenderDrawInfo} */
var NativeRenderDrawInfo;
/** @type {NativeRenderEntity} */
var NativeRenderEntity;
/** @type {NativeStencilManager} */
var NativeStencilManager;
/** @type {NativeUIMeshBuffer} */
var NativeUIMeshBuffer;
/** @type {NativeUIModelProxy} */
var NativeUIModelProxy;
/** @type {NET_MODE} */
var NET_MODE;
/** @type {NetworkType} */
var NetworkType;
/** @type {Node} */
var Node;
/** @type {NodeActivator} */
var NodeActivator;
/** @type {NodeEventProcessor} */
var NodeEventProcessor;
/** @type {NodeEventType} */
var NodeEventType;
/** @type {nodePolyfill} */
var nodePolyfill;
/** @type {NodePool} */
var NodePool;
/** @type {NodeSpace} */
var NodeSpace;
/** @type {NodeUIProperties} */
var NodeUIProperties;
/** @type {NodeView} */
var NodeView;
/** @type {NoiseModule} */
var NoiseModule;
/** @type {normalizedFollowTag} */
var normalizedFollowTag;
/** @type {NOT_PACK_PHYSX_LIBS} */
var NOT_PACK_PHYSX_LIBS;
/** @type {notepackDecode} */
var notepackDecode;
/** @type {notepackEncode} */
var notepackEncode;
/** @type {nt2lm} */
var nt2lm;
/** @type {NULL_HANDLE} */
var NULL_HANDLE;
/** @type {OBB} */
var OBB;
/** @type {ObjectCollisionMatrix} */
var ObjectCollisionMatrix;
/** @type {ObjectCurve} */
var ObjectCurve;
/** @type {ObjectPool} */
var ObjectPool;
/** @type {ObjectTrack} */
var ObjectTrack;
/** @type {ObjectType} */
var ObjectType;
/** @type {Octree} */
var Octree;
/** @type {OctreeInfo} */
var OctreeInfo;
/** @type {Offset} */
var Offset;
/** @type {OHOS} */
var OHOS;
/** @type {onAfterDeserializedTag} */
var onAfterDeserializedTag;
/** @type {OneOffInvoker} */
var OneOffInvoker;
/** @type {OneShotAudio} */
var OneShotAudio;
/** @type {OneShotAudioDOM} */
var OneShotAudioDOM;
/** @type {OneShotAudioMinigame} */
var OneShotAudioMinigame;
/** @type {OneShotAudioWeb} */
var OneShotAudioWeb;
/** @type {onLoadedInvokedMap} */
var onLoadedInvokedMap;
/** @type {OPEN_HARMONY} */
var OPEN_HARMONY;
/** @type {OperationOnFreestandingNodeError} */
var OperationOnFreestandingNodeError;
/** @type {OPPO} */
var OPPO;
/** @type {OptimizedCurve} */
var OptimizedCurve;
/** @type {OptimizedKey} */
var OptimizedKey;
/** @type {Orientation} */
var Orientation;
/** @type {OS} */
var OS;
/** @type {OutE} */
var OutE;
/** @type {OutEI} */
var OutEI;
/** @type {OutEP} */
var OutEP;
/** @type {OutEPI} */
var OutEPI;
/** @type {outgoingsSymbol} */
var outgoingsSymbol;
/** @type {Overflow} */
var Overflow;
/** @type {override} */
var override;
/** @type {overrideSpineDefine} */
var overrideSpineDefine;
/** @type {ownerSymbol} */
var ownerSymbol;
/** @type {Pacer} */
var Pacer;
/** @type {packGradientRange} */
var packGradientRange;
/** @type {PackManager} */
var PackManager;
/** @type {packRGBE} */
var packRGBE;
/** @type {PageView} */
var PageView;
/** @type {PageViewComponent} */
var PageViewComponent;
/** @type {PageViewIndicator} */
var PageViewIndicator;
/** @type {PageViewIndicatorComponent} */
var PageViewIndicatorComponent;
/** @type {parallel} */
var parallel;
/** @type {ParameterType} */
var ParameterType;
/** @type {parsed} */
var parsed;
/** @type {Parser} */
var Parser;
/** @type {Particle} */
var Particle;
/** @type {PARTICLE_MODULE_NAME} */
var PARTICLE_MODULE_NAME;
/** @type {PARTICLE_MODULE_ORDER} */
var PARTICLE_MODULE_ORDER;
/** @type {PARTICLE_MODULE_PROPERTY} */
var PARTICLE_MODULE_PROPERTY;
/** @type {Particle2DAssembler} */
var Particle2DAssembler;
/** @type {ParticleAlignmentSpace} */
var ParticleAlignmentSpace;
/** @type {ParticleArcMode} */
var ParticleArcMode;
/** @type {ParticleAsset} */
var ParticleAsset;
/** @type {ParticleCuller} */
var ParticleCuller;
/** @type {ParticleCullingMode} */
var ParticleCullingMode;
/** @type {ParticleEmitLocation} */
var ParticleEmitLocation;
/** @type {particleEmitZAxis} */
var particleEmitZAxis;
/** @type {ParticleModuleBase} */
var ParticleModuleBase;
/** @type {ParticleModuleRandSeed} */
var ParticleModuleRandSeed;
/** @type {ParticleNoise} */
var ParticleNoise;
/** @type {ParticleRenderMode} */
var ParticleRenderMode;
/** @type {ParticleShapeType} */
var ParticleShapeType;
/** @type {ParticleSpace} */
var ParticleSpace;
/** @type {ParticleSystem} */
var ParticleSystem;
/** @type {ParticleSystem2D} */
var ParticleSystem2D;
/** @type {ParticleSystem2DAssembler} */
var ParticleSystem2DAssembler;
/** @type {ParticleSystemComponent} */
var ParticleSystemComponent;
/** @type {ParticleSystemRendererBase} */
var ParticleSystemRendererBase;
/** @type {ParticleTextureMode} */
var ParticleTextureMode;
/** @type {ParticleTrailMode} */
var ParticleTrailMode;
/** @type {ParticleUtils} */
var ParticleUtils;
/** @type {partition} */
var partition;
/** @type {Pass} */
var Pass;
/** @type {passContext} */
var passContext;
/** @type {PassInstance} */
var PassInstance;
/** @type {passParams} */
var passParams;
/** @type {PassPool} */
var PassPool;
/** @type {PassStage} */
var PassStage;
/** @type {PassStatesEditor} */
var PassStatesEditor;
/** @type {PassType} */
var PassType;
/** @type {PassView} */
var PassView;
/** @type {path} */
var path;
/** @type {PCFType} */
var PCFType;
/** @type {PerfCounter} */
var PerfCounter;
/** @type {PersistentBuffer} */
var PersistentBuffer;
/** @type {PersistentRenderPassAndFramebuffer} */
var PersistentRenderPassAndFramebuffer;
/** @type {PersistentTexture} */
var PersistentTexture;
/** @type {PhotometricTerm} */
var PhotometricTerm;
/** @type {PhysicMaterial} */
var PhysicMaterial;
/** @type {physics} */
var physics;
/** @type {PHYSICS_2D_PTM_RATIO} */
var PHYSICS_2D_PTM_RATIO;
/** @type {Physics2DManifoldType} */
var Physics2DManifoldType;
/** @type {Physics2DUtils} */
var Physics2DUtils;
/** @type {PhysicsAABBQueryCallback} */
var PhysicsAABBQueryCallback;
/** @type {PhysicsContact} */
var PhysicsContact;
/** @type {PhysicsContactListener} */
var PhysicsContactListener;
/** @type {PhysicsDebugDraw} */
var PhysicsDebugDraw;
/** @type {PhysicsGroup} */
var PhysicsGroup;
/** @type {PhysicsGroup2D} */
var PhysicsGroup2D;
/** @type {PhysicsLineStripCastResult} */
var PhysicsLineStripCastResult;
/** @type {PhysicsMaterial} */
var PhysicsMaterial;
/** @type {PhysicsRayCastCallback} */
var PhysicsRayCastCallback;
/** @type {PhysicsRayResult} */
var PhysicsRayResult;
/** @type {PhysicsSystem} */
var PhysicsSystem;
/** @type {PhysicsSystem2D} */
var PhysicsSystem2D;
/** @type {PhysXBoxCharacterController} */
var PhysXBoxCharacterController;
/** @type {PhysXBoxShape} */
var PhysXBoxShape;
/** @type {PhysXCapsuleCharacterController} */
var PhysXCapsuleCharacterController;
/** @type {PhysXCapsuleShape} */
var PhysXCapsuleShape;
/** @type {PhysXCharacterController} */
var PhysXCharacterController;
/** @type {PhysXConeShape} */
var PhysXConeShape;
/** @type {PhysXConfigurableJoint} */
var PhysXConfigurableJoint;
/** @type {PhysXContactEquation} */
var PhysXContactEquation;
/** @type {PhysXCylinderShape} */
var PhysXCylinderShape;
/** @type {PhysXFixedJoint} */
var PhysXFixedJoint;
/** @type {PhysXInstance} */
var PhysXInstance;
/** @type {PhysXJoint} */
var PhysXJoint;
/** @type {PhysXPlaneShape} */
var PhysXPlaneShape;
/** @type {PhysXRevoluteJoint} */
var PhysXRevoluteJoint;
/** @type {PhysXRigidBody} */
var PhysXRigidBody;
/** @type {PhysXShape} */
var PhysXShape;
/** @type {PhysXSharedBody} */
var PhysXSharedBody;
/** @type {PhysXSphereShape} */
var PhysXSphereShape;
/** @type {PhysXSphericalJoint} */
var PhysXSphericalJoint;
/** @type {PhysXTerrainShape} */
var PhysXTerrainShape;
/** @type {PhysXTrimeshShape} */
var PhysXTrimeshShape;
/** @type {PhysXWorld} */
var PhysXWorld;
/** @type {pipeline} */
var pipeline;
/** @type {PIPELINE_FLOW_FORWARD} */
var PIPELINE_FLOW_FORWARD;
/** @type {PIPELINE_FLOW_MAIN} */
var PIPELINE_FLOW_MAIN;
/** @type {PIPELINE_FLOW_SHADOW} */
var PIPELINE_FLOW_SHADOW;
/** @type {PIPELINE_FLOW_SMAA} */
var PIPELINE_FLOW_SMAA;
/** @type {PIPELINE_FLOW_TONEMAP} */
var PIPELINE_FLOW_TONEMAP;
/** @type {PipelineBindPoint} */
var PipelineBindPoint;
/** @type {PipelineCapabilities} */
var PipelineCapabilities;
/** @type {PipelineEventProcessor} */
var PipelineEventProcessor;
/** @type {PipelineEventType} */
var PipelineEventType;
/** @type {PipelineGlobalBindings} */
var PipelineGlobalBindings;
/** @type {PipelineInputAssemblerData} */
var PipelineInputAssemblerData;
/** @type {PipelineLayout} */
var PipelineLayout;
/** @type {PipelineLayoutData} */
var PipelineLayoutData;
/** @type {PipelineLayoutInfo} */
var PipelineLayoutInfo;
/** @type {PipelineRenderData} */
var PipelineRenderData;
/** @type {PipelineSceneData} */
var PipelineSceneData;
/** @type {PipelineState} */
var PipelineState;
/** @type {PipelineStateInfo} */
var PipelineStateInfo;
/** @type {PipelineStateManager} */
var PipelineStateManager;
/** @type {PipelineStatistics} */
var PipelineStatistics;
/** @type {PipelineType} */
var PipelineType;
/** @type {PipelineUBO} */
var PipelineUBO;
/** @type {PixelFormat} */
var PixelFormat;
/** @type {PlaceMethod} */
var PlaceMethod;
/** @type {PlainVariable} */
var PlainVariable;
/** @type {PlanarShadowQueue} */
var PlanarShadowQueue;
/** @type {plane} */
var plane;
/** @type {PlaneCollider} */
var PlaneCollider;
/** @type {Platform} */
var Platform;
/** @type {Playable} */
var Playable;
/** @type {playOnFocus} */
var playOnFocus;
/** @type {PNGReader} */
var PNGReader;
/** @type {Point} */
var Point;
/** @type {pointerEventDispatcher} */
var pointerEventDispatcher;
/** @type {PointFlags} */
var PointFlags;
/** @type {PointLight} */
var PointLight;
/** @type {PointToPointConstraint} */
var PointToPointConstraint;
/** @type {PolarSpaceGradientBandInterpolator2D} */
var PolarSpaceGradientBandInterpolator2D;
/** @type {PolygonBoundingBoxData} */
var PolygonBoundingBoxData;
/** @type {PolygonCollider2D} */
var PolygonCollider2D;
/** @type {PolygonMode} */
var PolygonMode;
/** @type {PolynomialSolver} */
var PolynomialSolver;
/** @type {Pool} */
var Pool;
/** @type {PoolType} */
var PoolType;
/** @type {Pose} */
var Pose;
/** @type {POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE} */
var POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE;
/** @type {POSE_GRAPH_NODE_MENU_PREFIX_IK} */
var POSE_GRAPH_NODE_MENU_PREFIX_IK;
/** @type {POSE_GRAPH_NODE_MENU_PREFIX_POSE} */
var POSE_GRAPH_NODE_MENU_PREFIX_POSE;
/** @type {POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND} */
var POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND;
/** @type {PoseGraph} */
var PoseGraph;
/** @type {poseGraphCreateNodeFactory} */
var poseGraphCreateNodeFactory;
/** @type {PoseGraphNode} */
var PoseGraphNode;
/** @type {poseGraphNodeAppearance} */
var poseGraphNodeAppearance;
/** @type {poseGraphNodeCategory} */
var poseGraphNodeCategory;
/** @type {poseGraphNodeHide} */
var poseGraphNodeHide;
/** @type {PoseGraphNodeShell} */
var PoseGraphNodeShell;
/** @type {poseGraphOp} */
var poseGraphOp;
/** @type {PoseGraphOutputNode} */
var PoseGraphOutputNode;
/** @type {PoseGraphStash} */
var PoseGraphStash;
/** @type {PoseGraphType} */
var PoseGraphType;
/** @type {PoseHeapAllocator} */
var PoseHeapAllocator;
/** @type {PoseNode} */
var PoseNode;
/** @type {PoseNodeAdditivelyBlend} */
var PoseNodeAdditivelyBlend;
/** @type {PoseNodeApplyTransform} */
var PoseNodeApplyTransform;
/** @type {PoseNodeBlendInProportion} */
var PoseNodeBlendInProportion;
/** @type {PoseNodeBlendTwoPose} */
var PoseNodeBlendTwoPose;
/** @type {PoseNodeBlendTwoPoseBase} */
var PoseNodeBlendTwoPoseBase;
/** @type {PoseNodeChoosePoseBase} */
var PoseNodeChoosePoseBase;
/** @type {PoseNodeChoosePoseByBoolean} */
var PoseNodeChoosePoseByBoolean;
/** @type {PoseNodeChoosePoseByIndex} */
var PoseNodeChoosePoseByIndex;
/** @type {PoseNodeCopyTransform} */
var PoseNodeCopyTransform;
/** @type {PoseNodeFilteringBlend} */
var PoseNodeFilteringBlend;
/** @type {PoseNodeModifyPoseBase} */
var PoseNodeModifyPoseBase;
/** @type {PoseNodePlayMotion} */
var PoseNodePlayMotion;
/** @type {PoseNodeSampleMotion} */
var PoseNodeSampleMotion;
/** @type {PoseNodeSetAuxiliaryCurve} */
var PoseNodeSetAuxiliaryCurve;
/** @type {PoseNodeStateMachine} */
var PoseNodeStateMachine;
/** @type {PoseNodeTwoBoneIKSolver} */
var PoseNodeTwoBoneIKSolver;
/** @type {PoseNodeUseStashedPose} */
var PoseNodeUseStashedPose;
/** @type {PoseOutput} */
var PoseOutput;
/** @type {PoseStackAllocator} */
var PoseStackAllocator;
/** @type {PoseTransformSpace} */
var PoseTransformSpace;
/** @type {PoseTransformSpaceRequirement} */
var PoseTransformSpaceRequirement;
/** @type {PositionType} */
var PositionType;
/** @type {PostFinalPass} */
var PostFinalPass;
/** @type {PostProcess} */
var PostProcess;
/** @type {PostProcessBuilder} */
var PostProcessBuilder;
/** @type {PostProcessSetting} */
var PostProcessSetting;
/** @type {PostProcessStage} */
var PostProcessStage;
/** @type {PostSettings} */
var PostSettings;
/** @type {PostSettingsInfo} */
var PostSettingsInfo;
/** @type {Prefab} */
var Prefab;
/** @type {PrefabInfo} */
var PrefabInfo;
/** @type {PrefabInstance} */
var PrefabInstance;
/** @type {PrefabLink} */
var PrefabLink;
/** @type {presets} */
var presets;
/** @type {preTransforms} */
var preTransforms;
/** @type {PREVIEW} */
var PREVIEW;
/** @type {Primitive} */
var Primitive;
/** @type {PrimitiveMode} */
var PrimitiveMode;
/** @type {primitives} */
var primitives;
/** @type {PrimitiveType} */
var PrimitiveType;
/** @type {PrintVisitor} */
var PrintVisitor;
/** @type {PrivateNode} */
var PrivateNode;
/** @type {ProbeClearFlag} */
var ProbeClearFlag;
/** @type {ProbeHelperQueue} */
var ProbeHelperQueue;
/** @type {ProbeResolution} */
var ProbeResolution;
/** @type {ProbeType} */
var ProbeType;
/** @type {ProceduralPoseState} */
var ProceduralPoseState;
/** @type {ProceduralPoseTransition} */
var ProceduralPoseTransition;
/** @type {profiler} */
var profiler;
/** @type {ProgramGroup} */
var ProgramGroup;
/** @type {ProgramInfo} */
var ProgramInfo;
/** @type {programLib} */
var programLib;
/** @type {ProgressBar} */
var ProgressBar;
/** @type {ProgressBarComponent} */
var ProgressBarComponent;
/** @type {promiseForWebGPUInstantiation} */
var promiseForWebGPUInstantiation;
/** @type {Property} */
var Property;
/** @type {PropertyOverrideInfo} */
var PropertyOverrideInfo;
/** @type {PropertyStashInternalFlag} */
var PropertyStashInternalFlag;
/** @type {provide} */
var provide;
/** @type {PureValueNode} */
var PureValueNode;
/** @type {PVData} */
var PVData;
/** @type {PVNodeGetVariableBase} */
var PVNodeGetVariableBase;
/** @type {PVNodeGetVariableBoolean} */
var PVNodeGetVariableBoolean;
/** @type {PVNodeGetVariableFloat} */
var PVNodeGetVariableFloat;
/** @type {PVNodeGetVariableInteger} */
var PVNodeGetVariableInteger;
/** @type {PVNodeGetVariableQuat} */
var PVNodeGetVariableQuat;
/** @type {PVNodeGetVariableVec3} */
var PVNodeGetVariableVec3;
/** @type {PX} */
var PX;
/** @type {PxContactPairFlag} */
var PxContactPairFlag;
/** @type {PxHitFlag} */
var PxHitFlag;
/** @type {PxPairFlag} */
var PxPairFlag;
/** @type {PxQueryFlag} */
var PxQueryFlag;
/** @type {PxTriggerPairFlag} */
var PxTriggerPairFlag;
/** @type {quad} */
var quad;
/** @type {quadOutIn} */
var quadOutIn;
/** @type {QuadRenderData} */
var QuadRenderData;
/** @type {quartOutIn} */
var quartOutIn;
/** @type {Quat} */
var Quat;
/** @type {QuatCurve} */
var QuatCurve;
/** @type {QuatInterpolationMode} */
var QuatInterpolationMode;
/** @type {QuatTrack} */
var QuatTrack;
/** @type {QuatTrackEval} */
var QuatTrackEval;
/** @type {QuatVariable} */
var QuatVariable;
/** @type {QueryPoolInfo} */
var QueryPoolInfo;
/** @type {QueryType} */
var QueryType;
/** @type {Queue} */
var Queue;
/** @type {QueueHint} */
var QueueHint;
/** @type {QueueInfo} */
var QueueInfo;
/** @type {QueueType} */
var QueueType;
/** @type {quintOutIn} */
var quintOutIn;
/** @type {radialFilled} */
var radialFilled;
/** @type {radian} */
var radian;
/** @type {radioGroup} */
var radioGroup;
/** @type {range} */
var range;
/** @type {RangedDirectionalLight} */
var RangedDirectionalLight;
/** @type {rangeMax} */
var rangeMax;
/** @type {rangeMin} */
var rangeMin;
/** @type {rangeStep} */
var rangeStep;
/** @type {RasterizerState} */
var RasterizerState;
/** @type {RasterizerStateEditor} */
var RasterizerStateEditor;
/** @type {RasterPass} */
var RasterPass;
/** @type {RasterSubpass} */
var RasterSubpass;
/** @type {RasterView} */
var RasterView;
/** @type {RatioSampler} */
var RatioSampler;
/** @type {Ray} */
var Ray;
/** @type {RaytracePass} */
var RaytracePass;
/** @type {readMesh} */
var readMesh;
/** @type {readOnly} */
var readOnly;
/** @type {READY_STATE} */
var READY_STATE;
/** @type {RealArrayTrack} */
var RealArrayTrack;
/** @type {RealArrayTrackEval} */
var RealArrayTrackEval;
/** @type {RealCurve} */
var RealCurve;
/** @type {RealInterpolationMode} */
var RealInterpolationMode;
/** @type {RealTrack} */
var RealTrack;
/** @type {Rect} */
var Rect;
/** @type {RectangleBoundingBoxData} */
var RectangleBoundingBoxData;
/** @type {RecyclePool} */
var RecyclePool;
/** @type {ReferenceGraphView} */
var ReferenceGraphView;
/** @type {references} */
var references;
/** @type {ReflectionProbe} */
var ReflectionProbe;
/** @type {ReflectionProbeFlow} */
var ReflectionProbeFlow;
/** @type {ReflectionProbeManager} */
var ReflectionProbeManager;
/** @type {ReflectionProbeStage} */
var ReflectionProbeStage;
/** @type {ReflectionProbeType} */
var ReflectionProbeType;
/** @type {regeneratorRuntime} */
var regeneratorRuntime;
/** @type {RelativeJoint2D} */
var RelativeJoint2D;
/** @type {ReleaseManager} */
var ReleaseManager;
/** @type {removeEmbeddedPlayerTag} */
var removeEmbeddedPlayerTag;
/** @type {removeProperty} */
var removeProperty;
/** @type {RemoveSelf} */
var RemoveSelf;
/** @type {renameObjectProperty} */
var renameObjectProperty;
/** @type {Render2dPool} */
var Render2dPool;
/** @type {Render2dView} */
var Render2dView;
/** @type {Renderable2D} */
var Renderable2D;
/** @type {RenderableComponent} */
var RenderableComponent;
/** @type {RenderAdditiveLightQueue} */
var RenderAdditiveLightQueue;
/** @type {RenderCommonObjectPool} */
var RenderCommonObjectPool;
/** @type {RenderComponent} */
var RenderComponent;
/** @type {RenderData} */
var RenderData;
/** @type {RenderDrawInfo} */
var RenderDrawInfo;
/** @type {RenderDrawInfoType} */
var RenderDrawInfoType;
/** @type {RenderDrawQueue} */
var RenderDrawQueue;
/** @type {RenderEntity} */
var RenderEntity;
/** @type {RenderEntityFillColorType} */
var RenderEntityFillColorType;
/** @type {RenderEntityType} */
var RenderEntityType;
/** @type {Renderer} */
var Renderer;
/** @type {RenderFlow} */
var RenderFlow;
/** @type {RenderFlowTag} */
var RenderFlowTag;
/** @type {RenderGraph} */
var RenderGraph;
/** @type {RenderGraphComponent} */
var RenderGraphComponent;
/** @type {RenderGraphObjectPool} */
var RenderGraphObjectPool;
/** @type {RenderGraphValue} */
var RenderGraphValue;
/** @type {RenderGraphVertex} */
var RenderGraphVertex;
/** @type {rendering} */
var rendering;
/** @type {RenderingSubMesh} */
var RenderingSubMesh;
/** @type {RenderInstancedQueue} */
var RenderInstancedQueue;
/** @type {RenderInstancingQueue} */
var RenderInstancingQueue;
/** @type {RenderOrder} */
var RenderOrder;
/** @type {RenderPass} */
var RenderPass;
/** @type {RenderPassDesc} */
var RenderPassDesc;
/** @type {RenderPassInfo} */
var RenderPassInfo;
/** @type {RenderPassMergeInfo} */
var RenderPassMergeInfo;
/** @type {RenderPassStage} */
var RenderPassStage;
/** @type {RenderPassType} */
var RenderPassType;
/** @type {RenderPhase} */
var RenderPhase;
/** @type {RenderPhaseData} */
var RenderPhaseData;
/** @type {RenderPipeline} */
var RenderPipeline;
/** @type {RenderPriority} */
var RenderPriority;
/** @type {RenderQueue} */
var RenderQueue;
/** @type {RenderQueueDesc} */
var RenderQueueDesc;
/** @type {RenderQueueQuery} */
var RenderQueueQuery;
/** @type {RenderQueueSortMode} */
var RenderQueueSortMode;
/** @type {RenderReflectionProbeQueue} */
var RenderReflectionProbeQueue;
/** @type {RenderRoot2D} */
var RenderRoot2D;
/** @type {RenderScene} */
var RenderScene;
/** @type {RenderShadowMapBatchedQueue} */
var RenderShadowMapBatchedQueue;
/** @type {RenderStage} */
var RenderStage;
/** @type {RenderStageData} */
var RenderStageData;
/** @type {RenderSwapchain} */
var RenderSwapchain;
/** @type {RenderTexture} */
var RenderTexture;
/** @type {RenderTextureConfig} */
var RenderTextureConfig;
/** @type {RenderTextureDesc} */
var RenderTextureDesc;
/** @type {RenderType} */
var RenderType;
/** @type {RenderVisitor} */
var RenderVisitor;
/** @type {RenderWindow} */
var RenderWindow;
/** @type {Repeat} */
var Repeat;
/** @type {RepeatForever} */
var RepeatForever;
/** @type {replaceProperty} */
var replaceProperty;
/** @type {reportMissingClass} */
var reportMissingClass;
/** @type {RequestType} */
var RequestType;
/** @type {requireComponent} */
var requireComponent;
/** @type {ResolutionPolicy} */
var ResolutionPolicy;
/** @type {ResolveFlags} */
var ResolveFlags;
/** @type {ResolveMode} */
var ResolveMode;
/** @type {ResolvePair} */
var ResolvePair;
/** @type {ResolvePass} */
var ResolvePass;
/** @type {ResourceDesc} */
var ResourceDesc;
/** @type {ResourceDimension} */
var ResourceDimension;
/** @type {ResourceFlags} */
var ResourceFlags;
/** @type {ResourceGraph} */
var ResourceGraph;
/** @type {ResourceGraphComponent} */
var ResourceGraphComponent;
/** @type {ResourceGraphValue} */
var ResourceGraphValue;
/** @type {ResourceGraphVertex} */
var ResourceGraphVertex;
/** @type {ResourceManagerVisitor} */
var ResourceManagerVisitor;
/** @type {ResourceRange} */
var ResourceRange;
/** @type {ResourceResidency} */
var ResourceResidency;
/** @type {resources} */
var resources;
/** @type {ResourceStates} */
var ResourceStates;
/** @type {ResourceTraits} */
var ResourceTraits;
/** @type {ResourceType} */
var ResourceType;
/** @type {ReverseTime} */
var ReverseTime;
/** @type {RichText} */
var RichText;
/** @type {RichTextComponent} */
var RichTextComponent;
/** @type {RigidBody} */
var RigidBody;
/** @type {RigidBody2D} */
var RigidBody2D;
/** @type {RigidBodyComponent} */
var RigidBodyComponent;
/** @type {Root} */
var Root;
/** @type {rpMergeInfos} */
var rpMergeInfos;
/** @type {RUNTIME_BASED} */
var RUNTIME_BASED;
/** @type {RUNTIME_ID_ENABLED} */
var RUNTIME_ID_ENABLED;
/** @type {RuntimeMotionSyncManager} */
var RuntimeMotionSyncManager;
/** @type {RuntimeStashManager} */
var RuntimeStashManager;
/** @type {SafeArea} */
var SafeArea;
/** @type {SafeAreaComponent} */
var SafeAreaComponent;
/** @type {SampleCount} */
var SampleCount;
/** @type {Sampler} */
var Sampler;
/** @type {SamplerInfo} */
var SamplerInfo;
/** @type {SampleType} */
var SampleType;
/** @type {SAXParser} */
var SAXParser;
/** @type {ScalableContainer} */
var ScalableContainer;
/** @type {scalableContainerManager} */
var scalableContainerManager;
/** @type {Scene} */
var Scene;
/** @type {SceneAsset} */
var SceneAsset;
/** @type {SceneCulling} */
var SceneCulling;
/** @type {SceneData} */
var SceneData;
/** @type {SceneFlags} */
var SceneFlags;
/** @type {SceneGlobals} */
var SceneGlobals;
/** @type {Scheduler} */
var Scheduler;
/** @type {Screen} */
var Screen;
/** @type {screenAdapter} */
var screenAdapter;
/** @type {Script} */
var Script;
/** @type {ScrollBar} */
var ScrollBar;
/** @type {ScrollBarComponent} */
var ScrollBarComponent;
/** @type {ScrollView} */
var ScrollView;
/** @type {ScrollViewComponent} */
var ScrollViewComponent;
/** @type {ScrollViewEventType} */
var ScrollViewEventType;
/** @type {searchForRootBonePathSymbol} */
var searchForRootBonePathSymbol;
/** @type {selector} */
var selector;
/** @type {SEPARATE_SAMPLER_BINDING_OFFSET} */
var SEPARATE_SAMPLER_BINDING_OFFSET;
/** @type {Sequence} */
var Sequence;
/** @type {serializable} */
var serializable;
/** @type {serializeBuiltinValueType} */
var serializeBuiltinValueType;
/** @type {serializeTag} */
var serializeTag;
/** @type {SERVER_MODE} */
var SERVER_MODE;
/** @type {set} */
var set;
/** @type {SetAction} */
var SetAction;
/** @type {SetIndex} */
var SetIndex;
/** @type {setPrototypeOf} */
var setPrototypeOf;
/** @type {SettingPass} */
var SettingPass;
/** @type {Settings} */
var Settings;
/** @type {SettingsCategory} */
var SettingsCategory;
/** @type {SH} */
var SH;
/** @type {ShadeModel} */
var ShadeModel;
/** @type {Shader} */
var Shader;
/** @type {ShaderBindingData} */
var ShaderBindingData;
/** @type {ShaderInfo} */
var ShaderInfo;
/** @type {ShaderLayoutData} */
var ShaderLayoutData;
/** @type {ShaderProgramData} */
var ShaderProgramData;
/** @type {ShaderStage} */
var ShaderStage;
/** @type {ShaderStageFlagBit} */
var ShaderStageFlagBit;
/** @type {ShadowFlow} */
var ShadowFlow;
/** @type {ShadowInfo} */
var ShadowInfo;
/** @type {ShadowLayerVolume} */
var ShadowLayerVolume;
/** @type {ShadowPass} */
var ShadowPass;
/** @type {Shadows} */
var Shadows;
/** @type {ShadowsInfo} */
var ShadowsInfo;
/** @type {ShadowSize} */
var ShadowSize;
/** @type {ShadowStage} */
var ShadowStage;
/** @type {ShadowType} */
var ShadowType;
/** @type {ShapeType} */
var ShapeType;
/** @type {SharedStackBasedAllocatorManager} */
var SharedStackBasedAllocatorManager;
/** @type {shareLabelInfo} */
var shareLabelInfo;
/** @type {shift} */
var shift;
/** @type {Show} */
var Show;
/** @type {simple} */
var simple;
/** @type {SimpleDirectionalIssueSameDirection} */
var SimpleDirectionalIssueSameDirection;
/** @type {simpleDragonBoneAssembler} */
var simpleDragonBoneAssembler;
/** @type {simpleSpineAssembler} */
var simpleSpineAssembler;
/** @type {SimpleTexture} */
var SimpleTexture;
/** @type {SimplexCollider} */
var SimplexCollider;
/** @type {Simulator} */
var Simulator;
/** @type {sineOutIn} */
var sineOutIn;
/** @type {SingleChannelTrack} */
var SingleChannelTrack;
/** @type {SingleOutputPVNode} */
var SingleOutputPVNode;
/** @type {Size} */
var Size;
/** @type {SizeTrack} */
var SizeTrack;
/** @type {SizeTrackEval} */
var SizeTrackEval;
/** @type {SkelAnimDataHub} */
var SkelAnimDataHub;
/** @type {SkeletalAnimation} */
var SkeletalAnimation;
/** @type {SkeletalAnimationComponent} */
var SkeletalAnimationComponent;
/** @type {SkeletalAnimationState} */
var SkeletalAnimationState;
/** @type {Skeleton} */
var Skeleton;
/** @type {SkeletonBinary} */
var SkeletonBinary;
/** @type {SkeletonData} */
var SkeletonData;
/** @type {SkeletonSystem} */
var SkeletonSystem;
/** @type {Skin} */
var Skin;
/** @type {SkinData} */
var SkinData;
/** @type {SkinInfo} */
var SkinInfo;
/** @type {SkinnedMeshBatchRenderer} */
var SkinnedMeshBatchRenderer;
/** @type {SkinnedMeshRenderer} */
var SkinnedMeshRenderer;
/** @type {SkinnedMeshUnit} */
var SkinnedMeshUnit;
/** @type {SkinningModel} */
var SkinningModel;
/** @type {SkinningModelComponent} */
var SkinningModelComponent;
/** @type {SkinningModelUnit} */
var SkinningModelUnit;
/** @type {SkinPass} */
var SkinPass;
/** @type {Skybox} */
var Skybox;
/** @type {SKYBOX_FLAG} */
var SKYBOX_FLAG;
/** @type {SkyBoxFlagValue} */
var SkyBoxFlagValue;
/** @type {SkyboxInfo} */
var SkyboxInfo;
/** @type {sliced} */
var sliced;
/** @type {slide} */
var slide;
/** @type {Slider} */
var Slider;
/** @type {SliderComponent} */
var SliderComponent;
/** @type {SliderJoint2D} */
var SliderJoint2D;
/** @type {Slot} */
var Slot;
/** @type {SlotData} */
var SlotData;
/** @type {Socket} */
var Socket;
/** @type {solveCubic} */
var solveCubic;
/** @type {solveTwoBoneIK} */
var solveTwoBoneIK;
/** @type {solveTwoBoneIKPositions} */
var solveTwoBoneIKPositions;
/** @type {Sorting} */
var Sorting;
/** @type {Sorting2D} */
var Sorting2D;
/** @type {SortingLayers} */
var SortingLayers;
/** @type {sp} */
var sp;
/** @type {Spawn} */
var Spawn;
/** @type {SpecialStateEval} */
var SpecialStateEval;
/** @type {Sphere} */
var Sphere;
/** @type {SphereCollider} */
var SphereCollider;
/** @type {SphereColliderComponent} */
var SphereColliderComponent;
/** @type {SphereLight} */
var SphereLight;
/** @type {SphereLightComponent} */
var SphereLightComponent;
/** @type {spine} */
var spine;
/** @type {SPINE_VERSION} */
var SPINE_VERSION;
/** @type {SPINE_WASM} */
var SPINE_WASM;
/** @type {SpineAnimationCacheMode} */
var SpineAnimationCacheMode;
/** @type {SpineDefaultAnimsEnum} */
var SpineDefaultAnimsEnum;
/** @type {SpineMaterialType} */
var SpineMaterialType;
/** @type {SpineSocket} */
var SpineSocket;
/** @type {SplashScreen} */
var SplashScreen;
/** @type {Spline} */
var Spline;
/** @type {SplineMode} */
var SplineMode;
/** @type {SpotLight} */
var SpotLight;
/** @type {SpotLightComponent} */
var SpotLightComponent;
/** @type {SpringJoint2D} */
var SpringJoint2D;
/** @type {Sprite} */
var Sprite;
/** @type {spriteAssembler} */
var spriteAssembler;
/** @type {SpriteAtlas} */
var SpriteAtlas;
/** @type {SpriteComponent} */
var SpriteComponent;
/** @type {SpriteEventType} */
var SpriteEventType;
/** @type {SpriteFrame} */
var SpriteFrame;
/** @type {SpriteFrameEvent} */
var SpriteFrameEvent;
/** @type {SpriteRenderer} */
var SpriteRenderer;
/** @type {SpriteType} */
var SpriteType;
/** @type {srgbToLinear} */
var srgbToLinear;
/** @type {SSSS_BLUR_X_PASS_INDEX} */
var SSSS_BLUR_X_PASS_INDEX;
/** @type {SSSS_BLUR_Y_PASS_INDEX} */
var SSSS_BLUR_Y_PASS_INDEX;
/** @type {SSSSBlurData} */
var SSSSBlurData;
/** @type {Stage} */
var Stage;
/** @type {StaggerAxis} */
var StaggerAxis;
/** @type {StaggerIndex} */
var StaggerIndex;
/** @type {START_RADIUS_EQUAL_TO_END_RADIUS} */
var START_RADIUS_EQUAL_TO_END_RADIUS;
/** @type {START_SIZE_EQUAL_TO_END_SIZE} */
var START_SIZE_EQUAL_TO_END_SIZE;
/** @type {State} */
var State;
/** @type {StateEval} */
var StateEval;
/** @type {StateMachine} */
var StateMachine;
/** @type {StateMachineComponent} */
var StateMachineComponent;
/** @type {StaticVBAccessor} */
var StaticVBAccessor;
/** @type {StaticVBChunk} */
var StaticVBChunk;
/** @type {Status} */
var Status;
/** @type {StdMorphRendering} */
var StdMorphRendering;
/** @type {StencilFace} */
var StencilFace;
/** @type {StencilManager} */
var StencilManager;
/** @type {StencilOp} */
var StencilOp;
/** @type {StencilSharedBufferView} */
var StencilSharedBufferView;
/** @type {StorageUnit} */
var StorageUnit;
/** @type {StoreOp} */
var StoreOp;
/** @type {string} */
var string;
/** @type {SubContextView} */
var SubContextView;
/** @type {SubModel} */
var SubModel;
/** @type {Subpass} */
var Subpass;
/** @type {SubpassCapabilities} */
var SubpassCapabilities;
/** @type {SubpassDependency} */
var SubpassDependency;
/** @type {SubpassGraph} */
var SubpassGraph;
/** @type {SubpassGraphComponent} */
var SubpassGraphComponent;
/** @type {SubpassGraphVertex} */
var SubpassGraphVertex;
/** @type {SubpassInfo} */
var SubpassInfo;
/** @type {SubresourceView} */
var SubresourceView;
/** @type {SubStateMachine} */
var SubStateMachine;
/** @type {support} */
var support;
/** @type {SUPPORT_JIT} */
var SUPPORT_JIT;
/** @type {SurfaceTransform} */
var SurfaceTransform;
/** @type {Swapchain} */
var Swapchain;
/** @type {SwapchainInfo} */
var SwapchainInfo;
/** @type {sys} */
var sys;
/** @type {System} */
var System;
/** @type {SystemEvent} */
var SystemEvent;
/** @type {SystemEventType} */
var SystemEventType;
/** @type {systemInfo} */
var systemInfo;
/** @type {SystemPriority} */
var SystemPriority;
/** @type {TAA} */
var TAA;
/** @type {TAAMask} */
var TAAMask;
/** @type {TAAPass} */
var TAAPass;
/** @type {tabIndexUtil} */
var tabIndexUtil;
/** @type {TangentWeightMode} */
var TangentWeightMode;
/** @type {TAOBAO} */
var TAOBAO;
/** @type {TAOBAO_MINIGAME} */
var TAOBAO_MINIGAME;
/** @type {TargetInfo} */
var TargetInfo;
/** @type {TargetOverrideInfo} */
var TargetOverrideInfo;
/** @type {TaskType} */
var TaskType;
/** @type {TCAuxiliaryCurveBinding} */
var TCAuxiliaryCurveBinding;
/** @type {TCBinding} */
var TCBinding;
/** @type {TCBindingTransitionSourceFilter} */
var TCBindingTransitionSourceFilter;
/** @type {TCBindingValueType} */
var TCBindingValueType;
/** @type {TCStateMotionTimeBinding} */
var TCStateMotionTimeBinding;
/** @type {TCStateWeightBinding} */
var TCStateWeightBinding;
/** @type {TCVariableBinding} */
var TCVariableBinding;
/** @type {TechniqueData} */
var TechniqueData;
/** @type {Terrain} */
var Terrain;
/** @type {TERRAIN_BLOCK_TILE_COMPLEXITY} */
var TERRAIN_BLOCK_TILE_COMPLEXITY;
/** @type {TERRAIN_BLOCK_VERTEX_COMPLEXITY} */
var TERRAIN_BLOCK_VERTEX_COMPLEXITY;
/** @type {TERRAIN_BLOCK_VERTEX_SIZE} */
var TERRAIN_BLOCK_VERTEX_SIZE;
/** @type {TERRAIN_DATA_VERSION} */
var TERRAIN_DATA_VERSION;
/** @type {TERRAIN_DATA_VERSION_DEFAULT} */
var TERRAIN_DATA_VERSION_DEFAULT;
/** @type {TERRAIN_DATA_VERSION2} */
var TERRAIN_DATA_VERSION2;
/** @type {TERRAIN_DATA_VERSION3} */
var TERRAIN_DATA_VERSION3;
/** @type {TERRAIN_DATA_VERSION4} */
var TERRAIN_DATA_VERSION4;
/** @type {TERRAIN_DATA_VERSION5} */
var TERRAIN_DATA_VERSION5;
/** @type {TERRAIN_DATA_VERSION6} */
var TERRAIN_DATA_VERSION6;
/** @type {TERRAIN_DATA_VERSION7} */
var TERRAIN_DATA_VERSION7;
/** @type {TERRAIN_DATA_VERSION8} */
var TERRAIN_DATA_VERSION8;
/** @type {TERRAIN_EAST_INDEX} */
var TERRAIN_EAST_INDEX;
/** @type {TERRAIN_HEIGHT_BASE} */
var TERRAIN_HEIGHT_BASE;
/** @type {TERRAIN_HEIGHT_FACTORY} */
var TERRAIN_HEIGHT_FACTORY;
/** @type {TERRAIN_HEIGHT_FACTORY_V7} */
var TERRAIN_HEIGHT_FACTORY_V7;
/** @type {TERRAIN_HEIGHT_FMAX} */
var TERRAIN_HEIGHT_FMAX;
/** @type {TERRAIN_HEIGHT_FMIN} */
var TERRAIN_HEIGHT_FMIN;
/** @type {TERRAIN_LOD_EAST_INDEX} */
var TERRAIN_LOD_EAST_INDEX;
/** @type {TERRAIN_LOD_LEVELS} */
var TERRAIN_LOD_LEVELS;
/** @type {TERRAIN_LOD_MAX_DISTANCE} */
var TERRAIN_LOD_MAX_DISTANCE;
/** @type {TERRAIN_LOD_NORTH_INDEX} */
var TERRAIN_LOD_NORTH_INDEX;
/** @type {TERRAIN_LOD_SOUTH_INDEX} */
var TERRAIN_LOD_SOUTH_INDEX;
/** @type {TERRAIN_LOD_TILES} */
var TERRAIN_LOD_TILES;
/** @type {TERRAIN_LOD_VERTS} */
var TERRAIN_LOD_VERTS;
/** @type {TERRAIN_LOD_WEST_INDEX} */
var TERRAIN_LOD_WEST_INDEX;
/** @type {TERRAIN_MAX_BLEND_LAYERS} */
var TERRAIN_MAX_BLEND_LAYERS;
/** @type {TERRAIN_MAX_LAYER_COUNT} */
var TERRAIN_MAX_LAYER_COUNT;
/** @type {TERRAIN_MAX_LEVELS} */
var TERRAIN_MAX_LEVELS;
/** @type {TERRAIN_NORTH_INDEX} */
var TERRAIN_NORTH_INDEX;
/** @type {TERRAIN_SOUTH_INDEX} */
var TERRAIN_SOUTH_INDEX;
/** @type {TERRAIN_WEST_INDEX} */
var TERRAIN_WEST_INDEX;
/** @type {TerrainAsset} */
var TerrainAsset;
/** @type {TerrainBlock} */
var TerrainBlock;
/** @type {TerrainBlockLightmapInfo} */
var TerrainBlockLightmapInfo;
/** @type {TerrainCollider} */
var TerrainCollider;
/** @type {TerrainIndexData} */
var TerrainIndexData;
/** @type {TerrainIndexPool} */
var TerrainIndexPool;
/** @type {TerrainInfo} */
var TerrainInfo;
/** @type {TerrainLayer} */
var TerrainLayer;
/** @type {TerrainLayerBinaryInfo} */
var TerrainLayerBinaryInfo;
/** @type {TerrainLayerInfo} */
var TerrainLayerInfo;
/** @type {TerrainLod} */
var TerrainLod;
/** @type {TerrainLodKey} */
var TerrainLodKey;
/** @type {TEST} */
var TEST;
/** @type {Tetrahedron} */
var Tetrahedron;
/** @type {TextAsset} */
var TextAsset;
/** @type {TextLayout} */
var TextLayout;
/** @type {TextOutputLayoutData} */
var TextOutputLayoutData;
/** @type {TextOutputRenderData} */
var TextOutputRenderData;
/** @type {TextProcessing} */
var TextProcessing;
/** @type {TextStyle} */
var TextStyle;
/** @type {Texture} */
var Texture;
/** @type {Texture2D} */
var Texture2D;
/** @type {TextureAtlasData} */
var TextureAtlasData;
/** @type {TextureBarrier} */
var TextureBarrier;
/** @type {TextureBarrierInfo} */
var TextureBarrierInfo;
/** @type {TextureBase} */
var TextureBase;
/** @type {TextureBlit} */
var TextureBlit;
/** @type {TextureBufferPool} */
var TextureBufferPool;
/** @type {TextureCopy} */
var TextureCopy;
/** @type {TextureCube} */
var TextureCube;
/** @type {TextureData} */
var TextureData;
/** @type {TextureFlagBit} */
var TextureFlagBit;
/** @type {TextureInfo} */
var TextureInfo;
/** @type {TextureSubresLayers} */
var TextureSubresLayers;
/** @type {TextureSubresRange} */
var TextureSubresRange;
/** @type {TextureType} */
var TextureType;
/** @type {TextureUsageBit} */
var TextureUsageBit;
/** @type {TextureViewInfo} */
var TextureViewInfo;
/** @type {TiffReader} */
var TiffReader;
/** @type {tiled} */
var tiled;
/** @type {TiledLayer} */
var TiledLayer;
/** @type {tiledLayerAssembler} */
var tiledLayerAssembler;
/** @type {TiledMap} */
var TiledMap;
/** @type {TiledMapAsset} */
var TiledMapAsset;
/** @type {TiledObjectGroup} */
var TiledObjectGroup;
/** @type {TiledTile} */
var TiledTile;
/** @type {TiledUserNodeData} */
var TiledUserNodeData;
/** @type {TileFlag} */
var TileFlag;
/** @type {timeScale} */
var timeScale;
/** @type {TMXImageLayerInfo} */
var TMXImageLayerInfo;
/** @type {TMXLayerInfo} */
var TMXLayerInfo;
/** @type {TMXMapInfo} */
var TMXMapInfo;
/** @type {TMXObjectGroupInfo} */
var TMXObjectGroupInfo;
/** @type {TMXObjectType} */
var TMXObjectType;
/** @type {TMXTilesetInfo} */
var TMXTilesetInfo;
/** @type {Toggle} */
var Toggle;
/** @type {ToggleComponent} */
var ToggleComponent;
/** @type {ToggleContainer} */
var ToggleContainer;
/** @type {ToggleContainerComponent} */
var ToggleContainerComponent;
/** @type {ToggleVisibility} */
var ToggleVisibility;
/** @type {ToneMappingType} */
var ToneMappingType;
/** @type {tooltip} */
var tooltip;
/** @type {TopLevelStateMachineEvaluation} */
var TopLevelStateMachineEvaluation;
/** @type {toPPM} */
var toPPM;
/** @type {torus} */
var torus;
/** @type {Touch} */
var Touch;
/** @type {TouchInputSource} */
var TouchInputSource;
/** @type {touchManager} */
var touchManager;
/** @type {Track} */
var Track;
/** @type {TrackBinding} */
var TrackBinding;
/** @type {trackBindingTag} */
var trackBindingTag;
/** @type {TrackEntryListeners} */
var TrackEntryListeners;
/** @type {TrackingType} */
var TrackingType;
/** @type {TrackPath} */
var TrackPath;
/** @type {Transform} */
var Transform;
/** @type {TRANSFORM_ON} */
var TRANSFORM_ON;
/** @type {TransformArray} */
var TransformArray;
/** @type {TransformBit} */
var TransformBit;
/** @type {TransformFilter} */
var TransformFilter;
/** @type {TransformObject} */
var TransformObject;
/** @type {TransformOperation} */
var TransformOperation;
/** @type {transformPipeline} */
var transformPipeline;
/** @type {TransformSpace} */
var TransformSpace;
/** @type {TransitionPreviewer} */
var TransitionPreviewer;
/** @type {traversal} */
var traversal;
/** @type {Triangle} */
var Triangle;
/** @type {TriggerCondition} */
var TriggerCondition;
/** @type {TriggerEventObject} */
var TriggerEventObject;
/** @type {TriggerResetMode} */
var TriggerResetMode;
/** @type {TriggerVariable} */
var TriggerVariable;
/** @type {ttf} */
var ttf;
/** @type {TTFFont} */
var TTFFont;
/** @type {TTFUtils} */
var TTFUtils;
/** @type {TupleDictionary} */
var TupleDictionary;
/** @type {Tween} */
var Tween;
/** @type {TweenAction} */
var TweenAction;
/** @type {tweenProgress} */
var tweenProgress;
/** @type {TweenSystem} */
var TweenSystem;
/** @type {twgslModule} */
var twgslModule;
/** @type {TWO_PI} */
var TWO_PI;
/** @type {TwoBoneIKDebugger} */
var TwoBoneIKDebugger;
/** @type {type} */
var type;
/** @type {type2reader} */
var type2reader;
/** @type {type2validator} */
var type2validator;
/** @type {type2writer} */
var type2writer;
/** @type {typeMap} */
var typeMap;
/** @type {TypeScript} */
var TypeScript;
/** @type {UBOCamera} */
var UBOCamera;
/** @type {UBOCameraEnum} */
var UBOCameraEnum;
/** @type {UBOCSM} */
var UBOCSM;
/** @type {UBOCSMEnum} */
var UBOCSMEnum;
/** @type {UBODeferredLight} */
var UBODeferredLight;
/** @type {UBOForwardLight} */
var UBOForwardLight;
/** @type {UBOForwardLightEnum} */
var UBOForwardLightEnum;
/** @type {UBOGlobal} */
var UBOGlobal;
/** @type {UBOGlobalEnum} */
var UBOGlobalEnum;
/** @type {UBOLocal} */
var UBOLocal;
/** @type {UBOLocalBatched} */
var UBOLocalBatched;
/** @type {UBOLocalEnum} */
var UBOLocalEnum;
/** @type {UBOMorph} */
var UBOMorph;
/** @type {UBOMorphEnum} */
var UBOMorphEnum;
/** @type {UBOSH} */
var UBOSH;
/** @type {UBOShadow} */
var UBOShadow;
/** @type {UBOShadowEnum} */
var UBOShadowEnum;
/** @type {UBOSHEnum} */
var UBOSHEnum;
/** @type {UBOSkinning} */
var UBOSkinning;
/** @type {UBOSkinningAnimation} */
var UBOSkinningAnimation;
/** @type {UBOSkinningTexture} */
var UBOSkinningTexture;
/** @type {UBOUILocal} */
var UBOUILocal;
/** @type {UBOWorldBound} */
var UBOWorldBound;
/** @type {UI} */
var UI;
/** @type {UIComponent} */
var UIComponent;
/** @type {UICoordinateTracker} */
var UICoordinateTracker;
/** @type {UICoordinateTrackerComponent} */
var UICoordinateTrackerComponent;
/** @type {UIDrawBatch} */
var UIDrawBatch;
/** @type {UIMeshRenderer} */
var UIMeshRenderer;
/** @type {UIModelComponent} */
var UIModelComponent;
/** @type {UIOpacity} */
var UIOpacity;
/** @type {UIOpacityComponent} */
var UIOpacityComponent;
/** @type {UIPhase} */
var UIPhase;
/** @type {UIRenderable} */
var UIRenderable;
/** @type {UIRenderer} */
var UIRenderer;
/** @type {UIRendererManager} */
var UIRendererManager;
/** @type {UIReorderComponent} */
var UIReorderComponent;
/** @type {UISkew} */
var UISkew;
/** @type {UIStaticBatch} */
var UIStaticBatch;
/** @type {UIStaticBatchComponent} */
var UIStaticBatchComponent;
/** @type {UITransform} */
var UITransform;
/** @type {UITransformComponent} */
var UITransformComponent;
/** @type {UIVertexFormat} */
var UIVertexFormat;
/** @type {UnaryCondition} */
var UnaryCondition;
/** @type {Uniform} */
var Uniform;
/** @type {UNIFORM_DIFFUSEMAP_BINDING} */
var UNIFORM_DIFFUSEMAP_BINDING;
/** @type {UNIFORM_ENVIRONMENT_BINDING} */
var UNIFORM_ENVIRONMENT_BINDING;
/** @type {UNIFORM_JOINT_TEXTURE_BINDING} */
var UNIFORM_JOINT_TEXTURE_BINDING;
/** @type {UNIFORM_LIGHTMAP_TEXTURE_BINDING} */
var UNIFORM_LIGHTMAP_TEXTURE_BINDING;
/** @type {UNIFORM_NORMAL_MORPH_TEXTURE_BINDING} */
var UNIFORM_NORMAL_MORPH_TEXTURE_BINDING;
/** @type {UNIFORM_POSITION_MORPH_TEXTURE_BINDING} */
var UNIFORM_POSITION_MORPH_TEXTURE_BINDING;
/** @type {UNIFORM_REALTIME_JOINT_TEXTURE_BINDING} */
var UNIFORM_REALTIME_JOINT_TEXTURE_BINDING;
/** @type {UNIFORM_REFLECTION_PROBE_BLEND_CUBEMAP_BINDING} */
var UNIFORM_REFLECTION_PROBE_BLEND_CUBEMAP_BINDING;
/** @type {UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING} */
var UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING;
/** @type {UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING} */
var UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING;
/** @type {UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING} */
var UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING;
/** @type {UNIFORM_SHADOWMAP_BINDING} */
var UNIFORM_SHADOWMAP_BINDING;
/** @type {UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING} */
var UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING;
/** @type {UNIFORM_SPRITE_TEXTURE_BINDING} */
var UNIFORM_SPRITE_TEXTURE_BINDING;
/** @type {UNIFORM_TANGENT_MORPH_TEXTURE_BINDING} */
var UNIFORM_TANGENT_MORPH_TEXTURE_BINDING;
/** @type {UniformBlock} */
var UniformBlock;
/** @type {UniformBlockData} */
var UniformBlockData;
/** @type {UniformData} */
var UniformData;
/** @type {UniformInputAttachment} */
var UniformInputAttachment;
/** @type {UniformProxyFactory} */
var UniformProxyFactory;
/** @type {UniformSampler} */
var UniformSampler;
/** @type {UniformSamplerTexture} */
var UniformSamplerTexture;
/** @type {UniformStorageBuffer} */
var UniformStorageBuffer;
/** @type {UniformStorageImage} */
var UniformStorageImage;
/** @type {UniformTexture} */
var UniformTexture;
/** @type {uniquelyReferenced} */
var uniquelyReferenced;
/** @type {unit} */
var unit;
/** @type {UntypedTrack} */
var UntypedTrack;
/** @type {UpdateFrequency} */
var UpdateFrequency;
/** @type {uploadJointData} */
var uploadJointData;
/** @type {UploadPair} */
var UploadPair;
/** @type {url} */
var url;
/** @type {USE_3D} */
var USE_3D;
/** @type {USE_SORTING_2D} */
var USE_SORTING_2D;
/** @type {USE_UI_SKEW} */
var USE_UI_SKEW;
/** @type {USE_XR} */
var USE_XR;
/** @type {utils} */
var utils;
/** @type {value} */
var value;
/** @type {ValueType} */
var ValueType;
/** @type {VariableNotDefinedError} */
var VariableNotDefinedError;
/** @type {VariableType} */
var VariableType;
/** @type {VariableTypeMismatchedError} */
var VariableTypeMismatchedError;
/** @type {VarInstanceBase} */
var VarInstanceBase;
/** @type {VarInstancePrimitive} */
var VarInstancePrimitive;
/** @type {VarInstanceTrigger} */
var VarInstanceTrigger;
/** @type {Vec2} */
var Vec2;
/** @type {Vec2TrackEval} */
var Vec2TrackEval;
/** @type {Vec3} */
var Vec3;
/** @type {VEC3_0} */
var VEC3_0;
/** @type {Vec3TrackEval} */
var Vec3TrackEval;
/** @type {Vec3Variable} */
var Vec3Variable;
/** @type {Vec4} */
var Vec4;
/** @type {Vec4TrackEval} */
var Vec4TrackEval;
/** @type {VectorGraphColorMap} */
var VectorGraphColorMap;
/** @type {VectorTrack} */
var VectorTrack;
/** @type {VERSION} */
var VERSION;
/** @type {Vertex} */
var Vertex;
/** @type {VertexEffectDelegate} */
var VertexEffectDelegate;
/** @type {VerticalTextAlignment} */
var VerticalTextAlignment;
/** @type {vfmt} */
var vfmt;
/** @type {vfmtPosColor} */
var vfmtPosColor;
/** @type {vfmtPosUvColor} */
var vfmtPosUvColor;
/** @type {vfmtPosUvColor4B} */
var vfmtPosUvColor4B;
/** @type {vfmtPosUvTwoColor} */
var vfmtPosUvTwoColor;
/** @type {vfmtPosUvTwoColor4B} */
var vfmtPosUvTwoColor4B;
/** @type {VideoClip} */
var VideoClip;
/** @type {VideoPlayer} */
var VideoPlayer;
/** @type {VideoPlayerEventType} */
var VideoPlayerEventType;
/** @type {VideoPlayerImpl} */
var VideoPlayerImpl;
/** @type {VideoPlayerImplManager} */
var VideoPlayerImplManager;
/** @type {VideoPlayerImplWeb} */
var VideoPlayerImplWeb;
/** @type {View} */
var View;
/** @type {ViewDimension} */
var ViewDimension;
/** @type {ViewGroup} */
var ViewGroup;
/** @type {Viewport} */
var Viewport;
/** @type {viewVariableBindings} */
var viewVariableBindings;
/** @type {VisibilityBlock} */
var VisibilityBlock;
/** @type {VisibilityDB} */
var VisibilityDB;
/** @type {VisibilityFlags} */
var VisibilityFlags;
/** @type {VisibilityGraph} */
var VisibilityGraph;
/** @type {VisibilityIndex} */
var VisibilityIndex;
/** @type {VisibilityPass} */
var VisibilityPass;
/** @type {visible} */
var visible;
/** @type {visibleRect} */
var visibleRect;
/** @type {VIVO} */
var VIVO;
/** @type {vmath} */
var vmath;
/** @type {VsyncMode} */
var VsyncMode;
/** @type {waitForSpineWasmInstantiation} */
var waitForSpineWasmInstantiation;
/** @type {waitForWebGPUWasmInstantiation} */
var waitForWebGPUWasmInstantiation;
/** @type {WASM_SUBPACKAGE} */
var WASM_SUBPACKAGE;
/** @type {WebComputePassBuilder} */
var WebComputePassBuilder;
/** @type {WebComputeQueueBuilder} */
var WebComputeQueueBuilder;
/** @type {WebCopyPassBuilder} */
var WebCopyPassBuilder;
/** @type {WebGL2Buffer} */
var WebGL2Buffer;
/** @type {WebGL2CommandBuffer} */
var WebGL2CommandBuffer;
/** @type {WebGL2DescriptorSet} */
var WebGL2DescriptorSet;
/** @type {WebGL2DescriptorSetLayout} */
var WebGL2DescriptorSetLayout;
/** @type {WebGL2Device} */
var WebGL2Device;
/** @type {WebGL2DeviceManager} */
var WebGL2DeviceManager;
/** @type {WebGL2EXT} */
var WebGL2EXT;
/** @type {WebGL2Framebuffer} */
var WebGL2Framebuffer;
/** @type {WebGL2IndirectDrawInfos} */
var WebGL2IndirectDrawInfos;
/** @type {WebGL2InputAssembler} */
var WebGL2InputAssembler;
/** @type {WebGL2PipelineLayout} */
var WebGL2PipelineLayout;
/** @type {WebGL2PipelineState} */
var WebGL2PipelineState;
/** @type {WebGL2PrimaryCommandBuffer} */
var WebGL2PrimaryCommandBuffer;
/** @type {WebGL2Queue} */
var WebGL2Queue;
/** @type {WebGL2RenderPass} */
var WebGL2RenderPass;
/** @type {WebGL2Sampler} */
var WebGL2Sampler;
/** @type {WebGL2Shader} */
var WebGL2Shader;
/** @type {WebGL2StateCache} */
var WebGL2StateCache;
/** @type {WebGL2Swapchain} */
var WebGL2Swapchain;
/** @type {WebGL2Texture} */
var WebGL2Texture;
/** @type {WebGLBuffer} */
var WebGLBuffer;
/** @type {WebGLCommandBuffer} */
var WebGLCommandBuffer;
/** @type {WebGLConstants} */
var WebGLConstants;
/** @type {WebGLDescriptorSet} */
var WebGLDescriptorSet;
/** @type {WebGLDescriptorSetLayout} */
var WebGLDescriptorSetLayout;
/** @type {WebGLDevice} */
var WebGLDevice;
/** @type {WebGLDeviceManager} */
var WebGLDeviceManager;
/** @type {WebGLEXT} */
var WebGLEXT;
/** @type {WebGLFramebuffer} */
var WebGLFramebuffer;
/** @type {WebGLIndirectDrawInfos} */
var WebGLIndirectDrawInfos;
/** @type {WebGLInputAssembler} */
var WebGLInputAssembler;
/** @type {WebGLPipelineLayout} */
var WebGLPipelineLayout;
/** @type {WebGLPipelineState} */
var WebGLPipelineState;
/** @type {WebGLPrimaryCommandBuffer} */
var WebGLPrimaryCommandBuffer;
/** @type {WebGLQueue} */
var WebGLQueue;
/** @type {WebGLRenderPass} */
var WebGLRenderPass;
/** @type {WebGLSampler} */
var WebGLSampler;
/** @type {WebGLShader} */
var WebGLShader;
/** @type {WebGLStateCache} */
var WebGLStateCache;
/** @type {WebGLSwapchain} */
var WebGLSwapchain;
/** @type {WebGLTexture} */
var WebGLTexture;
/** @type {webGPU} */
var webGPU;
/** @type {WEBGPU_WASM} */
var WEBGPU_WASM;
/** @type {webgpuAdapter} */
var webgpuAdapter;
/** @type {WebGPUBlendFactors} */
var WebGPUBlendFactors;
/** @type {WebGPUBlendOps} */
var WebGPUBlendOps;
/** @type {WebGPUBuffer} */
var WebGPUBuffer;
/** @type {WebGPUCmd} */
var WebGPUCmd;
/** @type {WebGPUCmdBeginRenderPass} */
var WebGPUCmdBeginRenderPass;
/** @type {WebGPUCmdBindStates} */
var WebGPUCmdBindStates;
/** @type {WebGPUCmdCopyBufferToTexture} */
var WebGPUCmdCopyBufferToTexture;
/** @type {WebGPUCmdDraw} */
var WebGPUCmdDraw;
/** @type {WebGPUCmdObject} */
var WebGPUCmdObject;
/** @type {WebGPUCmdPackage} */
var WebGPUCmdPackage;
/** @type {WebGPUCmdUpdateBuffer} */
var WebGPUCmdUpdateBuffer;
/** @type {WebGPUCommandAllocator} */
var WebGPUCommandAllocator;
/** @type {WebGPUCommandBuffer} */
var WebGPUCommandBuffer;
/** @type {WebGPUCommandPool} */
var WebGPUCommandPool;
/** @type {WebGPUCompereFunc} */
var WebGPUCompereFunc;
/** @type {WebGPUDescriptorSet} */
var WebGPUDescriptorSet;
/** @type {WebGPUDescriptorSetLayout} */
var WebGPUDescriptorSetLayout;
/** @type {WebGPUDevice} */
var WebGPUDevice;
/** @type {WebGPUDeviceManager} */
var WebGPUDeviceManager;
/** @type {WebGPUFramebuffer} */
var WebGPUFramebuffer;
/** @type {WebGPUInputAssembler} */
var WebGPUInputAssembler;
/** @type {WebGPUPipelineLayout} */
var WebGPUPipelineLayout;
/** @type {WebGPUPipelineState} */
var WebGPUPipelineState;
/** @type {WebGPUQueue} */
var WebGPUQueue;
/** @type {WebGPURenderPass} */
var WebGPURenderPass;
/** @type {WebGPUSampler} */
var WebGPUSampler;
/** @type {WebGPUShader} */
var WebGPUShader;
/** @type {WebGPUStateCache} */
var WebGPUStateCache;
/** @type {WebGPUStencilOp} */
var WebGPUStencilOp;
/** @type {WebGPUSwapchain} */
var WebGPUSwapchain;
/** @type {WebGPUTexture} */
var WebGPUTexture;
/** @type {WebMovePassBuilder} */
var WebMovePassBuilder;
/** @type {WebPipeline} */
var WebPipeline;
/** @type {WebProgramLibrary} */
var WebProgramLibrary;
/** @type {WebProgramProxy} */
var WebProgramProxy;
/** @type {WebRenderPassBuilder} */
var WebRenderPassBuilder;
/** @type {WebRenderQueueBuilder} */
var WebRenderQueueBuilder;
/** @type {WebRenderSubpassBuilder} */
var WebRenderSubpassBuilder;
/** @type {WebSceneBuilder} */
var WebSceneBuilder;
/** @type {WebSetter} */
var WebSetter;
/** @type {WebView} */
var WebView;
/** @type {WebViewEventType} */
var WebViewEventType;
/** @type {WebViewImpl} */
var WebViewImpl;
/** @type {WebViewImplManager} */
var WebViewImplManager;
/** @type {WebViewImplWeb} */
var WebViewImplWeb;
/** @type {WECHAT} */
var WECHAT;
/** @type {WECHAT_MINI_PROGRAM} */
var WECHAT_MINI_PROGRAM;
/** @type {WGPU_WASM} */
var WGPU_WASM;
/** @type {WheelJoint2D} */
var WheelJoint2D;
/** @type {Widget} */
var Widget;
/** @type {WidgetComponent} */
var WidgetComponent;
/** @type {widgetManager} */
var widgetManager;
/** @type {WINDOWS} */
var WINDOWS;
/** @type {WorldClock} */
var WorldClock;
/** @type {wrap} */
var wrap;
/** @type {WrapMode} */
var WrapMode;
/** @type {WrapModeMask} */
var WrapModeMask;
/** @type {wrapNativeSuper} */
var wrapNativeSuper;
/** @type {WrappedInfo} */
var WrappedInfo;
/** @type {wrapRegExp} */
var wrapRegExp;
/** @type {XIAOMI} */
var XIAOMI;
/** @type {XRConfigKey} */
var XRConfigKey;
/** @type {XREye} */
var XREye;
/** @type {XrKeyboardEventType} */
var XrKeyboardEventType;
/** @type {XRPoseType} */
var XRPoseType;
/** @type {XrUIPressEvent} */
var XrUIPressEvent;
/** @type {XrUIPressEventType} */
var XrUIPressEventType;
/** @type {ZERO_DELTA_TRANSFORM} */
var ZERO_DELTA_TRANSFORM;

//lmaooo
