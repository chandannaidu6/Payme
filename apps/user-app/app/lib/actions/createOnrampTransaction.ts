"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider:string,amount:number){
    const session = await getServerSession(authOptions);
    if(!session?.user || !session?.user?.id){
        return{
            message:"Unauthenticated request"
        }
    }
    const token = (Math.random()*1000).toString();
    if(!amount || amount < 0){
            throw new Error('Negative Money Entered or no money Entered')
    }
    await prisma.onRampTransaction.create({
        data:{
            provider,
            status:"Processing",
            startTime: new Date(),
            token:token,
            userId: Number(session?.user?.id),
            amount: amount * 100
        }
    });

    return{
        message:"Done"
    }
}