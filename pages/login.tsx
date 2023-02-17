import Head from 'next/head'
import { Button } from '@mui/material'
import Image from 'next/image'
import MyChatApp from '../public/images/Tu1.png'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'

const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
    return (
        <div className='h-screen grid place-items-center bg-gray-50'>
            <Head>
                <title>Login</title>
            </Head>
            <div className='flex flex-col items-center p-24 bg-white rounded-md shadow-lg'>
                <div className='mb-12'>
                    <Image src={MyChatApp} alt='my chat app' height={200} width={200} />
                </div>
                <Button variant='outlined' onClick={() => {
                    signInWithGoogle()
                }}>Sign in with google</Button>
            </div>
        </div>
    )
}

export default Login