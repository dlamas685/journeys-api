import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		super({
			transactionOptions: {
				timeout: 10000,
				maxWait: 5000,
			},
		})
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}
