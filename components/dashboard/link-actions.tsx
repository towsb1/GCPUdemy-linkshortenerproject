import type { Link } from "@/db/schema";

import { DeleteLinkDialog } from "./delete-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";

export function LinkActions({ link }: { link: Link }) {
  return (
    <div className="flex items-center gap-2">
      <EditLinkDialog link={link} />
      <DeleteLinkDialog link={link} />
    </div>
  );
}
