import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { extractGitHubRepoPath, handleError } from '../utils'
import { Button, FormControl, Input } from '@chakra-ui/react'
import { LensClient, ProfileFragment, production } from '@lens-protocol/client'
import MetaMaskSDK from '@metamask/sdk'

export type Inputs = {
    lensHandle: string
    email: string
    repoLink: string
}

type FormProps = {
    proveIt: (input: Inputs) => Promise<void>
}

function Form({ proveIt }: FormProps) {
    const [input, setInput] = useState<Inputs>({
        lensHandle: '',
        email: '',
        repoLink: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lensProfile, setLensProfile] = useState<ProfileFragment>()

    const authenticate = async () => {
        try {
            setIsLoading(true)

            const lensClient = new LensClient({
                environment: production
            });


            const MMSDK = new MetaMaskSDK();
            const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
            const res = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
            console.log(res)
            let isAuthenticated = await lensClient.authentication.isAuthenticated()
            if (!isAuthenticated) {
                const challenge = await lensClient.authentication.generateChallenge(res[0])
                console.log(challenge)
                const sign = await ethereum.request({ method: 'personal_sign', params: [res[0], challenge], id: 1 })
                console.log(sign)
                await lensClient.authentication.authenticate(res[0], sign)
            }
            isAuthenticated = await lensClient.authentication.isAuthenticated()
            console.log(isAuthenticated)
            if (isAuthenticated) {
                const allOwnedProfiles = await lensClient.profile.fetchAll({
                    ownedBy: [res[0]],
                });
                allOwnedProfiles.items.forEach((i) => {
                    setLensProfile(i)
                })
            }
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (lensProfile) {
            setInput((prev) => ({
                ...prev,
                lensHandle: lensProfile?.handle,
            }))
        }
    }, [lensProfile])

    return (
        <FormControl
            as="form"
            onSubmit={(e) => {
                e.preventDefault()
                if (lensProfile) {
                    // Show QR
                    const repoFullName = extractGitHubRepoPath(input.repoLink)
                    if (!repoFullName) {
                        toast.error('Invalid repository link')
                    } else {
                        proveIt(input).catch((e) => console.log(handleError(e)))
                    }
                } else {
                    // Authenticate and connect to Lens
                    authenticate()
                }
            }}
            flexDirection="column"
            alignItems={{ base: 'center', lg: 'flex-start' }}
            w="full"
            color="offBlack"
        >
            <Input
                isDisabled
                type="lensHandle"
                name="lensHandle"
                isRequired
                onChange={handleChange}
                value={input.lensHandle}
                placeholder="Your Lens handle (auto-filled when you connect)"
                w="full"
                px={5}
                py={{ base: 5, lg: 3 }}
                bgColor="white"
                color="offBlack"
                borderRadius="xl"
            />
            <Input
                type="email"
                name="email"
                isRequired
                onChange={handleChange}
                value={input.email}
                placeholder="Your email id"
                w="full"
                mt={5}
                px={5}
                py={{ base: 5, lg: 3 }}
                bgColor="white"
                color="offBlack"
                borderRadius="xl"
            />
            <Input
                name="repoLink"
                isRequired
                onChange={handleChange}
                value={input.repoLink}
                placeholder="GitHub repo link"
                w="full"
                mt={5}
                px={5}
                py={{ base: 5, lg: 3 }}
                bgColor="white"
                color="offBlack"
                borderRadius="xl"
            />

            <Button
                type="submit"
                py={{ base: 5, lg: 4 }}
                mt={5}
                transition="colors"
                bgColor={lensProfile ? "yellow" : '#BDFC5A'}
                isLoading={isLoading}
                px={9}
                borderRadius="xl"
                _hover={{ boxShadow: 'lg' }}
            >
                {lensProfile ? 'Prove' : 'Connect using lens'}
            </Button>
        </FormControl>
    )
}

export default Form
