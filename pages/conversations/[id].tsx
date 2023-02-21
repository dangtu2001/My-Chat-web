import { GetServerSideProps } from "next"
import Sidebar from "../../components/Sidebar"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { auth, db } from "../../config/firebase"
import { Conversation, IMessage } from "../../types"
import { getRecipientEmail } from "../../utils/getRecipientEmail"
import { useAuthState } from "react-firebase-hooks/auth"
import { generateQueryGetMessages, transformMessage } from "../../utils/getMessagesInConversation"
import ConversationScreen from "../../components/ConversationScreen"

interface Props {
    conversation: Conversation,
    messages: IMessage[]
}

const Conversation = ({ conversation, messages }: Props) => {

    const [loggedInUser, _loading, _error] = useAuthState(auth)

    return (
        <div className="flex flex-row">
            {/* <head>
                <title>Conversation with {getRecipientEmail(conversation.users, loggedInUser)}</title>
            </head> */}

            <Sidebar />

            <div className="grow overflow-scroll scrollbar-none h-screen">
                <ConversationScreen conversation={conversation} messages={messages} />
            </div>
        </div>
    )
}

export default Conversation

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async context => {
    const conversationId = context.params?.id

    // get conversation, to know who we are chatting with

    const conversationRef = doc(db, 'conversations', conversationId as string)
    const conversationSnapshot = await getDoc(conversationRef)

    // get all message between logged in user and recipient in this conversation

    const queryMessages = generateQueryGetMessages(conversationId)

    const messagesSnapshot = await getDocs(queryMessages)

    const messages = messagesSnapshot.docs.map(messageDoc => transformMessage(messageDoc))

    return {
        props: {
            conversation: conversationSnapshot.data() as Conversation,
            messages
        }
    }
}