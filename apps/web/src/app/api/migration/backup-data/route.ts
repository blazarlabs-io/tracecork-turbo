import { initAdmin } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";
import { getCollectionNestedDataService } from "~/src/services/db/db-migration-services";

import { writeLocalFile } from "~/src/utils/files";

export async function POST(request: Request) {
  await initAdmin();

  const wineries = await getCollectionNestedDataService("wineries");

  await writeLocalFile(wineries, "wineries-backup");

  return Response.json({
    success: true,
    data: wineries,
  });
}
