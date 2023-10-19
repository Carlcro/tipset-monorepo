import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useTranslation } from "next-i18next";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";

type Props = {
  memberId: string;
  memberName: string;
};

export default function KickMemberDialog({ memberId, memberName }: Props) {
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useTranslation("user-tournament-page");

  const { mutate } = trpc.userTournament.kickMember.useMutation();

  const handleKickMember = async () => {
    await mutate({
      userTournamentId: id,
      userIdToKick: memberId,
    });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Text>❌</Text>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Description size="2" mb="4">
          {t("sure-you-want-to-remove-member", { memberName })}
        </Dialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {t("cancel")}
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button color="red" onClick={handleKickMember}>
              {t("remove")}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );

  /*  return (
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
  ); */
}
