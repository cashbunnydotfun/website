import React, { useEffect, useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

const Countdown = ({ targetDate, isMobile }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [targetDate]);

  return (
    <HStack>
      <Box display="flex" alignItems="baseline" >
        <Text fontWeight="bold" fontSize={isMobile?"11px": "16px"}>{timeLeft.days}</Text>
        <Text fontSize={isMobile?"8px": "11px"} color="white">
          <b>(d)</b>:
        </Text>
      </Box>
      <Box display="flex" alignItems="baseline" >
        <Text fontWeight="bold" fontSize={isMobile?"11px": "16px"}>{timeLeft.hours}</Text>
        <Text fontSize="11px" fontSize={isMobile?"8px": "11px"}  color="white">
          <b>(h)</b>:
        </Text>
      </Box>
      <Box display="flex" alignItems="baseline">
        <Text fontWeight="bold" fontSize={isMobile?"11px": "16px"}>{timeLeft.minutes}</Text>
        <Text fontSize="11px" fontSize={isMobile?"8px": "11px"} color="white">
          <b>(m):</b>
        </Text>
      </Box>
      <Box display="flex" alignItems="baseline" mt={"-5px"}>
        <Text fontWeight="bold" fontSize={isMobile?"11px": "16px"} >{timeLeft.seconds}</Text>
      </Box>
    </HStack>
  );
};

export default Countdown;
