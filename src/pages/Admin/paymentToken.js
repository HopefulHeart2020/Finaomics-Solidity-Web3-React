import React, { useState } from "react";
import { NFT_MARKET_ADDRESS } from "../../constants";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import Market_INFO from "artifacts/contracts/Marketplace.sol/NFTsRealmMarketplace.json";
import { isAddress } from "@ethersproject/address";

function PaymentToken() {
  const { library } = useWeb3React();
  // eslint-disable-next-line no-unused-vars
  const [tokenAddress, setTokenAddress] = useState("");
  const [payoutAddress, setPayoutAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const setPaymentToken = async () => {
    if (tokenName === "") {
      toast.error("Invalid token Name!");
      return;
    }
    if (tokenAddress === "" || !isAddress(tokenAddress)) {
      toast.error("Invalid token address!");
      return;
    }
    if (payoutAddress === "" || !isAddress(payoutAddress)) {
      toast.error("Invalid payout address!");
      return;
    }
    setIsProcessing(true);
    const contract = new Contract(
      NFT_MARKET_ADDRESS,
      Market_INFO.abi,
      library.getSigner()
    );
    const res = await contract.setTokenAddress(
      tokenName,
      tokenAddress,
      payoutAddress
    );
    res
      .wait()
      .then(async (result) => {
        toast.success("Payment Token has been registered successfully!");
        setIsProcessing(false);
        setTokenAddress("");
        setPayoutAddress("");
        setTokenName("");
      })
      .catch((e) => {
        toast.error("Failed to set payment token!");

        setIsProcessing(false);
      });
  };
  return (
    <div className="col-12 col-xl-4 col-md-4">
      <div className="asset__info">
        <h2 className="text-white">Set Payment Token</h2>
        <div className="asset__action row">
          <p className="asset__text col-12 pb-2">Token Name</p>
          <input
            id="tokenName"
            type="text"
            name="tokenName"
            className="sign__input col-12 height-sm"
            placeholder="ex: PAD."
            value={tokenName || ""}
            onChange={(e) => {
              setTokenName(e.target.value);
            }}
          />
        </div>
        <div className="asset__action row">
          <p className="asset__text col-12 py-2">Token Address</p>
          <input
            id="tokenAddress"
            type="text"
            name="tokenAddress"
            className="sign__input col-12 height-sm"
            placeholder="ex: 0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893."
            value={tokenAddress || ""}
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
          />
        </div>
        <div className="asset__action row">
          <p className="asset__text col-12 py-2">Payout Address</p>
          <input
            id="payoutAddress"
            type="text"
            name="payoutAddress"
            className="sign__input col-12 height-sm"
            placeholder="ex: 0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893."
            value={payoutAddress || ""}
            onChange={(e) => {
              setPayoutAddress(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="d-flex justify-center">
        <button
          className="asset__btn asset__btn--clr height-sm"
          onClick={setPaymentToken}
        >
          {isProcessing ? "REGISTERRING..." : "SET PAYMENT TOKEN"}
        </button>
      </div>
    </div>
  );
}

export default PaymentToken;
