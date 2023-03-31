import React from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useRouter } from "next/router";
import Container from "../Container";
import { kickMember } from "../../services/userTournamentService";
import { useQueryClient } from "react-query";

export default function KickMemberDialog({
  isOpen,
  setIsOpen,
  memberEmail,
  memberName,
}) {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const handleKickMember = async () => {
    await kickMember({ id, email: memberEmail });
    queryClient.invalidateQueries(["highscoreData", id]);

    setIsOpen(false);
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
        className="fixed z-10 inset-0 overflow-y-auto"
        static
        open={true}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <Container classNames="z-10 border border-black max-w-sm mx-auto">
            <Dialog.Description>
              {`Är du säker på att du vill ta bort ${memberName}`}
            </Dialog.Description>
            <div className="flex justify-between mt-3">
              <button
                className="bg-auroraRed text-snowStorm3 border-polarNight py-1 px-2 rounded-sm border border-black"
                onClick={handleKickMember}
              >
                {`Ta bort`}
              </button>
              <button
                className="px-2 py-1 border rounded"
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
