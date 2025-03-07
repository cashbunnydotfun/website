// import "./App.css";
import { Outlet } from "react-router-dom";
import { LanguageProvider } from "./core/LanguageProvider";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { bsc, bscTestnet, localhost } from "viem/chains";
// import { ToastContainer } from "react-toastify";
import { switchNetwork, watchNetwork } from "wagmi/actions";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "./components/ui/provider"
import { MenuProvider } from "./hooks/useMenuContext"; // Import the MenuProvider

import React from "react";
import ReactGA from 'react-ga';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  
  const TRACKING_ID = "UA-XXXXX-X"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);

  const projectId = "daad7988f4d18448c60592b5361056e6";
  const metadata = {
    name: "CashBunny",
    description: "First meme coin with real utility",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const chains = [bsc];
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  });

  createWeb3Modal({ wagmiConfig, projectId, chains });

  watchNetwork(async (network) => {
    if (network.chain?.name == "bsc") {
      await switchNetwork({
          chainId: 56,
      });
    }
    console.log(`Network is ${network.chain?.name}`)
  });

   return (
    <WagmiConfig config={wagmiConfig}>
      <LanguageProvider>
        <MenuProvider> {/* Wrap the MenuProvider around the components */}
        <Provider>
          <Header />
          <Outlet />
          <Footer />
        </Provider>
        </MenuProvider>
      </LanguageProvider>
    </WagmiConfig>
  );
}

export default App;
