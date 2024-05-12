import { prisma } from "@acme/db";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const emailAddressSchema = z.object({
  email_address: z.string(),
  id: z.string(),
});

const userSchema = z.object({
  id: z.string(),
  email_addresses: z.array(emailAddressSchema),
  first_name: z.string(),
  last_name: z.string(),
});

const deleteUserDataSchema = z.object({
  deleted: z.boolean(),
  id: z.string(),
});

const ClerkResponse = z.object({
  data: z.union([deleteUserDataSchema, userSchema]),
  object: z.literal("event"),
  type: z.enum(["user.created", "user.updated", "user.deleted"]),
});

// called by webhook in clerk when user is created
export default async function handler(req: NextRequest, res: NextResponse) {
  const event = ClerkResponse.parse(req.body);

  console.log("clerkResponse", event);

  if (event.type === "user.deleted") {
    const data = deleteUserDataSchema.parse(event.data);

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }

  if (event.type === "user.updated") {
    const data = userSchema.parse(event.data);

    await prisma.user.update({
      where: {
        userId: data.id,
      },
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: `${data.first_name} ${data.last_name}`,
      },
    });
  }

  if (event.type === "user.created") {
    const data = userSchema.parse(event.data);

    const user = await prisma.user.create({
      data: {
        email: data.email_addresses[0]?.email_address || "",
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: `${data.first_name} ${data.last_name}`,
        userId: data.id,
      },
    });

    const config = await prisma.config.findFirstOrThrow();

    await prisma.userTournament.update({
      where: {
        id: config.mainTournament,
      },
      data: {
        members: {
          connect: {
            email: user.email,
          },
        },
      },
    });
  }

  return res.ok;
}
