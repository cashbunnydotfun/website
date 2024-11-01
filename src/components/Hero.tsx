import React from "react";
import { Box, Flex, Image, Stack, Heading, Text, Button, HStack } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import bunny_art from "../assets/images/bunny_art.png";
import bunny_art_2 from "../assets/images/bunny_art_2.png";
import bunny_art_t from "../assets/images/bunny_art_t.png";

const Hero: React.FC = () => {
  return (
    <Box 
      alignContent={'center'}
      as="section" 
      p={ isMobile ? '8vh' : '10vh' } 
      minH={'100vh'} 
    >
      <Box 
        p={isMobile ? "10vw" : "5vw"} 
        flex={1}
        gap={20} 
        className="container"
      >


        <Box className="row align-items-center justify-content-center" >
          <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" width="full">
            
            <Box className="col-md">
              <Stack spacing={0}>
                <Heading 
                  fontSize={{ 
                    base: '3xl', 
                    md: '4xl', 
                    lg: '5xl' }}
                >
                  <Text as={'span'}>The </Text>
                  <Text as={'span'} color={'#FFFDB8'}>
                    Billionaire
                  </Text>
                  <br />
                  <Text as={'span'}>
                    Cash 
                  </Text>
                  <Text as={'span'} color={'#fe9eb4'}>
                     &nbsp;Bunny
                  </Text>
                </Heading>
                  <Text color={"white"}>
                    Make money with weekly raffles and benefit from perpetual fee burning. First meme token with real utility — launching on Binance Smart Chain and coming soon on Solana.
                  </Text>
                  <HStack minW={100} justify={{ base: 'center', md: 'flex-start' }}>
                    <a href="https://#" onClick={()=>gaEventTracker('deadbeef')} target="_blank">
                      <Button p={15} minW={100} minH={60} fontWeight={600} background={"black"} color={"#FFFDB8"}>
                          Join the whitelist
                      </Button>
                    </a>              
                  {/* <Button p={15} bg={'#fe9eb4'} minW={100}  fontWeight={600} isDisabled>
                  <div style={{ textAlign: 'center' }} minH={60}>
                      <Text as={'span'} color={"white"}>
                         Trade now <br />
                      </Text>
                    <div style={{ fontSize: '10px', marginTop: '5px', color: "gray" }}>Coming Soon</div>
                  </div>
                </Button>                   */}
              </HStack>
              </Stack>

            </Box>   

            <Box width={ isMobile ? '0' : '50%' } textAlign={"center"}>
                <Image 
                  objectFit={'cover'}
                  src={bunny_art_t}
                  visibility={ isMobile ? 'hidden' : 'initial' }
                />
            </Box>
          </Flex>         
        </Box>
      </Box>
    </Box>               
  );
}

export default Hero;
