import React, {Component, useEffect, useState} from 'react'
import Layout from "../../components/Layout"
import FileUpload from "../../components/Upload"
import Dropdown from "../../components/Dropdown";
import axios, {post} from "axios";
import {readString} from 'react-papaparse'

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
	const [rawFile, setRawFile] = useState(undefined);
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
	}

	const onFileUpload = () => {
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
		console.log(`handling file chosen: `, file)
		setRawFile(file)
		const {name, lastModified, lastModifiedDate, type} = file
		let newFileInfo = {name, lastModified, lastModifiedDate, type}
		console.log(`new file info: `, newFileInfo)
		// setFileInfo(newFileInfo)
		fileReader = new FileReader()
		fileReader.onloadend = () => handleFileRead(newFileInfo)
		fileReader.readAsText(file)
	}

	const updateFileSelect = (data, errors, meta, fileProps) => {
		console.log(`selected CSV!: `,)
		console.log(`meta:`, meta)
		console.log(`fileProps:`, fileProps)
		// console.log(data, fileProps)
		let newProps = {n_records: data.length, ...fileProps}
		setCurrentFile(fileProps)
		setFileInfo(newProps)
		console.log(`current file: `, newProps)
		// axios send to the endpoint
		// check the file --
	}
	const handleFileSelect = (data, fileProps) => {
		console.log(`selected CSV!: `,)
		console.log(data, fileProps)
		let newProps = {n_records: data.length, ...fileProps}
		setCurrentFile(fileProps)
		setFileInfo(newProps)
		console.log(`current file: `, newProps)
		// axios send to the endpoint
		// check the file --
	}

	return (
		<Layout>
			<Dropdown options={dealers} selected={dealer} label={'Dealer'} onSelectedChange={changeDealer}/>
			<FileUpload handleFileSelect={handleFileSelect}
			            currentFile={currentFile}
			            uploadFile={fileUpload}
			            handleFileChosen={handleFileChosen}
			            onFileUpload={onFileUpload}
			/>
			<div>
				{fileInfo &&
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
			</div>
		</Layout>
	)
}


export default UploadPage
