import { useAuthState } from "react-firebase-hooks/auth"
import { IMessage } from "../types"
import { auth } from "../config/firebase"
import Image from "next/image"

const Message = ({ message }: { message: IMessage }) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth)

  return (
    <div>
      {loggedInUser?.email === message.user ?
        <div className="w-fit break-all max-w-[70%] min-w-[30%] p-5 rounded-lg m-[10px] relative ml-auto bg-[#dcf8c6]">
          {message.sticker ?  
          <Image unoptimized={true} src={message.sticker} alt="message-image" width={100} height={100} /> 
          : message.text}
          <span className="text-gray-500 p-[10px] text-xs absolute bottom-[-5px] right-0 text-right">
            {message.sent_at}
          </span>
        </div> :
        <div className="w-fit break-all max-w-[70%] min-w-[30%] p-5 rounded-lg m-[10px] relative bg-[#f5f5f5]">
          {message.sticker ?
            <Image unoptimized={true} src={message.sticker} alt="message-image" width={500} height={500} />
            : message.text}
          <span className="text-gray-500 p-[10px] text-xs absolute bottom-[-5px] right-0 text-right">
            {message.sent_at}
          </span>
        </div>
      }
    </div>
  )
}

export default Message