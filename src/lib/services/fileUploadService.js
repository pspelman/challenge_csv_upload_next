import http from "../apis/http-common"
const FormData = require('form-data');

const upload = (file, onUploadProgress) => {
	let formData = new FormData()
	formData.append("file", file)

	return http.post("/cars/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress,
	})
}

const getFiles = () => {
	return http.get("/cars")
}

export default {
	upload,
	getFiles,
}
