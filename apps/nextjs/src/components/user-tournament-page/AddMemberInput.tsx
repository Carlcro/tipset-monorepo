import { SyntheticEvent, useState } from "react";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const AddMemberInput = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const [memberInput, setMemberInput] = useState("");

  const { mutate } = trpc.userTournament.addMember.useMutation();

  const handleAddMember = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ email: memberInput, userTournamentId: id });
    setMemberInput("");
  };

  return (
    <div>
      <h3 className="font-semibold">Lägg till ny medlem</h3>
      <div>
        <form onSubmit={handleAddMember}>
          <input
            className="border-black mt-1 h-8 w-full rounded-sm border p-2"
            type="text"
            placeholder="E-postadress"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <SubmitButton type="submit">Lägg till</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default AddMemberInput;
