import prisma from "@repo/db/client"
import { authOptions } from "../../lib/auth"
import { getServerSession } from "next-auth"

async function displayPreviousTransaction(){
    const session = await getServerSession(authOptions);
}
export default function() {
    return <div>
        Transactions
    </div>
}