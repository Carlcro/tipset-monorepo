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

    await prisma.matchGroup.deleteMany();
    await prisma.team.deleteMany();
    await prisma.player.deleteMany();
    await prisma.config.deleteMany();

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
      matchId++,
        await prisma.match.create({
          data: {
            matchId,
            matchGroupId: newMatchGroup.id,
            team1Id: newTeams[0].id,
            team2Id: newTeams[1].id,
          },
        });

      await prisma.matchInfo.create({
        data: {
          matchId,
          championshipId: championship.id,
          matchGroupId: newMatchGroup.id,
          time: new Date(
            `${matchInfo[matchId - 1].date}-${matchInfo[matchId - 1].time}`,
          ),
          arena: matchInfo[matchId - 1].arena,
          city: matchInfo[matchId - 1].city,
        },
      });

      matchId++;
      await prisma.match.create({
        data: {
          matchId,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[1].id,
          team2Id: newTeams[2].id,
        },
      });

      await prisma.matchInfo.create({
        data: {
          matchId,
          championshipId: championship.id,
          matchGroupId: newMatchGroup.id,
          time: new Date(
            `${matchInfo[matchId - 1].date}-${matchInfo[matchId - 1].time}`,
          ),
          arena: matchInfo[matchId - 1].arena,
          city: matchInfo[matchId - 1].city,
        },
      });

      matchId++;
      await prisma.match.create({
        data: {
          matchId,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[2].id,
          team2Id: newTeams[3].id,
        },
      });

      await prisma.matchInfo.create({
        data: {
          matchId,
          championshipId: championship.id,
          matchGroupId: newMatchGroup.id,
          time: new Date(
            `${matchInfo[matchId - 1].date}-${matchInfo[matchId - 1].time}`,
          ),
          arena: matchInfo[matchId - 1].arena,
          city: matchInfo[matchId - 1].city,
        },
      });

      matchId++;
      await prisma.match.create({
        data: {
          matchId,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[3].id,
          team2Id: newTeams[0].id,
        },
      });

      await prisma.matchInfo.create({
        data: {
          matchId,
          championshipId: championship.id,
          matchGroupId: newMatchGroup.id,
          time: new Date(
            `${matchInfo[matchId - 1].date}-${matchInfo[matchId - 1].time}`,
          ),
          arena: matchInfo[matchId - 1].arena,
          city: matchInfo[matchId - 1].city,
        },
      });

      matchId++;
      await prisma.match.create({
        data: {
          matchId,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[1].id,
          team2Id: newTeams[3].id,
        },
      });

      await prisma.matchInfo.create({
        data: {
          matchId,
          championshipId: championship.id,
          matchGroupId: newMatchGroup.id,
          time: new Date(
            `${matchInfo[matchId - 1].date}-${matchInfo[matchId - 1].time}`,
          ),
          arena: matchInfo[matchId - 1].arena,
          city: matchInfo[matchId - 1].city,
        },
      });

      matchId++;
      await prisma.match.create({
        data: {
          matchId,
          matchGroupId: newMatchGroup.id,
          team1Id: newTeams[2].id,
          team2Id: newTeams[0].id,
        },
      });

      await prisma.matchInfo.create({
        data: {
          matchId,
          championshipId: championship.id,
          matchGroupId: newMatchGroup.id,
          time: new Date(
            `${matchInfo[matchId - 1].date}-${matchInfo[matchId - 1].time}`,
          ),
          arena: matchInfo[matchId - 1].arena,
          city: matchInfo[matchId - 1].city,
        },
      });
    }

    await prisma.config.create({
      data: {
        bettingAllowed: true,
      },
    });

    console.log("Added data!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
