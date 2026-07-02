
declare namespace cc {
    export namespace AssetManager {

        export interface IConfigOption  {
            importBase: string;
            nativeBase: string;
            base: string;
            name: string;
            deps: string[];
            uuids: string[];
            paths: Record<string, any[]>;
            scenes: Record<string, string>;
            packs: Record<string, string[]>;

            versions: {
                import: string[];
                native: string[];
            };

            redirect: string[];
            debug: boolean;
            types: string[];
            extensionMap: Record<string, string[]>;
        }
    }

}
