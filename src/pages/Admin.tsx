import React, { useState } from "react";
import { Button, Flex, Image, Text, Box, Container, VStack, Spinner, HStack, Grid, GridItem, Input } from "@chakra-ui/react";
import { Address, useContractRead, useContractWrite } from "wagmi";
import { CirclesWithBar } from "react-loader-spinner";
import { commify } from "../utils";
import bnbLogo from "../assets/images/bnb.png";
import bunnyLogo from "../assets/images/logo-clean-200x200.png";
import { isMobile } from "react-device-detect";
import { ethers } from "ethers";
import MD5 from "crypto-js/md5";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import Header from "../components/Header";
import { send } from "react-ga";

const { formatEther, isAddress } = ethers;

interface Winner {
  prize: number;
  timestamp: number;
  winner: Address;
}
const raffleContractArtifact =  await import("../assets/BaseRaffle.json");
const raffleContractAbi = raffleContractArtifact.abi;

const IBEP20Artifact =  await import("../assets/IBEP20.json");
const IBEP20Abi = IBEP20Artifact.abi;

const tokenRepoArtifact =  await import("../assets/TokenRepo.json");
const tokenRepoAbi = tokenRepoArtifact.abi;

const raffleContractAddress = "0x1D8b5c93E50C5971A63D5951E3dF55c66737AF8B";
const cashBunnyAddress = "0x2F7c6FCE82a4845726C3744df21Dc87788112B66";
const tokenRepoAddress = "0x4882585b8a5c9B4766071485421A6D7E05b25963";

const Admin: React.FC = () => {
    const [searchParams] = useSearchParams();
    const secret = searchParams.get("s") || ""; // Fallback to empty string
    const [isLoading, setIsLoading] = useState(false);
    const [targetAddress, setTargetAddress] = useState("");
    // md5 hash
    const hash = MD5(process.env.REACT_APP_DUMMY_PW || "dummy").toString();
    console.log(hash);
    if (secret !== hash) {
        return (
            <>
            <Container maxW="container.xl" p={2} >
                <Box 
                    ml={"20%"}  
                    w={"80%"} 
                    color="white" 
                    display="flex"
                    alignItems="left" 
                    justifyContent="left" 
                    textAlign="left" 
                    position="relative" 
                    mt={"150px"} 
                    border="1px solid" 
                    as="section" 
                    borderRadius="2xl" 
                    p={2} 
                    pl={8}
                    bg="gray.800"  
                    borderColor="gray.700"
                    p={4}
                >
                    <Text as="h3">Unauthorized 🚫</Text>
                </Box>
            </Container>
            </>
        );
    }
    const [leaderboard, setLeaderBoard] = useState<Winner[]>([]);

    const { 
      isLoading: isLoadingLeaderboard, 
      data: winners 
    } = useContractRead({
      address: raffleContractAddress,
      abi: raffleContractAbi,
      functionName: "getLeaderboard",
      onSuccess(data) {
        // Cast to your Winner[] type
        const allWinners = data as Winner[];
    
        // Sort by timestamp descending (larger = newer).
        const sortedWinners = allWinners.slice().sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );
    
        // Update your state with the sorted array
        setLeaderBoard(sortedWinners);
      },
    });
    
    const {
        write: sendAirdrop,
    } = useContractWrite({
        address: tokenRepoAddress,
        abi: tokenRepoAbi,
        functionName: "transfer",
        args: [
            cashBunnyAddress,
            targetAddress,
            "10150000000000000000000",
        ],
        onSuccess(data) {
            setIsLoading(false);
            console.log("transaction successful");
        },
        onError(error) {
            setIsLoading(false);
            console.log("transaction error");
            const msg = error.message.indexOf("Token already transferred") > -1 ? "Already distributed tokens to this address" : 
            error.message.indexOf("Only owner") > -1 ? "You are not authorized" : 
            error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;

            alert(msg);


            
        }
    });

    const handleClickSendAirdrop = async () => {
        setIsLoading(true);
        sendAirdrop();
    }

  return (
    <Container maxW="container.xl" p={2} >
        <Box 
            w={isMobile ? "90%" : "80%"}
            color="white"
            display="flex"
            alignItems="left"
            justifyContent="left"
            textAlign="left"
            position="relative"
            mt={"150px"}
            border="1px solid" 
            as="section" 
            borderRadius="2xl" 
            p={isMobile ? 2 : 8} 
            bg="gray.800" 
            ml={isMobile?5: "20%"}
            borderColor="gray.700"
        >
          {isMobile ? (
            <>
            <Flex direction="column" gap={1}>
              <Box ml={2}><Text as={"h2"} mb={"20px"} color="#fe9eb4">Admin</Text></Box>
                <Box ml={2} mt={"-50px"}>
                    <HStack>
                        <Box><Text as="h3">Restricted</Text></Box>
                        <Box><Text as="h3" color="#fe9eb4">section</Text></Box>
                        <Box><Text as="h3" color="#fffdb8"></Text></Box>
                    </HStack>
                </Box>



            </Flex>       
            </>
          ): (
            <VStack w="100%" alignItems={"left"} p={2}>
                <Box><Text as={"h2"} mb={"20px"} color="#fe9eb4">Admin</Text></Box>
                  <Box mt={"-50px"}>
                      <HStack>
                            <Box><Text as="h3">Restricted</Text></Box>
                            <Box><Text as="h3" color="#fe9eb4">section</Text></Box>
                          <Box><Text as="h3" color="#fffdb8"></Text></Box>
                      </HStack>
                  </Box>
                <Box  w="100%" border={"1px solid"} borderColor="gray.700" borderRadius="2xl" p={4}>
                  <Grid columns={3} rows={2}>
                    <GridItem colspan={3}>
                        <Text fontWeight={"bold"}>Send airdrop</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        <Input 
                        placeholder="Enter address" 
                        w={"280px"} 
                        h={30} 
                        onChange={(e) => {
                            const address = e.target.value;
                            console.log(address);
                            if (!isAddress(address)) {
                                console.log(`Invalid address: ${address}`);
                                return;
                            }
                            setTargetAddress(address);
                        }}
                        
                        />
                        <Button w="120px" colorScheme="pink" size="md"  h={30} ml={2} onClick={() => handleClickSendAirdrop()}>
                            {isLoading ? (<Spinner size="sm" />) : "Send"} 
                        </Button>
                    </GridItem>
                    </Grid>                 
                </Box>
            </VStack>

          )}
      </Box>

      {isLoadingLeaderboard && (
        <Box className="loader">
          <Spinner
            size="lg"
            />
        </Box>
      )}
    </Container>
  );
};

export default Admin;
