import React from "react";
import { Container } from "@chakra-ui/react";

// Components
import Stats from "../components/Stats.tsx";
import Hero from "../components/Hero.tsx";
import Details from "../components/Details.tsx";
import Roadmap from "../components/Roadmap.tsx";

const HomePage: React.FC = () => {
  return (
    <>
      <Container>
        <Hero />
        <Stats />
        <Details />   
        <Roadmap />  
      </Container>
    </>
  );
};

export default HomePage;
