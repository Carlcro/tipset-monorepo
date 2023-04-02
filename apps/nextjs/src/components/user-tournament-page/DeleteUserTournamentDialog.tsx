import React from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Container from "../Container";

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
  const { id } = router.query;
  const exitUserTournament = async () => {
    try {
      await leaveUserTournament(id);
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data);
    }
  };

  const removeUserTournament = async () => {
    await deleteUserTournament(id);
    router.push("/");
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        className="fixed inset-0 z-10 overflow-y-auto"
        static
        open={true}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Overlay className="bg-black fixed inset-0 opacity-20" />
          <Container classNames="z-10 border border-black max-w-sm mx-auto">
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
    </Transition>
  );
}
