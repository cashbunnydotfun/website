import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, SimpleGrid, Box, HStack, Center, VStack } from '@chakra-ui/react';
import { isMobile } from "react-device-detect";

const footerFontSize = isMobile ? 10 : 14;

const Footer: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const bscScanUrl = "https://bscscan.com/address/0x2F7c6FCE82a4845726C3744df21Dc87788112B66";
  const handleCopy = () => {
    navigator.clipboard.writeText(bscScanUrl).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <footer>
      <Box mt={250}>
        {isMobile ? 
        <>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </>: 
        <>
        <br /><br /><br /><br /><br /><br /><br /><br />
        </>}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 p-10 text-center">
            <div className="footer-items">
              <Center fontSize={isMobile ? "small" : "medium"}>
                <VStack>
                <HStack>
                  <p className="cashbunnyLogo">Cash </p>
                  <p className="cashbunnyLogo" style={{marginTop: -23, color:'#fe9eb4'}}>Bunny</p>
                </HStack>

                <HStack>
            <Box>
            <p 
                    className="goldtext" 
                    style={{fontWeight:'bold', marginTop:-20, fontSize: footerFontSize}}
                  >
                    <a href={bscScanUrl} target="_blank"
                    style={{fontSize: footerFontSize}}
                    >
                      &nbsp;&nbsp;
                      <label>0x2F7c6FCE82a4845726C3744df21Dc87788112B66 </label>
                    </a> 
                    {isMobile ? <br /> : <></> }
                    &nbsp;(Binance Smart Chain)
                  </p>
            </Box>
            <Box>
            <Button
                  h={5}
                  mt={-5}
                  w={"50px"}
                  borderRadius={10}
                  onClick={handleCopy}
                  colorScheme="white"
                  variant="ghost"
                  bg="transparent"
                  border="2px solid"
                  fontSize={"xx-small"}
                  color="white"
                  _hover={{ bg: "rgba(0, 0, 255, 0.1)" }}
                  _active={{ bg: "rgba(0, 0, 255, 0.2)" }}
                >
                  {hasCopied ? "Copied!" : "Copy"}
                </Button>
            </Box>
                </HStack>
                </VStack>


              </Center>
              <div className="social-icons d-flex justify-content-center my-4">
                  <Box  w="65vh" h="2vh">
                    <center>
                      <SimpleGrid columns={4} spacing={8}>
                        <Box >
                        <HStack maxWidth={"fit-content"} color={"#FFFDB8"}>
                        <i className="fa-brands fa-telegram"></i>
                            <Link 
                              className="discord"
                              to="https://t.me/CashBunnyFun"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Telegram
                            </Link>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack  maxWidth={"fit-content"} color={"#FFFDB8"}>
                          <i className="fa-brands fa-github"></i>
                          <Link 
                          className="github"
                          to="https://github.com/cashbunnydotfun"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                        Github
                        </Link>
                        </HStack>
                        </Box>
                        <Box>
                          <HStack  maxWidth={"fit-content"} color={"#FFFDB8"}>
                            <i className="fa-brands fa-twitter"></i>
                            <Link 
                              className="twitter"
                              to="https://x.com/CashBunnydotfun"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                            X/Twitter
                          </Link>
                          </HStack>
                        </Box>
                        <Box>
                          <HStack  maxWidth={"fit-content"} color={"#FFFDB8"}>
                            <i className="fa fa-envelope"></i>
                            <Link 
                              className="twitter"
                              to="mailto:info@cashbunny.fun"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                            Email
                          </Link>
                          </HStack>
                        </Box>
                      </SimpleGrid>
                    </center>
                  </Box>
              </div> 
            </div>
          </div>
        </div>
      </div>
      </Box>
    </footer>
  );
};

export default Footer;
