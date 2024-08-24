/**
 * In-memory or session-memory session manager
 * Generates a uuid (v4) on construct and saves it locally
 */
export class SmpSessionManagerService {

    get sessionId(): string | void {
        return this._sessionId || this._storage.getItem(this._sessionIdKey) || void 0;
    }

    protected _sessionId: string;
    protected _storage: Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear">;

    constructor(protected _sessionIdKey: string = "lggr_sid") {
        this._storage = this._getStorage();
        this._sessionId = this.sessionId || this._generateSessionId();
    }

    protected _generateSessionId(): string {
        const sessionId = this._generateUUID();
        this._storage.setItem(this._sessionIdKey, sessionId);

        return sessionId;
    }


    protected _generateUUID(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;

            return v.toString(16);
        });
    }

    protected _getStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear"> {
        try {
            if (typeof window !== "undefined" && typeof window.sessionStorage === typeof isNaN) {
                return sessionStorage;
            }
        }
        catch (e: any) {
            console.warn(`${this.constructor.name}: error while checking sessionStorage`, e);
        }

        return {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null,
            clear: () => null
        };
    }
}
