import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Flex, Dialog, Button } from "@radix-ui/themes";
import { useTranslation } from "next-i18next";

type Props = {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  isOwner: boolean;
  buttonText: string;
};

export default function DeleteUserTournamentDialog({
  isOwner,
  buttonText,
}: Props) {
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useTranslation("user-tournament-page");

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
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="red">{buttonText}</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Description size="2" mb="4">
          {isOwner
            ? t("are-you-sure-delete-group")
            : t("are-you-sure-delete-leave-group")}
        </Dialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
              className="rounded border px-2 py-1"
            >
              {t("cancel")}
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              color="red"
              onClick={() =>
                isOwner ? removeUserTournament() : exitUserTournament()
              }
            >
              {`${isOwner ? t("delete-group") : t("leave-group")}`}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
