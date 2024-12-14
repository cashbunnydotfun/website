import { Box, Button, Flex, Text, chakra } from '@chakra-ui/react';
import { StatLabel, StatRoot, StatValueText } from "../components/ui/stat"

import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import useAnalyticsEventTracker from '../hooks/useAnalyticsEventTracker';

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
        backgroundColor={'rgba(0,0,0,0.5)'}>
          <StatLabel color={'white'} fontWeight={'medium'} fontSize={"22px"}>
            {title}
          </StatLabel>
          <StatValueText color={'white'} fontWeight={'medium'} fontSize={"16px"}>
            {stat}
          </StatValueText>
      </StatRoot>
    );
  }

  export default function Stats() {
    const gaEventTracker = useAnalyticsEventTracker('presale');

    return (
        <>
          <Box
            w="100vw"
            h="120vh"
            minH="30vh"
            bg="gray.800"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            position={"absolute"}
            left={0}
            right={0}
            height={isMobile? 520 : 400}
            p={4}
            backgroundColor={"black"}
            backgroundSize={"100%"}
          >
            
          <Flex direction="column" align="center" justify="center" w="full" minW={isMobile ? "auto" : "50vh"}>
              <br />
              <Box maxW={isMobile?"auto" : "80vh"} justifyContent={"left"} textAlign={"left"} ml={isMobile? "25%" : 0}>
              <chakra.h2 fontSize={isMobile ? "2xl" : "4xl"} mt={isMobile ? 120 : 60}>
                Participate in the <Text color={'#FFFDB8'} as={'span'}>Presale</Text> 
              </chakra.h2>
              <Text fontSize={isMobile ? "small" : "medium"} w={isMobile ? "90%" : "60%"} align={"left"}>
                A <label color={'yellow'}>$BUNNY</label> presale will be conducted in order to ensure a fair distribution at launch. Join our community and stay tuned for more information.
              </Text>
                <Flex
                  direction={isMobile ? "column" : "row"}
                  gap={4}
                  w={isMobile ? "full" : "auto"}
                >
                  <a href="/presale" >
                  <Button 
                    p={15} minW={100} 
                    fontWeight={600} 
                    background={"#FFFDB8"} 
                    color={"black"} 
                    mb={isMobile ? 120 : 60} 
                    mt={20} 
                    onClick={()=>gaEventTracker('presale_link1')} 
                    minH={20}
                    >
                  <div style={{ textAlign: 'center' }} minH={20}>
                       <Link  style={{color: "#000000"}} to="/presale"></Link>
                    <div style={{ color: "gray"}}> 
                    Join
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '1px', color: "red" }}>Live now</div>

                  </div>
                    </Button>
                  <br /> 
                  <br />
                </a>
              </Flex>
              </Box>
            </Flex>
          </Box>
          <Flex mt={isMobile ? "125%" : "30%"} ml={isMobile ? 0 : "15%"}>
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
              title={'Weekly Prize Entry Requirements 🔥 '} 
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