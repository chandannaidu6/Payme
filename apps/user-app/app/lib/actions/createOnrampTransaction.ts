"use server"
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { v4 as uuidv4 } from 'uuid'; // You can use uuid for a unique token

export async function createOnRampTransaction(provider: string, amount: number) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !session?.user?.id) {
    return {
      message: "Unauthenticated request"
    };
  }

  const token = uuidv4(); // Using uuid to ensure uniqueness
  if (!amount || amount < 0) {
    throw new Error('Negative Money Entered or no money Entered');
  }

  try {
    const transaction = await prisma.onRampTransaction.create({
      data: {
        provider,
        status: "Processing",
        startTime: new Date(),
        token: token,
        userId: Number(session.user.id),
        amount: amount * 100
      }
    });

    return {
      amount,
      token,
      userId: session.user.id,
      message: "Done"
    };
  } catch (error:any) {
    // Log the error to help with debugging
    console.error("Error creating onRampTransaction:", error);
    throw new Error('Transaction creation failed: ' + error.message);
  }
}
