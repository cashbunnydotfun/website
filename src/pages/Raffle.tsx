import React, { useEffect, useState } from "react";
import { Toaster, toaster } from "../components/ui/toaster";
import {
  Container,
  VStack,
  Box,
  SimpleGrid,
  HStack,
  Heading,
  Image,
  Text,
  Button,
  Flex,
  Grid,
  Checkbox,
  GridItem,
  Spinner
} from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputLabel,
    NumberInputRoot,
  } from "../components/ui/number-input"
  import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
  } from "../components/ui/dialog"
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
import ReCAPTCHA from "react-google-recaptcha";

import { useAccount, useBalance, useContractWrite, useContractRead, useNetwork } from "wagmi";
import {ethers } from "ethers";
import { isMobile } from "react-device-detect";
import bnbLogo from "../assets/images/bnb.png";
import bunnyLogo from "../assets/images/logo-clean-200x200.png";
import useRecaptcha from '../hooks/useRecaptcha';

const { formatEther, parseEther } = ethers;
const { MaxUint256 } = ethers;

import { commify, convertDaysToReadableFormat, formatLargeNumber } from "../utils";

const raffleContractArtifact =  await import("../assets/BaseRaffle.json");
const raffleContractAbi = raffleContractArtifact.abi;

const faucetContractArtifact =  await import("../assets/Faucet.json");
const faucetContractAbi = faucetContractArtifact.abi;

const IBEP20Artifact =  await import("../assets/IBEP20.json");
const IBEP20Abi = IBEP20Artifact.abi;

const raffleContractAddress = "0xe70195f2da9Dcd4CE982DeF65744e056Da64B728";
const cashBunnyAddress = "0x2F7c6FCE82a4845726C3744df21Dc87788112B66";
const faucetContractAddress = "0xFfc581A73815cCA97345F31665A259Ff4cd0C5c3";

const FaucetControls = ({isLoading, handleRequestTokens, ...props}) => {
    return (
        <Box w="300px">
        <HStack>
            <Box>
            <a href={"javascript:void(0)"} 
            onClick={handleRequestTokens}>
            {isLoading ? <Spinner size="sm" /> : <Text fontSize={"small"} color="#fffdb8">Get some from the faucet</Text>}
            </a>
            </Box>
        </HStack>
    </Box>
    );
}

const Raffle: React.FC = () => {
    
    const { address, isConnected } = useAccount();
    // const { chain, chains } = useNetwork()
    const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
    const [isRequestingTokens, setIsRequestingTokens] = useState(false);
    const [numTickets, setNumTickets] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    // console.log(`Address: ${address} | Connected: ${isConnected} token is ${token}` );

    const { 
        data: totalPrizePool
     } = useBalance({
        address: raffleContractAddress,
    });
    
    const {
        data: bunnyBalance
    } = useContractRead({
        abi: IBEP20Abi,
        address: cashBunnyAddress,
        functionName: "balanceOf",
        args: [address],
        watch: true
    });

    const {
        data: ticketPrice
    } = useContractRead({
        abi: raffleContractAbi,
        address: raffleContractAddress,
        functionName: "getTicketCost",
        args: [],
        watch: true
    });

    console.log(`Ticket price: ${ticketPrice}`);
    const {
        data: ticketsPerUser
    } = useContractRead({
        abi: raffleContractAbi,
        address: raffleContractAddress,
        functionName: "getTicketsPerUser",
        args: [address],
        watch: true
    });

    const {
        data: timeLeftToDraw
    } = useContractRead({
        abi: raffleContractAbi,
        address: raffleContractAddress,
        functionName: "getTimeLeftToDraw",
        args: [],
        watch: true
    });

    const {
        data: totalParticipants
    } = useContractRead({
        abi: raffleContractAbi,
        address: raffleContractAddress,
        functionName: "getTotalParticipants",
        args: [],
        watch: true
    });

    const {
        data: totalTickets
    } = useContractRead({
        abi: raffleContractAbi,
        address: raffleContractAddress,
        functionName: "getTotalTickets",
        args: [],
        watch: true
    });

    const totalTicketPrice = Number(formatEther(`${ticketPrice || 0}`) * numTickets);
    const {
        write: approve
    } = useContractWrite({
        address: cashBunnyAddress,
        abi: IBEP20Abi,
        functionName: "approve",
        args: [
            raffleContractAddress,
            MaxUint256
        ],
        onSuccess(data) {
            // setIsLoading(false);
            enterRaffle();
        },
        onError(error) {
            console.error(`transaction failed: ${error.message}`);
            setIsPlaying(false);
            // setIsLoading(false);
            // setIsLoadingBtnSell(false);
            // const msg = Number(error.message.toString().indexOf("User rejected the request.")) > -1 ? "Rejected operation" : error.message;
            // toaster.create({
            //     title: "Error",
            //     description: msg,
            // });         
        }
    });


    const {
        write: enterRaffle
    } = useContractWrite({
        address: raffleContractAddress,
        abi: raffleContractAbi,
        functionName: "enterRaffle",
        args: [
            numTickets
        ],
        onSuccess(data) {
            setIsPlaying(false);
            toaster.create({
                title: "Success",
                description: "Thank you for playing!",
            });  
        },
        onError(error) {
            console.error(`transaction failed: ${error.message}`);
            setIsPlaying(false);
            // setIsLoading(false);
            // setIsLoadingBtnSell(false);
            // const msg = Number(error.message.toString().indexOf("User rejected the request.")) > -1 ? "Rejected operation" : error.message;
            // toaster.create({
            //     title: "Error",
            //     description: msg,
            // });         
        }
    });

    const {
        write: selectWinners
    } = useContractWrite({
        address: raffleContractAddress,
        abi: raffleContractAbi,
        functionName: "selectWinners",
        args: [],
        onSuccess(data) {
            toaster.create({
                title: "Success",
                description: "Winners have been selected!",
            });  
        },
        onError(error) {
            console.error(`transaction failed: ${error.message}`);
            // setIsLoading(false);
            // setIsLoadingBtnSell(false);
            // const msg = Number(error.message.toString().indexOf("User rejected the request.")) > -1 ? "Rejected operation" : error.message;
            // toaster.create({
            //     title: "Error",
            //     description: msg,
            // });         
        }
    });

    const {
        write: requestTokens
    } = useContractWrite({
        address: faucetContractAddress,
        abi: faucetContractAbi,
        functionName: "requestTokens",
        args: [],
        onSuccess(data) {
            setIsRequestingTokens(false);
            toaster.create({
                title: "Success",
                description: "Tokens have been requested!",
            });  
        },
        onError(error) {
            console.error(`transaction failed: ${error.message}`);
            setIsRequestingTokens(false);
            const msg = Number(error.message.toString().indexOf("NotAllowedToWithdraw()")) > -1 ? "Already requested" :
                        Number(error.message.toString().indexOf("InvalidEthBalance()")) > -1 ? "You need at least 0.002 BNB on your wallet" :
                        error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;
            toaster.create({
                title: "Error",
                description: msg,
            }); 

            // setIsLoading(false);
            // setIsLoadingBtnSell(false);
            // const msg = Number(error.message.toString().indexOf("User rejected the request.")) > -1 ? "Rejected operation" : error.message;
            // toaster.create({
            //     title: "Error",
            //     description: msg,
            // });         
        }
    });

    const handleSetNumTickets = (e: any) => {
        setNumTickets(e.target.value);
    }

    const handleClickPlay = () => {
        setIsPlaying(true);
        approve();
    }
    
    const handleSelectWinners = () => {
        console.log("Selecting winners...");
        selectWinners();
    }
    
    const handleRequestTokens = () => {
        if (capchaToken) {
            setIsRequestingTokens(true);
            console.log("Requesting tokens...");
            requestTokens();            
            recaptchaRef.current.reset();
        } else {
            setIsRequestingTokens(false);
            toaster.create({
                title: "Error",
                description: "Please complete the captcha",
            });
            handleRecaptcha('');
        }

    }

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
                p={8} 
                bg="gray.800" 
                ml={isMobile?5: "20%"}
                borderColor="gray.700"
            >{isMobile ? (
                <>
                    <Flex direction={"column"} alignItems={"left"} mt={-5}>
                    <VStack alignItems={"left"}>
                        <Box><Text as="h2">Raffle</Text></Box>
                        <Box mt={"-50px"}>
                            <HStack>
                                <Box><Text as="h3">Win</Text></Box>
                                <Box><Text as="h3" color="#fe9eb4"> unlimited </Text></Box>
                                <Box><Text as="h3" color="#fffdb8">BNB</Text></Box>
                            </HStack>
                        </Box>
                    </VStack>
                    <Text fontSize={"medium"} color="#fffdb8"><b>Controls</b></Text>
                   <HStack w="450px">
                    <Box w="90px"><Text fontSize="small"><b>Ticket Price</b></Text></Box>
                    <Box w="80px" fontSize="small">{commify(formatEther(`${ticketPrice || 0}`))}</Box>
                    <Box><Image src={bunnyLogo} w={"20px"}/></Box>
                    <Box><Text fontSize="small" color="ivory">($BUNNY)</Text></Box>

                   </HStack>
                    <HStack w="450px" mt={2}>
                      <Box w="90px"><Text fontSize="small"><b>Your Balance</b></Text></Box>
                      <Box w="80px" fontSize="small">{formatLargeNumber(`${formatEther(`${bunnyBalance || 0}`)}`)} </Box>
                      <Box><Image src={bunnyLogo} w={"18px"}/></Box>
                      <Box><Text fontSize="small" color="ivory">($BUNNY)</Text></Box>
                    </HStack>
                   <Box w="300px">
                        <NumberInputRoot 
                          mt={5}
                          defaultValue="1"
                        //   ml={isMobile ? 4 : 0}
                          w={isMobile ? "140px": 60}
                          h={"40px"} 
                          resize={"none"} 
                          size="sm" 
                          variant="outline" 
                          value={numTickets}
                        >
                            <HStack w="300px" >
                                <Box >
                                <VStack alignItems={"left"}>
                                    <Box>
                                        <Text fontSize="small">Choose tickets:</Text>
                                    </Box>
                                    <Box>
                                    <NumberInputField
                                        h={'42px'}
                                        defaultValue={1}
                                        min={1}
                                        step={1}
                                        onChange={(e) => {
                                            return handleSetNumTickets(e);
                                        }
                                        }
                                        fontSize="small"
                                        w="120px"
                                    />
                                        </Box>
                                </VStack>

                                </Box>
                                <Box>
                                    <Button 
                                        w={"120px"}
                                        border="1px solid white"
                                        color="gray.800"
                                        backgroundColor="#fe9eb4"
                                        variant="outline"
                                        h={'40x'}
                                        mt={7}
                                        disabled={isPlaying || Number(formatEther(`${bunnyBalance || 0}`)) == 0}
                                        onClick={handleClickPlay}
                                    >{isPlaying ? <Spinner size="sm" color="red"/> : "Play"}</Button>
                                </Box>
                            </HStack>
                        </NumberInputRoot>
                        <br />
                      </Box>
                    <Box mt={10}>
                    <Text fontSize={"medium"} color="#fffdb8"><b>Statistics</b></Text>
                    <VStack  alignItems={"left"}>
                        <Box>
                        <HStack>
                            <Box w="140px"><Text fontSize="small"><b>Total tickets held:</b></Text></Box>
                            <Box fontSize="small">#{commify(ticketsPerUser?.toString() || 0)} tickets</Box>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack>
                            <Box w="140px"><Text fontSize="small"><b>Purchasing:</b></Text></Box>
                            <Box fontSize="small">#{commify(numTickets)} tickets</Box>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack>
                            <Box w="140px"><Text fontSize="small"><b>Total Cost</b></Text></Box>
                            <Box fontSize="small">{commify(`${formatEther(`${ticketPrice || 0}`) * numTickets}`)} </Box>
                            <Box fontSize="small">$BUNNY</Box>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack>
                            <Box w="140px"><Text fontSize="small"><b>Total prize pool</b></Text></Box>
                            <Box fontSize="small">{commify(`${totalPrizePool?.formatted || 0}`)} BNB</Box>
                            <Box><Image src={bnbLogo} w="20px" /></Box>
                        </HStack>                            
                        </Box>
                        {/* <Box>
                        <HStack>
                            <Box w="220px"><Text fontSize="16px"><b>Time left to draw:</b></Text></Box>
                            <Box>{Number((timeLeftToDraw?.toString()) / 86400).toFixed(1)} days</Box>
                        </HStack>
                        </Box> */}
                        <Box>
                        <DialogRoot>
                        <DialogTrigger asChild >
                            <Button
                                mt={5}
                                w="160px"
                                h="30px"
                                border="1px solid white"
                                variant="outline"
                            >
                                <Text fontSize="small">See more stats</Text>
                            </Button>
                        </DialogTrigger>
                        <DialogContent marginTop="20%">
                            <DialogHeader>
                            <DialogTitle>
                                <Text fontSize="20px" ml={4}>
                                    Advanced Stats
                                </Text>
                            </DialogTitle>
                            </DialogHeader>
                            <DialogBody mt={10} p={4} mt={"=50px"}>
                            <VStack p={4} w="100%">
                            <Box w="100%">
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">Total Prize Pool</Text>
                                </Box>
                                <Box>
                                <Text>{commify(`${totalPrizePool?.formatted || 0}`)}</Text>
                                </Box>
                                <Box><Image src={bnbLogo} w="20px" /></Box>
                            </HStack>                                
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">Total Participants</Text>
                                </Box>
                                <Box>
                                <Text>{commify(totalParticipants || 0)}</Text>
                                </Box>
                            </HStack>
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">Total Tickets</Text>
                                </Box>
                                <Box>
                                <Text>{commify(totalTickets || 0)}</Text>
                                </Box>
                            </HStack>
                            <HStack>
                                <Box w={"50%"}><Text fontSize="16px"><b>Time left to draw:</b></Text></Box>
                                <Box>{Number((timeLeftToDraw?.toString()) / 86400).toFixed(3)} days</Box>
                            </HStack>
                            </Box>
                            </VStack>

                            </DialogBody>

                            <DialogCloseTrigger />
                        </DialogContent>
                        </DialogRoot>
                        </Box>
                    </VStack>
                    </Box>
                    </Flex>
                </>

            ) : (
                 <Grid 
                    templateRows={"repeat(2, 1fr)"}
                    templateColumns="repeat(2, 1fr)" 
                    gap={2} 
                    w={"90%"} 
                 >  
                 <GridItem colSpan={2} rowSpan={1} >
                    <VStack alignItems={"left"}>
                        <Box><Text color="#fe9eb4" as="h2">Raffle</Text></Box>
                        <Box mt={"-50px"}>
                            <HStack>
                                <Box><Text as="h3">Win</Text></Box>
                                <Box><Text as="h3" color="#fe9eb4"> unlimited </Text></Box>
                                <Box><Text as="h3" color="#fffdb8">BNB</Text></Box>
                                <Box><Text as="h3"> with our decentralized raffle</Text></Box>
                            </HStack>
                        </Box>
                    </VStack>
                </GridItem>
                 <GridItem colSpan={1} rowSpan={1} p={4} w="450px"  mt={bunnyBalance > 0 ? "-40px" : "-80px"}>
                    <Text fontSize={"x-large"} color="#fffdb8"><b>Controls</b></Text>
                   <HStack w="450px">
                    <Box w="140px"><Text fontSize="16px"><b>Ticket Price</b></Text></Box>
                    <Box w="120px">{commify(formatEther(`${ticketPrice || 0}`))}</Box>
                    <Box><Image src={bunnyLogo} w={"20px"}/></Box>
                    <Box><Text color="ivory">($BUNNY)</Text></Box>

                   </HStack>
                    <HStack w="450px" mt={2}>
                      <Box w="140px"><Text fontSize="16px"><b>Your Balance</b></Text></Box>
                      <Box w="120px">{formatLargeNumber(`${formatEther(`${bunnyBalance || 0}`)}`)} </Box>
                      <Box><Image src={bunnyLogo} w={"18px"}/></Box>
                      <Box><Text color="ivory">($BUNNY)</Text></Box>
                    </HStack>
                   <Box w="300px">
                        <NumberInputRoot 
                          mt={5}
                          ml={isMobile ? 4 : 0}
                          w={isMobile ? "140px": 60}
                          h={"40px"} 
                          resize={"none"} 
                          size="sm" 
                          variant="outline" 
                          value={numTickets}
                        >
                            <HStack w="300px" >
                                <Box >
                                <VStack alignItems={"left"}>
                                    <Box>
                                        <Text>Choose tickets:</Text>
                                    </Box>
                                    <Box>
                                        <NumberInputField
                                            h={'35px'}
                                            defaultValue={1}
                                            min={1}
                                            step={1}
                                            onChange={(e) => {
                                                return handleSetNumTickets(e);
                                            }}
                                        />
                                    </Box>
                                </VStack>
                                </Box>
                                <Box>
                                    <Button 
                                        w={"120px"}
                                        border="1px solid white"
                                        color="gray.800"
                                        backgroundColor="#fe9eb4"
                                        variant="outline"
                                        h={'35px'}
                                        mt={8}
                                        disabled={isPlaying || Number(formatEther(`${bunnyBalance || 0}`)) == 0}
                                        onClick={handleClickPlay}
                                    >{isPlaying ? <Spinner size="sm" color="red"/> : "Play"}</Button>
                                </Box>
                            </HStack>
                        </NumberInputRoot>

                    
                        {bunnyBalance == 0 ? 
                        (<Box mt={20} p={2}> 
                                            
                        <DrawerRoot>
                            <VStack gap={1} alignItems={"left"}>
                            <Box >
                                <Text fontSize={"medium"} color="white"><b>No $BUNNY?</b></Text>
                            </Box>

                            </VStack> 
                        <DrawerTrigger asChild>
                            <FaucetControls handleRequestTokens={handleRequestTokens} isLoading={isRequestingTokens}/>
                        </DrawerTrigger>
                        <DrawerBackdrop />
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>
                                    <Text as="h3">Unwrap WETH</Text>
                                </DrawerTitle>
                                <DrawerCloseTrigger asChild mt="82%" mr={5}>
                                    <Button variant="ghost" size="sm">×</Button>
                                </DrawerCloseTrigger>
                            </DrawerHeader>
                            <DrawerBody>
                                {/* <Input
                                    placeholder="Enter amount to unwrap"
                                    onChange={(e) => setWrapAmount(e.target.value)}
                                    w="80%"
                                /> */}
                            </DrawerBody>
                            {/* <DrawerFooter>
                            </DrawerFooter> */}
                        </DrawerContent>
                        </DrawerRoot>
                        <div id="recaptchaContainer" className="rc-anchor-normal-mine" style={{marginTop:"20px", border:"2px solid gray.800"}}>
                          <ReCAPTCHA
                            theme="dark"
                            sitekey={process.env.REACT_APP_SITE_KEY} 
                            onChange={handleRecaptcha}
                        />
                        </div>
                        </Box>) : null}

                      </Box>
                </GridItem>
                <GridItem colSpan={1} rowSpan={1} p={4} ml={50}  mt={bunnyBalance > 0 ? "-40px" : "-80px"}>
                    <Text fontSize={"x-large"} color="#fffdb8"><b>Statistics</b></Text>
                    <VStack  alignItems={"left"}>
                        <Box>
                        <HStack>
                            <Box w="220px"><Text fontSize="16px"><b>Total tickets held:</b></Text></Box>
                            <Box>#{commify(ticketsPerUser?.toString() || 0)} tickets</Box>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack>
                            <Box w="220px"><Text fontSize="16px"><b>Purchasing:</b></Text></Box>
                            <Box>#{commify(numTickets)} tickets</Box>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack>
                            <Box w="220px"><Text fontSize="16px"><b>Total Cost</b></Text></Box>
                            <Box>{commify(`${formatEther(`${ticketPrice || 0}`) * numTickets}`)} </Box>
                            <Box>$BUNNY</Box>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack>
                            <Box w="220px"><Text fontSize="16px"><b>Total prize pool</b></Text></Box>
                            <Box>{commify(`${totalPrizePool?.formatted || 0}`)} BNB</Box>
                            <Box><Image src={bnbLogo} w="20px" /></Box>
                        </HStack>                            
                        </Box>
                        {/* <Box>
                        <HStack>
                            <Box w="220px"><Text fontSize="16px"><b>Time left to draw:</b></Text></Box>
                            <Box>{Number((timeLeftToDraw?.toString()) / 86400).toFixed(1)} days</Box>
                        </HStack>
                        </Box> */}
                        <Box>
                        <DialogRoot>
                        <DialogTrigger asChild >
                            <Button
                                mt={5}
                                w="160px"
                                h="30px"
                                border="1px solid white"
                                variant="outline"
                            >
                                <Text>See more stats</Text>
                            </Button>
                        </DialogTrigger>
                        <DialogContent marginTop="20%">
                            <DialogHeader>
                            <DialogTitle>
                                <Text fontSize="20px" ml={4}>
                                    Advanced Stats
                                </Text>
                            </DialogTitle>
                            </DialogHeader>
                            <DialogBody mt={10} p={4} mt={"=50px"}>
                            <VStack p={4} w="100%">
                            <Box w="100%">
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">💰 Total Prize Pool</Text>
                                </Box>
                                <Box>
                                <Text>{commify(`${totalPrizePool?.formatted || 0}`)}</Text>
                                </Box>
                                <Box><Image src={bnbLogo} w="20px" /></Box>
                            </HStack>   
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">🏆 1st prize</Text>
                                </Box>
                                <Box>
                                <Text>{commify(`${((totalPrizePool?.formatted * 0.9) * 0.5) || 0}`)}</Text>
                                </Box>
                                <Box><Image src={bnbLogo} w="20px" /></Box>
                            </HStack>   
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">🎖️ 2nd & 3rd prizes</Text>
                                </Box>
                                <Box>
                                <Text>{commify(`${((totalPrizePool?.formatted * 0.9) * 0.25) || 0}`, 5)}</Text>
                                </Box>
                                <Box><Image src={bnbLogo} w="20px" /></Box>
                            </HStack>   
                            <Box mt={10}>
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">Total Participants</Text>
                                </Box>
                                <Box>
                                <Text>{commify(totalParticipants || 0)}</Text>
                                </Box>
                            </HStack>
                            <HStack>
                                <Box w={"50%"}>
                                    <Text fontWeight="bold" color="gray">Total Tickets</Text>
                                </Box>
                                <Box>
                                <Text>{commify(totalTickets || 0)}</Text>
                                </Box>
                            </HStack>
                            <HStack>
                                <Box w={"50%"}><Text fontSize="16px"><b>Time left to draw:</b></Text></Box>
                                <Box fontSize="small">{convertDaysToReadableFormat(Number((timeLeftToDraw?.toString()) / 86400).toFixed(3))}</Box>
                            </HStack>
                            </Box>
                            </Box>
                            </VStack>

                            </DialogBody>

                            <DialogCloseTrigger />
                        </DialogContent>
                        </DialogRoot>
                        </Box>
                    </VStack>
                </GridItem>
                {/* <Button
                    mt={5}
                    w="160px"
                    h="30px"
                    border="1px solid white"
                    variant="outline"
                    onClick={handleSelectWinners}
                >
                    <Text>Select Winners</Text>
                </Button> */}
                <br /><br /><br />
                 </Grid>)}
                
            {/* 
                <VStack>
                <Box border="1px solid white">
                    <Text as = "h1" fontSize="4xl" textAlign="left" mb="8" color="white">Raffle</Text>
                </Box>
                <Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={2} w={"500px"} border="1px solid">
                    <GridItem colSpan={1}>
                        Test
                    </GridItem>
                    <GridItem colSpan={1}>  
                        Test
                    </GridItem>
                </Grid>

                </Box>

                
                </VStack> 
            */}
               
            </Box>

        </Container>
    );
};

export default Raffle;