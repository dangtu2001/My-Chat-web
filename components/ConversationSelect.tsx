import { userRecipient } from "../hooks/useRecipient"
import { Conversation } from "../types"
import RecipientAvata from "./RecipientAvata"

const ConversationSelect = ({ id, conversationUsers }: { id: string, conversationUsers: Conversation['users'] }) => {

    const { recipient, recipientEmail } = userRecipient(conversationUsers)

    return (
        <div className="flex items-center cursor-pointer p-4 break-all hover:bg-gray-200">
            <RecipientAvata recipient={recipient} recipientEmail={recipientEmail} />
            <span>{recipientEmail}</span>
        </div>
    )
}

export default ConversationSelect