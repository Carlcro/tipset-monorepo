import React, { SyntheticEvent, useState } from "react";
import { motion } from "framer-motion";
import Container from "../Container";
import SubmitButton from "../SubmitButton";
import { trpc } from "../../utils/trpc";

const UserTournamentForm = () => {
  const utils = trpc.useContext();

  const [userTournamentName, setUserTournamentName] = useState("");

  const { mutate } = trpc.userTournament.createUserTournament.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ name: userTournamentName });
    setUserTournamentName("");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container classNames="mb-5">
        <div className="mb-3 text-sm">
          {`För att göra det lättare att följa ställningen mellan familj och
          vänner kan du skapa en grupp för just er. Det gör du genom att skriva
          in ett gruppnamn här och sedan och klicka på 'skapa grupp'.`}
        </div>
        <div className="mb-1 font-bold">Namnge din grupp</div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            onChange={({ target }) => setUserTournamentName(target.value)}
            type="text"
            value={userTournamentName}
            className="mb-3 w-full rounded-sm border border-polarNight px-2 py-1.5"
          ></input>
          <SubmitButton type="submit">Skapa grupp</SubmitButton>
        </form>
      </Container>
    </motion.div>
  );
};

export default UserTournamentForm;
