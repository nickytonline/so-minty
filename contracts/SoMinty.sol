// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.9;

// We need some util functions for strings.
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';

// We need to import the helper functions from the contract that we copy/pasted.
import {Base64} from './libraries/Base64.sol';

contract SoMinty is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.

    // I create three arrays, each with their own theme of random words.
    // Pick some random funny words, names of anime characters, foods you like, whatever!
    string[] firstWords = [
        'Corvette',
        'Grand Caravan',
        'Impala',
        'Model T',
        'Colorado'
    ];
    string[] secondWords = [
        '#FFA500',
        '#bada55',
        '#DD63EE',
        '#689BC0',
        '#00ff00'
    ];
    string[] thirdWords = [
        'North Constance',
        'Deondreville',
        'Port Othoborough',
        'Gusikowskistad',
        'Halvorsonfort'
    ];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721('SquareNFT', 'SQUARE') {
        console.log('This NFT contract is so minty.');
    }

    // I create a function to randomly pick a word from each array.
    function pickRandomFirstWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        // I seed the random generator. More on this in the lesson.
        uint256 rand = random(
            string(abi.encodePacked('FIRST_WORD', Strings.toString(tokenId)))
        );
        // Squash the # between 0 and the length of the array to avoid going out of bounds.
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked('SECOND_WORD', Strings.toString(tokenId)))
        );
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked('THIRD_WORD', Strings.toString(tokenId)))
        );
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnEpicNFT() public {
        uint256 newItemId = _tokenIds.current();

        // We go and randomly grab one word from each of the three arrays.
        string memory word = pickRandomFirstWord(newItemId);
        string memory color = pickRandomSecondWord(newItemId);
        string memory city = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(
            abi.encodePacked(word, ', ', color, ', ', city)
        );

        string
            memory baseSvgPart1 = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: #000000;font-family: serif;font-size: 24px;font-weight: 700; }</style><rect width='100%' height='100%' fill='";
        string
            memory baseSvgPart2 = "' /><text transform='rotate(35)' x='70%' y='20%' class='base' dominant-baseline='middle' text-anchor='middle'>";

        // I concatenate it all together, and then close the <text> and <svg> tags.
        string memory finalSvg = string(
            abi.encodePacked(
                baseSvgPart1,
                color,
                baseSvgPart2,
                word,
                ', ',
                color,
                ', ',
                city,
                '</text></svg>'
            )
        );

        console.log('\n--------------------');
        console.log(finalSvg);
        console.log('--------------------\n');

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A very minty collection of squares.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked('data:application/json;base64,', json)
        );

        _safeMint(msg.sender, newItemId);

        // We'll be setting the tokenURI later!
        _setTokenURI(newItemId, finalTokenUri);

        _tokenIds.increment();
        console.log(
            'An NFT w/ ID %s has been minted to %s',
            newItemId,
            msg.sender
        );

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
