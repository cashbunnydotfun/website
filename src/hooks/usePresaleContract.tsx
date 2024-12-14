import { useEffect, useState, useMemo, useCallback } from 'react';
import { ethers, JsonRpcProvider } from "ethers";
import { generateBytes32String } from "../utils";

import config from '../config';

const { environment, presaleContractAddress, providerUrl } = config;
const { formatEther } = ethers;

const usePresaleContract = (network, userAddress, referralCode) => {

    const [presaleData, setPresaleData] = useState({
        totalRaised: "0",
        participantCount: "0",
        finalized: false,
        softCapReached: false,
        contributions: "0",
        totalReferred: "0",
        referralCount: "0",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log( process.env.REACT_APP_PROVIDER_URL)
    // Setup Provider
    const provider = useMemo(
        () =>
            new JsonRpcProvider(
                providerUrl
            ),
        [network]
    );

    // Function to fetch presale info
    const fetchPresaleInfo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Dynamically import the required JSON based on the network
            const Presale = await import(`../assets/Presale.json`);
            const PresaleAbi = Presale.abi;

            // Initialize the contract
            const PresaleContract = new ethers.Contract(
                presaleContractAddress,
                PresaleAbi,
                provider
            );

            // Fetch data from contract
            const [
                totalRaised,
                participantCount,
                finalized,
                softCapReached,
                contributions,
                totalReferred,
                referralCount,
            ] = await Promise.all([
                PresaleContract.getTotalRaised(),
                PresaleContract.getParticipantCount(),
                PresaleContract.finalized(),
                PresaleContract.finalized(),
                PresaleContract.contributions(userAddress),
                PresaleContract.getTotalReferredByCode(generateBytes32String(referralCode)),
                PresaleContract.getReferralUserCount(generateBytes32String(referralCode)),
            ]);

            setPresaleData({
                totalRaised: formatEther(totalRaised),
                participantCount: participantCount,
                finalized,
                softCapReached,
                contributions: contributions,
                totalReferred: totalReferred,
                referralCount: referralCount,
            });
        } catch (error) {
            console.error("Failed to fetch presale info:", error);
            setError("Failed to fetch presale information.");
        } finally {
            setLoading(false);
        }
    }, [provider, presaleContractAddress, userAddress, referralCode]);

    // Fetch data on component mount and when dependencies change
    useEffect(() => {
        fetchPresaleInfo();
    }, [fetchPresaleInfo]);

    // Return presale data and refetch function
    return { ...presaleData, loading, error, refetch: fetchPresaleInfo };
};

export default usePresaleContract;
