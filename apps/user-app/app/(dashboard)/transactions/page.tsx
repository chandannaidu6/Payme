import prisma from "@repo/db/client"
import { authOptions } from "../../lib/auth"
import { getServerSession } from "next-auth"
import { Card } from "@repo/ui/card";
async function displayPreviousTransaction(){
    const session = await getServerSession(authOptions);
}
async function getRecent(){
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
async function processingTrans(){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        throw new Error("User not authenticated");
    }
    const failed = await prisma.onRampTransaction.findMany({
        where:{
            userId:Number(session?.user?.id),
            status:"Processing"
        },
        orderBy:{
            startTime:"desc"
        },
        include:{
            user:true
        }
    })
    return failed;

}
async function successTrans(){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        throw new Error("User not authenticated");
    }
    const success = await prisma.onRampTransaction.findMany({
        where:{
            userId:Number(session?.user?.id),
            status:"Success"
        },
        orderBy:{
            startTime:"desc"
        },
        include:{
            user:true
        }
    })
    return success;

}
export  default async  function() {
    const p2p = await getRecent();
    const success = await successTrans();
    const processing  = await processingTrans();
    return <div className='w-screen'>
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transactions
        </div>
        <div className="text-2xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transactions
        </div>
        <div className='flex justify-center'>
        <div className="w-full max-w-3xl pt-2">
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
                <div className="text-2xl text-[#6a51a6] pt-8 mb-8 font-bold">
                    Wallet Transactions
                </div>
                <div className="sm:grid grid-cols-1 gap-4 lg:grid-cols-2 p-4">

                <div className="w-full max-w-2xl pt-2">
                <Card title="Successfull Transactions">
                    <div>
                        {success.map((transaction,index) => (
                            <div 
                                key={index}
                                className='p-4 bg-gray-100 border rounded mb-4'>

                                <div className='font-semibold text-lg'>
                                    From:{transaction.user.number ?? "Unknown User"}
                                </div>
                                <div className='text-sm'>
                                    Amount:{transaction.amount}
                                </div>   
                                <div className="text-sm">
                                    Date: {new Date(transaction.startTime).toLocaleString()}
                                 </div>    
                            </div>
                        ))}
                    </div>
                </Card>

                </div>
                <div className="w-full max-w-2xl pt-4">
                <Card title="Processing Transactions">
                    <div>
                        {processing.map((transaction,index) => (
                            <div 
                                key={index}
                                className='p-4 bg-gray-100 border rounded mb-4'>

                                <div className='font-semibold text-lg'>
                                    From:{transaction.user.number ?? "Unknown User"}
                                </div>
                                <div className='text-sm'>
                                    Amount:{transaction.amount}
                                </div>   
                                <div className="text-sm">
                                    Date: {new Date(transaction.startTime).toLocaleString()}
                                 </div>    
                            </div>
                        ))}
                    </div>
                </Card>
                
                </div>
                </div>
        
    </div>
}