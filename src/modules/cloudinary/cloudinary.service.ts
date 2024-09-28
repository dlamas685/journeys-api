import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import * as streamifier from 'streamifier'
import { CloudinaryResponse } from './types/cloudinary.type'

@Injectable()
export class CloudinaryService {
	uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				(error, result) => {
					if (error) return reject(error)
					resolve(result)
				}
			)

			streamifier.createReadStream(file.buffer).pipe(uploadStream)
		})
	}

	deleteFile(publicId: string): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error, result) => {
				if (error) return reject(error)
				resolve(result)
			})
		})
	}

	getFile(publicId: string): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			cloudinary.api.resource(publicId, (error, result) => {
				if (error) return reject(error)
				resolve(result)
			})
		})
	}
}
