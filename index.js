const express = require("express");
const app = express();
const Moralis = require("moralis").default;
const cors = require("cors");
require("dotenv").config({ path: ".env" });//we need to use this to access the environment variables

app.use(cors());//we need to use cors to allow the frontend to access the backend
app.use(express.json());//we need to use this to parse the body of the request
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;//moralis api key
const PORT = process.env.PORT || 3000;//project port



app.get("/getethprice", async (req, res) => {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: process.env.ETH_ADDRESS,
        chain: "0x1",
      });
      return res.status(200).json(response);
    } catch (e) {
      return res.status(400).json(e.message);
    }
  });

  app.get("/getblockinfo", async (req, res) => {
    try {
      const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
        date: Date.now(),
        chain: "0x1",
      });
  
      let blockNrOrParentHash = latestBlock.toJSON().block;
      let previousBlockInfo = [];
  
      for (let i = 0; i < 5; i++) {
        const previousBlockNrs = await Moralis.EvmApi.block.getBlock({
          chain: "0x1",
          blockNumberOrHash: blockNrOrParentHash,
        });
  
        blockNrOrParentHash = previousBlockNrs.toJSON().parent_hash;
        if (i == 0) {
          previousBlockInfo.push({
            transactions: previousBlockNrs.toJSON().transactions.map((i) => {
              return {
                transactionHash: i.hash,
                time: i.block_timestamp,
                fromAddress: i.from_address,
                toAddress: i.to_address,
                value: i.value,
              };
            }),
          });
        }
        previousBlockInfo.push({
          blockNumber: previousBlockNrs.toJSON().number,
          totalTransactions: previousBlockNrs.toJSON().transaction_count,
          gasUsed: previousBlockNrs.toJSON().gas_used,
          miner: previousBlockNrs.toJSON().miner,
          time: previousBlockNrs.toJSON().timestamp,
        });
      }
  
      const response = {
        latestBlock: latestBlock.toJSON().block,
        previousBlockInfo,
      };
  
      return res.status(200).json(response);
    } catch (e) {
      console.log(`Something went wrong ${e}`);
      return res.status(400).json(e.message);
    }
  });


  app.get("/address", async (req, res) => {
  try {
    const { query } = req;
    const chain = "0x1";//for ethereum 
    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: query.address,
        chain,
      });
    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong ${e}`);
    return res.status(400).json(e.message);
  }
});




//we need to start the server and moralis server 
//if we don't start the moralis server we will get an error that the module server can only hit the server once
Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});