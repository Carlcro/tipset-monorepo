import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addMember } from "../../services/userTournamentService";
import Container from "../Container";
import AddMemberInput from "./AddMemberInput";
import DeleteUserTournamentDialog from "./DeleteUserTournamentDialog";

const UserTournamentPanel = ({ isOwner }) => {
  const queryClient = useQueryClient();
  const [dialogIsOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const mutation = useMutation(addMember, {
    onSuccess: () => {
      queryClient.invalidateQueries("highscoreData");
    },
    onError: ({ response }) => console.error(response.data),
  });

  const handleAddMember = (email) => {
    mutation.mutate({ id, email });
  };

  return (
    <>
      <DeleteUserTournamentDialog
        isOpen={dialogIsOpen}
        setIsOpen={setIsDialogOpen}
        isOwner={isOwner}
      ></DeleteUserTournamentDialog>
      <div className="flex flex-col max-w-[400px] mt-5 md:mt-0">
        <div className="space-y-2">
          <Container>
            <div>
              <AddMemberInput addMember={handleAddMember} />
            </div>
          </Container>
          <Container>
            För att bjuda in familj och vänner till den här gruppen behöver de
            klicka på länken du ser här nedanför. Klicka helt enkelt på länken
            för att kopiera den, och skicka den sedan till dem du vill bjuda in.
            T.ex. via SMS, mail eller Messenger.
            <span className="font-bold">
              {
                " OBS! Tänk på att de måste ha skapat ett konto innan de använder länken."
              }
            </span>
          </Container>

          <Container classNames="flex flex-col">
            <span className="text-sm">{window.location.href + "/join"}</span>
            <button
              className="cursor-pointer font-bold text-left active:text-gray-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href + "/join");
              }}
            >
              Klicka här för att kopiera
            </button>
          </Container>
          <div className="mb-5">
            <button
              className="bg-auroraRed text-snowStorm3 border-polarNight py-1 px-2 rounded-sm border border-black"
              onClick={() => setIsDialogOpen(true)}
            >
              {`${isOwner ? "Radera grupp" : "Lämna grupp"}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTournamentPanel;
