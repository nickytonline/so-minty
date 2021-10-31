import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { BaseProvider } from '@metamask/providers';
import { Maybe } from '@metamask/providers/dist/utils';
import { toast, ToastContainer } from 'react-toastify';
import { RinkebyNetworkId } from 'utilities/NetworkIds';

import 'react-toastify/dist/ReactToastify.css';
import { Wallet } from '@components/Wallet';
import { contractAbi, CONTRACT_ADDRESS } from '../utilities/Contract';
import { Miner } from '@components/Miner';
import { getMissingMetamaskMessage } from 'utilities/metamask';
import { LoadingIndicator } from '@components/LoadingIndicator';
import { Button } from '@components/Button';
import { NftLink } from '@components/OpenSeaLink';

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState<Maybe<string>>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function getContract(ethereum = window.ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

    return contract;
  }

  async function mintNft() {
    if (!currentAccount) {
      return;
    }

    let transactionId: string | undefined;

    if (!window.ethereum) {
      stopLoading();
      toast.error(getMissingMetamaskMessage());
      return;
    }

    try {
      const connectedContract = getContract();

      connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
        setTokenId(tokenId.toNumber());
        console.log(from, tokenId.toNumber());
      });

      console.log('Going to pop wallet now to pay gas...');
      let nftTxn = await connectedContract.makeAnEpicNFT();
      transactionId = nftTxn.hash;

      toast.info(<Miner message="Minting NFT" />, {
        autoClose: false,
        toastId: transactionId,
      });

      console.log('Mining...please wait.');
      await nftTxn.wait();

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
      );
      toast.success(
        `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea.`,
      );
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      if (transactionId != null) {
        toast.dismiss(transactionId);
      }
    }
  }

  function stopLoading() {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        stopLoading();
        toast.error(getMissingMetamaskMessage());
        return;
      }

      if (
        ethereum.networkVersion != null &&
        ethereum.networkVersion !== RinkebyNetworkId
      ) {
        stopLoading();
        toast.error('You are not on the Rinkeby network.');
        return;
      }

      ethereum.on('accountsChanged', ([account]: Array<string>) => {
        if (account) {
          // We're only interested in the first account for now
          // to keep things simple
          setCurrentAccount(account);
        } else {
          setCurrentAccount(null);
          toast.warn(
            'No authorized account found. Connect your account in your Metamask wallet.',
          );
        }
      });

      const accounts = await ethereum.request<[string]>({
        method: 'eth_requestAccounts',
      });

      if (accounts?.length) {
        const [account] = accounts;
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      }
    } catch (error: any) {
      console.log(error);

      if (
        error.message.includes(
          `Request of type 'wallet_requestPermissions' already pending`,
        )
      ) {
        toast.info(
          `You've already requested to connect your Metamask wallet. Click on the Metamask wallet extension to bring it back to focus so you can connect your wallet.`,
        );
      } else if (error.message.includes(`User rejected the request.`)) {
        toast.info(`That's so sad. You decided to not connect your wallet. 😭`);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      stopLoading();
    }
  }

  useEffect(() => {
    async function checkIfWalletIsConnected(ethereum: BaseProvider) {
      try {
        const accounts = await ethereum.request<[string]>({
          method: 'eth_accounts',
        });

        if (accounts?.length) {
          const [account] = accounts;
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        }
      } catch (error) {
        console.dir(error);
        toast.error('An unknown error occurred connecting your account.');
      } finally {
        stopLoading();
      }
    }

    const { ethereum } = window;

    if (!ethereum) {
      stopLoading();
      toast.error(getMissingMetamaskMessage());
      return;
    }

    if (
      ethereum.networkVersion != null &&
      ethereum.networkVersion !== RinkebyNetworkId
    ) {
      stopLoading();
      toast.error('You are not on the Rinkeby network.');
      return;
    }

    checkIfWalletIsConnected(ethereum);

    document.querySelector('.Toastify')?.setAttribute('aria-live', 'polite');
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <header>
        <h1 sx={{ fontFamily: 'heading' }}>
          Welcome to <span sx={{ color: 'accent' }}>so minty 💚</span>
        </h1>
      </header>
      <main>
        <ToastContainer position="top-right" theme="dark" />
        <Wallet connectWallet={connectWallet} account={currentAccount} />
        {currentAccount && (
          <>
            <Button onClick={mintNft}>Mint NFT</Button>
            <h2 sx={{ marginTop: '1rem' }}>Last NFT minted Links</h2>
          </>
        )}
        {currentAccount && tokenId ? (
          <div sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <NftLink
              contractAddress={CONTRACT_ADDRESS}
              tokenId={tokenId}
              type="opensea"
            />
            <NftLink
              contractAddress={CONTRACT_ADDRESS}
              tokenId={tokenId}
              type="openseacollection"
            />
            <NftLink
              contractAddress={CONTRACT_ADDRESS}
              tokenId={tokenId}
              type="rarible"
            />
          </div>
        ) : (
          currentAccount && <p sx={{ marginTop: '1rem' }}>None</p>
        )}
      </main>
      <footer>
        <nav>
          <ul
            sx={{
              listStyle: 'none',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              placeItems: 'center',
              margin: 0,
              marginTop: '1rem',
              padding: 0,
              gridGap: '1rem',
            }}
          >
            <li>
              <a href="https://github.com/nickytonline/so-minty">source code</a>
            </li>
            <li>
              <a href="https://timeline.iamdeveloper.com">about Nick</a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
};

export default Home;
