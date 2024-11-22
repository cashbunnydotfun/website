import { Box, Button, Flex, Text, Stat, StatLabel, StatNumber, chakra } from '@chakra-ui/react';
import { isMobile } from "react-device-detect";
  
  interface StatsCardProps {
    title: string;
    stat: string;
  }

  function StatsCard(props: StatsCardProps) {
    const { title, stat } = props;
    return (
      <Stat
        p={'2vw'}
        shadow={'xl'}
        border={'4px solid'}
        rounded={'lg'}
        backgroundColor={'rgba(0,0,0,0.5)'}>
          <StatLabel color={'white'} fontWeight={'medium'}>
            {title}
          </StatLabel>
          <StatNumber color={'white'} fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
      </Stat>
    );
  }

  export default function Stats() {
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
            height={isMobile? 480 : 300}
            p={4}
            backgroundColor={"black"}
            backgroundSize={"100%"}
          >
          <Flex direction="column" align="center" justify="center" w="full">
              <br />
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
                  <a href="https://www.pinksale.finance/" target="_blank" >
                  <Button 
                    p={15} minW={100} 
                    fontWeight={600} 
                    background={"#FFFDB8"} 
                    color={"black"} 
                    mb={isMobile ? 120 : 60} 
                    mt={20} 
                    onClick={()=>gaEventTracker('deadbeef')} 
                    >
                  <div style={{ textAlign: 'center' }} minH={60}>
                      <Text as={'span'}  >
                       <a href="https://www.pinksale.finance/launchpad/bsc/0x3Bd1cc34ea42bFF165049EcFf524E8Eed008692F?refId=0x6ab5B9deD8E7c77F1Ade9399f912041159569a0A" target="_blank">Join now</a> <br />
                      </Text>
                    <div style={{ fontSize: '10px', marginTop: '5px', color: "gray" }}>Live now</div>
                  </div>
                    </Button>
                  <br /> 
                  <br />
                </a>
              </Flex>
            </Flex>
          </Box>
          <Flex mt={isMobile ? "125%" : "30%"}>
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
            maxW={isMobile ? "" : "50%" }
            mx={'auto'} 
            p={'5vh'} 
            px={{ 
                base: 2, 
                sm: 12, 
                md: 17 
            }}
            mb={"150px"}               
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