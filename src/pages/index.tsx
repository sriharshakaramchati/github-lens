import { Button, Container, Text , Flex} from '@chakra-ui/react'
import { LensClient, ProfileFragment, production } from '@lens-protocol/client';
import MetaMaskSDK from '@metamask/sdk';
import { useState } from 'react';
import Main from 'src/components/main';
function Home() {
  const lensClient = new LensClient({
    environment: production
  });
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lensProfile, setLensProfile] = useState<ProfileFragment>()
  const authenticate = async () => {
    try {
      setIsLoading(true)
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
  const signInUsingLens = async () => {
    await authenticate()
  }
  // return (
  //   <Container>
  //     {!lensProfile && <Button onClick={signInUsingLens} isLoading={isLoading}>Sign In using Lens</Button>}
  //     {lensProfile && <Text>{lensProfile?.handle}</Text>}
  //   </Container>
  // )

  return <Flex bg='#1F1F1F' minH="100vh"
    alignItems="center"
    w='100vw'
    mx="auto"
    justifyContent="space-between"
    gap="36"
    flexWrap="wrap"
    p={{ base: 2, lg: 10 }}
    py={20}>
    <Main />
  </Flex>
}
export default Home