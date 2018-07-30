import { Snowflake } from "discord.js";
import { IWalletTransferResult, DataRequest } from "@utility/datarequest";

export const TRANSFER_RATE = .20;

export class Wallet {
	private readonly _userId?: Snowflake

	public static getTotal(): Promise<number> {
		return DataRequest.walletGetStaticTotal();
	}

	public constructor(userId: Snowflake) {
		this._userId = userId;
	}

	public async getTotal(): Promise<number> {
		return DataRequest.walletGetTotal(this._userId);
	}

	public async change(amount: number): Promise<number> {
		return DataRequest.walletChange(this._userId, amount);
	}

	public async transfer(amount: number, toUserId: Snowflake = null): Promise<IWalletTransferResult> {
		return DataRequest.walletTransfer(this._userId, amount, toUserId);
	}
}
