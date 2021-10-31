import OpenSeaIcon from '@assets/icons/opensea.svg';
import { removeTypeDuplicates } from '@babel/types';
import { Flex } from '@theme-ui/components';

export const NftLink: React.FC<{
  type: 'opensea' | 'rarible' | 'openseacollection';
  contractAddress: string;
  tokenId: string;
}> = ({ contractAddress, tokenId, type }) => {
  let url;
  let linkText;
  let title;

  switch (type) {
    case 'opensea':
      url = `https://testnets.opensea.io/assets/${contractAddress}/${tokenId}`;
      linkText = 'NFT';
      title = 'View NFT on OpenSea';
      break;
    case 'rarible':
      url = `https://rinkeby.rarible.com/token/${contractAddress}:${tokenId}`;
      linkText = 'On Rarible';
      title = 'View NFT on Rarible';
      break;
    case 'openseacollection':
      url = `https://testnets.opensea.io/collection/squarenft-kchhee5bmp`;
      linkText = 'Collection';
      title = 'View entire NFT Collection on OpenSea';
      break;
  }

  return (
    <a
      sx={{
        color: '#000',
        wordBreak: 'break-word',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        '&:hover svg': {
          transform: 'rotate(-15deg)',
        },
      }}
      href={url}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <OpenSeaIcon width="24" height="24" />{' '}
      <span
        sx={{
          marginLeft: '0.5rem',
        }}
      >
        {linkText}
      </span>
    </a>
  );
};
