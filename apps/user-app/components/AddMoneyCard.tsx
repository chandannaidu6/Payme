"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";
const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    provider:"HDFC",
    redirectUrl: "http://localhost:3003/hdfcWebhook"
}];

export const AddMoney = () => {
    const [amount,setAmount] = useState("");
    const [provider,setProvider] = useState(SUPPORTED_BANKS[0]?.provider);
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState<string>("");

    const handleMoney = async () => {
        setLoading(true)
        try{
            if (!provider || !redirectUrl) {
                setMessage("Please select a valid provider.");
                setLoading(false);
                return;
              }

              if (!amount || Number(amount) <= 0) {
                setMessage("Please enter a valid amount.");
                setLoading(false);
                return;
              }
            const result = await createOnRampTransaction(provider,Number(amount))
            if(result.message==="Done"){
                try{
                const postResponse = await fetch(redirectUrl,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify({
                        token:result.token,
                        userId:result.userId,
                        amount:amount

                    })
                    
                })
                if(postResponse.ok){
                    setMessage("Money successfully added");
                }else{
                    setMessage("Failed to post to webhook");
                }
            }
                catch(error:any){
                    setMessage("Fetch Error"+error.message)
                }
        

            }else{
                setMessage("Error" + result.message)
            }
        }
        catch(error:any){
            setMessage("Error:" + error.message)
        }
    }
    return (
        <div>
            <Card title="Add Money">
                <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                    setAmount(value);
                }}
                />
            <div className='pt-4'>                <Select
                    onSelect={(value) => {
                    setRedirectUrl(SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || "");
                    setProvider(SUPPORTED_BANKS.find((x) => x.name === value)?.provider);
                }}
                options={SUPPORTED_BANKS.map((x) => ({
                key: x.provider,
                value: x.name,
          }))}
        />
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={handleMoney}>
            {loading ? "Processing..." : "Add Money"}
          </Button>
        </div>
        {message && <div className="pt-4 text-red-500">{message}</div>}
            </Card>
        </div>
    ) 

}