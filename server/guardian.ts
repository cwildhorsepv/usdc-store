// server/services/guardian.ts
import { IS_SANDBOX } from "@/lib/config";

export const guardianService = IS_SANDBOX
    ? require("@/server/stubs/guardians").guardianStub
    : require("@/server/live/guardians").guardianLive;
