import { isMobile } from "react-device-detect";
import {
  StepsCompletedContent,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "../components/ui/steps"

import {
    Button,
    Box,
    Stack,
    Heading,
    Group,
  } from '@chakra-ui/react'
  
  export default function Roadmap() {
    const size = isMobile ? "sm" : "xxl"
    return (
      <Box 
        w="100vw"
        h="120vh"
        minH="30vh"
        bg="gray.800"
        color="white"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        position={"absolute"}
        left={0}
        right={0}
        height={isMobile? 520 : 400}
        p={4}
        backgroundColor={"black"}
        backgroundSize={"100%"}     
      >
      <Heading>Roadmap</Heading>
        <center style={{marginTop:"50px"}}>

        <Stack gap="4" maxW={"80%"}>
        <StepsRoot 
          defaultValue={1}
          key={size} 
          size={size} 
          count={4}  
          minW={isMobile? "auto" : "80%"} 
          orientation={isMobile ? "vertical" : "horizontal"}
          colorPalette={"cyan"}
          >
          <StepsList>
            <StepsItem index={0} title="Q4 2024 - TGE & Presale"  />
            <StepsItem index={1} title="Q1 2025 - Raffle launch" />
            <StepsItem index={2} title="Q2 2025 - Staking launch" />
            <StepsItem index={3} title="Q3 2025 - Lending launch" />
          </StepsList>

          <Box mt={25}>
          <StepsContent index={0} >
            Mainnet launch
          </StepsContent>
          <StepsContent index={0}>
          Presale has &nbsp;
            <a 
              href="/presale" 
              style={{color:"green"}}
            > 
             <b>ended</b> 🎆
            </a>
          </StepsContent>
          <StepsContent index={1}>Decentralized raffle and deflationary fee burning 🔥 <br /> Raffle has started! </StepsContent>
          <StepsContent index={2}>Staking vaults with $BUNNY rewards 💰 </StepsContent>
          <StepsContent index={3}>Lending vaults launch 🏦</StepsContent>
          <StepsCompletedContent>
            $BUNNY to the moon! 🚀
          </StepsCompletedContent>

          </Box>

          <Box
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            position={isMobile ? "relative" : "absolute"}
            top={250}
            left={0}
          >
            <br /><br />
          <Group ml={"45vw"}>
            <center>
            <StepsPrevTrigger asChild>
              <Button variant="inherit" size="sm">
                Prev
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </StepsNextTrigger>
            </center>
          </Group>
          </Box>
        </StepsRoot>

        </Stack>
        </center>
      </Box>
   )
  }