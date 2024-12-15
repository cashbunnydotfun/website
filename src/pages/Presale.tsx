import React, { useEffect, useState } from "react";
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
  Flex
} from "@chakra-ui/react";
import { useAccount, useBalance, useContractWrite, useContractRead } from "wagmi";
import { isMobile } from "react-device-detect";
import { Slider } from "../components/ui/slider"
import {
  StatRoot,
  StatLabel,
  StatValueText,
} from "../components/ui/stat";

import { Toaster, toaster } from "../components/ui/toaster"
import { useSearchParams } from "react-router-dom"; // Import useSearchParams

import { commify, generateBytes32String } from "../utils";
import Logo from "../assets/images/logo-clean-200x200.png";
import { ethers, formatEther, parseEther, encodeBytes32String } from "ethers"; // Import ethers.js
import { ProgressLabel, ProgressBar, ProgressRoot, ProgressValueText } from "../components/ui/progress"
import PresaleDetails from "../components/PresaleDetails";
import usePresaleContract from '../hooks/usePresaleContract';
import { set } from "react-ga";
import bnbLogo from "../assets/images/bnb.png";
import tokenArtifact from "../assets/IBEP20.json";
import {
  NumberInputField,
  NumberInputLabel,
  NumberInputRoot,
} from "../components/ui/number-input"
import Countdown from "../components/Countdown";
import config from '../config';

const { environment, presaleContractAddress, tokenAddress } = config;
const PresaleArtifact = await import(`../assets/Presale.json`);
const PresaleAbi = PresaleArtifact.abi;

const Presale: React.FC = () => {
  const { address, isConnected } = useAccount();
  // Parse the referral code from the URL
  const [searchParams] = useSearchParams();
  const urlReferralCode = searchParams.get("r") || ""; // Fallback to empty string

  const tokenPrice = 0.000000067;
  const targetDate = new Date("2025-01-13T00:00:00Z").getTime();
  const hardCap = 100;
  const softCap = 25;
  // State for contribution and presale data
  const [timeLeft, setTimeLeft] = useState("00:00:00"); // Example default

  const [allowance, setAllowance] = useState(0);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [tokensPurchased, setTokensPurchased] = useState(0);

  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [progress, setProgress] = useState(null);
  const [progressSc, setProgressSc] = useState(null);

  const presaleUrl = `${environment == "development" ? "http://localhost:5173":"https://cashbunny.fun"}/presale?r=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(presaleUrl).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleAddAmount = () => {
    // Determine the number of decimals in contributionAmount
    const decimals = String(contributionAmount).includes(".")
      ? String(contributionAmount).split(".")[1].length
      : 0;
  
        console.log(`decimals: ${decimals} contributionAmount: ${contributionAmount}`);
    // Compute the step size based on the number of decimals
    const step = 1 / Math.pow(10, decimals);
  
    // Calculate the new amount and ensure it doesn't exceed 5
    const number = (Number(contributionAmount) + step).toFixed(decimals <= 10 ? decimals: 10);
    if (Number(number) > 5) {
      return;
    }
  
    setContributionAmount(number);
  };
  
  const handleSubtractAmount = () => {
    // Determine the number of decimals in contributionAmount
    const decimals = String(contributionAmount).includes(".")
      ? String(contributionAmount).split(".")[1].length
      : 0;
  
    // Compute the step size based on the number of decimals
    const step = 1 / Math.pow(10, decimals);
  
    // Calculate the new amount and ensure it doesn't go below 0
    const number = (Number(contributionAmount) - step).toFixed(decimals <= 10 ? decimals: 10);
    if (Number(number) <= 0) {
      return;
    }
  
    setContributionAmount(number);
  };
  
  let { 
    totalRaised,
    participantCount,
    finalized,
    softCapReached,
    contributions,
    totalReferred,
    referralCount
  } = usePresaleContract(
    "bsc",
    address,
    referralCode
  );

  const { refetch: fetchPresaleInfo } = usePresaleContract(
    "bsc",
    address,
    urlReferralCode
  );

   contributions = Number(formatEther(contributions)).toFixed(4);

  const balance =  useBalance({
    address: address,
  });
  
  const { refetch: refetchBalance } = useBalance({
    address: address,
  });

  const presaleData = {
    isMobile,
    balance,
    tokenPrice,
    contributions,
    contributionAmount,
    tokensPurchased,
    Logo
};

  const { data: bunnyBalance } = 
  useContractRead({
    address: tokenAddress,
    abi: tokenArtifact.abi,
    functionName: "balanceOf",
    args: [address],
  });

  const { 
    isLoading: contributing, 
    write: contribute 
  } = useContractWrite({
    address: presaleContractAddress,
    abi: PresaleAbi,
    functionName: "contribute",
    args: [generateBytes32String(urlReferralCode)],
    onSuccess(data) {
      console.log(`transaction successful: ${data.hash} referral code: ${urlReferralCode}`);
      refetchBalance();
      fetchPresaleInfo();
      toaster.create({
        title: "Success",
        description: "Thanks for contributing!",
      })
      setTimeout(() => {
        window.location.reload();
    }, 3000); // 3000ms = 3 seconds
    },
    onError(error) {
      const msg = error.message.indexOf("exceeds the balance of the account") > -1 ? "Insufficient balance" : 
                  error.message.indexOf("Already contributed") > -1 ? "Already contributed" : 
                  error.message.toString().indexOf("User rejected the request.") > -1  ? "Rejected operation" : error.message;
      toaster.create({
        title: "Error",
        description: msg,
      })
      console.log(error)
      console.error("failed:", error);
    }
  }); 

  useEffect(() => {
    const progress = (totalRaised / hardCap) * 100;
    const progressSc = (totalRaised / softCap) * 100;

    setProgress(progress);
    setProgressSc(progressSc);
  }
  , [totalRaised]);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!isConnected || !address) return;

      try {
        const response = await fetch(`${environment == "development" ? "http://localhost:3000" : "https://presale.cashbunny.fun"}/referral`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });

        const data = await response.json();

        if (response.ok) {
          setReferralCode(data.referralCode);
          setErrorMessage('');
        } else {
          setErrorMessage(data.error || 'An error occurred while fetching the referral code.');
        }
      } catch (error) {
        setErrorMessage('Failed to connect to the server. Please try again later.');
        console.error('Error fetching referral code:', error);
      }
    };

    fetchReferralCode();
  }, [isConnected, address]); // Run whenever isConnected or address changes

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("--:--:--:--");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `<HStack><Box><Text>${String(days).padStart(2, "0")}</Text></Box><Box><Text fontSize:"8px">(d)</Text></Box>:` +
        `<Box><Text>${String(hours).padStart(2, "0")}</Text></Box><Box><label style={{fontSize:"11px"}}>(h)</label></Box>:` +
        `</HStack>`
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [targetDate]);


  useEffect(() => {
    const tokensPurchased = Number(contributionAmount / tokenPrice).toFixed(4);
    setTokensPurchased(
      tokensPurchased
    );
  }, [contributionAmount]);

  return (
    <Container maxW="container.xl" p={2} >
      <Box
        // as="section"
        // p={{ base: "4vh", md: "8vh" }}
        // my={10}
        w="100%"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="left"
        position="relative"
        mt={"150px"}
      >
        <VStack spacing={8} w="full" px={4}>
          <Box w="full" maxW="1000px" ml={isMobile?0:"18%"}>
          <VStack spacing={4} w="full" align="center">
            {/* Content Box */}
            <Box
              w="full"
              maxW="1000px"
              p={4}
              // borderRadius="lg"
              // border="2px solid white"
              // bg="#2d2f33"
              boxShadow="lg"
            >
            {/* Welcome and Stats Section */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
              <Box 
                p={2} 
                // border="1px solid white"
              >
                <HStack>
                  <Box>
                    <Text fontSize="lg" color="white">
                      Welcome
                    </Text>
                  </Box>
                  <Box>
                  <Text fontSize={isMobile ? "sm": "lg"} fontWeight="bold" color="#fe9eb4">
                  {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "Not connected"}
                </Text>
                  </Box>
                </HStack>
              </Box>
              <Box
                textAlign={{ base: "left", md: "right" }}
                h={"100%"}
                // border="1px solid white"
                display="flex"
                flexDirection="column"
                gap={0}
                pr={10}
                pl={5}
              >
              <Flex flexWrap="wrap" justifyContent="flex-start" gap={"20px"} mt={isMobile? 5:0}>
                <Box w="auto" >
                  <StatRoot>
                    <StatLabel fontSize="sm" lineHeight="5px">
                      Contributed
                    </StatLabel>
                    <StatValueText
                      value={totalRaised}
                      fontSize="md"
                      lineHeight="5px"
                      color="#fe9eb4"
                    />
                  </StatRoot>
                </Box>

                <Box w="auto">
                  <StatRoot>
                    <StatLabel fontSize="sm" lineHeight="5px">
                      # Contributors
                    </StatLabel>
                    <StatValueText fontSize="md" lineHeight="1px" value={participantCount} color="#fe9eb4" />
                  </StatRoot>
                </Box>

                <Box w="160px">
                  <StatRoot>
                    <StatLabel fontSize="sm" lineHeight="5px">
                      <Box ml={isMobile?0:-25}>
                      Time Left
                      </Box>
                    </StatLabel>
                    <StatValueText w={"90px"} fontSize="md" color="#fe9eb4">
                      <Box mt="-30px">
                        <Countdown targetDate={targetDate} />
                      </Box>
                    </StatValueText>
                  </StatRoot>
                </Box>
              </Flex>
              </Box>
          </SimpleGrid>
            <Box w={isMobile?"88%":"auto"} ml={isMobile?5:"52%"} mt={2} >
              <ProgressRoot value={timeLeft != "00:00:00:00" ? progress : null} max={100}  maxW="sm" size="lg">
                <HStack gap="5">
                  <Box mt={5} >
                    <ProgressLabel >Progress 
                      <br /> 
                      <br />
                    </ProgressLabel>
                  </Box>
                  <ProgressBar flex="1" defaultValue={0} />
                  <ProgressValueText color="#fe9eb4">{Number(progress).toFixed(2)}%</ProgressValueText>
                </HStack>
              </ProgressRoot>
              </Box>

              <Box mt={10} ></Box>
              <SimpleGrid columns={{ base: 1, md: 2 }}  gap={4}>
                {contributions == 0 ? (
                    <Box bg="gray.600" border="1px solid white" p={2}>
                    <StatRoot>
                    <StatLabel fontSize="md" lineHeight="5px" ml={2}>
                    Contribution
                    </StatLabel>
                    <Text fontSize={13}  fontStyle={"italic"} m={2} mt={-2}>
                      Choose your contribution amount {isMobile?<br />:<></>} (no minimum, max 5 BNB)
                    </Text>
                    </StatRoot>
                    <HStack spacing={4} align="center" justify="center" mt={2}>
                    <VStack>
                      <Box>
                        <NumberInputRoot 
                          mt={5}
                          ml={isMobile ? 4 : 0}
                          w={isMobile ? "140px": 60}
                          h={"40px"} 
                          resize={"none"} 
                          size="sm" 
                          variant="outline" 
                          value={contributionAmount}
                        >
                          <NumberInputField
                            h={'30px'}
                            defaultValue={0.1}
                            onChange={(e) => {
                                return setContributionAmount(e.target.value);
                              }
                            }
                          />
                        </NumberInputRoot>
                      </Box>
                      <Box>
                      <Slider
                        step={0.001}
                        defaultValue={[0.5]}
                        variant="outline"
                        w={{ base: "140px", sm: "140px", md: "250px", lg: "250px" }} // Responsive widths
                        marks={[
                          { value: 0, label: "0" },
                          { value: 5, label: "5" },
                        ]}
                        min={0}
                        max={5.0}
                        ml={isMobile? 4 : 2}
                        mt="3%"
                        onValueChange={(e) => {

                          return setContributionAmount(e.value);
                      }}
                    />
                    <br />
                      </Box>  
                    </VStack>
                    {allowance === 0 ? (
                    <Box mt={-5}>
                    <VStack h={"100px"} p={2} w={"100px"} ml={4} mt={2}>
                      <HStack>
                      <Box>
                        <Button 
                          backgroundColor={"gray.900"}
                          variant={"outline"}
                          colorScheme="blue"
                          h={"40px"} 
                          borderRadius={10}
                          onClick={handleSubtractAmount}
                        >-</Button>
                      </Box>
                      <Box>
                        <Button 
                          backgroundColor={"gray.900"}
                          variant={"outline"}
                          colorScheme="blue"
                          h={"40px"} 
                          borderRadius={10}
                          onClick={handleAddAmount}
                        >+</Button>
                      </Box>
                      </HStack>
                      <Box>
                      <Button
                        ml={1}
                        variant={"outline"}
                        colorScheme="blue"
                        w={"100px"}
                        fontSize={{ base: "11px", sm: "11px", md: "14px", lg: "14px" }}
                        maxH={40}
                        backgroundColor={"gray.900"}
                        borderRadius={10}
                        disabled={!isConnected || contributionAmount === 0 || contributing}
                        onClick={() => {
                          if (contributionAmount < 0.0001 || contributionAmount > 5) {
                            toaster.create({
                              title: "Error",
                              description: "Invalid amount",
                            })
                            return;
                          }
                          setErrorMessage(""); // Clear any previous error
                          try {
                            contribute({
                              args: [generateBytes32String(urlReferralCode)],
                              from: address,
                              value: parseEther(contributionAmount.toString()),
                            });
                          } catch (error) {
                            console.error("Failed to contribute:", error);
                          }
                        }}
                      >
                      {contributing ? "Loading..." : "Deposit"}
                    </Button>
                    </Box>
                    </VStack>
                    <Toaster />
                    </Box>

                  ) : <></>}
                  </HStack>
                  </Box>): <></>}
                {contributions == 0 ? (
                  <>{isConnected ? <PresaleDetails {...presaleData} /> : 
                  <>
                    <Box bg="gray.600" border="1px solid white" p={4}>
                      <Text fontSize="sm" color="white">
                        Connect your wallet to contribute
                      </Text>
                    </Box>
                  </>}</>
              ): <></>}
            </SimpleGrid>
          <Box 
            mt={3} 
            alignContent={"center"} 
            backgroundColor="gray.600" 
            fontSize="sm" 
            lineHeight="tall" 
            p={4} 
            w={"auto"} 
          >
            <StatRoot ml={1}>
              <StatLabel fontSize="md" lineHeight="5px">
                Referrals
              </StatLabel>
              <Text fontSize={13}  fontStyle={"italic"}  mt={-2}>
                For each user referred you get 3% of their contribution
              </Text>
            </StatRoot>
              <HStack columns={2} p={1} mt={4}>
                  <Box w="80px">
                    <Text>Referred</Text>
                </Box>
                <Box color="#fe9eb4" >
                  {Number(referralCount)}
                </Box><b>users</b>
              </HStack>
              <HStack columns={2} p={1} mt={2}>
                  <Box w="80px">
                  <Text>Earned</Text>
                </Box>
                <Box color="#fe9eb4" >
                  {Number(commify(formatEther(totalReferred) * 0.03)).toFixed(4)}
                </Box><b>BNB</b>
              </HStack>              
            <Box w={isMobile?"100%":"55%"} mt={4} ml={1}>
              {isConnected ? (
                <Flex align="left" gap={1} direction={isMobile? "column" : "row"} alignItems="left" justifyContent="space-between">
                <Box mt={1}>
                  <Text fontSize={"sm"} >Share your referral URL</Text>
                </Box>
                <Box>
                <Text 
                  p={1} 
                  backgroundColor="ivory" 
                  fontStyle="italic" 
                  color="black" 
                  fontSize={"11px"}
                  height={"25px"}
                  w={"260px"}
                >
                   
                  {presaleUrl}
                </Text>
                </Box>
                <Box>
                  <Button
                  h={8}
                  mt={isMobile?3:-1}
                  w={"80px"}
                  borderRadius={10}
                  onClick={handleCopy}
                  colorScheme="white"
                  variant="ghost"
                  bg="transparent"
                  border="2px solid"
                  color="white"
                  _hover={{ bg: "rgba(0, 0, 255, 0.1)" }}
                  _active={{ bg: "rgba(0, 0, 255, 0.2)" }}
                >
                  {hasCopied ? "Copied!" : "Copy"}
                </Button>
                </Box>
              </Flex>): <>Please login with your wallet to get your referral URL</>}
            </Box>


            </Box>              
        </Box>
      </VStack>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default Presale;
 