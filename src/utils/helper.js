import { formatUnits } from "@ethersproject/units";
import { firestore } from "../firebase";

export const getOwnerAvatar = async (owner) => {
  if (owner === null || owner === "") return "";
  const url = (await firestore.collection("users").doc(owner).get()).data();
  if (!url) return "";
  return url.avatar;
};
export function shortenHex(hex, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

const BSCSCAN_PREFIXES = {
  56: "",
  97: "testnet.",
};

/**
 *
 * @param {("Account"|"Transaction")} type
 * @param {[number, string]} data
 */
export const formatBscscanLink = (type, data) => {
  if (type === "Account") {
    const [chainId, address] = data;
    return `https://${BSCSCAN_PREFIXES[chainId]}bscscan.com/address/${address}`;
  } else {
    const [chainId, hash] = data;
    return `https://${BSCSCAN_PREFIXES[chainId]}bscscan.com/tx/${hash}`;
  }
};

/**
 * @name parseBalance
 *
 * @param {import("@ethersproject/bignumber").BigNumberish} balance
 * @param {number} decimals
 * @param {number} decimalsToDisplay
 *
 * @returns {string}
 */
export const parseBalance = (balance, decimals = 18, decimalsToDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);

export const _objToArray = (obj) => {
  const tempArr = [];
  Object.keys(obj).map((key) => tempArr.push(obj[key]));
  return tempArr;
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const nFormatter = (num, digits) => {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

export const calculateAvailableReward = (userActivity) => {
  const playedTimeLevel =
    Number(userActivity.playedTime / 40) + 1
      ? Number(userActivity.playedTime / 40) + 1
      : 1;
  const playedPerDayLevel =
    Number(userActivity.playedPerDay / 4) + 1
      ? Number(userActivity.playedPerDay / 4) + 1
      : 1;
  const achievementLevel =
    Number(userActivity.achievements / 100) + 1
      ? Number(userActivity.achievements / 100) + 1
      : 1;
  const challengesLevel =
    Number(userActivity.challenges / 18) + 1
      ? Number(userActivity.challenges / 18) + 1
      : 1;
  const userLevel = 1;
  const amountStakedLevel = Number(userActivity.stakedLevel)
    ? Number(userActivity.stakedLevel)
    : 1;

  return Number(
    parseInt(playedTimeLevel) +
      parseInt(playedPerDayLevel) +
      parseInt(achievementLevel) +
      parseInt(challengesLevel) +
      parseInt(userLevel) +
      parseInt(amountStakedLevel)
  );
};

// Formate minute to human readable time format
export const displayFormatTime = (time) => {
  if (isNaN(time)) time = 0;
  const hours =
    Number(time / 3600).toFixed(0) > 9
      ? Number(time / 3600).toFixed(0)
      : "0" + Number(time / 3600).toFixed(0);
  const minutes =
    Math.floor(Number(time % 3600) / 60).toFixed(0) > 9
      ? Math.floor(Number(time % 3600) / 60).toFixed(0)
      : "0" + Math.floor(Number(time % 3600) / 60);
  const seconds =
    Number(time % 60).toFixed(0) > 9
      ? Number(time % 60).toFixed(0)
      : "0" + Number(time % 60).toFixed(0);
  return hours + ":" + minutes + ":" + seconds;
};
