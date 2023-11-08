import React, { SyntheticEvent, useState } from "react";
import { motion } from "framer-motion";
import Container from "../Container";
import SubmitButton from "../SubmitButton";
import { useTranslation } from "next-i18next";
import { trpc } from "../../utils/trpc";

const UserTournamentForm = () => {
  const [userTournamentName, setUserTournamentName] = useState("");
  const { t } = useTranslation("user-tournament");
  const utils = trpc.useContext();

  const { mutate, isLoading } =
    trpc.userTournament.createUserTournament.useMutation({
      onSuccess: () => utils.userTournament.getUserTournaments.invalidate(),
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
        <div className="mb-3 text-sm">{t("create-group-info")}</div>
        <div className="mb-1 font-bold">{t("give-your-group-a-name")}</div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            onChange={({ target }) => setUserTournamentName(target.value)}
            type="text"
            value={userTournamentName}
            className="mb-3 w-full rounded-sm border border-polarNight px-2 py-1.5"
          ></input>
          <SubmitButton
            isLoading={isLoading}
            type="submit"
            className="w-[130px]"
          >
            {t("create-group")}
          </SubmitButton>
        </form>
      </Container>
    </motion.div>
  );
};

export default UserTournamentForm;
