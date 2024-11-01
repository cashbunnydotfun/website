import { Link } from "react-router-dom";
import { SimpleGrid, Box, HStack, Center } from '@chakra-ui/react';
import { isMobile } from "react-device-detect";

const Footer: React.FC = () => {
  return (
    <footer>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 p-10 text-center">
            <div className="footer-items">
              <Center fontSize={isMobile ? "small" : "medium"}>
                <HStack>
                  <p className="cashbunnyLogo">Cash </p>
                  <p className="cashbunnyLogo" style={{marginTop:-1, color:'#fe9eb4'}}>Bunny</p>
                  <p className="goldtext" style={{fontWeight:'bold', marginTop:-20, fontSize:'14px'}}>(Binance Smart Chain)</p>
                </HStack>
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
                              to="https://twitter.com/"
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
    </footer>
  );
};

export default Footer;
