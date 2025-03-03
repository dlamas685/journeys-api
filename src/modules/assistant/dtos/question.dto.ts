import { IsNotEmpty } from 'class-validator'

export class QuestionDto {
	@IsNotEmpty()
	threadId: string

	@IsNotEmpty()
	content: string
}
