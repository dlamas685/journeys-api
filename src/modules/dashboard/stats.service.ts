import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../prisma/prisma.service'
import { CompanyStats, CompanyStatsByMonth } from './dto/company-stats.dto'

@Injectable()
export class StatsService {
	constructor(private readonly prisma: PrismaService) {}

	create(createDashboardDto: CompanyStats) {
		return 'This action adds a new dashboard'
	}

	async companyStats(userId: string) {
		const result = await this.prisma.$queryRaw<CompanyStats>(Prisma.sql`
		WITH company_stats AS (
			SELECT  
				r.user_id,
				COUNT(*)::int total,
				COUNT(CASE WHEN r.status = 'UPCOMING' THEN 1 END)::int AS "totalUpcoming",
				COUNT(CASE WHEN r.status = 'ONGOING' THEN 1 END)::int AS "totalOngoing",
				COUNT(CASE WHEN r.status = 'COMPLETED' THEN 1 END)::int AS "totalCompleted",
				COUNT(CASE WHEN r.status = 'DISMISSED' THEN 1 END)::int AS "totalDismissed"
			FROM roadmaps r
			GROUP BY r.user_id
		)
		SELECT * FROM company_stats
		WHERE user_id = ${userId}::uuid;`)

		return plainToInstance(CompanyStats, result)
	}

	async companyStatsByMonth(userId: string, year?: number, month?: number) {
		const result = await this.prisma.$queryRaw<
			CompanyStatsByMonth[]
		>(Prisma.sql`
			WITH company_stats_by_month AS (
				SELECT
					r.user_id, 
					date_part('year', r.start_date_time) as year, 
					date_part('month', r.start_date_time) as month,
					COUNT(case when r.status = 'COMPLETED' then 1 end)::int as "countCompleted"
				FROM
					roadmaps r
				GROUP BY
					r.user_id,
					year,
					month
				ORDER BY
					year desc, month desc
			)
			SELECT * FROM company_stats_by_month
			WHERE  user_id = ${userId}::uuid
			${year ? Prisma.sql`AND year = ${year}` : Prisma.empty}
			${month ? Prisma.sql`AND month = ${month}` : Prisma.empty}`)

		return plainToInstance(CompanyStatsByMonth, result)
	}
}
