import React, {useEffect} from "react";
import { Box, Flex, Image, Stack, Heading, Text, Button, HStack } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";

import bunny_art_t from "../assets/images/bunny_art_t.png";
import { useMenu } from "../hooks/useMenuContext";
import styled from "styled-components";

const StyledLink = styled.a`
  color: gray !important; /* Force color to be white */
  text-decoration: none; /* Remove underline */

  &:visited {
    color: gray !important; /* Ensure visited links stay white */
  }
`;

const Hero: React.FC = () => {
  const { isMenuOpen } = useMenu(); // Access menu state from context
  console.log("isMenuOpen in Hero:", isMenuOpen); // Debugging log

  return (
    <Box 
      alignContent={'center'}
      as="section" 
      p={ isMobile ? '1vh' : '10vh' } 
      minH={'100vh'} 
      ml={{ sm: "5%", md: "10%", lg: "10%" }}
      alignItems={"left"}
      textAlign={"left"}
      backgroundSize={"140%"}
      backdropOpacity={"60%"}
    >
      <Box 
        p={isMobile ? "10vw" : "2vw"} 
        flex={1}
        gap={20} 
      >
        <Box className="row align-items-center" >
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
                  <Text color={"white"} w={isMobile? "80vw" : "600px"}>
                    Make money with weekly raffles and benefit from perpetual fee burning. First meme token with real utility — launching on Binance Smart Chain.
                  </Text>
                  <HStack minW={100} justify={{ base: 'center', md: 'flex-start' }}>
                    {/* <a href="https://#" onClick={()=>gaEventTracker('deadbeef')} target="_blank">
                      <Button p={15} minW={100} minH={60} fontWeight={600} background={"black"} color={"#FFFDB8"}>
                          Trade mpw
                      </Button>
                    </a>               */}
                  <Box
                    alignItems="left"
                    justifyContent="left"
                    textAlign="left"
                    w="50vh"
                    >
                    <Button bg={'#fe9eb4'} minW={100} minH={20} background={"black"} color={"#FFFDB8"} fontWeight={600} isDisabled  border={"1px solid white"}>
                      <div style={{ textAlign: 'center' }} minH={20}>
                          <a href="https://pancakeswap.finance/?outputCurrency=0x2F7c6FCE82a4845726C3744df21Dc87788112B66&inputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" target="_blank">
                          <Text as={'span'}  color={"#fe9eb4"}   >
                            <b>Trade Now</b> <br />
                          </Text>
                          </a>
                      </div>
                  </Button>                         
                </Box>               
              </HStack>
              </Stack>

            </Box>   

            <Box width={ isMobile ? '0' : '40%' } textAlign={"center"} ml={"-500px"}>
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
