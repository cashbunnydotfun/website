import React, { useContext, useEffect } from "react";

// import { LanguageContext, LanguageContextType } from "../core/LanguageProvider";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import Logo from "../assets/images/logo-clean-200x200.png";
// import { isMobile } from 'react-device-detect';
import { Link, Image } from '@chakra-ui/react';
import { useMenu } from "../hooks/useMenuContext"; // Import useMenu hook for context

const Header: React.FC = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { setIsMenuOpen } = useMenu(); // Access setIsMenuOpen from context


  useEffect(() => {
    const menuModal = document.getElementById("menu");
    if (menuModal) {
      menuModal.addEventListener("show.bs.modal", () => {
        console.log("Menu opened");
        setIsMenuOpen(true);
      });
      menuModal.addEventListener("hide.bs.modal", () => {
        console.log("Menu closed");
        setIsMenuOpen(false);
      });
    }

    return () => {
      if (menuModal) {
        menuModal.removeEventListener("show.bs.modal", () => setIsMenuOpen(true));
        menuModal.removeEventListener("hide.bs.modal", () => setIsMenuOpen(false));
      }
    };
  }, [setIsMenuOpen]);

  const [linkName, setLinkName] = React.useState("");

  const handleChangeBorderButtonOnClick = (linkName) => {
    setLinkName(linkName);
  }

  return (
    <header id="header">
      <nav className="navbar navbar-expand navbar-fixed-top" >
        <div className="container header">
          
          <Link className="navbar-brand" href="/">
            <Image src={Logo} alt="CashBunny Logo" />
          </Link>
          
          {/* Remove mx-auto class and add justify-content-start to align items to the left */}
          <ul className="navbar-nav items justify-content-start " >
          <li className="nav-item" style={{border:window.location.href.indexOf("raffle") > -1 || linkName == "raffle" ? "1px solid #fe9eb4" : "none"}}>
              <Link className="nav-link" href="/raffle" onClick={() => handleChangeBorderButtonOnClick("raffle")} >
                  Raffle
              </Link>
            </li>      
            <li className="nav-item" style={{marginLeft:"10px", border:window.location.href.indexOf("leaderboard") > -1 || linkName == "leaderboard" ? "1px solid #fe9eb4" : "none"}}>
              <Link className="nav-link" href="/leaderboard"  onClick={() => handleChangeBorderButtonOnClick("leaderboard")}>
                  Leaderboard
              </Link> 
            </li>    
            <li className="nav-item">
              <Link className="nav-link"  target="_blank" href="https://github.com/cashbunnydotfun" isExternal >
                  Github
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="https://cashbunny.medium.com/" target="_blank" isExternal>
                  Medium
              </Link>
            </li>        
            <li className="nav-item">
              <Link className="nav-link" href="https://t.me/CashBunnyFun" target="_blank" isExternal>
                  Telegram
              </Link>
            </li>       
            {/* <li className="nav-item">
              <Link className="nav-link" href="https://discord.gg/cashbunny" target="_blank" isExternal>
                  Discord
              </Link>
            </li>                          */}
          </ul>

          {/* Wallet Connect */}
          <ul className="navbar-nav action">
            <li className="nav-item ml-2">
              <a
                className="btn ml-lg-auto btn-bordered-pink"
                onClick={() => open()}
              >
                <p style={{color:"#fe9eb4"}}>
                <i className="fa-solid fa-wallet mr-md-2"></i>
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
                  : "Wallet Connect"}
                </p>
              </a>
            </li>
          </ul>

          <ul className="navbar-nav toggle">
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="modal"
                data-bs-target="#menu"
              >
                <i className="fa-solid fa-bars m-0"></i>
              </a>
            </li>
          </ul>

        </div>
      </nav>
      {/* Mobile Modal */}
      <div id="menu" className="modal fade p-0">
        <div className="modal-dialog dialog-animated">
          <div className="modal-content h-100">
            <div
              className="modal-header"
              data-bs-dismiss="modal"
              style={{ color: "#fff" }}
            >
              Menu <i className="far fa-times-circle icon-close"></i>
            </div>
            <div className="menu modal-body">
              <div className="row w-100">
                <div className="items p-0 col-12 text-center">
                  <ul className="navbar-nav items mx-auto">

                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px", marginTop:"20px"}}
                    >
                      <a className="btn ml-lg-auto btn-bordered-white" href="https://github.com/cashbunnydotfun" target="_blank">
                        Github
                      </a>
                    </li>

                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px", marginTop:"20px"}}
                    >
                      <a className="btn ml-lg-auto btn-bordered-white" href="https://cashbunny.medium.com/" target="_blank">
                        Medium
                      </a>
                    </li>

                    {/* Wallet Connect */}
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px", marginTop:"20px"}}
                    >
                      <a
                        className="btn ml-lg-auto btn-bordered-white"
                        onClick={() => open}
                      >
                        <i className="fa-solid fa-wallet mr-md-2" ></i>
                        {isConnected
                          ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
                          : "Connect Wallet"}
                      </a>
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
