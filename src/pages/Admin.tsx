import React, { useState } from "react";
import { Button, Flex, Image, Text, Box, Container, VStack, Spinner, HStack, Grid, GridItem, Input, SimpleGrid } from "@chakra-ui/react";
import { Address, useContractRead, useContractWrite } from "wagmi";
import { CirclesWithBar } from "react-loader-spinner";
import bunnyLogo from "../assets/images/logo-clean-200x200.png";
import { isMobile } from "react-device-detect";
import { ethers, parseEther } from "ethers";
import MD5 from "crypto-js/md5";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import Header from "../components/Header";
import { send } from "react-ga";
import { commify, convertDaysToReadableFormat, formatLargeNumber } from "../utils";
import { Toaster, toaster } from "../components/ui/toaster";
import bnbLogo from "../assets/images/bnb.png";

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

const feeDistributorArtifact =  await import("../assets/FeeDistributor.json");
const feeDistributorAbi = feeDistributorArtifact.abi;

const raffleContractAddress = "0xb0730270f910b0b44f50d325e9368fc660c483a9";
const cashBunnyAddress = "0x2F7c6FCE82a4845726C3744df21Dc87788112B66";
const tokenRepoAddress = "0x4882585b8a5c9B4766071485421A6D7E05b25963";
const faucetAddress = "0xffc581a73815cca97345f31665a259ff4cd0c5c3";
const feeDistributor = "0xb9032B12F2738AdE7E1Eb5FC8a71E1bA820916a6";

const Admin: React.FC = () => {
    const [searchParams] = useSearchParams();
    const secret = searchParams.get("s") || ""; // Fallback to empty string

    const [isLoading, setIsLoading] = useState(false);
    const [targetAddress, setTargetAddress] = useState("");
    const [leaderboard, setLeaderBoard] = useState<Winner[]>([]);
    const [refillFaucet, setRefillFaucet] = useState(false);
    const [txAmount, setTxAmount] = useState(0);
    
    // md5 hash
    const hash = MD5(process.env.REACT_APP_DUMMY_PW || "dummy").toString();

    if (secret !== hash) {
        return (
            <>
            <Container maxW="container.xl" p={2} >
                <Box 
                    ml={isMobile ? "10%" : "20%"}  
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
    
    const {
        data: feeDistributorBunnyBalance,
    } = useContractRead({
        address: cashBunnyAddress,
        abi: IBEP20Abi,
        functionName: "balanceOf",
        args: [feeDistributor],
        watch: true,
    });

    console.log(`Fee distributor ${formatEther(`${feeDistributorBunnyBalance || 0}`)}`)

    let {
        data: timeLeftToDraw,
        refetch: refetchTimeLeftToDraw,
    } = useContractRead({
        address: raffleContractAddress,
        abi: raffleContractAbi,
        functionName: "getTimeLeftToDraw",
        watch: true,
    });
    
    const {
        write: sendAirdrop,
    } = useContractWrite({
        address: tokenRepoAddress,
        abi: tokenRepoAbi,
        functionName: "transfer",
        args: [
            cashBunnyAddress,
            refillFaucet ? faucetAddress : targetAddress,
            "5100000000000000000000",
        ],
        onSuccess(data) {
            setIsLoading(false);
            console.log("transaction successful");
            toaster.create({
                title: "Success",
                description: "Tokens transferred successfully",
            });  
        },
        onError(error) {
            setIsLoading(false);
            console.log("transaction error");
            const msg = error.message.indexOf("Token already transferred") > -1 ? "Already distributed tokens to this address" : 
            error.message.indexOf("Only owner") > -1 ? "Not authorized 🚫" : 
            error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;

            toaster.create({
                title: "Error",
                description: msg,
            });  
            
        }
    });

    const {
        write: draw,
    } = useContractWrite({
        address: raffleContractAddress,
        abi: raffleContractAbi,
        functionName: "selectWinners",
        onSuccess(data) {
            setIsLoading(false);
            console.log("transaction successful");
            toaster.create({
                title: "Success",
                description: "Draw successful",
            });  
        },
        onError(error) {
            setIsLoading(false);
            console.log("transaction error");
            const msg = error.message.indexOf("RaffleNotDueYet") > -1 ? "Raffle not due yet." : 
            error.message.indexOf("Only owner") > -1 ? "You are not authorized" : 
            error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;

            toaster.create({
                title: "Error",
                description: msg,
            });  
            
        }
    });

    //handleSwapAmtAndDistribute

    const {
        write: handleSwapAmtAndDistribute
    } = useContractWrite({
        address: feeDistributor,
        abi: feeDistributorAbi,
        functionName: "handleSwapAmtAndDistribute",
        args: [parseEther(`${txAmount}`)],
        onSuccess(data) {
            setIsLoading(false);
            console.log("transaction successful");
            toaster.create({
                title: "Success",
                description: "Fees distributed successfully",
            });  
        },
        onError(error) {
            setIsLoading(false);
            console.log("transaction error");
            const msg = error.message.indexOf("Caller is not authorized") > -1 ? "Not authorized 🚫" : 
            error.message.indexOf("Only owner") > -1 ? "You are not authorized" : 
            error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;

            toaster.create({
                title: "Error",
                description: msg,
            });  
            
        }
    });

    const handleClickSendAirdrop = async () => {
        setIsLoading(true);
        sendAirdrop();
    }

    const handleClickDraw = async () => {
        setIsLoading(true);
        draw();
    }

    const handleClickSell = async () => {
        setIsLoading(true);
        handleSwapAmtAndDistribute();
    }

    timeLeftToDraw = Number(`${timeLeftToDraw || 0}`) / 86400;

  return (
    <Container maxW="container.xl" p={2} >
        <Toaster />
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
            ml={isMobile? 5 : "20%"}
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
                <Flex direction="column" p={2}>
                <Text fontWeight={"bold"} color="#fffdb8" as="h4">Contracts</Text>
                <SimpleGrid columns={4} spacing={1} w="100%" mt={-5}>
                        <Box>
                            <Text fontWeight={"bold"} fontSize="xs">Token Repo</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"} fontSize="xs">Raffle</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"} fontSize="xs">Faucet</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"} fontSize="xs">Distributor</Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs"><a style={{fontSize:"xs"}} color="#fffdb8" href={"https://bscscan.com/address/"+ tokenRepoAddress} target="_blank">
                            {`${tokenRepoAddress?.slice(0, 2)}...${tokenRepoAddress?.slice(-2)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs"><a color="#fffdb8" href={"https://bscscan.com/address/"+ raffleContractAddress} target="_blank">
                            {`${raffleContractAddress?.slice(0, 2)}...${raffleContractAddress?.slice(-2)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs"><a color="#fffdb8" href={"https://bscscan.com/address/"+ faucetAddress} target="_blank">
                            {`${faucetAddress?.slice(0, 2)}...${faucetAddress?.slice(-2)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text ><a color="#fffdb8" href={"https://bscscan.com/address/"+ feeDistributor} target="_blank">
                            {`${feeDistributor?.slice(0, 2)}...${feeDistributor?.slice(-2)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text></Text>
                        </Box>
                    </SimpleGrid>                    
                    <Grid mt={10}>
                  <GridItem colspan={3} >
                        <Text color="#fffdb8" fontWeight={"bold"}>Time left to next draw</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        {convertDaysToReadableFormat(timeLeftToDraw)}
                    </GridItem>
                    <GridItem colspan={3}>
                    <Button w="120px" colorScheme="pink" size="md" mt={2}  h={30} onClick={() => handleClickDraw()}>
                            {isLoading ? (<Spinner size="sm" />) : "Draw"} 
                        </Button>
                    </GridItem>

                    <GridItem mt={10} colspan={3}>
                        <Text fontWeight={"bold"} color="#fffdb8">Send airdrop</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        <Input 
                        placeholder="Enter address" 
                        w={"300px"} 
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
                        <Button w="120px" mt={2} colorScheme="pink" size="md"  h={30} onClick={() => handleClickSendAirdrop()}>
                            {isLoading ? (<Spinner size="sm" />) : "Send"} 
                        </Button>
                    </GridItem>
                    <GridItem mt={10} colspan={3}>
                        <Text fontWeight={"bold"} color="#fffdb8">Distribute fees</Text>
                    </GridItem>                            
                    <GridItem>
                        <Input 
                            placeholder="Enter amount" 
                            w={"150px"} 
                            h={30} 
                            onChange={(e) => {
                                const amount = e.target.value;
                                console.log(amount);
                                if (Number(amount) > 100000) {
                                    console.log(`Invalid amount`);
                                    return;
                                }
                                setTxAmount(Number(amount));
                            }}
                            
                            />
                        <Button w="120px" colorScheme="pink" size="md"  h={30} ml={2} onClick={() => handleClickSell()}>
                            {isLoading ? (<Spinner size="sm" />) : "Sell"} 
                        </Button>     
                        <HStack mt={5}>
                            <Box><Text fontSize="xs"><b>Balance: </b></Text>     </Box> 
                            <Box><Text fontSize="xs">{commify(formatEther(`${feeDistributorBunnyBalance || 0}`), 4)} ($BUNNY)</Text></Box>
                            <Box><Image src={bunnyLogo} w="15px" /></Box>   
                        </HStack>              
                    </GridItem>
                    </Grid> 
                </Flex>


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
                <Box  w="100%" border={"1px solid"} borderColor="gray.700" borderRadius="2xl" px={4} py={4}>
                    <Text fontWeight={"bold"} color="#fffdb8" as="h4">Contracts</Text>
                    <SimpleGrid columns={4} spacing={1} w="80%" mt={-5}>
                        <Box>
                            <Text fontWeight={"bold"}>Token Repo</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Raffle</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Faucet</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Fee Distributor</Text>
                        </Box>
                        <Box>
                            <Text><a color="#fffdb8" href={"https://bscscan.com/address/"+ tokenRepoAddress} target="_blank">
                            {`${tokenRepoAddress?.slice(0, 6)}...${tokenRepoAddress?.slice(-6)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text><a color="#fffdb8" href={"https://bscscan.com/address/"+ raffleContractAddress} target="_blank">
                            {`${raffleContractAddress?.slice(0, 6)}...${raffleContractAddress?.slice(-6)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text><a color="#fffdb8" href={"https://bscscan.com/address/"+ faucetAddress} target="_blank">
                            {`${faucetAddress?.slice(0, 6)}...${faucetAddress?.slice(-6)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text><a color="#fffdb8" href={"https://bscscan.com/address/"+ feeDistributor} target="_blank">
                            {`${feeDistributor?.slice(0, 6)}...${feeDistributor?.slice(-6)}`}
                            </a></Text>
                        </Box>
                        <Box>
                            <Text></Text>
                        </Box>
                    </SimpleGrid>
                  {/* <Grid       
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(4, 1fr)"
                    border="1px solid white"
                    >
                    <GridItem colspan={4}>
                        <Text as="h4" fontWeight={"bold"}>Addresses</Text>
                    </GridItem>
                    <br />
                    <GridItem >
                        <Text fontWeight={"bold"}>Token Repo</Text>
                    </GridItem>
                    <GridItem>
                        <Text>Test</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight={"bold"}>Raffle</Text>
                    </GridItem>

                    </Grid> */}
                    {/* <GridItem colspan={2}>
                        <Text><a color="#fffdb8" href={"https://bscscan.com/address/"+ raffleContractAddress} target="_blank">
                        {`${raffleContractAddress?.slice(0, 6)}...${raffleContractAddress?.slice(-6)}`}
                        </a></Text>
                    </GridItem> */}
                    <Grid mt={10}>
                  <GridItem colspan={3} >
                        <Text color="#fffdb8" fontWeight={"bold"}>Time left to next draw</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        {convertDaysToReadableFormat(timeLeftToDraw)}
                    </GridItem>
                    <GridItem colspan={3}>
                    <Button w="120px" colorScheme="pink" size="md" mt={2}  h={30} onClick={() => handleClickDraw()}>
                            {isLoading ? (<Spinner size="sm" />) : "Draw"} 
                        </Button>
                    </GridItem>

                    <GridItem mt={10} colspan={3}>
                        <Text fontWeight={"bold"} color="#fffdb8">Send airdrop</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        <Input 
                            placeholder="Enter address" 
                            w={"450px"} 
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
                    <GridItem mt={10} colspan={3}>
                        <Text fontWeight={"bold"} color="#fffdb8">Distribute fees</Text>
                    </GridItem>                            
                    <GridItem>
                        <Input 
                            placeholder="Enter amount" 
                            w={"150px"} 
                            h={30} 
                            onChange={(e) => {
                                const amount = e.target.value;
                                console.log(amount);
                                if (Number(amount) > 100000) {
                                    console.log(`Invalid amount`);
                                    return;
                                }
                                setTxAmount(Number(amount));
                            }}
                            
                            />
                        <Button w="120px" colorScheme="pink" size="md"  h={30} ml={2} onClick={() => handleClickSell()}>
                            {isLoading ? (<Spinner size="sm" />) : "Sell"} 
                        </Button>     
                        <HStack mt={5}>
                            <Box><Text fontSize="xs"><b>Balance: </b></Text>     </Box> 
                            <Box><Text fontSize="xs">{commify(formatEther(`${feeDistributorBunnyBalance || 0}`), 4)} ($BUNNY)</Text></Box>
                            <Box><Image src={bunnyLogo} w="15px" /></Box>   
                        </HStack>              
                    </GridItem>
                    </Grid>                 
                </Box>
            </VStack>

          )}
      </Box>

      {isLoading && (
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
