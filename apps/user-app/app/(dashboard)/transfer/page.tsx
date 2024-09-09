import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Card } from "@repo/ui/card";
async function getBalance(){
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where:{
            userId:Number(session?.user?.id)
        }
    });
    return{
        amount:balance?.amount || 0,
        locked:balance?.amount || 0
    }
}

async function getOnRampTransactions(){
    const session = await getServerSession(authOptions);
    const transaction = await prisma.onRampTransaction.findMany({
        where:{
            userId:Number(session?.user?.id)
        }
    })
    return transaction.map(t => ({
            time:t.startTime,
            amount:t.amount,
            status:t.status,
            provider:t.provider

        }))
    

}

export async function getRecent(){
    const session = await getServerSession(authOptions)
    if(!session?.user?.id){
        throw new Error('User is not authenticated');
    }
    const p2p = await prisma.p2pTransfer.findMany({
        where:{
            OR:[
                {fromUserId:Number(session?.user?.id)},
                {toUserId:Number(session.user.id)},
            
        ]
        },
        orderBy:{
            timestamp:'desc'
        },
        include:{
            fromUser:true,
            toUser:true
        }

    });
    return p2p
}
export default async function() {
    const balance = await getBalance();
    const p2p = await getRecent();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                <Card title="Recent Transactions">
                    <div>
                        {p2p.map((transaction,index) => (
                            <div 
                                key={index}
                                className='p-4 bg-gray-100 border rounded mb-4'>

                                <div className='font-semibold text-lg'>
                                    From:{transaction.fromUser.number ?? "Unknown User"}
                                </div>
                                <div className="text-sm">
                                    To:{transaction.toUser.number ?? "Unknown User"}    
                                </div> 
                                <div className='text-sm'>
                                    Amount:{transaction.amount}
                                </div>   
                                <div className="text-sm">
                                    Date: {new Date(transaction.timestamp).toLocaleString()}
                                 </div>    
                            </div>
                        ))}
                    </div>
                </Card>
                </div>
            </div>
        </div>
    </div>
}
