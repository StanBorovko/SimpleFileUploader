import React from 'react';
import './FileList.css';

import FileListItem from "../FileListItem/FileListItem";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


const FileList = ({files, ...rest}) => {
    if (files.length > 0) {
        return (
            <div>
                <h2 className="text-center">Files in upload queue:</h2>
                <Container>
                    <Row>
                        <Col xs={6}>Name</Col>
                        <Col xs={4}>Size</Col>
                        <Col xs={2}> </Col>
                    </Row>
                    {files.map(item => {
                        return <FileListItem item={item}
                                             key={item.id}
                                             {...rest}
                        />
                    })}
                </Container>
            </div>
        );
    } else {
        return null;
    }

};

export default FileList;
