
declare namespace gdsdk {
	export namespace TEvents {
		export type SDK =	"SDK_READY" | "SDK_ERROR" |
							"SDK_GAME_START" | "SDK_GAME_PAUSE" |
							"SDK_GDPR_TRACKING" | "SDK_GDPR_THIRD_PARTY"

		export type IMA =	"AD_SDK_MANAGER_READY" | "AD_SDK_CANCELED"
		export type AD =	"AD_ERROR" | "AD_BREAK_READY" | "AD_METADATA" | "ALL_ADS_COMPLETED" |
							"CLICK" | "COMPLETE" | "CONTENT_PAUSE_REQUESTED" |
							"CONTENT_RESUME_REQUESTED" | "DURATION_CHANGE" | "FIRST_QUARTILE" |
							"IMPRESSION" | "LINEAR_CHANGED" | "LOADED" | "LOG" | "MIDPOINT" |
							"PAUSED" | "RESUMED" | "SKIPPABLE_STATE_CHANGED" | "SKIPPED" |
							"STARTED" | "THIRD_QUARTILE" | "USER_CLOSE" | "VOLUME_CHANGED" |
							"VOLUME_MUTED"
	}

	export type TEvent = TEvents.SDK | TEvents.AD | TEvents.IMA

	export type TPreloadAdEvent = 'rewarded' | 'interstitial';
	export type ShowAdOptType = 'CONTAINER_ID_TO_PUT_AD_IN'
	export type TStatus = "error" | "success" | "warning"


	export interface IEvent {
		name: TEvent;
		adPosition: 'rewarded' | "preroll" | "midroll" | undefined;
		data: object;
		isStoreEvent: boolean
		message: string;
		skipForward: boolean | undefined;
		status: TStatus
	}

	export interface IOptions {
		gameId: string;
		onEvent: (event: IEvent) => void;

		prefix?: string
		advertisementSettings?: {
			debug: boolean
			autoplay: boolean
			locale: string
		}
	}

	export interface IShowAdOptions {
		containerId: ShowAdOptType
	}

	export interface ISession {
		ads: {
			display: { enabled: boolean }
			rewarded: { enabled: boolean }
		}
		location: {
			depth: number
			loadedByGameZone: boolean
			parentDomain: string;
			parentURL: string;
			topDomain: string;
		}
	}

	export interface IAds {
		adType: "preroll"
		args: {
			isGift: boolean | undefined
			isMidrollPlus: boolean | undefined
			success: boolean
		}
	}

	export function preloadAd(event: TPreloadAdEvent): Promise<string>
	export function showAd(event: TPreloadAdEvent, opt?: IShowAdOptions): Promise<IAds>
	export function cancelAd(): void
	export function getSession(): Promise<ISession>
	export function isPaymentsAvailable(): Promise<boolean>
	export function openConsole(): void
	export function sendEvent(event: string): Promise<void>
	export const leaderboard: {
		show: pFlex.TFunc,
		addScore: pFlex.TFunc
	}

	interface IAdType {
		Display: TPreloadAdEvent;
		Interstitial: "interstitial";
		Midroll: "interstitial";
		Preroll: "interstitial"
		Rewarded: "interstitial"
	}

	export const AdType: IAdType;
}

