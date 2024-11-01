import React from "react";
import { Container } from "@chakra-ui/react";

// Components
import Stats from "../components/Stats.tsx";
import Hero from "../components/Hero.tsx";


const HomePage: React.FC = () => {
  return (
    <>
      <Container>
        <Hero />
        <Stats />
      </Container>
    </>
  );
};

export default HomePage;
