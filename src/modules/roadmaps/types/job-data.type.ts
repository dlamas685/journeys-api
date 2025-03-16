import { Roadmap } from '@prisma/client'

export type JobData = Pick<Roadmap, 'userId' | 'id'>
