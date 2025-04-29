import React, { useState } from "react";
import { Button, Flex, Image, Text, Box, Container, VStack, Spinner, HStack, Grid, GridItem, Input, SimpleGrid } from "@chakra-ui/react";
import { Address, useAccount, useBalance, useContractRead, useContractWrite } from "wagmi";
import { CirclesWithBar } from "react-loader-spinner";
import bunnyLogo from "../assets/images/logo-clean-200x200.png";
import { isMobile } from "react-device-detect";
import { ethers, parseEther } from "ethers";
import MD5 from "crypto-js/md5";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import Header from "../components/Header";
import { send, set } from "react-ga";
import { commify, convertDaysToReadableFormat, timeUntilNextBurn } from "../utils";
import { Toaster, toaster } from "../components/ui/toaster";
import bnbLogo from "../assets/images/bnb.png";
import {
    DrawerRoot,
    DrawerTrigger,
    DrawerBackdrop,
    DrawerContent,
    DrawerCloseTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerBody,
    DrawerFooter,
    DrawerActionTrigger,
} from '../components/ui/drawer'; // Ark UI Drawer components
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

const burnerArtifact =  await import("../assets/Burner.json");
const burnerAbi = burnerArtifact.abi;

const raffleContractAddress = "0xb0730270f910b0b44f50d325e9368fc660c483a9";
const cashBunnyAddress = "0x2F7c6FCE82a4845726C3744df21Dc87788112B66";
const tokenRepoAddress = "0x4882585b8a5c9B4766071485421A6D7E05b25963";
const faucetAddress = "0xffc581a73815cca97345f31665a259ff4cd0c5c3";
const feeDistributor = "0xb9032B12F2738AdE7E1Eb5FC8a71E1bA820916a6";
const burnerAddress = "0xeb444577a4898a61ee4190ff5e3e3470007102b6";
const bannedAddress = "0xEB66E7479555AaE66c2fAcE93443d8f1c7c547B3";

const Admin: React.FC = () => {
    const [searchParams] = useSearchParams();
    const secret = searchParams.get("s") || ""; // Fallback to empty string
    const { address, isConnected } = useAccount();

    const [isLoading, setIsLoading] = useState(false);
    const [targetAddress, setTargetAddress] = useState("");
    const [leaderboard, setLeaderBoard] = useState<Winner[]>([]);
    const [refillFaucet, setRefillFaucet] = useState(false);
    const [txAmount, setTxAmount] = useState(0);
    const [isClearing, setIsClearing] = useState(false);
    const [burnAmount, setBurnAmount] = useState(0);
    const [isBurning, setIsBurning] = useState(false);

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
        data: lastBurnTime
    } = useContractRead({
        address: burnerAddress,
        abi: burnerAbi,
        functionName: "lastBurnTime",
        watch: true,
    });

    const { 
        data: totalPrizePool
     } = useBalance({
        address: raffleContractAddress,
    });

    const {
        data: feeDistributorBunnyBalance,
    } = useContractRead({
        address: cashBunnyAddress,
        abi: IBEP20Abi,
        functionName: "balanceOf",
        args: [feeDistributor],
        watch: true,
    });

    const {
        data: burnerBalance
    } = useContractRead({
        address: cashBunnyAddress,
        abi: IBEP20Abi,
        functionName: "balanceOf",
        args: [burnerAddress],
        watch: true,
    });

    const {
        data: tokenRepoBunnyBalance,
    } = useContractRead({
        address: cashBunnyAddress,
        abi: IBEP20Abi,
        functionName: "balanceOf",
        args: [tokenRepoAddress],
        watch: true,
    });

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
        data: totalTickets
    } = useContractRead({
        address: raffleContractAddress,
        abi: raffleContractAbi,
        functionName: "getTotalTickets",
        watch: true,
    });

    const {
        data: totalParticipants
    } = useContractRead({
        address: raffleContractAddress,
        abi: raffleContractAbi,
        functionName: "getTotalParticipants",
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
            const msg = error.message.indexOf("RaffleNotDueYet") > -1 ? "Raffle draw not due yet 🚫." : 
            error.message.indexOf("Only owner") > -1 ? "You are not authorized 🚫" : 
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

    const {
        write: clearBlacklist
    } = useContractWrite({
        address: tokenRepoAddress,
        abi: tokenRepoAbi,
        functionName: "clearBlacklist",
        args: [cashBunnyAddress],
        onSuccess(data) {
            setIsClearing(false);
            console.log("transaction successful");
            toaster.create({
                title: "Success",
                description: "Blacklist cleared successfully",
            });  
        },
        onError(error) {
            setIsClearing(false);
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

    const {
        write: executeWeeklyBurn
    } = useContractWrite({
        address: burnerAddress,
        abi: burnerAbi,
        functionName: "executeWeeklyBurn",
        onSuccess(data) {
            setIsBurning(false);
            console.log("transaction successful");
            toaster.create({
                title: "Success",
                description: "Weekly burn executed successfully",
            });  
        },
        onError(error) {
            setIsBurning(false);
            console.log("transaction error");
            const msg = error.message.indexOf("NotAuthority") > -1 ? "Not authorized 🚫" :
            error.message.indexOf("TimeNotElapsed") > -1 ? "Not due yet 🚫" :  
            error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;

            toaster.create({
                title: "Error",
                description: msg,
            });  
            
        }
    });

    const {
        write: executeWeeklyBurnByAmt
    } = useContractWrite({
        address: burnerAddress,
        abi: burnerAbi,
        functionName: "executeWeeklyBurnByAmt",
        args: [parseEther(`${burnAmount}`)],
        onSuccess(data) {
            setIsBurning(false);
            console.log("transaction successful");
            toaster.create({
                title: "Success",
                description: "Weekly burn executed successfully",
            });  
        },
        onError(error) {
            setIsBurning(false);
            console.log("transaction error");
            const msg = error.message.indexOf("NotAuthority") > -1 ? "Not authorized 🚫" :
            error.message.indexOf("TimeNotElapsed") > -1 ? "Not due yet 🚫" :  
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
        console.log(`Tx amount is ${txAmount} cond ${Number(txAmount) > 10000000}`);
        if (txAmount == 0 || txAmount > 10000000) {
            console.log(`Invalid amount`);
            toaster.create({
                title: "Error",
                description: "Invalid amount, max 100,000",
            });
            setIsLoading(false);
            return;
        }
        handleSwapAmtAndDistribute();
    }

    const handleClickClearBlacklist = async () => {
        setIsClearing(true);
        clearBlacklist();
    }

    const handleClickExecuteWeeklyBurn = async () => {
        setIsBurning(true);
        executeWeeklyBurn();
    }

    const handleClickExecuteWeeklyBurnByAmt = async () => {
        setIsBurning(true);
        executeWeeklyBurnByAmt();
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
              <Box ml={2}><Text as={"h3"} mb={"20px"} color="#fe9eb4">Admin</Text></Box>
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
                            <Text fontWeight={"bold"} fontSize="xs">Raffle</Text>
                        </Box>
                        <Box ml={-2}>
                            <Text fontWeight={"bold"} fontSize="xs">Burner</Text>
                        </Box>
                        <Box ml={-2}>
                            <Text fontWeight={"bold"} fontSize="xs">Token Repo</Text>
                        </Box>                       
                        <Box>
                            <Text fontWeight={"bold"} fontSize="xs">Distributor</Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs"><a color="#fffdb8" href={"https://bscscan.com/address/"+ raffleContractAddress} target="_blank">
                            {`${raffleContractAddress?.slice(0, 2)}...${raffleContractAddress?.slice(-2)}`}
                            </a></Text>
                        </Box>
                        <Box ml={-2}>
                            <Text fontSize="xs"><a color="#fffdb8" href={"https://bscscan.com/address/"+ burnerAddress} target="_blank">
                            {`${burnerAddress?.slice(0, 2)}...${burnerAddress?.slice(-2)}`}
                            </a></Text>
                        </Box>
                        <Box  ml={-2}>
                            <Text fontSize="xs"><a style={{fontSize:"xs"}} color="#fffdb8" href={"https://bscscan.com/address/"+ tokenRepoAddress} target="_blank">
                            {`${tokenRepoAddress?.slice(0, 2)}...${tokenRepoAddress?.slice(-2)}`}
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
                    <SimpleGrid columns={1} spacing={1} w="80%" mt={10}>
                    <Box>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Time left to next draw</Text></Box>
                            <Box> {convertDaysToReadableFormat(timeLeftToDraw)}</Box>
                            <Box>
                            <Button w="120px" colorScheme="pink" size="md" mt={2}  h={30} onClick={() => handleClickDraw()}>
                                {isLoading ? (<Spinner size="sm" />) : "Draw"} 
                            </Button>
                            </Box>
                        </VStack>
                    </Box>
                    <Box mt={5}>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Total tickets</Text></Box>
                            <Box>{Number(`${totalTickets || 0}`)}</Box>
                        </VStack>
                    </Box>
                    <Box mt={2}>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Total participants</Text></Box>
                            <Box>{Number(`${totalParticipants || 0}`)}</Box>
                        </VStack>
                    </Box>
                    <Box mt={2}>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Balance</Text></Box>
                            <Box>
                                <HStack>
                                    <Box>{commify(Number(`${totalPrizePool?.formatted || 0}`))}</Box>
                                    <Box> <Image src={bnbLogo} w="20px"></Image></Box>
                                    <Box> <Text fontSize="sm">(BNB)</Text></Box>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                    </SimpleGrid>
                  {/* <GridItem colspan={3} >
                        <Text color="#fffdb8" fontWeight={"bold"}>Time left to next draw</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        {convertDaysToReadableFormat(timeLeftToDraw)}
                    </GridItem>
                    <GridItem colspan={3}>
                    <Button w="140px" colorScheme="pink" size="md" mt={2}  h={30} onClick={() => handleClickDraw()}>
                            {isLoading ? (<Spinner size="sm" />) : "Draw"} 
                        </Button>
                    </GridItem> */}
                    <Grid mt={2}>
                    <GridItem mt={5} colspan={3}>
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
                        <Button disabled={targetAddress == ""} w="140px" mt={2} colorScheme="pink" size="md"  h={30} onClick={() => handleClickSendAirdrop()}>
                            {isLoading ? (<Spinner size="sm" />) : "Send"} 
                        </Button>
                        <DrawerRoot>
                        <DrawerTrigger asChild>
                            <Button 
                                border={ "1px solid" }
                                borderColor={"gray"}
                                variant="outline" 
                                h={30} 
                                ml={2} 
                                mt={2}
                                w="150px" 
                            >
                                {isLoading ? <Spinner size="sm" /> : <Text fontSize={isMobile?"12px": "13px"}>Advanced</Text>}
                            </Button>
                        </DrawerTrigger>
                        <DrawerBackdrop />
                        <DrawerContent>
                            <Box mt="80%" ml={5}>
                            <DrawerHeader>
                                <DrawerTitle>
                                    <Text as="h3">Advanced</Text>
                                </DrawerTitle>
                                <DrawerCloseTrigger asChild mt="82%" mr={5}>
                                    <Button variant="ghost" size="sm">×</Button>
                                </DrawerCloseTrigger>
                            </DrawerHeader>
                            <DrawerBody>
                             <Box>
                                <HStack>
                                    <Box>
                                        <Text>Balance</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={"sm"} color="white">{commify(formatEther(`${tokenRepoBunnyBalance || 0}`))}</Text>
                                    </Box>
                                    <Box>
                                        <Image src={bunnyLogo} w="15px" />
                                    </Box>
                                    <Box>
                                        <Text fontSize={"sm"} color="white">(BUNNY)</Text>
                                    </Box>
                                </HStack>    
                            </Box>
                            <Box>
                            <HStack>
                                <Box>
                                    <Text>Max transfer</Text>
                                </Box>
                                <Box>
                                    <Text fontSize={"sm"} color="white">5,100</Text>
                                </Box>
                                <Box>
                                    <Image src={bunnyLogo} w="15px" />
                                </Box>
                                <Box>
                                    <Text fontSize={"sm"} color="white">(BUNNY)</Text>
                                </Box>
                            </HStack>
                            
                            </Box>   
                            <Box mt={10}>
                            <Button w="150px" disabled={address == bannedAddress} colorScheme="pink" size="md"  h={30} onClick={() => handleClickClearBlacklist()}>
                                {isClearing ? (<Spinner size="sm" />) : "Clear blacklist"} 
                            </Button> 
                            <Box mt={5} w="250px"><Text fontSize="sm">⚠️ This action will remove all addresses from the airdrop blacklist, proceed with caution.</Text></Box>
                            <Box mt={10}>
                            <DrawerActionTrigger asChild>
                                <Button display={"none"}></Button>
                            </DrawerActionTrigger>
                            </Box>                                  
                            </Box>                              
                            </DrawerBody>
                            </Box>
                        </DrawerContent>
                        </DrawerRoot>                       
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
                                console.log(`Amount is ${amount}`);
                                setTxAmount(amount);
                            }}
                            
                            />
                        <Button w="140px" colorScheme="pink" size="md"  h={30} ml={2} disabled={address == bannedAddress  || txAmount == 0} onClick={() => handleClickSell()}>
                            {isLoading ? (<Spinner size="sm" />) : "Sell"} 
                        </Button>     
                        <HStack mt={5}>
                            <Box><Text fontSize="xs"><b>Balance: </b></Text>     </Box> 
                            <Box><Text fontSize="xs">{commify(formatEther(`${feeDistributorBunnyBalance || 0}`), 4)} ($BUNNY)</Text></Box>
                            <Box><Image src={bunnyLogo} w="15px" /></Box>   
                        </HStack>              
                    </GridItem>
                    <GridItem mt={5} colspan={3}>
                        <VStack alignItems={"left"} mt={5}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Time left to next weekly burn</Text></Box>
                            <Box> {timeUntilNextBurn(Number(lastBurnTime))}</Box>
                            <HStack>
                            <Box>
                            <Button w="120px" colorScheme="pink" size="md"  h={30} disabled={address == bannedAddress} onClick={() => handleClickExecuteWeeklyBurn()}>
                                {isBurning ? (<Spinner size="sm" />) : "Execute"} 
                            </Button>
                            </Box>
                            <Box>
                            <DrawerRoot>
                            <DrawerTrigger asChild>
                                <Button 
                                    border={ "1px solid" }
                                    borderColor={"gray"}
                                    variant="outline" 
                                    h={30}
                                    mt={"1px"} 
                                    w="100px" 
                                >
                                    {isLoading ? <Spinner size="sm" /> : <Text fontSize={isMobile?"12px": "13px"}>Advanced</Text>}
                                </Button>
                            </DrawerTrigger>
                            <DrawerBackdrop />
                            <DrawerContent>
                                <Box mt="80%" ml={5}>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        <Text as="h3">Advanced</Text>
                                    </DrawerTitle>
                                    <DrawerCloseTrigger asChild mt="82%" mr={5}>
                                        <Button variant="ghost" size="sm">×</Button>
                                    </DrawerCloseTrigger>
                                </DrawerHeader>
                                <DrawerBody>
                                    <HStack>
                                    <Input 
                                        placeholder="Enter amount"
                                        w={"150px"}
                                        h={30}
                                        onChange={(e) => {
                                            const amount = e.target.value;
                                            if (Number(amount) > 10000000) {
                                                return;
                                            }
                                            setBurnAmount(amount);
                                        }}
                                    />
                                    <Button 
                                        w="100px" 
                                        size="md"  
                                        h={30} 
                                        disabled={address == bannedAddress || burnAmount == 0}  
                                        onClick={() => handleClickExecuteWeeklyBurnByAmt()}
                                    >
                                        {isBurning ? (<Spinner size="sm" />) : "Execute"}
                                    </Button>
                                    </HStack>
                                    <VStack alignItems={"left"} mt={10}>
                                        <Box>
                                            <HStack>
                                                <Box w="70px">
                                                <Text color="#fffdb8">Burning  </Text>
                                                </Box>
                                                <Box w="100px">
                                                    <Text fontSize={"sm"} color="white">{commify(burnAmount, 2)}</Text>
                                                </Box>
                                                <Box >
                                                <Image src={bunnyLogo} w="15px" />
                                            </Box>
                                            <Box>
                                                <Text fontSize={"sm"} color="white">(BUNNY)</Text>
                                            </Box>
                                            </HStack>
                                            <Box>
                                            <HStack>
                                                <Box w="70px" color="#fffdb8" fontSize={"sm"}>
                                                    <Text>Balance</Text>
                                                </Box>
                                                <Box w="100px" fontSize={"sm"}>
                                                    <Text fontSize={"sm"} color="white">{commify(formatEther(`${burnerBalance || 0}`))}</Text>
                                                </Box>
                                                <Box>
                                                    <Image src={bunnyLogo} w="15px" />
                                                </Box>
                                                <Box>
                                                    <Text fontSize={"sm"} color="white">(BUNNY)</Text>
                                                </Box>
                                            </HStack>    
                                        </Box>
                                        <Box>
                                        <HStack>
                                            <Box w="70px" color="#fffdb8">
                                                <Text fontSize={"sm"}>Max</Text>
                                            </Box>
                                            <Box w="100px">
                                                <Text fontSize={"sm"} color="white">10,000,000</Text>
                                            </Box>
                                            <Box >
                                                <Image src={bunnyLogo} w="15px" />
                                            </Box>
                                            <Box>
                                                <Text fontSize={"sm"} color="white">(BUNNY)</Text>
                                            </Box>
                                        </HStack>
                                        
                                        </Box>
                                        </Box>
                                    </VStack>
                                {/* <Button w="150px" disabled={address == bannedAddress} colorScheme="pink" size="md"  h={30} onClick={() => handleClickClearBlacklist()}>
                                    {isClearing ? (<Spinner size="sm" />) : "Clear blacklist"} 
                                </Button> 
                                <Box mt={5} w="250px"><Text fontSize="sm">⚠️ This action will remove all addresses from the airdrop blacklist, proceed with caution.</Text></Box> */}
                                <Box mt={10}>
                                <DrawerActionTrigger asChild>
                                    <Button display={"none"}></Button>
                                </DrawerActionTrigger>
                                </Box>                                
                                </DrawerBody>
                                </Box>
                            </DrawerContent>
                            </DrawerRoot> 
                            </Box>
                        </HStack>
                            </VStack>
                    </GridItem>
                    </Grid> 
                </Flex>


            </Flex>       
            </>
          ): (
            <VStack w="100%" alignItems={"left"} p={2}>
                <Box><Text as={"h3"} mb={"20px"} color="#fe9eb4">Admin</Text></Box>
                  <Box mt={"-50px"}>
                      <HStack>
                            <Box><Text as="h3">Restricted</Text></Box>
                            <Box><Text as="h3" color="#fe9eb4">section</Text></Box>
                          <Box><Text as="h3" color="#fffdb8"></Text></Box>
                      </HStack>
                  </Box>
                <Box  w="100%" border={"1px solid"} borderColor="gray.700" borderRadius="2xl" px={8} py={4} mt={-2}>
                    <Text fontWeight={"bold"} color="#fffdb8" as="h4">Contracts</Text>
                    <SimpleGrid columns={4} spacing={1} w="80%" mt={-5}>
                        <Box>
                            <Text fontWeight={"bold"}>Token Repo</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Raffle</Text>
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Burner</Text>
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
                            <Text><a color="#fffdb8" href={"https://bscscan.com/address/"+ burnerAddress} target="_blank">
                            {`${burnerAddress?.slice(0, 6)}...${burnerAddress?.slice(-6)}`}
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
                    <SimpleGrid columns={4} spacing={1} w="90%" mt={10}>
                    <Box>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Time left to next draw</Text></Box>
                            <Box> {convertDaysToReadableFormat(timeLeftToDraw)}</Box>
                            <Box>
                            <Button w="120px" colorScheme="pink" size="md" mt={2}  h={30} onClick={() => handleClickDraw()}>
                                {isLoading ? (<Spinner size="sm" />) : "Draw"} 
                            </Button>
                            </Box>
                        </VStack>
                    </Box>
                    <Box>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Total tickets</Text></Box>
                            <Box>{Number(`${totalTickets || 0}`)}</Box>
                        </VStack>
                    </Box>
                    <Box ml={-10}>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Total participants</Text></Box>
                            <Box>{Number(`${totalParticipants || 0}`)}</Box>
                        </VStack>
                    </Box>
                    <Box ml={-10}>
                        <VStack alignItems={"left"}>
                            <Box><Text color="#fffdb8" fontWeight={"bold"}>Balance</Text></Box>
                            <Box>
                                <HStack>
                                    <Box>{commify(Number(`${totalPrizePool?.formatted || 0}`))}</Box>
                                    <Box> <Image src={bnbLogo} w="20px"></Image></Box>
                                    <Box> <Text fontSize="sm">(BNB)</Text></Box>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                    </SimpleGrid>
                    <Grid>
                    {/* <GridItem colspan={3}>
                    <Button w="120px" colorScheme="pink" size="md" mt={2}  h={30} onClick={() => handleClickDraw()}>
                            {isLoading ? (<Spinner size="sm" />) : "Draw"} 
                        </Button>
                    </GridItem> */}

                    <GridItem mt={10} colspan={3}>
                        <Text fontWeight={"bold"} color="#fffdb8">Send airdrop</Text>
                    </GridItem>
                    <GridItem colspan={1}>
                        <HStack>
                            <Box>
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
                        <Button disabled={targetAddress === ""} w="120px" colorScheme="pink" size="md"  h={30} ml={2} onClick={() => handleClickSendAirdrop()}>
                            {isLoading ? (<Spinner size="sm" />) : "Send"} 
                        </Button>                                
                            </Box>
                            <Box>
                            <DrawerRoot>
                            <DrawerTrigger asChild>
                                <Button 
                                    border={ "1px solid" }
                                    borderColor={"gray"}
                                    variant="outline" 
                                    h={30}
                                    mt={"1px"} 
                                    w="100px" 
                                >
                                    {isLoading ? <Spinner size="sm" /> : <Text fontSize={isMobile?"12px": "13px"}>Advanced</Text>}
                                </Button>
                            </DrawerTrigger>
                            <DrawerBackdrop />
                            <DrawerContent>
                                <Box mt="80%" ml={5}>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        <Text as="h3">Advanced</Text>
                                    </DrawerTitle>
                                    <DrawerCloseTrigger asChild mt="82%" mr={5}>
                                        <Button variant="ghost" size="sm">×</Button>
                                    </DrawerCloseTrigger>
                                </DrawerHeader>
                                <DrawerBody>
                                <Button w="150px" disabled={address == bannedAddress} colorScheme="pink" size="md"  h={30} onClick={() => handleClickClearBlacklist()}>
                                    {isClearing ? (<Spinner size="sm" />) : "Clear blacklist"} 
                                </Button> 
                                <Box mt={5} w="250px"><Text fontSize="sm">⚠️ This action will remove all addresses from the airdrop blacklist, proceed with caution.</Text></Box>
                                <Box mt={10}>
                                <DrawerActionTrigger asChild>
                                    <Button display={"none"}></Button>
                                </DrawerActionTrigger>
                                </Box>                                
                                </DrawerBody>
                                </Box>
                            </DrawerContent>
                            </DrawerRoot>                                    
                            </Box>
                        </HStack>
                        <HStack mt={5}>
                            <Box><Text fontSize="xs"><b>Balance: </b></Text>     </Box> 
                            <Box><Text fontSize="xs">{commify(formatEther(`${tokenRepoBunnyBalance || 0}`), 4)} ($BUNNY)</Text></Box>
                            <Box><Image src={bunnyLogo} w="15px" /></Box>   
                        </HStack>
                    
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
                                setTxAmount(amount);
                            }}
                            
                            />
                        <Button w="120px" colorScheme="pink" size="md"  h={30} ml={2} disabled={address == bannedAddress || txAmount == 0}  onClick={() => handleClickSell()}>
                            {isLoading ? (<Spinner size="sm" />) : "Sell"} 
                        </Button>     
                        <HStack mt={5}>
                            <Box><Text fontSize="xs"><b>Balance: </b></Text>     </Box> 
                            <Box><Text fontSize="xs">{commify(formatEther(`${feeDistributorBunnyBalance || 0}`), 4)} ($BUNNY)</Text></Box>
                            <Box><Image src={bunnyLogo} w="15px" /></Box>   
                        </HStack>              
                    </GridItem>
                    {/* <GridItem mt={10} colspan={3}>
                        <Text fontWeight={"bold"} color="#fffdb8">Weekly Burn</Text>
                    </GridItem> */}
                    <GridItem mt={10} >
                        <VStack alignItems={"left"}>
                        <Box><Text color="#fffdb8" fontWeight={"bold"}>Time left to next weekly burn</Text></Box>
                        <Box> {timeUntilNextBurn(Number(lastBurnTime))}</Box>
                        <HStack>
                            <Box>
                            <Button w="120px" colorScheme="pink" size="md"  h={30} disabled={address == bannedAddress} onClick={() => handleClickExecuteWeeklyBurn()}>
                                {isBurning ? (<Spinner size="sm" />) : "Execute"} 
                            </Button>
                            </Box>
                            <Box>
                            <DrawerRoot>
                            <DrawerTrigger asChild>
                                <Button 
                                    border={ "1px solid" }
                                    borderColor={"gray"}
                                    variant="outline" 
                                    h={30}
                                    mt={"1px"} 
                                    w="100px" 
                                >
                                    {isLoading ? <Spinner size="sm" /> : <Text fontSize={isMobile?"12px": "13px"}>Advanced</Text>}
                                </Button>
                            </DrawerTrigger>
                            <DrawerBackdrop />
                            <DrawerContent>
                                <Box mt="80%" ml={5}>
                                <DrawerHeader>
                                    <DrawerTitle>
                                        <Text as="h3">Advanced</Text>
                                    </DrawerTitle>
                                    <DrawerCloseTrigger asChild mt="82%" mr={5}>
                                        <Button variant="ghost" size="sm">×</Button>
                                    </DrawerCloseTrigger>
                                </DrawerHeader>
                                <DrawerBody>
                                    <HStack>
                                    <Input 
                                        placeholder="Enter amount"
                                        w={"150px"}
                                        h={30}
                                        onChange={(e) => {
                                            const amount = e.target.value;
                                            if (Number(amount) > 10000000) {
                                                return;
                                            }
                                            setBurnAmount(amount);
                                        }}
                                    />
                                    <Button 
                                        w="100px" 
                                        size="md"  
                                        h={30} 
                                        disabled={address == bannedAddress || burnAmount == 0}  
                                        onClick={() => handleClickExecuteWeeklyBurnByAmt()}
                                    >
                                        {isBurning ? (<Spinner size="sm" />) : "Execute"}
                                    </Button>
                                    </HStack>
                                    <VStack alignItems={"left"} mt={5}>
                                        <Box>
                                            <HStack>
                                                <Box>
                                                <Text color="#fffdb8" fontWeight={"bold"}>Burning  </Text>
                                                </Box>
                                                <Box w="100px">
                                                    <Text fontSize={"sm"} color="white">{commify(burnAmount, 2)}</Text>
                                                </Box>
                                                <Box>
                                                <Text color="#fffdb8" fontWeight={"bold"}>$BUNNY </Text>
                                                </Box>
                                            </HStack>
                                        
                                        </Box>
                                    </VStack>
                                {/* <Button w="150px" disabled={address == bannedAddress} colorScheme="pink" size="md"  h={30} onClick={() => handleClickClearBlacklist()}>
                                    {isClearing ? (<Spinner size="sm" />) : "Clear blacklist"} 
                                </Button> 
                                <Box mt={5} w="250px"><Text fontSize="sm">⚠️ This action will remove all addresses from the airdrop blacklist, proceed with caution.</Text></Box> */}
                                <Box mt={10}>
                                <DrawerActionTrigger asChild>
                                    <Button display={"none"}></Button>
                                </DrawerActionTrigger>
                                </Box>                                
                                </DrawerBody>
                                </Box>
                            </DrawerContent>
                            </DrawerRoot> 
                            </Box>
                        </HStack>

                        <HStack mt={3}>
                            <Box><Text fontSize="xs"><b>Balance: </b></Text>     </Box> 
                            <Box><Text fontSize="xs">{commify(formatEther(`${burnerBalance || 0}`), 4)} ($BUNNY)</Text></Box>
                            <Box><Image src={bunnyLogo} w="15px" /></Box>   
                        </HStack> 
                        </VStack>
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
