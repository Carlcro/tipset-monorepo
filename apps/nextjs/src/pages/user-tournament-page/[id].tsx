import React, { useState } from "react";
import HighScoreTable from "../../components/user-tournament-page/HighScoreTable";
import KickMemberDialog from "../../components/user-tournament-page/KickMemberDialog";
import UserTournamentPanel from "../../components/user-tournament-page/UserTournamentPanel";

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
      <UserTournamentPanel />
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
