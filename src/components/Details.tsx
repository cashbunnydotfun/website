import {
    Box,
    Flex,
    Heading,
    Image,
    SimpleGrid,
    Stack,
    Text,
  } from '@chakra-ui/react';
  import { isMobile } from "react-device-detect";

  export default function Details() {
    return (
        <Box>
          <Flex
            p={'2vh'}
            style={{
              backgroundImage: `url('https://raw.githubusercontent.com/cashbunnydotfun/assets/refs/heads/master/bunny_art_transparent_background.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: "60%"
            }}
          >
           
            <SimpleGrid 
              columns={isMobile ? 1 : 3}
              spacing='40px' 
              color={'white'}
              maxW={isMobile ? "" : "50%" }
              mx={'auto'} 
              padding={'20vh 0'}
              fontWeight={'bold'}
              style={{
                opacity: "100%"
              }}
            >          
              {/* Feature 1 */}
                <Stack direction={ isMobile ? 'row' :'column'} backgroundColor={"black"} p={25}>
                  <Box>
  
                  </Box>
                  <Box>
                    <h5>Weekly Prize Entry Requirements</h5>
                    <Text>
                      To enter CashBunny's exciting weekly prize draws, here’s what you need: Hold at least 2.5 million BUNNY in your wallet to qualify.
                    </Text>
                  </Box>  
                </Stack>

              {/* Feature 2 */}
                <Stack direction={ isMobile ? 'row' :'column'} backgroundColor={"black"} p={25}>
                  <Box>

                  </Box>
                  <Box>
                    <h5>Safe and sound</h5>
                    <Text>
                    Pay a 2,500 BUNNY entry fee – which will be automatically burned! ♻️ This deflationary feature means each entry reduces the total BUNNY supply, helping increase value over time.  
                    </Text>
                  </Box>
                </Stack>

              {/* Feature 3 */}
                <Stack direction={ isMobile ? 'row' :'column'} backgroundColor={"black"} p={25}>
                  <Box>

                  </Box>
                  <Box>
                    <h5>Fair game</h5>
                    <Text>
                    Your participation not only boosts your chances of winning but also strengthens the CashBunny ecosystem! 🌟 Ready to hop in? 🐰💸
                    </Text>
                  </Box>
                </Stack>

              {/* Feature 4 */}
              {/* <Box bg='tomato' height='80px'></Box> */}
            </SimpleGrid>
          </Flex>
        </Box>
    );
  }