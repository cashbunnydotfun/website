import { Box, Button, Flex, Text, chakra } from '@chakra-ui/react';
import { StatLabel, StatRoot, StatValueText } from "../components/ui/stat"
import React, { useEffect, useState } from "react";

import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import useAnalyticsEventTracker from '../hooks/useAnalyticsEventTracker';
import PresaleStats from "../components/PresaleStats";
import usePresaleContract from '../hooks/usePresaleContract';

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
            h="120vh"
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
            height={isMobile? 520 : 400}
            // p={4}
            backgroundColor={"black"}
            backgroundSize={"100%"}
            
          >
            <Box ml={isMobile?"2%":"15%"} w={"600px"} pl={isMobile? 3:10} pt={isMobile? 10:4}>
            <chakra.h2 fontSize={isMobile ? "2xl" : "4xl"}>
                Presale has <Text color={'#FFFDB8'} as={'span'}>ended</Text> 
              </chakra.h2>
              <PresaleStats
                    totalRaised={totalRaised}
                    participantCount={participantCount}
                    targetDate={targetDate}
                    progress={progress}
                    timeLeft={timeLeft}
                    isMobile={isMobile}
                  />
                  <Button bg={'#fe9eb4'} mt={5} minW={100} minH={20} background={"black"} color={"#FFFDB8"} fontWeight={600} isDisabled  border={"1px solid white"}>
                      <div style={{ textAlign: 'center' }} minH={20}>
                          <a href="https://pancakeswap.finance/?outputCurrency=0x2F7c6FCE82a4845726C3744df21Dc87788112B66&inputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" target="_blank">
                          <Text as={'span'}  color={"#fe9eb4"}   >
                            <b>Trade Now</b> <br />
                          </Text>
                          </a>
                      </div>
                  </Button>    
                  <br /> 
                  <br />
            </Box>
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
            ml={{ sm: 0, md: "10%", lg: "25%" }}
            gap={10}
          >
            <StatsCard
              title={'Weekly Prize Entry Requirements'} 
              stat={"To enter CashBunny's exciting weekly prize draws, here’s what you need: Hold at least $100 in BUNNY in your wallet to qualify."}/>
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