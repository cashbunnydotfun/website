import { Link } from "react-router-dom";
import { SimpleGrid, Box, HStack, Center, VStack } from '@chakra-ui/react';
import { isMobile } from "react-device-detect";

const footerFontSize = isMobile ? 10 : 14;

const Footer: React.FC = () => {
  return (
    <footer>
      <Box mt={250}>
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
                  <p 
                    className="goldtext" 
                    style={{fontWeight:'bold', marginTop:-20, fontSize: footerFontSize}}
                  >
                    <a href="https://bscscan.com/address/0x7a4d4C9ab336D7e8f59194DF13c4cB5AA9c93945" target="_blank"
                    style={{fontSize: footerFontSize}}
                    >
                      &nbsp;&nbsp;
                      <label>0x7a4d4C9ab336D7e8f59194DF13c4cB5AA9c93945 </label>
                    </a> 
                    {isMobile ? <br /> : <></> }
                    &nbsp;(Binance Smart Chain)
                  </p>
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
