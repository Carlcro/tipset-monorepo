import { prisma } from "./../index";
import players from "./data/players.json";
import matchInfo from "./data/matchInfo.json";
import { matchGroups } from "./data/matchGroups";

const load = async () => {
  try {
    await prisma.answerSheet.deleteMany();

    await prisma.betSlip.deleteMany();
    await prisma.bet.deleteMany();
    await prisma.result.deleteMany();

    await prisma.championship.deleteMany();
    await prisma.match.deleteMany();
    await prisma.matchInfo.deleteMany();

    await prisma.team.deleteMany();
    await prisma.matchGroup.deleteMany();
    await prisma.player.deleteMany();
    await prisma.config.deleteMany();

    await prisma.user.deleteMany();
    await prisma.userTournament.deleteMany();

    const championship = await prisma.championship.create({
      data: {
        name: "Euro 2024",
      },
    });

    const mainUserTournament = await prisma.userTournament.create({
      data: {
        name: "main-tournament",
      },
    });

    await prisma.config.create({
      data: {
        bettingAllowed: true,
        mainTournament: mainUserTournament.id,
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

      const teamPairs = new Set();
      for (let i = 0; i < newTeams.length; i++) {
        for (let j = i + 1; j < newTeams.length; j++) {
          const pair = [newTeams[i].id, newTeams[j].id].sort().toString();
          if (!teamPairs.has(pair)) {
            teamPairs.add(pair);
            matchId++;
            await prisma.match.create({
              data: {
                matchId,
                matchGroupId: newMatchGroup.id,
                team1Id: newTeams[i].id,
                team2Id: newTeams[j].id,
              },
            });
          }
        }
      }
    }

    for (let index = 0; index < matchInfo.length; index++) {
      await prisma.matchInfo.create({
        data: {
          matchId: matchInfo[index].matchId,
          championshipId: championship.id,
          time: new Date(`${matchInfo[index].date}-${matchInfo[index].time}`),
          arena: matchInfo[index].arena,
          city: matchInfo[index].city,
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
