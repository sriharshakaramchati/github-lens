import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { extractGitHubRepoPath, handleError } from '../utils'
import Form, { Inputs } from './form'
import QrMessage from './qrMessage'
// import Device from './static/Device'
// import Gift from './static/Svg/Gift'
import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const statusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'

function Main() {
    const [callbackId, setCallbackId] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [appUrl, setAppUrl] = useState<string | null>(null)

    const getStatus = async (callbackId: string) => {
        const response = await axios.get(statusUrl + `/${callbackId}`)
        setStatus(response.data.status)
    }

    const getCallback = async (input: Inputs) => {
        const params = {
            email: input.email,
            repo: extractGitHubRepoPath(input.repoLink),
        }
        return toast.promise(
            axios.get(getCallbackUrl + '/repo', {
                params,
            }),
            {
                loading: 'Loading..',
                error: (error) => handleError(error),
                success: 'Success',
            }
        )
    }

    const proveIt = async (input: Inputs) => {
        const response = await getCallback(input)
        if (response.status !== 200) {
            throw new Error('Something went wrong')
        }
        setCallbackId(response.data.callbackId)
        setAppUrl(response.data.url)
    }

    useEffect(() => {
        if (!callbackId) return

        const interval = setInterval(() => {
            getStatus(callbackId)
        }, 2000)

        return () => clearInterval(interval)
    }, [callbackId])

    return (
        <Flex
            w='100%'
        >
            <Flex
                flexDirection="column"
                alignItems={{ base: 'center', lg: 'flex-start' }}
                justifyContent="center"
                maxW="full"
                mx="auto"
                textAlign={{ base: 'center', lg: 'start' }}
            >
                <Image src='/gift.svg' mb={10} />
                <Box>
                    <Heading
                        color="#BDFC5A"
                        fontFamily="AgrandirGrandHeavy"
                        lineHeight="62px"
                        fontWeight="extrabold"
                        fontSize="5xl"
                    >
                        Claim your
                    </Heading>
                    <Heading
                        color="white"
                        fontFamily="AgrandirGrandHeavy"
                        lineHeight="62px"
                        fontWeight="extrabold"
                        fontSize="5xl"
                    >
                        Github contributions
                    </Heading>
                    <Heading
                        color="white"
                        fontFamily="AgrandirGrandHeavy"
                        lineHeight="62px"
                        fontWeight="extrabold"
                        fontSize="5xl"
                    >
                        on Lens
                    </Heading>
                </Box>
                <Box mb={12}>
                    <Text
                        fontSize="xl"
                        fontFamily="Fredoka"
                        color="white"
                        opacity="0.6"
                    >
                        Reclaim your github trackrecord, while still being pseudonaonymous on Lens
                    </Text>
                </Box>

                {status === 'verified' ? (
                    <Box mb={12}>
                        <Heading fontFamily="Fredoka" fontSize="3xl" fontWeight="bold" color="#BDFC5A">
                            <span role="img" aria-label="rocket">🚀</span> You are a verified developer on Lens!{' '}
                            <span role="img" aria-label="rocket">🚀</span>
                        </Heading>
                    </Box>
                ) : appUrl && callbackId ? (
                    <QrMessage appUrl={appUrl} />
                ) : (
                    <Form proveIt={proveIt} />
                )}
            </Flex>

            <Box maxW="20%" mx="auto">
                <Image src='/device.png' />
            </Box>
        </Flex>
    )
}

export default Main