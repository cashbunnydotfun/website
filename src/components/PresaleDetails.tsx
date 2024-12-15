import React from 'react';
import { Box, HStack, Text, Image } from '@chakra-ui/react';
import { commify } from '../utils';
import bnbLogo from "../assets/images/bnb.png";
import {
    StatRoot,
    StatLabel,
    StatValueText,
  } from "../components/ui/stat";
  
const PresaleDetails = ({ isMobile, balance, tokenPrice, contributions, contributionAmount, tokensPurchased, Logo }) => {
    return (
        <Box bg="gray.600" border="1px solid white" pt={1} pl={4} >
            <StatRoot >
                <StatLabel fontSize="md" lineHeight="5px">
                    Summary
                </StatLabel>
                <Text fontSize={isMobile ? "11px" : "13px"}   fontStyle={"italic"}  mt={-2}>
                    Wallet information and presale details
                 </Text>
            </StatRoot>

            <Box mt={5}>
                <HStack spacing={4}>
                    <Box w={isMobile? "80px": "90px"}>
                        <Text fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}>Balance</Text>
                    </Box>
                    <Box w={isMobile?"80px":"130px"}>
                        <Text
                            color="#fe9eb4"
                            fontWeight="bold"
                            fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}
                        >
                            {commify(Number(balance.data?.formatted).toFixed(5))}
                        </Text>
                    </Box>
                    <Box w="30px" >
                        <Image h={5} src={bnbLogo}  />
                    </Box>
                    <Box w="auto">
                        <Text fontWeight="bold" fontSize={{ base: "12px", sm: "12px", md: "14px", lg: "14px" }}>
                            {isMobile ? "" : <>&nbsp;</>}BNB
                        </Text>
                    </Box>
                </HStack>

                <HStack mt={3} spacing={4} >
                    <Box w={isMobile? "80px": "90px"}>
                        <Text fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}>Token price</Text>
                    </Box>
                    <Box w={isMobile?"80px":"130px"}>
                        <Text
                            color="#fe9eb4"
                            fontWeight="bold"
                            fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}
                        >
                            {Number(commify(tokenPrice)).toFixed(9)}
                        </Text>
                    </Box>
                    <Box w="30px">
                        <Image h={5} src={bnbLogo} />
                    </Box>
                    <Box w="auto">
                        <Text fontWeight="bold" fontSize={{ base: "12px", sm: "12px", md: "14px", lg: "14px" }}>
                            {isMobile ? "" : <>&nbsp;</>}BNB
                        </Text>
                    </Box>
                </HStack>

                <HStack mt={3} spacing={4}>
                    <Box w={isMobile? "80px": "90px"}>
                        <Text fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}>{contributions > 0 ? "Contributed" : "Contributing"}</Text>
                    </Box>
                    <Box w={isMobile?"80px":"130px"}>
                        <Text
                            color="#fe9eb4"
                            fontWeight="bold"
                            fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}
                        >
                            {contributions > 0 ? contributions : contributionAmount}
                        </Text>
                    </Box>
                    <Box w="30px">
                        <Image h={5} src={bnbLogo}  />
                    </Box>
                    <Box w="auto">
                        <Text fontWeight="bold" fontSize={{ base: "12px", sm: "12px", md: "14px", lg: "14px" }}>
                            {isMobile ? "" : <>&nbsp;</>}BNB
                        </Text>
                    </Box>
                </HStack>            

                <HStack spacing={4} mt={3}>
                    <Box w={isMobile? "80px": "90px"}>
                        <Text fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}>
                            {contributions > 0 ? "Balance" : "You get"}
                        </Text>
                    </Box>
                    <Box w={isMobile?"80px":"130px"}>
                        <Text
                            color="#fe9eb4"
                            fontWeight="bold"
                            fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}
                        >
                            {commify(tokensPurchased)}
                        </Text>
                    </Box>
                    <Box w="60px" >
                        <Image w={"20px"}  src={Logo} />
                    </Box>
                    <Box w="auto">
                        <Text fontWeight="bold" ml={-8} fontSize={{ base: "12px", sm: "12px", md: "14px", lg: "14px" }}>
                        &nbsp;$BUNNY
                        </Text>
                    </Box>
                </HStack> 
                {isMobile ? <><br /></> : <></>}               
            </Box>
        </Box>
    );
};

export default PresaleDetails;