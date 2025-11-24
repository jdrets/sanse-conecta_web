import { IClient } from "@/types";
import CreateClientAccess from "./CreateClientAccess";
import DeleteClientAccess from "./DeleteAccess";
import ViewClientAccess from "./ViewClientAccess";

export const Modals = ({
  createAccessDisclosure,
  viewAccessDisclosure,
  deleteAccessDisclosure,
  selectedClient,
}: {
  createAccessDisclosure: { isOpen: boolean; onClose: () => void };
  viewAccessDisclosure: { isOpen: boolean; onClose: () => void };
  deleteAccessDisclosure: { isOpen: boolean; onClose: () => void };
  selectedClient: IClient | null;
}) => {
  return (
    <>
      <CreateClientAccess
        isOpen={createAccessDisclosure.isOpen}
        onClose={createAccessDisclosure.onClose}
        selectedClient={selectedClient ?? undefined}
      />

      <ViewClientAccess
        isOpen={viewAccessDisclosure.isOpen}
        onClose={viewAccessDisclosure.onClose}
        client={selectedClient ?? undefined}
      />

      <DeleteClientAccess
        isOpen={deleteAccessDisclosure.isOpen}
        onClose={deleteAccessDisclosure.onClose}
        client={selectedClient ?? undefined}
      />
    </>
  );
};
