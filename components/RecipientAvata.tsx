import { Avatar } from "@mui/material"
import { userRecipient } from "../hooks/useRecipient"
import { useEffect, useState } from "react"

type Props = ReturnType<typeof userRecipient>

const RecipientAvata = ({ recipient, recipientEmail }: Props) => {

    return recipient?.photoURL ? (<Avatar src={recipient.photoURL} className="m-2" />) :
        (<Avatar className="m-2">
            {recipientEmail && recipientEmail[0].toUpperCase()}
        </Avatar>)


}

export default RecipientAvata