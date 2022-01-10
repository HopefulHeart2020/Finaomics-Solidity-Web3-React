import React, { useState } from "react";
import { NFT_MARKET_ADDRESS } from "../../constants";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import Market_INFO from "artifacts/contracts/Marketplace.sol/NFTsRealmMarketplace.json";

function SetMarketFee() {
  const { library } = useWeb3React();
  // eslint-disable-next-line no-unused-vars
  const [mainFee, setMainFee] = useState("7.5");
  const [tokenFee, setTokenFee] = useState("5");
  const [isProcessingKCS, setIsProcessingKCS] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  const setMarketFeeForKCS = async () => {
    if (mainFee === "" || parseFloat(mainFee) < 1) {
      toast.error("Invalid Fee!");
      return;
    }
    setIsProcessingKCS(true);
    const contract = new Contract(
      NFT_MARKET_ADDRESS,
      Market_INFO.abi,
      library.getSigner()
    );
    const res = await contract.setMarketFeeForKCS(parseFloat(mainFee) * 10);
    res
      .wait()
      .then(async (result) => {
        setIsProcessingKCS(false);
        toast.success(
          "Market Fee For KCS Payment has been updated successfully!"
        );
      })
      .catch((e) => {
        toast.error("Failed to update Fee!");
        setIsProcessingKCS(false);
      });
  };
  const setMarketFeeForToken = async () => {
    if (tokenFee === "" || parseFloat(tokenFee) < 1) {
      toast.error("Invalid Fee!");
      return;
    }
    setIsProcessingToken(true);
    const contract = new Contract(
      NFT_MARKET_ADDRESS,
      Market_INFO.abi,
      library.getSigner()
    );
    const res = await contract.setMarketFeeForToken(parseFloat(tokenFee) * 10);
    res
      .wait()
      .then(async (result) => {
        console.log(result);
        toast.success(
          "Market Fee For Token Payment has been updated successfully!"
        );
        setIsProcessingToken(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to update Fee!");

        setIsProcessingToken(false);
      });
  };
  return (
    <div className="col-12 col-xl-4 col-md-4">
      <div className="asset__info">
        <h2 className="text-white">Set Market Fee</h2>
        <div className="asset__action row">
          <p className="asset__text col-12 pb-2">Market Fee For KCS</p>
          <input
            id="toAddress"
            type="text"
            name="toAddress"
            className="sign__input col-12 height-sm"
            placeholder="7.5"
            value={mainFee || ""}
            onChange={(e) => {
              setMainFee(e.target.value);
            }}
          />
        </div>
        <div className="d-flex justify-center">
          <button
            className="asset__btn asset__btn--clr height-sm col-12"
            onClick={setMarketFeeForKCS}
          >
            {isProcessingKCS ? "REGISTERRING..." : "Set Fee For KCS"}
          </button>
        </div>
        <div className="asset__action row">
          <p className="asset__text col-12 py-2">Market Fee For Token</p>
          <input
            id="toAddress"
            type="text"
            name="toAddress"
            className="sign__input col-12 height-sm"
            placeholder="5"
            value={tokenFee || ""}
            onChange={(e) => {
              setTokenFee(e.target.value);
            }}
          />
        </div>
        <div className="d-flex justify-center">
          <button
            className="asset__btn asset__btn--clr height-sm col-12"
            onClick={setMarketFeeForToken}
          >
            {isProcessingToken ? "REGISTERRING..." : "Set Fee For Token"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetMarketFee;
