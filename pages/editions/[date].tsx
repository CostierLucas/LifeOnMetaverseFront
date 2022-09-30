import styles from './editions.module.scss'
import React, { useState, useEffect } from 'react'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Header from '../../components/header/header'
import db from '../../config/db'
import { IEditionProps } from '../../interfaces/interfaces'
import { Col, Container, Row, Modal, Button } from 'react-bootstrap'
import logo from '../../assets/gifs/test.gif'
import Image from 'next/image'
import { useWeb3React } from '@web3-react/core'
import { ContractFactory, ethers } from 'ethers'
import ContractAbi from '../../WalletHelpers/contractTokenAbi.json'
import ContractUsdcAbi from '../../WalletHelpers/contractUsdcAbi.json'
import ContractFactoryAbi from '../../WalletHelpers/contractFactoryAbi.json'
import ModalEdition from '../../components/modalEdition/modalEdition'
import {
  contractUsdc,
  contractAddress,
  targetChainId,
} from '../../WalletHelpers/contractVariables'
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui'

export const getStaticPaths: GetStaticPaths = async () => {
  const params = {
    TableName: 'life-edition',
  }

  const data = await db.scan(params).promise()
  const editions = data.Items
  const paths = editions!.map((edition) => ({
    params: { date: edition.date.toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const date = context.params?.date as string

  const params = {
    TableName: 'life-edition',
    FilterExpression: '#date =:date',
    ExpressionAttributeValues: { ':date': parseInt(date) },
    ExpressionAttributeNames: { '#date': 'date' },
  }

  const data = await db.scan(params).promise()

  const editions = null || data.Items?.[0]

  return {
    props: {
      editions,
    },
  }
}

const Editions: NextPage<IEditionProps> = ({ editions }) => {
  const [componentLoaded, setComponentLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalShow, setModalShow] = useState<boolean>(false)
  const [allowanceNumber, setAllowanceNumber] = useState<string>('')
  const context = useWeb3React<any>()
  const { account, provider, chainId } = context

  useEffect(() => {
    setComponentLoaded(true)
  }, [])

  useEffect(() => {
    if (!!provider && chainId == targetChainId && !!account) {
      getDatas()
    }
  }, [chainId, provider])

  const getDatas = async () => {
    const getSigner = provider.getSigner()
    const contract = new ethers.Contract(
      contractAddress,
      ContractAbi.abi,
      getSigner,
    )

    const all = await getAllowance()
    console.log('all  ', all)
  }

  const handleMint = async (categoriesId: number) => {
    const getSigner = provider.getSigner()
    const contract = new ethers.Contract(
      contractAddress,
      ContractFactoryAbi.abi,
      getSigner,
    )
    try {
      const tx = await contract.mintUSDCFactory(
        editions.address,
        contractUsdc,
        1,
        categoriesId,
      )
      await tx.wait()
    } catch (e) {
      console.log(e)
    }
  }

  const approve = async () => {
    setIsLoading(true)
    const getSigner = provider.getSigner()
    const contract = new ethers.Contract(
      contractUsdc,
      ContractUsdcAbi,
      getSigner,
    )

    let approve = await contract.approve(
      contractAddress,
      '2000000000000000000000000000000000',
    )

    setIsLoading(false)
  }

  const getAllowance = async () => {
    const getSigner = provider.getSigner()
    const contract = new ethers.Contract(
      contractUsdc,
      ContractUsdcAbi,
      provider,
    )

    let allowance = await contract.allowance(account, contractAddress)
    let parseAllowance = ethers.utils.formatUnits(allowance, 'wei')
    setAllowanceNumber(parseAllowance)
    return parseAllowance
  }

  return (
    <>
      <Header />
      <section className={styles.edition}>
        <Container fluid>
          <Row className={styles.row}>
            <Col md={6}>
              <div className={styles.colBanner}>
                <div className={styles.banner}>
                  <Image
                    src={editions.image as string}
                    alt="logo"
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
                <div className={styles.centerImg}>
                  <Image
                    src={editions.image as string}
                    width="200%"
                    height="200%"
                    objectFit="cover"
                    alt="logo"
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.content}>
                <div className={styles.contentDirect}>
                  <h2>{editions.title}</h2>
                  <p>{editions.description}</p>
                  <div className={styles.spotifyPlayer}>
                    <iframe
                      src={editions.spotify as string}
                      width="100%"
                      height="80"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <hr className={styles.hr} />
          <Row>
            {editions.categories.map((item: string, i: any) => (
              <Col md={4} key={i}>
                <div className={styles.editionItem}>
                  <div className={styles.editionItemImg}>
                    {/* <Image src={logo} layout="fill" objectFit="cover" /> */}
                    <img
                      src="https://spaceseed.mypinata.cloud/ipfs/QmaF47C9UobRQ3LdbafGkgUbHAUfhTpW7Lyd8oTC3przym"
                      alt="image animate"
                    ></img>
                  </div>
                  <div className={styles.editionItemCategories}>
                    <div>
                      <p>{editions.categories[i]}</p>
                    </div>
                    <div>
                      <p>{editions.type}</p>
                    </div>
                  </div>
                  <div className={styles.editionItemBloc}>
                    <p className={styles.percentages}>
                      {/* {parseInt(editions.supply[i]) /
                        editions.percentages[i] /
                        100} */}
                      {parseInt(editions.supply[i]) / 100}%
                    </p>
                    <p className={styles.ownership}>OWNERSHIP PER TOKEN</p>
                    <hr />
                    <p className={styles.price}>${editions.price[i]} </p>
                    {/* <div className={styles.details}>
                      <div>
                        <ul>
                          {editions.titleList &&
                            editions.titleList[
                              i
                            ].map((item: string, j: any) => (
                              <li key={i}>{item}</li>
                            ))}
                        </ul>
                      </div>
                    </div> */}
                    <div className={styles.spaceDetails}></div>
                    <div>
                      <a
                        onClick={() => setModalShow(true)}
                        className={styles.readmore}
                        href="#"
                      >
                        READ MORE
                      </a>
                      <ModalEdition
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title={`${editions.categories[i]} ${editions.type}`}
                      />
                    </div>
                    <div>
                      <CrossmintPayButton
                        clientId="1516fbcf-1363-4a34-bfa0-ac78c2ae4e8a"
                        mintConfig={{
                          type: 'erc-721',
                          totalPrice: '0.001',
                          _contract: editions.address,
                          _category: i,
                          _amount: 1,
                        }}
                        environment="staging"
                        className={styles.crossmintButton}
                      />
                    </div>
                    <div>
                      {account ? (
                        allowanceNumber == '0' ? (
                          <button className={styles.mint} onClick={approve}>
                            Approve first
                          </button>
                        ) : (
                          <button
                            className={styles.mint}
                            onClick={() => handleMint(i)}
                          >
                            Mint
                          </button>
                        )
                      ) : (
                        <button
                          // onClick={() => handleMint(i)}
                          className={styles.mint}
                        >
                          Connect Wallet First
                        </button>
                      )}
                    </div>
                    <div>
                      <a className={styles.opensea} href="https://google.com">
                        BUY ON OPENSEA
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
        <Container className={styles.about}>
          <hr className={styles.hr} />
          <h2>ABOUT</h2>
          <Row className="mb-4 mt-4">
            <Col md={4}>
              <p>Edition</p>
            </Col>
            <Col md={{ span: 4, offset: 4 }}>
              <p className={styles.endText}>Rare</p>
            </Col>
            <Col md={4}>
              <p>Blockchain</p>
            </Col>
            <Col md={{ span: 4, offset: 4 }}>
              <p className={styles.endText}>Matic(Polygon) Mainnet</p>
            </Col>
          </Row>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam,
          </p>
        </Container>
      </section>
    </>
  )
}

export default Editions
