import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { PickerComponent, StoreComponent } from 'stipop-react-sdk'
import { auth, db } from '../config/firebase'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'

const MyPickerComponent = (props: {scrollToBottom: () => void, conversationId:string | string[] | undefined}) => {

  const [loggedInUser, _loading, _error] = useAuthState(auth)  

  const [showStore, setShowStore] = useState(false)

  const addStickerToDbAndUpdateLassSeen = async (sticker: any) => {
    // update last seen in 'users' collection
    await setDoc(doc(db, 'users', loggedInUser?.uid as string), {
        lastSeen: serverTimestamp(),
    }, { merge: true })
    // just update what is changed
    // add new message to 'messages' collection
    await addDoc(collection(db, 'messages'), {
        conversation_id: props.conversationId,
        sent_at: serverTimestamp(),
        text: '',
        user: loggedInUser?.email,
        sticker: sticker
    })

    // reset sticker field
    // setSticker('')
    // scroll to bottom
    props.scrollToBottom()
}

  return (
    showStore ? 
    <StoreComponent
    params={{
      apikey: process.env.STICKER_API_KEY as string,
      userId: loggedInUser?.uid as string,
    }}
    downloadParams={{
      isPurchase: 'N'
    }}
    onClose={() => setShowStore(false)}
    />  
    :  
    <PickerComponent
      params={{
          apikey: process.env.STICKER_API_KEY as string,
          userId: loggedInUser?.uid as string,
      }}
      stickerClick={(url: any) => {
          addStickerToDbAndUpdateLassSeen(url.url)
      }}
      storeClick={(e:any) => {
        console.log(e)
          setShowStore(true)
      }}
    />
      
  )
}

export default MyPickerComponent