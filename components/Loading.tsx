import Image from "next/image"
import MyChatApp from '../public/images/Tu1.png'
import { CircularProgress } from "@mui/material"
const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className='mb-12'>
                <Image src={MyChatApp} alt='my chat app' height={200} width={200} />
            </div>
            <CircularProgress />
        </div>
    )
}

export default Loading