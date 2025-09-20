import { useEffect, useState } from "react";
import type { UserData } from "@stacks/connect";

export function useStacks() {
  // Initially when the user is not logged in, userData is null
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Track if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only create these on the client side
  const getStacksInstances = async () => {
    if (typeof window === 'undefined') return null;
    
    const { AppConfig, UserSession } = await import("@stacks/connect");
    const appConfig = new AppConfig(["store_write"]);
    const userSession = new UserSession({ appConfig });
    
    return { appConfig, userSession };
  };

  const connectWallet = async () => {
    if (!isClient) return;
    
    const stacksInstances = await getStacksInstances();
    if (!stacksInstances) return;
    
    const { showConnect } = await import("@stacks/connect");
    
    showConnect({
      appDetails: {
        name: "Stacks Account History",
        icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
      },
      onFinish: () => {
        // reload the webpage when wallet connection succeeds
        // to ensure that the user session gets populated from local storage
        window.location.reload();
      },
      userSession: stacksInstances.userSession,
    });
  };

  const disconnectWallet = async () => {
    if (!isClient) return;
    
    const stacksInstances = await getStacksInstances();
    if (!stacksInstances) return;
    
    // sign out the user and close their session
    // also clear out the user data
    stacksInstances.userSession.signUserOut();
    setUserData(null);
  };

  // When the page first loads, if the user is already signed in,
  // set the userData
  // If the user has a pending sign-in instead, resume the sign-in flow
  useEffect(() => {
    const initializeStacks = async () => {
      if (!isClient) return;
      
      const stacksInstances = await getStacksInstances();
      if (!stacksInstances) return;
      
      if (stacksInstances.userSession.isUserSignedIn()) {
        setUserData(stacksInstances.userSession.loadUserData());
      } else if (stacksInstances.userSession.isSignInPending()) {
        stacksInstances.userSession.handlePendingSignIn().then((userData: UserData) => {
          setUserData(userData);
        });
      }
    };
    
    initializeStacks();
  }, [isClient]);

  // return the user data, connect wallet function, and disconnect wallet function
  return { userData, connectWallet, disconnectWallet };
}
