import { QRCodeSVG } from 'qrcode.react'
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';

const QrMessage = ({ appUrl }: { appUrl: string }) => {
    return (
        <Box>
            <Box mb={4} display={{ base: 'block', lg: 'none' }}>
                <Link
                    color="blue.800"
                    fontSize="lg"
                    textDecoration="underline"
                    target="_blank"
                    rel="noreferrer"
                    href={appUrl}
                >
                    Click here to open on Reclaim Wallet app
                </Link>

                <Heading color="yellow" mt={2}>
                    OR
                </Heading>
            </Box>
            <Box>
                <Flex
                    alignItems="center"
                    justifyContent={{ base: 'center', lg: 'flex-start' }}
                    mb={10}
                    gap={{ base: 1, lg: 10 }}
                >
                    <Box p={2} bgColor="white" borderRadius="2xl">
                        <QRCodeSVG className="w-54 h-54" value={appUrl} size={250} />
                    </Box>

                    {/* <Arrow display={{ base: 'none', lg: 'block' }} /> */}
                </Flex>
                <Text
                    px={{ base: 20, lg: 0 }}
                    pr={{ base: 0, lg: 20 }}
                    fontSize="2xl"
                    color="white"
                    fontFamily="Agrandir"
                >
                    <Text as="span" color="yellow">
                        Scan Qr
                    </Text>{' '}
                    to download the app
                </Text>
            </Box>
        </Box>
    )
}

export default QrMessage
