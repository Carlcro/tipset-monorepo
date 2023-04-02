import React from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useRouter } from "next/router";
import Container from "../Container";

import { trpc } from "../../utils/trpc";

type Props = {
  memberId: string;
  memberName: string;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
};

export default function KickMemberDialog({
  isOpen,
  setIsOpen,
  memberId,
  memberName,
}: Props) {
  const router = useRouter();
  const id = router.query.id as string;

  const { mutate } = trpc.userTournament.kickMember.useMutation();

  const handleKickMember = async () => {
    await mutate({
      userTournamentId: id,
      userIdToKick: memberId,
    });

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
        className="fixed inset-0 z-10 overflow-y-auto"
        static
        open={true}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Overlay className="bg-black fixed inset-0 opacity-20" />
          <Container classNames="z-10 border border-black max-w-sm mx-auto">
            <Dialog.Description>
              {`Är du säker på att du vill ta bort ${memberName}`}
            </Dialog.Description>
            <div className="mt-3 flex justify-between">
              <button
                className="border-black rounded-sm border border-polarNight bg-auroraRed py-1 px-2 text-snowStorm3"
                onClick={handleKickMember}
              >
                {`Ta bort`}
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
