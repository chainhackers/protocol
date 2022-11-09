import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20Mock } from "@typechain/ERC20Mock";
import { UniswapV3Wrapper } from "@typechain/UniswapV3Wrapper";
import { USDCMock } from "@typechain/USDCMock";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { bn } from "../../common/numbers";

/// @dev The minimum tick that may be passed to #getSqrtRatioAtTick computed from log base 1.0001 of 2**-128
export const MIN_TICK = -887272;
/// @dev The maximum tick that may be passed to #getSqrtRatioAtTick computed from log base 1.0001 of 2**128
export const MAX_TICK = -MIN_TICK;

export type TMintParams = {
  token0: string;
  token1: string;
  fee: BigNumberish;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
  amount0Desired: BigNumberish;
  amount1Desired: BigNumberish;
  amount0Min: BigNumberish;
  amount1Min: BigNumberish;
  recipient: string;
  deadline: BigNumberish;
}

export async function deployUniswapV3Wrapper(address: SignerWithAddress): Promise<UniswapV3Wrapper> {
  const uniswapV3WrapperContractFactory = await ethers.getContractFactory('UniswapV3Wrapper')
  const uniswapV3Wrapper: UniswapV3Wrapper = <UniswapV3Wrapper>(
    await uniswapV3WrapperContractFactory.connect(address).deploy(
      "UniswapV3WrapperToken",
      "U3W"
    )
  )
  return uniswapV3Wrapper
}

export async function adjustedAmout(asset: (ERC20Mock | USDCMock | UniswapV3Wrapper), amount: BigNumberish): Promise<BigNumber> {
  return BigNumber.from(10).pow(await asset.decimals()).mul(bn(amount))
}

export async function logBalances(prefix: string, accounts: SignerWithAddress[], assets: (ERC20Mock | USDCMock | UniswapV3Wrapper)[]) {
  console.log(prefix);
  const table = [];
  for (const account of accounts) {
    for (const asset of assets) {
      const address = account.address;
      table.push({
        name: await asset.name(),
        asset: await asset.name(),
        balance: (await asset.balanceOf(address)).toString(),
      });
    }
  }
  console.table(table);
}