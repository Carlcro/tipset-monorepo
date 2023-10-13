import React from "react";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import Container from "../Container";
import { trpc } from "../../utils/trpc";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("user-tournament-page");

  const { mutate } = trpc.userTournament.kickMember.useMutation();

  const handleKickMember = async () => {
    await mutate({
      userTournamentId: id,
      userIdToKick: memberId,
    });

    setIsOpen(false);
  };

  return (
    <Dialog
      className="fixed inset-0 z-10 overflow-y-auto"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="bg-black fixed inset-0 opacity-20" />
        <Container classNames="z-10 border border-black max-w-sm mx-auto">
          <Dialog.Description>
            {t("sure-you-want-to-remove-member", { memberName })}
          </Dialog.Description>
          <div className="mt-3 flex justify-between">
            <button
              className="border-black rounded-sm border border-polarNight bg-auroraRed py-1 px-2 text-snowStorm3"
              onClick={handleKickMember}
            >
              {t("remove")}
            </button>
            <button
              className="rounded border px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              {t("cancel")}
            </button>
          </div>
        </Container>
      </div>
    </Dialog>
  );
}
