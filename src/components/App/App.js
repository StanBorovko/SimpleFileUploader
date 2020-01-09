import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FileList from "../FileList/FileList";
import {formatSize} from '../../utils/utils';

const defaultState = {
    files: null,
    filesInfo: []
};

export default class App extends Component {
    state = defaultState;
    selectedFiles = new React.createRef();

    onFormSubmit = (event) => {
        event.preventDefault();

        this.state.filesInfo.forEach((fileInfo) => {
            const file = this.state.files.item(fileInfo.id);
            axios.post('/public/upload', file)
                .then(function (response) {
                console.log(response);
            })
                .catch(function (error) {
                    console.log(error);
                });
        })
    };

    onUploadClicked = () => {
        this.updateFileInfo();
    };

    onCancelClick = (id) => {
        const filesInfo = [...this.state.filesInfo];
        const newFilesInfo = filesInfo.filter((item) => {
            return item.id !== id
        });
        this.setState({
            filesInfo: newFilesInfo
        })
    };

    updateFileInfo = () => {
        const newFiles = this.selectedFiles.current.files;
        const newFilesInfo = this.formatFiles(newFiles);
        this.setState({
            filesInfo: newFilesInfo,
            files: newFiles
        });
    };

    formatFiles = (files) => {
        /* files are converted to Array, because files (taken from this.filesUpload.current.files)
         is an instance of FileList, but have key "length" and numbered keys */
        // eslint-disable-next-line
        return Array.from(files).reduce((filesInfo, file, index) => {
            return [
                ...filesInfo,
                {
                    id: index,
                    fileName: file.name,
                    fileSize: formatSize(file.size)
                }
            ];
        }, []);
    };

    render() {
        console.log(this.state.files, this.state.filesInfo);
        return (
            <Form className="d-flex flex-column align-items-center m-2 p-2 border border-primary rounded"
                  onSubmit={this.onFormSubmit}
            >
                <Form.Group controlId="formFileUpload">
                    <Form.Control variant="primary"
                                  type="file" multiple
                                  ref={this.selectedFiles}
                                  onChange={this.onUploadClicked}
                                  className="d-none"/>
                    <Form.Label className="btn btn-primary">
                        Upload
                    </Form.Label>
                </Form.Group>
                <Form.Group controlId="formFileList" className="w-75">
                    <FileList files={this.state.filesInfo}
                              onCancel={this.onCancelClick}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        )
    }
}
