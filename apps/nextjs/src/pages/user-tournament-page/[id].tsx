import React, { useState } from "react";
import dynamic from "next/dynamic";
import HighScoreTable from "../../components/user-tournament-page/HighScoreTable";
import KickMemberDialog from "../../components/user-tournament-page/KickMemberDialog";

const DynamicUserTournamentPanel = dynamic(
  () => import("../../components/user-tournament-page/UserTournamentPanel"),
  {
    ssr: false,
  },
);

const UserTournamentPage = () => {
  const [kickMemberDialogOpen, setKickMemberDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");

  const showKickDialog = (id: string, name: string) => {
    setMemberId(id);
    setMemberName(name);
    setKickMemberDialogOpen(true);
  };

  return (
    <div className="flex flex-col-reverse items-center px-5 md:flex-row md:items-start md:justify-center md:space-x-8">
      {<DynamicUserTournamentPanel />}
      <HighScoreTable showKickDialog={showKickDialog} />
      {
        <KickMemberDialog
          isOpen={kickMemberDialogOpen}
          setIsOpen={setKickMemberDialogOpen}
          memberId={memberId}
          memberName={memberName}
        />
      }
    </div>
  );
};

export default UserTournamentPage;
