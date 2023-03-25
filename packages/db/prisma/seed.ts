import { prisma } from "./../index";
import players from "./data/players.json";
import { matchGroups } from "./data/matchGroups";

const load = async () => {
  try {
    await prisma.championship.deleteMany();
    await prisma.match.deleteMany();
    await prisma.matchGroup.deleteMany();
    await prisma.team.deleteMany();
    await prisma.player.deleteMany();

    const championship = await prisma.championship.create({
      data: {
        name: "Euro 2024",
      },
    });

    await prisma.player.createMany({
      data: players.map((player) => ({
        name: player.name,
      })),
    });

    let matchId = 0;
    for await (const mg of matchGroups) {
      const newMatchGroup = await prisma.matchGroup.create({
        data: {
          name: mg.group,
          championshipId: championship.id,
        },
      });

      await prisma.team.createMany({
        data: mg.teams.map((team) => ({
          name: team,
          matchGroupId: newMatchGroup.id,
        })),
      });

      const newTeams = await prisma.team.findMany({
        where: {
          matchGroupId: newMatchGroup.id,
        },
      });

      await prisma.match.create({
        data: {
          matchId: matchId++,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[0].id,
          team2Id: newTeams[1].id,
        },
      });

      await prisma.match.create({
        data: {
          matchId: matchId++,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[1].id,
          team2Id: newTeams[2].id,
        },
      });

      await prisma.match.create({
        data: {
          matchId: matchId++,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[2].id,
          team2Id: newTeams[3].id,
        },
      });

      await prisma.match.create({
        data: {
          matchId: matchId++,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[3].id,
          team2Id: newTeams[0].id,
        },
      });

      await prisma.match.create({
        data: {
          matchId: matchId++,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[1].id,
          team2Id: newTeams[3].id,
        },
      });

      await prisma.match.create({
        data: {
          matchId: matchId++,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[2].id,
          team2Id: newTeams[0].id,
        },
      });
    }

    console.log("Added data!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
