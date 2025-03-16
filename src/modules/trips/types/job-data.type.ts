import { Trip } from '@prisma/client'

export type JobData = Pick<Trip, 'userId' | 'id'>
