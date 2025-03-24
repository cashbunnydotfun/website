import React, { useState } from "react";
import { Flex, Image, Text, Box, Container, VStack, Spinner, HStack } from "@chakra-ui/react";
import { Address, useContractRead } from "wagmi";
import { CirclesWithBar } from "react-loader-spinner";
import { commify } from "../utils";
import bnbLogo from "../assets/images/bnb.png";
import bunnyLogo from "../assets/images/logo-clean-200x200.png";
import { isMobile } from "react-device-detect";
import { ethers } from "ethers";
const { formatEther } = ethers;

interface Winner {
  prize: number;
  timestamp: number;
  winner: Address;
}
const raffleContractArtifact =  await import("../assets/BaseRaffle.json");
const raffleContractAbi = raffleContractArtifact.abi;

const IBEP20Artifact =  await import("../assets/IBEP20.json");
const IBEP20Abi = IBEP20Artifact.abi;

const raffleContractAddress = "0xb0730270f910b0b44f50d325e9368fc660c483a9";
const cashBunnyAddress = "0x2F7c6FCE82a4845726C3744df21Dc87788112B66";

const LeaderboardPage: React.FC = () => {

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
              <Box ml={2}><Text as={"h2"} mb={"20px"} color="#fe9eb4">Leaderboard</Text></Box>
                <Box ml={2} mt={"-50px"}>
                    <HStack>
                        <Box><Text as="h3">Our top players</Text></Box>
                        <Box><Text as="h3" color="#fe9eb4">in realtime </Text></Box>
                        <Box><Text as="h3" color="#fffdb8"></Text></Box>
                    </HStack>
                </Box>
                <table className="table token-content table-borderless" style={{ width: isMobile ? "100px": "100%" }}>
                  <thead>
                    <tr>
                    <th style={{ width: "1px" }} scope="col">
                    <Text color={"#fffdb8"}><b>Rank</b></Text>
                    </th>
                    <th style={{ width: "5px" }} scope="col">
                    <Text color={"#fffdb8"}><b>Address</b></Text>
                    </th>
                    <th style={{ width: "auto" }} scope="col">
                      <Text color={"#fffdb8"}><b>Prize</b></Text>
                    </th>
                    {/* <th style={{ width: "25%" }} scope="col">
                      <Text color={"#fffdb8"}><b>Date</b></Text>
                    </th> */}
                </tr>
                  </thead>
                  <tbody>
                    {" "}
                    {leaderboard.length == 0 && (
                        <>
                        <Box w="400px">
                            <Text
                                mt={10}
                                fontSize={"large"}
                                color="white"
                                // style={{
                                //     textAlign: "center",
                                //     fontSize: 20,
                                //     fontWeight: 500,
                                //     marginTop: 50,
                                //     width: "400px"
                                // }}
                            >
                                {isLoadingLeaderboard ? (
                                    <Spinner size="sm" />) : "No winners yet"}
                            </Text>
                        </Box>
                        </>
                    )}
                    {leaderboard.length != 0 &&
                        leaderboard.map((addr, index) => {
                          console.log({addr});
                          let winnerAddress = addr.winner;
                          if (winnerAddress === "0x0000000000000000000000000000000000000000") {
                            winnerAddress = "0x475D29fFE98638F81BEAA5061D902f365927420c";
                          }
                          return (
                            <tr key={index}>
                                <td style={{ width: "1px" }} >
                                  <Text color="white">{index + 1}</Text>
                                </td>
                                <td style={{ width: "5px" }}>
                                <>
                                <a href={"https://bscscan.com/address/"+winnerAddress} target="_blank" rel="noreferrer">
                                    {winnerAddress?.slice(0, 4)}...${winnerAddress?.slice(-4)}
                                </a>
                                  </>
                                </td>
                                <td style={{ width: "auto" }}>
                                <HStack>
                                  <Box>
                                    <Text color="white">{commify(formatEther(`${addr.prize}`))}</Text>
                                  </Box>
                                  <Box> <Image src={bnbLogo} alt="BNB Logo" boxSize="20px" /> </Box>
                                </HStack>
                                </td>
                                {/* <td style={{ width: "25%" }}>
                                {new Date(
                                    Number(addr.timestamp) * 1000
                                ).toDateString()}
                                </td> */}
                            </tr>
                            )
                        })}
                  </tbody>
                </table>     
            </Flex>       
            </>
          ): (
            <VStack w="100%" alignItems={"left"} p={2}>
                <Box><Text as={"h2"} mb={"20px"} color="#fe9eb4">Leaderboard</Text></Box>
                  <Box mt={"-50px"}>
                      <HStack>
                          <Box><Text as="h3">Our top players</Text></Box>
                          <Box><Text as="h3" color="#fe9eb4">in realtime </Text></Box>
                          <Box><Text as="h3" color="#fffdb8"></Text></Box>
                      </HStack>
                  </Box>
                <Box  w="100%" border={"1px solid"} borderColor="gray.700" borderRadius="2xl" p={4}>
                <table >
                <thead>
                <tr>
                    <th style={{ width: "5%" }} scope="col">
                    <Text color={"#fffdb8"}><b>Rank</b></Text>
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                    <Text color={"#fffdb8"}><b>Address</b></Text>
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      <Text color={"#fffdb8"}><b>Prize</b></Text>
                    </th>
                    <th style={{ width: "25%" }} scope="col">
                      <Text color={"#fffdb8"}><b>Date</b></Text>
                    </th>
                </tr>
                </thead>
                <tbody>
                {" "}
                {leaderboard.length == 0 && (
                    <>
                    <Box w="400px">
                        <Text
                            mt={10}
                            fontSize={"large"}
                            // style={{
                            //     textAlign: "center",
                            //     fontSize: 20,
                            //     fontWeight: 500,
                            //     marginTop: 50,
                            //     width: "400px"
                            // }}
                        >
                            {isLoadingLeaderboard ? (
                                <Spinner size="sm" />) : "No winners yet"}
                        </Text>
                    </Box>
                    </>
                )}
                {leaderboard.length != 0 &&
                    leaderboard.map((addr, index) => (
                    <tr key={index}>
                        <td style={{ width: "5%" }}>{index + 1}</td>
                        <td style={{ width: "10%" }}>
                         <>
                         <a href={"https://bscscan.com/address/"+addr.winner} target="_blank" rel="noreferrer">
                            {addr.winner?.slice(0, 6)}...${addr.winner?.slice(-6)}
                         </a>
                          </>
                        </td>
                        <td style={{ width: "10%" }}>
                        <HStack>
                          <Box>{commify(formatEther(`${addr.prize}`))}</Box>
                          <Box> <Image src={bnbLogo} alt="BNB Logo" boxSize="20px" /> </Box>
                          <Box> (BNB)</Box>
                        </HStack>
                        </td>
                        <td style={{ width: "25%" }}>
                        {new Date(
                            Number(addr.timestamp) * 1000
                        ).toDateString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>                    
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

export default LeaderboardPage;
