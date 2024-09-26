import {
	Body,
	Button,
	Column,
	Container,
	Font,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import * as React from 'react'
import tailwindConfig from 'src/common/modules/mails/config/tailwind.config'
import { WelcomeStep } from 'src/common/modules/mails/interfaces'

type Props = {
	steps: WelcomeStep[]
	name: string
	message: string
	verificationLink: string
}

const WelcomeUser = ({
	steps,
	message,
	name,
	verificationLink,
}: Readonly<Props>) => {
	const year = new Date().getFullYear()

	return (
		<Html lang='es'>
			<Head>
				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={300}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={500}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={600}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={700}
					fontStyle='normal'
				/>
			</Head>

			<Preview>Bienvenido a Journeys</Preview>
			<Body>
				<Tailwind config={tailwindConfig}>
					<Container className='bg-offwhite mx-auto my-0 w-[680px] p-4 max-w-full'>
						<Section className='rounded-md'>
							<Img
								src='https://journeys-api.onrender.com/api/images/imagotype-v1.png'
								alt='Journeys'
								className='object-cover w-56 mx-auto'
							/>
						</Section>
						<Section className='p-4 bg-white'>
							<Heading
								as='h1'
								className='font-secondary text-2xl text-center font-extrabold '>
								Hola, {name}
							</Heading>
							<Text className='text-base text-gray-500'>{message}</Text>

							<Text className='text-base text-gray-500'>
								Aquí te explicamos como empezar:
							</Text>

							{steps?.map((step, index) => (
								<Section key={step.id} className='mb-5'>
									<Row>
										<Column className='pr-4 align-top pt-1'>
											<Text className='h-10 w-10 m-0 p-0 rounded-full bg-orange-100 font-semibold text-orange-600 leading-10 text-center'>
												{index + 1}
											</Text>
										</Column>
										<Column>
											<Text className='m-0 text-base font-semibold leading-[28px] text-gray-900'>
												{step.title}
											</Text>
											<Text className='m-0 mt-1 text-base leading-[24px] text-gray-500'>
												{step.description}
											</Text>
										</Column>
									</Row>
								</Section>
							))}

							<Section className='mt-10'>
								<Row>
									<Column align='center'>
										<Button
											href={verificationLink}
											className='bg-orange-500 text-white px-4 py-3 rounded-md select-none cursor-pointer'>
											Verificar correo electrónico
										</Button>
									</Column>
								</Row>
							</Section>

							<Section className='mt-5'>
								<Row>
									<Column align='center'>
										<Text className='text-xs text-center text-gray-400'>
											&copy; {year} Journeys. Todos los derechos reservados.
										</Text>
									</Column>
								</Row>
							</Section>
						</Section>
					</Container>
				</Tailwind>
			</Body>
		</Html>
	)
}

export default WelcomeUser
