import React from "react";
import { Box, Flex, HStack, Image } from "@chakra-ui/react";
import { StatRoot, StatLabel, StatValueText } from "../components/ui/stat";
import { ProgressRoot, ProgressLabel, ProgressBar, ProgressValueText } from "../components/ui/progress";
import Countdown from "../components/Countdown";
import bnbLogo from "../assets/images/bnb.png";

const PresaleStats = ({ totalRaised, participantCount, targetDate, progress, timeLeft, isMobile }) => {
  return (
    <>
      <Flex flexWrap="wrap" justifyContent="flex-start" gap={"20px"} mt={isMobile ? 5 : 0} w={isMobile ?"auto":"900px"}  >
        <Box w={isMobile? "auto": "25%"}>
          <StatRoot>
            <StatLabel fontSize="sm" lineHeight="5px">
              Contributed
            </StatLabel>
            <HStack mt={"-8px"}>
            <StatValueText value={totalRaised} fontSize="md" lineHeight="5px" color="#fe9eb4" />
            <Box w={"auto"}>
                <Image w="20px" src={bnbLogo} />
            </Box>
            </HStack>
          </StatRoot>
        </Box>

        <Box w={isMobile? "auto": "25%"}>
          <StatRoot>
            <StatLabel fontSize="sm" lineHeight="5px">
              # Contributors
            </StatLabel>
            <StatValueText
              fontSize="md"
              lineHeight="1px"
              value={participantCount}
              color="#fe9eb4"
            />
          </StatRoot>
        </Box>

        <Box w={isMobile? "auto": "25%"}>
          <StatRoot>
            <StatLabel fontSize="sm" lineHeight="5px">
              <Box >Time Left</Box>
            </StatLabel>
            <StatValueText w={"90px"} fontSize="md" color="#fe9eb4">
              <Box mt="-30px">
                <Countdown targetDate={targetDate} isMobile={isMobile} />
              </Box>
            </StatValueText>
          </StatRoot>
        </Box>
      </Flex>

      <Box w={isMobile ? "88%" : "500px"} mt={2}>
        <ProgressRoot
          value={timeLeft !== "00:00:00:00" ? progress : null}
          max={100}
          maxW="600px"
          size="lg"
        >
          <HStack gap="5">
            <Box mt={5}>
              <ProgressLabel>
                Progress
                <br />
                <br />
              </ProgressLabel>
            </Box>
            <ProgressBar flex="1" defaultValue={0} />
            <ProgressValueText color="#fe9eb4">
              {Number(progress).toFixed(2)}%
            </ProgressValueText>
          </HStack>
        </ProgressRoot>
      </Box>
    </>
  );
};

export default PresaleStats;
