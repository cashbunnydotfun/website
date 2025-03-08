import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Image, SimpleGrid, Box, HStack, Center, VStack } from '@chakra-ui/react';
import { isMobile } from "react-device-detect";
import { ethers } from "ethers";
import metamaskLogo from "../assets/images/metamask.svg";

const { parseUnits } = ethers;
const { BrowserProvider } = ethers;

const footerFontSize = isMobile ? 10 : 14;

const AddToMetaMaskButton = ({ contractAddress, tokenSymbol, tokenDecimals }) => {
  const addTokenToMetaMask = async () => {
    try {
      // Create a provider using MetaMask's injected web3 provider
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = provider.getSigner();

        // Get the contract interface and ABI (replace with your token's ABI)
        const tokenABI = [
          "function name() public view returns (string memory)",
          "function symbol() public view returns (string memory)",
          "function decimals() public view returns (uint8)",
          "function totalSupply() public view returns (uint256)",
          "function balanceOf(address account) public view returns (uint256)",
          "function transfer(address recipient, uint256 amount) public returns (bool)",
        ];
        
        // Create a contract instance
        const tokenContract = new ethers.Contract(contractAddress, tokenABI, signer);

        // Get the token details
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();

        // Prepare the token information for MetaMask
        const formattedSymbol = tokenSymbol || symbol;
        const formattedDecimals = tokenDecimals || decimals;

        const hexValue = parseUnits('1', formattedDecimals);

        // Add the token to MetaMask
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: contractAddress,
              symbol: formattedSymbol,
              decimals: formattedDecimals,
              image: `https://example.com/token-logo.png`, // Replace with your token logo URL
            },
          },
        });
      } else {
        console.error("MetaMask is not installed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button onClick={addTokenToMetaMask} 
      variant={"outline"}
      fontSize={isMobile ? 6 : 10}
      h={5}
      mt={-5}
      ml={2}
      borderRadius={10}
    >
      Add to MetaMask
      <Image src={metamaskLogo} w={15} ml={2} />
    </Button>
  );
};


const Footer: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const bscScanUrl = "https://bscscan.com/address/0x2F7c6FCE82a4845726C3744df21Dc87788112B66";
  const handleCopy = () => {
    navigator.clipboard.writeText(bscScanUrl).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const address = String("0x2F7c6FCE82a4845726C3744df21Dc87788112B66");
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
                      <label>{address.slice(0, 6)}...${address?.slice(-6)} </label>
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
              <Box>
              <AddToMetaMaskButton contractAddress={"0x2F7c6FCE82a4845726C3744df21Dc87788112B66"} />
              </Box>
                </HStack>
                </VStack>
              <Box>

              </Box>

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
