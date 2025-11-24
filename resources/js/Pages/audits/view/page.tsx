import Providers from "./providers";
import { IAudit } from "@/types/audit.interface";
import PageContent from "./pageContent";

export default function ViewAudit({ audit }: { audit: IAudit }) {
  return (
    <Providers audit={audit}>
      <PageContent audit={audit} />
    </Providers>
  );
}
