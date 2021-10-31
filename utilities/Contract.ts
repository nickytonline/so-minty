import { ethers } from 'ethers';
import abi from './SoMinty.json';

export const CONTRACT_ADDRESS = '0xb1094eD25085Fd8ec148568723f8d86a1fcf7696';
export const contractAbi = abi.abi;

export type Contract = ethers.Contract & {
  makeAnEpicNFT: () => void;
};
