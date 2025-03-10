import { Image, HStack, Box, Button, Flex, Text, chakra } from '@chakra-ui/react';
import { StatLabel, StatRoot, StatValueText } from "../components/ui/stat"
import React, { useEffect, useState } from "react";

import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import useAnalyticsEventTracker from '../hooks/useAnalyticsEventTracker';
import PresaleStats from "../components/PresaleStats";
import usePresaleContract from '../hooks/usePresaleContract';
import cardsImage from '../assets/images/cards.png';

import {ethers} from 'ethers';

interface StatsCardProps {
    title: string;
    stat: string;
  }

  function StatsCard(props: StatsCardProps) {
     const { title, stat } = props;

    return (
      <StatRoot
        p={'2vw'}
        shadow={'xl'}
        border={'4px solid'}
        rounded={'lg'}
        backgroundColor={'rgba(0,0,0,0.5)'}
        >
          <StatLabel color={'white'} fontWeight={'medium'} fontSize={"22px"}>
            {title}
          </StatLabel>
          <StatValueText color={'white'} fontWeight={'medium'} fontSize={"16px"} lineHeight={"short"}>
            {stat}
          </StatValueText>
      </StatRoot>
    );
  }

  export default function Stats() {
    const gaEventTracker = useAnalyticsEventTracker('presale');
    const targetDate = new Date("2025-01-17T15:00:00Z").getTime();
    const hardCap = 100;

    const [progress, setProgress] = useState(null);
    const [timeLeft, setTimeLeft] = useState("00:00:00"); // Example default


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
      "0x0000000000000000000000000000000000000000",
      "0xdeadbeef"
    );

    useEffect(() => {
      const progress = (totalRaised / hardCap) * 100;
  
      setProgress(progress);
    }
    , [totalRaised]);

    return (
        <>
          <Box
            w="100vw"
            // h="120vh"
            minH="30vh"
            bg="gray.800"
            color="white"
            display="flex"
            alignItems="left"
            justifyContent="left"
            textAlign="left"
            position={"absolute"}
            left={0}
            right={0}
            height={isMobile? 340 : 400}
            p={isMobile ? 8 : 0}
            backgroundColor={"black"}
            backgroundSize={"100%"}
            
          >
            {/* <Box ml={isMobile?"2%":"15%"} w={"700px"} pl={isMobile? 3:10} pt={isMobile? 10:4}>
            <chakra.h2 fontSize={isMobile ? "2xl" : "4xl"}>
              Our <Text  color={'#fe9eb4'} as={'span'}>decentralized</Text> raffle has <Text color={'#FFFDB8'} as={'span'}>started</Text>
              </chakra.h2>
              <Box>
                <HStack>
                    <Box><Text as="h3">Win</Text></Box>
                    <Box><Text as="h3" color="#fe9eb4"> unlimited BNB</Text></Box>
                    <Box><Text as="h3" color="white">while burning</Text></Box>
                    <Box><Text as="h3" color="#fffdb8">$BUNNY</Text></Box>
                </HStack>
              </Box>
                  <a href="/raffle" target="_blank">
                  <Button bg={'#fe9eb4'} mt={5} minW={100} minH={20} background={"black"} color={"#FFFDB8"} fontWeight={600} isDisabled  border={"1px solid white"}>
                      <div style={{ textAlign: 'center' }} minH={20}>
                          <Text as={'span'}  color={"#fe9eb4"}   >
                            <b>Play raffle</b> <br />
                          </Text>
                      </div>
                  </Button>     
                  </a>
                  <br /> 
                  <br />
            </Box> */}

            <Flex
              direction={isMobile ? "column" : "row"}
              gap={1}
              ml={2}
              mt={isMobile ? -50: 0}
            > 
            {isMobile ? <></> : 
              <Box w="300px"  ml={isMobile ? 0 : "3%"} flex="none">
              <Image src={cardsImage} w="80px" mt={"60px"} ml={40}/>
              </Box>}
              <Box w="70%" ml={isMobile ? 0 : "5%"} mt={20} flex="none">
              <chakra.h2 fontSize={isMobile ? "2xl" : "4xl"}>
                Our <Text  color={'#fe9eb4'} as={'span'}>decentralized</Text> raffle has <Text color={'#FFFDB8'} as={'span'}>started</Text>
              </chakra.h2>
              {!isMobile ? (
                <HStack>
                  <Box><Text as="h3">Win</Text></Box>
                  <Box><Text as="h3" color="#fe9eb4"> unlimited BNB</Text></Box>
                  <Box><Text as="h3" color="white">while burning</Text></Box>
                  <Box><Text as="h3" color="#fffdb8">$BUNNY</Text></Box>
              </HStack>
              ) : <></>}
              </Box>
              <Box w="100%" ml={"10px"} mt={isMobile ? -5 : 110}>
              <a href="/raffle" target="_blank">
                  <Button 
                  // mt={isMobile ? -20 : 20} 
                  bg={'#fe9eb4'} 
                  mt={5} 
                  minW={150} 
                  minH={20} 
                  background={"black"} 
                  color={"#FFFDB8"} 
                  fontWeight={600} 
                  isDisabled  
                  border={"1px solid white"}
                  ml={isMobile ? 0 : -10}
                >
                      <div style={{ textAlign: 'center' }} minH={20}>
                          <Text as={'span'}  color={"#fe9eb4"}   >
                            <b>Play Now</b> <br />
                          </Text>
                      </div>
                  </Button>     
                  </a>
              </Box>
            </Flex>
            
            </Box>

          <Flex mt={isMobile ? "75%" : "30%"} ml={isMobile ? 0 : "15%"}>
              <chakra.h2
                textAlign={'center'}
                py={10}
                mx={'auto'}>
                Weekly raffles with<br/> 
                Rich Prizes 💰
              </chakra.h2>
          </Flex>
          <Flex 
            direction={isMobile? "column" : "row"}
            minW={isMobile ? "100%" : "80vh"}
            maxW={{ sm: 0, md: "10%", lg: "65%" }}
            mx={'auto'} 
            p={'5vh'} 
            px={{ 
                base: 2, 
                sm: 12, 
                md: 17 
            }}
            mb={"150px"}   
            ml={{ sm: 0, md: "10%", lg: "22%" }}
            gap={10}
          >
            <StatsCard
              title={'Weekly Prize Entry Requirements'} 
              stat={"To enter CashBunny's exciting weekly prize draws, here’s what you need: Hold at least 2500 BUNNY in your wallet to qualify."}/>
            <StatsCard 
              title={'Safe and sound'} 
              stat={"Pay a 2,500 BUNNY entry fee – which will be automatically burned! ♻️ This deflationary feature means each entry reduces the total BUNNY supply, helping increase value over time."}/> 
            <StatsCard 
              title={"Fair game"} 
              stat={"Your participation not only boosts your chances of winning but also strengthens the CashBunny ecosystem! 🌟 Ready to hop in? 🐰💸"}/>
        </Flex>      
        </>
    );
  }