import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../prisma/prisma.service'
import {
	CompanyStatsByMonthEntity,
	CompanyStatsEntity,
	StatsByMonthEntity,
	StatsEntity,
	TopDriversEntity,
} from './entities'

@Injectable()
export class StatsService {
	constructor(private readonly prisma: PrismaService) {}

	async getStats(userId: string) {
		const result = await this.prisma.$queryRaw<StatsEntity[]>(Prisma.sql`
		WITH trip_stats AS (
			SELECT  
				t.user_id,
				COUNT(*)::int total,
				COUNT(CASE WHEN t.is_archived IS TRUE THEN 1 END)::int AS "totalArchived",
				COUNT(CASE WHEN t.is_archived IS NOT TRUE THEN 1 END)::int AS "totalNoArchived"
			FROM trips t
			GROUP BY t.user_id
		)
		SELECT * FROM trip_stats
		WHERE user_id = ${userId}::uuid;`)

		return plainToInstance(StatsEntity, result[0], {
			excludeExtraneousValues: true,
		})
	}

	async getStatsByMonth(userId: string, year?: number, month?: number) {
		const result = await this.prisma.$queryRaw<StatsByMonthEntity[]>(Prisma.sql`
			WITH stats_by_month AS (
				SELECT
					t.user_id, 
					date_part('year', t.departure_time) AS year, 
					date_part('month', t.departure_time) AS month,
					COUNT(CASE WHEN t.is_archived IS TRUE THEN 1 END)::int AS "countArchived",
					COUNT(CASE WHEN t.is_archived IS FALSE THEN 1 END)::int AS "countNotArchived"
				FROM
					trips t
				GROUP BY
					t.user_id,
					year,
					month
				ORDER BY
					year DESC, month DESC
			)
			SELECT * FROM stats_by_month
			WHERE user_id = ${userId}::uuid
			${year ? Prisma.sql`AND year = ${year}` : Prisma.empty}
			${month ? Prisma.sql`AND month = ${month}` : Prisma.empty}`)

		return plainToInstance(StatsByMonthEntity, result, {
			excludeExtraneousValues: true,
		})
	}

	async getCompanyStats(userId: string) {
		const result = await this.prisma.$queryRaw<CompanyStatsEntity[]>(Prisma.sql`
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

		return plainToInstance(CompanyStatsEntity, result[0], {
			excludeExtraneousValues: true,
		})
	}

	async getCompanyStatsByMonth(userId: string, year?: number, month?: number) {
		const result = await this.prisma.$queryRaw<
			CompanyStatsByMonthEntity[]
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

		return plainToInstance(CompanyStatsByMonthEntity, result, {
			excludeExtraneousValues: true,
		})
	}

	async getCompanyTopDrivers(userId: string) {
		const result = this.prisma.$queryRaw<
			TopDriversEntity[]
		>(Prisma.sql`WITH top_drivers AS (
			SELECT
				r.user_id,
				r.driver_id,
				COUNT(CASE WHEN r.status = 'COMPLETED' THEN 1 END)::int AS count_completed
			FROM roadmaps r
			GROUP BY
				r.user_id,
				r.driver_id
			)
			SELECT d."name", td.count_completed AS "countCompleted" 
			FROM top_drivers td INNER JOIN drivers d ON d.id = td.driver_id
			WHERE td.user_id = ${userId}::uuid 
			ORDER BY td.count_completed DESC LIMIT 5;`)

		return plainToInstance(TopDriversEntity, result, {
			excludeExtraneousValues: true,
		})
	}
}
