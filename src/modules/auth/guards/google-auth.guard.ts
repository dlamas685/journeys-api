import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	constructor() {
		super({
			accessType: 'offline',
		})
	}

	handleRequest(err, user, info, context: ExecutionContext) {
		const req = context.switchToHttp().getRequest()
		const error = req.query.error

		if (error) {
			return null
		}

		return user
	}
}
