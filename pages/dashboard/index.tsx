import { NextPage } from "next";
import Header from "../../components/header/header";
import ClaimCarousel from "../../components/claimCarousel/claimCarousel";
import UserSecurity from "../../components/protect/protect";
import { useState } from "react";


const Dashboard: NextPage = () => {
  //const [Nft, setNft] = useState([]);
  
  // get polygon NFTs for address

//const polygonNFTs =  fetchNFTs;
//console.log(polygonNFTs)

  return (
    
    <>
      <Header />
      <div>
    </div>
      <ClaimCarousel/>
      {UserSecurity("user") && <h1>User connected</h1>}
    </>
  );
};

export default Dashboard;
