export const NftLink: React.FC<{
  type: 'opensea' | 'rarible' | 'openseacollection';
  contractAddress: string;
  tokenId: string;
}> = ({ contractAddress, tokenId, type }) => {
  let url;
  let linkText;

  switch (type) {
    case 'opensea':
      url = `https://testnets.opensea.io/assets/${contractAddress}/${tokenId}`;
      linkText = 'View on Open Sea';
      break;
    case 'rarible':
      url = `https://rinkeby.rarible.com/token/${contractAddress}:${tokenId}`;
      linkText = 'View on Rarible';
      break;
    case 'openseacollection':
      url = `https://testnets.opensea.io/collection/squarenft-kchhee5bmp`;
      linkText = 'View on Open Sea Collection';
      break;
  }

  return (
    <a
      sx={{
        color: 'accent',
        wordBreak: 'break-word',
        borderRadius: '0.25rem',
        padding: '0.5rem',
      }}
      href={url}
      title={`Check out the NFT`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {linkText}
    </a>
  );
};
