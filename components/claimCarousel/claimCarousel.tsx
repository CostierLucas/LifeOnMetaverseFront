import styles from "./claimCarousel.module.scss";
import { useState, useEffect } from "react";
import { useMoralisWeb3Api } from "react-moralis";
import { useWeb3React } from "@web3-react/core";
import { targetChainId } from "../../WalletHelpers/contractVariables";
import { IEdition } from "../../interfaces/interfaces";
import ContractAbi from "../../WalletHelpers/contractTokenAbi.json";
import { ethers } from "ethers";

const ClaimCarousel: React.FC<{ edition: IEdition }> = ({ edition }) => {
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;
  const [arrayNfts, setArrayNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const Web3Api = useMoralisWeb3Api();

  useEffect(() => {
    if (!!provider && chainId == targetChainId && !!account) {
      getDatas(account);
    }
  }, [chainId, provider]);

  const getDatas = async (address: String) => {
    Object.values(edition).map(async (key) => {
      const options = {
        chain: "mumbai",
        address: account,
        from_block: "0",
        token_address: key.address,
      };

      try {
        const nfts = await Web3Api.account.getNFTsForContract(options as any);
        if (nfts.result!.length > 0) {
          for (let i = 0; i < nfts.result!.length; i++) {
            const nft = nfts.result![i];
            const rewards = await getRewardsByTokenId(
              key.address,
              nfts.result![i].token_id
            );
            const nftWithRewards = { ...nft, rewards };
            setArrayNfts((arrayNfts) => [...arrayNfts, nftWithRewards]);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  };

  const claim = async (address: string, tokenId: String) => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(address, ContractAbi.abi, getSigner);
    try {
      const tx = await contract.claimRoyalties(tokenId);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const getRewardsByTokenId = async (address: string, tokenId: String) => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(address, ContractAbi.abi, getSigner);

    try {
      const tx = await contract.getRewardsByTokenId(tokenId);
      return tx;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className={styles.formLogin}>
        <h3>NFTs</h3>
        <div className={styles.tableNft}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Token ID</th>
                <th scope="col">Image</th>
                <th scope="col">rewards</th>
                <th scope="col">Claim</th>
              </tr>
            </thead>
            <tbody>
              {arrayNfts.map((nft, index) => {
                return (
                  <tr key={index}>
                    <td scope="row">#{nft.token_id}</td>
                    <td>{nft.token_address}</td>
                    <td>{parseInt(nft.rewards)} $</td>
                    <td>
                      <button
                        onClick={() => claim(nft.token_address, nft.token_id)}
                      >
                        Claim
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClaimCarousel;
