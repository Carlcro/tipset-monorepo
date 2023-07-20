import React from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Container from "../Container";
import { trpc } from "../../utils/trpc";

type Props = {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  isOwner: boolean;
};

export default function DeleteUserTournamentDialog({
  isOpen,
  setIsOpen,
  isOwner,
}: Props) {
  const router = useRouter();
  const id = router.query.id as string;

  const { mutate: leaveUserTournament } =
    trpc.userTournament.leaveUserTournament.useMutation();
  const { mutate: deleteUserTournament } =
    trpc.userTournament.deleteUserTournament.useMutation();

  const exitUserTournament = async () => {
    try {
      leaveUserTournament({ userTournamentId: id });
      router.push("/");
    } catch (error) {
      // todo
      // toast.error(error.response?.data);
    }
  };

  const removeUserTournament = async () => {
    deleteUserTournament({ userTournamentId: id });
    router.push("/");
  };

  return (
    <Dialog
      className="relative z-50"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="bg-black/30 fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Container classNames="border border-black max-w-sm mx-auto">
          <Dialog.Description>
            {`Är du säker på att du vill ${
              isOwner ? "radera gruppen?" : "lämna gruppen?"
            }`}
          </Dialog.Description>
          <div className="mt-3 flex justify-between">
            <button
              className="border-black rounded-sm border border-polarNight bg-auroraRed py-1 px-2 text-snowStorm3"
              onClick={() =>
                isOwner ? removeUserTournament() : exitUserTournament()
              }
            >
              {`${isOwner ? "Radera" : "Lämna"}`}
            </button>
            <button
              className="rounded border px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Avbryt
            </button>
          </div>
        </Container>
      </div>
    </Dialog>
  );
}
