import IconButton from "@mui/material/IconButton"
import { useRecipient } from "../hooks/useRecipient"
import { Conversation, IMessage } from "../types"
import { convertFirestoreTimestampToString, generateQueryGetMessages, transformMessage } from "../utils/getMessagesInConversation"
import RecipientAvata from "./RecipientAvata"
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../config/firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import Message from "./Message"
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
// import { PickerComponent } from 'stipop-react-sdk'
import dynamic from 'next/dynamic'

const PickerComponent = dynamic(
    () => import('stipop-react-sdk/dist/PickerComponent'),
    {
        ssr: false,
    })

const ConversationScreen = ({ conversation, messages }: { conversation: Conversation, messages: IMessage[] }) => {
    const [newMessage, setNewMessage] = useState('')

    const [loggedInUser, _loading, _error] = useAuthState(auth)

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showStickerPicker, setShowStickerPicker] = useState(false)

    const conversationUsers = conversation.users

    const { recipient, recipientEmail } = useRecipient(conversationUsers)

    const router = useRouter()
    const conversationId = router.query.id

    const stickerRef = useRef<HTMLDivElement>(null)


    const queryGetMessages = generateQueryGetMessages(conversationId as string)

    const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages)

    useEffect(() => {
        scrollToBottom()
    }, [conversationId])

    useEffect(() => {
        function handleClickOutside(event:any) {
          if (stickerRef.current && !stickerRef.current.contains(event.target)) {
            setShowStickerPicker(false)
          }
        }
    
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
    
        // Unbind the event listener on cleanup
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [stickerRef]);

    const showMessages = () => {
        // If front-end is loading messages behind the scenes, display messages retrived from Next SSR
        if (messagesLoading) {
            return messages.map((message, index) =>
                <Message key={message.id} message={message} />
            )
        }
        // If front-end has finished loading messages , so now we have messagesSnapshot

        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) =>
                <Message key={message.id} message={transformMessage(message)} />
            )
        }

        return null

    }

    const addMessageToDbAndUpdateLassSeen = async () => {
        // update last seen in 'users' collection
        await setDoc(doc(db, 'users', loggedInUser?.uid as string), {
            lastSeen: serverTimestamp(),
        }, { merge: true })
        // just update what is changed
        // add new message to 'messages' collection
        await addDoc(collection(db, 'messages'), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessage,
            user: loggedInUser?.email,
            sticker: ''
        })

        // reset input field
        setNewMessage('')
        // scroll to bottom
        scrollToBottom()
    }

    const addStickerToDbAndUpdateLassSeen = async (sticker: any) => {
        // update last seen in 'users' collection
        await setDoc(doc(db, 'users', loggedInUser?.uid as string), {
            lastSeen: serverTimestamp(),
        }, { merge: true })
        // just update what is changed
        // add new message to 'messages' collection
        await addDoc(collection(db, 'messages'), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: '',
            user: loggedInUser?.email,
            sticker: sticker
        })

        // reset sticker field
        // setSticker('')
        // scroll to bottom
        scrollToBottom()
    }

    const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = event => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (!newMessage) return
            addMessageToDbAndUpdateLassSeen()
        }
    }

    const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        if (!newMessage) return
        addMessageToDbAndUpdateLassSeen()
    }

    const endOfMessagesRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleShowEmojis: MouseEventHandler<HTMLButtonElement> = event => {
        event.stopPropagation()
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleShowStickers: MouseEventHandler<HTMLButtonElement> = event => {
        event.stopPropagation()
        setShowStickerPicker(!showStickerPicker)
    }

    const addRmojisToChatInput = (emojis: any) => {
        let sym = emojis?.unified?.split("-");
        let codesArray: any[] = [];
        sym.forEach((el: any) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setNewMessage(newMessage + emoji);
    }

    return (
        <>
            <div className="sticky bg-white z-20 top-0 flex items-center p-3 h-20 border-b">
                <RecipientAvata recipient={recipient} recipientEmail={recipientEmail} />
                <div className="ml-1 grow">
                    <h3 className="mt-0 mb-1 break-all ">{recipientEmail}</h3>
                    {recipient && <span className="text-sm text-gray-400">Last active: {convertFirestoreTimestampToString(recipient.lastSeen)}</span>}
                </div>
                <div className="flex">
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="p-8 bg-[#e5ded8] min-h-[90vh]">
                {showMessages()}
                {/* for auto scroll to the end when a new message is sent */}
                <div className="mb-[30px]" ref={endOfMessagesRef}></div>
            </div>
            {/* enter new message */}
            <form className="flex items-center p-[10px] sticky bottom-0 bg-white z-20">
                <IconButton onClick={handleShowEmojis}>
                    <InsertEmoticonIcon />
                </IconButton>
                {showEmojiPicker && <div className="absolute bottom-20">
                    <Picker data={data} onEmojiSelect={addRmojisToChatInput} locale='vi' onClickOutside={() => { setShowEmojiPicker(false) }} />
                </div>}
                <IconButton onClick={handleShowStickers}>
                    <FaceRetouchingNaturalIcon />
                </IconButton>
                {showStickerPicker && <div ref={stickerRef} className="absolute bottom-20">
                    <PickerComponent
                        params={{
                            apikey: '80d536bac9feef6570920372556fe027',
                            userId: loggedInUser?.uid as string,
                        }}
                        stickerClick={(url: any) => {
                            // setSticker(url.url)
                            // if (!sticker) return
                            addStickerToDbAndUpdateLassSeen(url.url)
                        }}
                        storeClick={(e:any) => console.log(e)}
                    />
                </div>}
                <input type="text"
                    className="grow outline-none border-none rounded-xl bg-[#f5f5f5] p-4 ml-4 mr-4"
                    value={newMessage} onChange={event => setNewMessage(event.target.value)}
                    onKeyDown={sendMessageOnEnter}
                />
                <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
                    <SendIcon />
                </IconButton>
                <IconButton>
                    <MicIcon />
                </IconButton>
            </form>
        </>
    )
}

export default ConversationScreen