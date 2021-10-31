npx hardhat run scripts/deploy.js --network rinkeby
mv artifacts/contracts/SoMinty.sol/SoMinty.json utilities
git add utilities/SoMinty.json
echo "\n****************"
echo "Remember to update your contract address in the UI!"
echo "****************"
