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
    const [selectedBank,setSelectedBank] = useState(SUPPORTED_BANKS[0]?.provider);
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState<string>("");
    return <div className='w-screen'>
        <Card title='Add Money'>
        <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
        }} />


        </Card>
    </div>

}