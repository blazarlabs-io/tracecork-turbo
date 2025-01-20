import { winery } from "./winery";
import { wine } from "./wine";
import { qrCode } from "./qr-code";
import { systemVariables } from "./system-variables";

const db: any = {};

db.winery = winery;
db.wine = wine;
db.qrcode = qrCode;
db.systemVariables = systemVariables;

export { db };
