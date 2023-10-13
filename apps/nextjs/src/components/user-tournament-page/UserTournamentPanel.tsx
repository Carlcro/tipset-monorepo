import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import Container from "../Container";
import AddMemberInput from "./AddMemberInput";
import DeleteUserTournamentDialog from "./DeleteUserTournamentDialog";
import { useTranslation } from "next-i18next";

const UserTournamentPanel = () => {
  const { t } = useTranslation("user-tournament-page");

  const [dialogIsOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const id = router.query.id as string;

  const { data } = trpc.userTournament.getUserTournament.useQuery({
    userTournamentId: id,
  });

  if (data === undefined) {
    return <div></div>;
  }

  return (
    <>
      <DeleteUserTournamentDialog
        isOpen={dialogIsOpen}
        setIsOpen={setIsDialogOpen}
        isOwner={data.isOwner}
      ></DeleteUserTournamentDialog>
      <div className="mt-5 flex max-w-[400px] flex-col md:mt-0">
        <div className="space-y-2">
          <Container>
            <div>
              <AddMemberInput />
            </div>
          </Container>
          <Container>
            {t("invite-to-group-info")}
            <span className="font-bold">{t("invite-warning")}</span>
          </Container>

          <Container classNames="flex flex-col">
            <span className="text-sm">{window.location.href + "/join"}</span>
            <button
              className="cursor-pointer text-left font-bold active:text-gray-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href + "/join");
              }}
            >
              {t("click-to-copy")}
            </button>
          </Container>
          <div className="mb-5">
            <button
              className="border-black rounded-sm border border-polarNight bg-auroraRed py-1 px-2 text-snowStorm3"
              onClick={() => setIsDialogOpen(true)}
            >
              {`${data.isOwner ? t("delete-group") : t("leave-group")}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTournamentPanel;
