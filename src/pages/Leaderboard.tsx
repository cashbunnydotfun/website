import React, { useState } from "react";
import { Flex, Image, Text, Box, Container, VStack, Spinner, HStack, Button } from "@chakra-ui/react";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'rank' | 'prize'>('rank');
    const [sortAscending, setSortAscending] = useState(false); // false = descending
    const itemsPerPage = 10;

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
    
    // Sort leaderboard based on current sort field and order
    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
      if (sortField === 'rank') {
        // Sort by timestamp (rank)
        if (sortAscending) {
          return Number(a.timestamp) - Number(b.timestamp); // Oldest first
        } else {
          return Number(b.timestamp) - Number(a.timestamp); // Newest first
        }
      } else {
        // Sort by prize
        if (sortAscending) {
          return Number(a.prize) - Number(b.prize); // Smallest first
        } else {
          return Number(b.prize) - Number(a.prize); // Largest first
        }
      }
    });
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedLeaderboard.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLeaderboard = sortedLeaderboard.slice(startIndex, endIndex);
    
    // Handle sort toggle
    const handleSort = (field: 'rank' | 'prize') => {
      if (field === sortField) {
        // Toggle sort direction if clicking same field
        setSortAscending(!sortAscending);
      } else {
        // Change field and reset to descending
        setSortField(field);
        setSortAscending(false);
      }
      setCurrentPage(1); // Reset to first page when sorting changes
    };

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
            <Flex direction="column" gap={1} w="100%">
              <Box ml={2}><Text as={"h2"} mb={"20px"} color="#fe9eb4">Leaderboard</Text></Box>
                <Box ml={2} mt={"-50px"}>
                    <HStack>
                        <Box><Text as="h3">Our top players</Text></Box>
                        <Box><Text as="h3" color="#fe9eb4">in realtime </Text></Box>
                        <Box><Text as="h3" color="#fffdb8"></Text></Box>
                    </HStack>
                </Box>
                <Box overflowX="auto" w="100%">
                <table className="table token-content table-borderless" style={{ width: "100%", minWidth: "300px" }}>
                  <thead>
                    <tr>
                    <th style={{ width: "1px", cursor: "pointer" }} scope="col" onClick={() => handleSort('rank')}>
                    <HStack>
                      <Box><Text color={"#fffdb8"} fontSize="sm"><b>Rank </b></Text></Box>
                      <Box><Text color={"#fffdb8"} fontSize={isMobile ? "xx-small" : "md"}><b>{sortField === 'rank' ? (sortAscending ? '↑' : '↓') : ''}</b></Text></Box>
                    </HStack>
                    </th>
                    <th style={{ width: "5px" }} scope="col">
                    <Text color={"#fffdb8"}><b>Address</b></Text>
                    </th>
                    <th style={{ width: "auto", cursor: "pointer" }} scope="col" onClick={() => handleSort('prize')}>
                      <Text color={"#fffdb8"}><b>Prize {sortField === 'prize' ? (sortAscending ? '↑' : '↓') : ''}</b></Text>
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
                        paginatedLeaderboard.map((addr, index) => {
                          let winnerAddress = addr.winner;
                          if (winnerAddress == "0x0000000000000000000000000000000000000000") {
                            winnerAddress = "0x475D29fFE98638F81BEAA5061D902f365927420c";
                          }
                          const actualIndex = startIndex + index;
                          return (
                            <tr key={actualIndex}>
                                <td style={{ width: "1px" }} >
                                  <Text color="white">{actualIndex + 1}</Text>
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
                </Box>
                {/* Pagination Controls for Mobile */}
                {totalPages > 1 && (
                  <Flex mt={4} justify="center" align="center" gap={1} w="100%" px={2} ml={{base: "-20%", md: "5%"}}>
                    <Button
                      size="sm"
                      h="32px"
                      fontSize="xs"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      isDisabled={currentPage === 1}
                      colorScheme="pink"
                      variant="outline"
                    >
                      <Text color="white" size="sm">Prev</Text>
                    </Button>
                    
                    <HStack spacing={1}>
                      <Text fontSize="sm" color="gray.400">
                        Page {currentPage} of {totalPages}
                      </Text>
                    </HStack>
                    
                    <Button
                      size="sm"
                      h="32px"
                      fontSize="xs"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      isDisabled={currentPage === totalPages}
                      colorScheme="pink"
                      variant="outline"
                    >
                      <Text color="white" size="sm">Next</Text>
                    </Button>
                  </Flex>
                )}
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
                    <th style={{ width: "5%", cursor: "pointer" }} scope="col" onClick={() => handleSort('rank')}>
                    <Text color={"#fffdb8"}><b>Rank {sortField === 'rank' ? (sortAscending ? '↑' : '↓') : ''}</b></Text>
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                    <Text color={"#fffdb8"}><b>Address</b></Text>
                    </th>
                    <th style={{ width: "10%", cursor: "pointer" }} scope="col" onClick={() => handleSort('prize')}>
                      <Text color={"#fffdb8"}><b>Prize {sortField === 'prize' ? (sortAscending ? '↑' : '↓') : ''}</b></Text>
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
                    paginatedLeaderboard.map((addr, index) => {
                      let winnerAddress = addr.winner;
                      if (winnerAddress == "0x0000000000000000000000000000000000000000") {
                        winnerAddress = "0x475D29fFE98638F81BEAA5061D902f365927420c";
                      }
                      const actualIndex = startIndex + index;
                      return (
                    <tr key={actualIndex}>
                        <td style={{ width: "5%" }}>{actualIndex + 1}</td>
                        <td style={{ width: "10%" }}>
                         <>
                         <a href={"https://bscscan.com/address/"+winnerAddress} target="_blank" rel="noreferrer">
                            {winnerAddress?.slice(0, 6)}...${winnerAddress?.slice(-6)}
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
                    ) 
                  })}
                </tbody>
            </table>
            {/* Pagination Controls for Desktop */}
            {totalPages > 1 && (
              <Flex mt={6} justify="center" align="center" gap={3}>
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                  colorScheme="pink"
                  variant="outline"
                >
                  Previous
                </Button>
                
                <HStack spacing={2}>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        colorScheme={currentPage === pageNum ? "pink" : "gray"}
                        variant={currentPage === pageNum ? "solid" : "outline"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </HStack>
                
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  isDisabled={currentPage === totalPages}
                  colorScheme="pink"
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            )}                    
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