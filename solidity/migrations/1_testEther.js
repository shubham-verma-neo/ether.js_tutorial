const testEther = artifacts.require('testEther');

const deployTestEther = (deployer) => {
    deployer.deploy(testEther);
}

module.exports = deployTestEther;