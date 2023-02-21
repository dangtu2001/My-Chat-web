import { useAuthState } from "react-firebase-hooks/auth"
import { IMessage } from "../types"
import { auth } from "../config/firebase"

const Message = ({ message }: { message: IMessage }) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth)

  return (
    <div>
      {loggedInUser?.email === message.user ?
        <p className="w-fit break-all max-w-[70%] min-w-[30%] p-5 rounded-lg m-[10px] relative ml-auto bg-[#dcf8c6]">
          {message.text}
          <span className="text-gray-500 p-[10px] text-xs absolute bottom-0 right-0 text-right ">
            {message.sent_at}
          </span>
        </p> :
        <p className="w-fit break-all max-w-[70%] min-w-[30%] p-5 rounded-lg m-[10px] relative bg-[#f5f5f5]">
          {message.text}
          <span className="text-gray-500 p-[10px] text-xs absolute bottom-0 right-0 text-right ">
            {message.sent_at}
          </span>
        </p>
      }
    </div>
  )
}

export default Message