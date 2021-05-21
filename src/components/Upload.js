import React, {Component} from 'react'
import CSVReader from "react-csv-reader"

const frontEndParser = () => {
	const papaparseOpts = {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
		transformHeader: header => header.toLowerCase().replace(/\W/g, "_") // will need to match headers against config in db config
	}

	return <CSVReader
		cssClass="react-csv-input"
		onFileLoaded={this.props.handleFileSelect}
		parserOptions={papaparseOpts}
	/>

}

class FileUpload extends Component {
	// On file select (from the pop up)
	state = {
		// Initially, no file is selected
		selectedFile: this.props.currentFile,
		fileSelected: false
	}

	onFileChange = event => {
		// Update the state
		this.setState({selectedFile: event.target.files[0]})
		if (this.state.selectedFile) {
			this.props.handleFileChange(this.state.selectedFile)
		}
	}

	fileSelected(e) {
		this.setState({fileSelected: true})
		this.handleFileSelected(e.target.files[0])
		return undefined;
	}

	handleFileSelected(file) {
		console.log(`handling file select: `, file)
		this.props.handleFileChosen(file)
	}

	doUpload() {
		setTimeout(() => {
			this.setState({fileSelected: null})
		}, 300)
		this.props.onFileUpload()
	}

	render() {
		return (
			<div className={'ui middle aligned center aligned grid'}>
				<div className="column">
					<h1>Select a File to upload</h1>
					<label className="ui secondary button">
						<input type="file"
						       id='file'
						       style={{'display': 'none'}}
						       accept='.csv'
						       onChange={e => this.fileSelected(e)}
						/>
						Select File
					</label>
					{ this.state.fileSelected &&
					<button onClick={() => this.doUpload()}
					        className='ui secondary button'
					>
						Upload Now
					</button>
					}
				</div>
			</div>
		)
	}

}

export default FileUpload

