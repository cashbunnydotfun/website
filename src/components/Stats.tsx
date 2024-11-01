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
                  <a href="https://discord.gg/" target="_blank" >
                  <Button 
                    p={15} minW={100} 
                    fontWeight={600} 
                    background={"#FFFDB8"} 
                    color={"black"} 
                    mb={isMobile ? 120 : 60} 
                    mt={20} 
                    onClick={()=>gaEventTracker('deadbeef')} 
                    >
                      Get whitelisted
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
                Raffles powered by<br/> 
                Chainlink oracles
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
          >
            <StatsCard
              title={'Weekly prizes'} 
              stat={"$100 are distributed weekly to lucky rafflers 🍀. Go Get $BUNNY now and upgrade your lifestyle by holding and playing 🤑 "}/>
            <StatsCard 
              title={'Safe and sound'} 
              stat={"$BUNNY uses Chainlink VDF for fair random number generation ⛓️ which means that cheating our raffle is nearly impossible 🚫"}/> 
            <StatsCard 
              title={"Fair tokenomics"} 
              stat={"Raffle prizes & buy-backs are factored in. 60% of the presale funds destined to the liquidity 💵 with LP rights renounced"}/>
        </Flex>          
        </>
    );
  }