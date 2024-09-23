import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetCurrentUserById = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		return request.user?.userId // this comes from jwt strategy
	}
)

/* Usage example
@UseGuards(AuthGuard('jwt'))
@Get()
async findOne(@GetCurrentUserById() userId: string) {
  console.log(user);
}
*/
