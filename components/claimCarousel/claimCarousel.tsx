import { Button } from "react-bootstrap";
import styles from "./claimCarousel.module.scss";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Router from "next/router";

import { useMoralis,useMoralisWeb3Api } from "react-moralis";
  const ClaimCarousel: React.FC = (nfts) => {
  const [Nft, setNft] = useState([]);
  const [isLoading,setIsLoading]= useState(true);
  const [error, setError] = useState<string | undefined>("");

  const fetchNFTs = async (address:String) => {
    const Web3Api = useMoralisWeb3Api();
    // get mainnet transactions for the current user
  
    // get BSC transactions for a given address
    // with most recent transactions appearing first
    const options = {
      chain: "eth",
      address: address,
      from_block: "0",
    };
    try{
      const bscTransactions = await Web3Api.account.getNFTs(options);
      console.log(bscTransactions);
      setNft(bscTransactions.result)
      setIsLoading(false)
    }catch(e){
      console.log(e)
    }
  };
  if(isLoading){
  fetchNFTs("0x8118547d2f70f36e86c92aeba3c3fac4518d313c")
  }
  console.log(Nft)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = userInfo;

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error === null) {
      Router.push("/");
    } else {
      setError(signInResult?.error);
    }
  };

  return (
    <div >
    
    <div className={styles.formLogin}>
      
        <h3>NFTs</h3>
        {Nft.filter(e=>e.token_address=="0xe106c63e655df0e300b78336af587f300cff9e76").map(e=> 
        <img style={{width: 200, height: 200}} src={JSON.parse(e.metadata)?.image.replace("ipfs://","https://ipfs.io/ipfs/")}/>
        )}
        <div className={styles.formGroup}>
         
        </div>
      
    </div>
    
    
    </div>
  );
};

export default ClaimCarousel;
