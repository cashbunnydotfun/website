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
                    <h5>A Token That Burns to Earn! </h5>
                    <Text>
                      Get ready to hop into weekly raffles and watch the supply shrink! With 15 billion tokens in total, we’re set to burn at least 10 billion over time. How?
                    </Text>
                  </Box>  
                </Stack>

              {/* Feature 2 */}
                <Stack direction={ isMobile ? 'row' :'column'} backgroundColor={"black"} p={25}>
                  <Box>

                  </Box>
                  <Box>
                    <h5>Automatic burning</h5>
                    <Text>
                    Join our Weekly Raffle with just 2,500 Bunny per entry. Each fee is automatically burned, reducing supply and boosting value for holders.
                  </Text>
                  </Box>
                </Stack>

              {/* Feature 3 */}
                <Stack direction={ isMobile ? 'row' :'column'} backgroundColor={"black"} p={25}>
                  <Box>

                  </Box>
                  <Box>
                    <h5>Fewer tokens = more potential growth!</h5>
                    <Text>
                      Don't miss your chance to win BIG while helping the Cashbunny community thrive. Let’s burn and earn together! 🔥
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