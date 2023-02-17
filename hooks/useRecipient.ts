import { useCollection } from 'react-firebase-hooks/firestore';
import { query, collection, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppUser, Conversation } from './../types/index';
import { auth, db } from '../config/firebase';
import { getRecipientEmail } from '../utils/getRecipientEmail';

export const userRecipient = (conversationUsers: Conversation['users']) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)

    // get recipient email
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser)

    // get recipient avata
    const queryGetRecipient = query(collection(db, 'users'), where('email', '==', 'dangtu07122001@gmail.com'))

    const [recipientsSnapshort, __loading, __error] = useCollection(queryGetRecipient)

    // recipientSnapsort could be an empty array
    // so we have to force "?" after docs[0] because there is no data() on "undefined"
    const recipient = recipientsSnapshort?.docs[0]?.data() as AppUser | undefined


    return {
        recipient,
        recipientEmail
    }
}