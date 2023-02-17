import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import styled from 'styled-components'
import { IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import MoreVerticalIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import { signOut } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as EmailValidator from 'email-validator'
import { addDoc, collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { AppUser, Conversation } from '../types'
import ConversationSelect from './ConversationSelect'



const StyleUserAvata = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8
    };
`

const StyledSideBarButton = styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
`

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.log('ERROR LOGGING OUT', error)
    }
}


const Sidebar = () => {

    const [loggedInUser, _loading, _error] = useAuthState(auth)

    const [isOpenConversationDialog, setIsOpenconversationDialog] = useState(false)

    const [recipientEmail, setRecipientEmail] = useState('')

    const toggleNewConversationDialog = (isOpen: boolean) => {
        setIsOpenconversationDialog(isOpen)
        if (!isOpen) setRecipientEmail('')
    }

    const closeNewConversationDialog = () => {
        toggleNewConversationDialog(false)
    }

    // check if conversation already exists between the current logged in user and recipient

    const queryGetConversationsForCurrentUser = query(collection(db, 'conversations'), where('users', 'array-contains', loggedInUser?.email))

    const [conversationsSnapshot, __loading, __error] = useCollection(queryGetConversationsForCurrentUser)

    // const queryGetRecipient = query(collection(db, 'users'), where('email', '==', recipientEmail))

    // const [recipientsSnapshort, loading, error] = useCollection(queryGetRecipient)

    // // recipientSnapsort could be an empty array
    // // so we have to force "?" after docs[0] because there is no data() on "undefined"
    // const recipient = recipientsSnapshort?.docs[0]?.data() as AppUser | undefined

    const isConversationAlreadyExists = (recipientEmail: string) => {
        return conversationsSnapshot?.docs.find(conversation => (conversation.data() as Conversation).users.includes(recipientEmail))
    }

    const isInvitingSelf = recipientEmail === loggedInUser?.email

    const createConversation = async () => {
        if (!recipientEmail) return

        if (EmailValidator.validate(recipientEmail) && !isInvitingSelf && !isConversationAlreadyExists(recipientEmail)) {
            // Add conversation user to db "conversations" collection
            // A conversation is between the currently logged in user and the user invited.

            await addDoc(collection(db, 'conversations'), {
                users: [loggedInUser?.email, recipientEmail]
            })

        }

        closeNewConversationDialog()
    }

    return (
        <div className='h-screen min-w-[300px] max-w-[350px] border-r scrollbar-thin scrollbar-w-0 hover:scrollbar-w-2 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-lg'>
            <div className='header flex sticky top-0 z-10 bg-white p-4 h-20 border-b justify-between'>
                <Tooltip title={loggedInUser?.email as string} placement='right'>
                    <StyleUserAvata src={loggedInUser?.photoURL || ''} />
                </Tooltip>
                <div>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon />
                    </IconButton>
                    <IconButton onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </div>
            </div>
            <div className='search flex items-center p-4 rounded-sm'>
                <SearchIcon className='pr-1' />
                <input className='outline-none border-none w-full' placeholder='search in conversations' />

            </div>
            <StyledSideBarButton onClick={() => {
                toggleNewConversationDialog(true)
            }}>start a new conversation</StyledSideBarButton>

            {/* List of conversation */}

            {conversationsSnapshot?.docs.map(conversation => <ConversationSelect key={conversation.id} id={conversation.id} conversationUsers={(conversation.data() as Conversation).users} />)}

            <Dialog open={isOpenConversationDialog} onClose={closeNewConversationDialog}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a Google email address for the user you wish to chat with
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={recipientEmail}
                        onChange={event => {
                            setRecipientEmail(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNewConversationDialog}>Cancel</Button>
                    <Button disabled={!recipientEmail} onClick={createConversation}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Sidebar