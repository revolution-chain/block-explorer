import type { NetworkConfig, RuntimeConfig } from "@/configs";

import { checksumAddress } from "@/utils/formatters";
export const DEFAULT_NETWORK: NetworkConfig = {
  "apiUrl": "https://api.libertas.revoscan.io",
  "verificationApiUrl": "https://contract-verifier-api.libertas.revolutionchain.io",
  "bridgeUrl": "http://libertas.revoscan.io:3000/bridge/?network=sepolia",
  "hostnames": [
  ],
  "icon": "/images/icons/revo.svg",
  "l1ExplorerUrl": "https://sepolia.etherscan.io",
  "l2ChainId": 73683,
  "l2NetworkName": "Libertas",
  "maintenance": false,
  "name": "revolution",
  "published": true,
  "rpcUrl": "https://libertas.revolutionchain.io",
  "baseTokenAddress": "0x2c81f8b274d6096bbd99a6e133e2dec3731af114"
};

export default (): RuntimeConfig => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const runtimeConfig = window && window["##runtimeConfig"];

  return {
    version: import.meta.env?.VITE_VERSION || "localhost",
    sentryDSN: runtimeConfig?.sentryDSN || import.meta.env?.VITE_SENTRY_DSN,
    appEnvironment: runtimeConfig?.appEnvironment || import.meta.env?.VITE_APP_ENVIRONMENT || "default",
    environmentConfig: runtimeConfig?.environmentConfig,
  };
};
