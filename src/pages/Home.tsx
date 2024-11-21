import React from "react";
import { Container } from "@chakra-ui/react";

// Components
import Stats from "../components/Stats.tsx";
import Hero from "../components/Hero.tsx";
import AMM from "../components/AMM.tsx";
import Roadmap from "../components/Roadmap.tsx";
import Details from "../components/Details.tsx";

const HomePage: React.FC = () => {
  return (
    <>
      <Container>
        <Hero />
        <Stats />
         <Details />
        {/*<ALM /> */ }
        {/* <Roadmap /> */}
        {/*<CTA />  */}       
      </Container>
    </>
  );
};

export default HomePage;
