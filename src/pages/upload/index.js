import React, {Component, useEffect, useState} from 'react'
import Layout from "../../components/Layout"
import FileUpload from "../../components/Upload"
import Dropdown from "../../components/Dropdown";
import axios, {post} from "axios";
import {readString} from 'react-papaparse'
import Spinner from "../../components/Spinner";

const dealers = [
	{
		label: 'South Hills Subaru',
		value: 1
	},
	{
		label: 'East Side Toyota',
		value: 2
	},
	{
		label: 'BMW of Seattle',
		value: 3
	},
	{
		label: 'Frank\'s AutoFi-nally',
		value: 4
	},
]
const papaConfig = {
	delimiter: "",  // auto-detect
	newline: "",  // auto-detect
	quoteChar: '"',
	escapeChar: '"',
	header: false,
	transformHeader: undefined,
	dynamicTyping: false,
	preview: 0,
	encoding: "",
	worker: false,
	comments: false,
	step: undefined,
	complete: undefined,
	error: undefined,
	download: false,
	downloadRequestHeaders: undefined,
	skipEmptyLines: false,
	chunk: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined,
	transform: undefined,
}

const UploadPage = props => {
	const [currentFile, setCurrentFile] = useState(undefined)
	const [fileInfo, setFileInfo] = useState(undefined)
	const [dealer, setDealer] = useState(dealers[0])
	const [rawFile, setRawFile] = useState(undefined)
	const [loading, setLoading] = useState(false)
	const [lastFileUpload, setLastFileUpload] = useState(null)
	const [message, setMessage] = useState(undefined);

	let fileReader

	const changeDealer = (selection) => {
		console.log(`updating selected dealer: `, selection)
		setDealer(selection)
	}

	const fileUpload = (data) => {
		console.log(`will try to upload file: `, data)
		const url = 'http://localhost:3000/api/cars';
		const formData = new FormData();
		formData.append('data', data)
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		console.log(`going to post to ${url}`,)
		return post(url, formData, config)
			.then((res, err) => {
				console.log(`res: `, res)

			})
			.catch(err => {
				console.log(`error: `, err)

			})
	}

	function fileUploadReset() {
		setLoading(false)
		setLastFileUpload(fileInfo)
		setFileInfo(undefined)
	}

	const onFileUpload = () => {
		setLoading(true)
		let cancelReset = setTimeout(() => {
			fileUploadReset();
		}, 10000)  // if it doesn't finish in 10 seconds, reset
		const formData = new FormData()
		// Update the formData object
		formData.append(
			"myFile",
			rawFile,
			fileInfo?.name
		)
		// Send formData object
		axios.post("api/cars", formData, {
			headers: {'dealer-id': dealer.value}
		}).then((res, err) => {
			console.log(`response: `, res)
			if (res.status != 200) alert(`the last request had a problem: ${res}`);
			else {
				clearTimeout(cancelReset)
				setMessage(`Successfully uploaded ${lastFileUpload}`)
				setTimeout(()=> {  // make the message disappear after a few seconds
					setMessage(undefined)
				}, 4000)
			}
		}).catch(err => {
			console.log(`error: `, err)
			if (res.status !== 200) alert(`the last request had a problem: ${err}`)
		})
			.finally(() => {
				setLoading(false)
				setFileInfo(undefined)
			})
	}


	const handleFileRead = (fileInfo) => {
		const content = fileReader.result
		console.log(`file read: `, content)
		const results = readString(content, papaConfig)
		console.log(`Best guess results: `, results)
		let {data, errors, meta} = results
		updateFileSelect(data, errors, meta, fileInfo)
	}

	const handleFileChosen = (file) => {
		setRawFile(file)
		const {name, lastModified, lastModifiedDate, type} = file
		let newFileInfo = {name, lastModified, lastModifiedDate, type}
		// setFileInfo(newFileInfo)
		fileReader = new FileReader()
		fileReader.onloadend = () => handleFileRead(newFileInfo)
		fileReader.readAsText(file)
	}

	const updateFileSelect = (data, errors, meta, fileProps) => {
		// console.log(data, fileProps)
		let newProps = {n_records: data.length, ...fileProps}
		setCurrentFile(fileProps)
		setFileInfo(newProps)
		// console.log(`current file: `, newProps)
	}
	const handleFileSelect = (data, fileProps) => {
		console.log(`selected CSV!: `,)
		// console.log(data, fileProps)
		let newProps = {n_records: data.length, ...fileProps}
		setCurrentFile(fileProps)
		setFileInfo(newProps)
	}

	const uploadResultMsg = () => {
		return (
			<div className="ui small message green" style={{'marginTop': '1rem'}}>
				Successfully uploaded your file
			</div>
		)
	}

	return (
		<Layout>
			{loading &&
			<Spinner/>
			}
			<Dropdown options={dealers} selected={dealer} label={'Dealer'} onSelectedChange={changeDealer}/>
			<FileUpload handleFileSelect={handleFileSelect}
			            currentFile={currentFile}
			            uploadFile={fileUpload}
			            handleFileChosen={handleFileChosen}
			            onFileUpload={onFileUpload}
			/>
			<div>
				{fileInfo && !loading &&
				<table className="ui celled table">
					<thead>
					<tr>
						<th>Filename</th>
						<th>Entries</th>
						<th>Type</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td data-label="Name">{fileInfo?.name}</td>
						<td data-label="Entries">{fileInfo?.n_records}</td>
						<td data-label="Modified">{fileInfo?.lastModifiedDate.toDateString()}</td>
					</tr>
					</tbody>
				</table>
				}
				{message && uploadResultMsg()}
			</div>
		</Layout>
	)
}


export default UploadPage
