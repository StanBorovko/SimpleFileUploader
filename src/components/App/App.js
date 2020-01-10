import React, {Component} from 'react';
import './App.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FileList from "../FileList/FileList";
import {formatSize} from '../../utils/utils';
import UploadedList from "../UploadedList/UploadedList";

const defaultState = {
    files: null,
    filesInfo: [],
    uploaded: null
};

export default class App extends Component {
    state = defaultState;
    selectedFiles = new React.createRef();

    componentDidMount() {
        this.updateUploaded();
    }

    onFormSubmit = (event) => {
        event.preventDefault();

        if (this.state.filesInfo.length === 0) {
            return;
        }
        this.postFiles();
    };

    onUploadClicked = () => {
        this.updateFileInfo();
    };

    onCancelClick = (id) => {
        const filesInfo = [...this.state.filesInfo];
        const newFilesInfo = filesInfo.filter((item) => {
            return item.id !== id
        });
        if (newFilesInfo.length === 0) {
            this.setState({...defaultState});
        } else {
            this.setState({
                filesInfo: newFilesInfo
            })
        }
    };

    postFiles = () => {
        this.state.filesInfo.forEach((fileInfo) => {
            const file = this.state.files.item(fileInfo.id);
            // const fd = new FormData();
            // fd.append('data', file);
            fetch(`http://localhost:3333/upload?name=${fileInfo.fileName}`, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'no-cors', // no-cors, cors, *same-origin
                // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': file.type,
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                // redirect: 'follow', // manual, *follow, error
                // referrer: 'no-referrer', // no-referrer, *client
                body: file, // тип данных в body должен соответвовать значению заголовка "Content-Type"
            })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    this.setState({...defaultState});
                    this.updateUploaded();
                });
        })
    };

    updateUploaded = () => {
        this.getUploaded().then(newUploaded => {
            if (newUploaded.files.length > 0) {this.setState({uploaded: newUploaded.files});}
            else {this.setState({uploaded: null});}
        })
            .catch(err => {console.error(err)});
    };

    getUploaded = async () => {
        //FIXME: clean up this func
        const response = await fetch('http://localhost:3333/getUploaded', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, cors, *same-origin
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const newUploaded = await response.json();
        return newUploaded;

        /*fetch(`http://localhost:3333/getUploaded`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrer: 'no-referrer', // no-referrer, *client
            // body: file, // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(newUploaded => {
                this.setState({uploaded: newUploaded.files});
            })
            .catch(err => {
                console.error(err);
            });*/

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
        // console.log(this.state.files, this.state.filesInfo);
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
                {(this.state.uploaded)? <UploadedList uploaded={this.state.uploaded} /> : <p className="text-center">Loading...</p>}
            </Form>
        )
    }
}
