import React from 'react';
import './FileListItem.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

const FileListItem = ({item, onCancel}) => {
    const {fileName, fileSize, id} = item;
    return (
        <Row>
            <Col xs={6}>{fileName}</Col>
            <Col xs={4}>{fileSize}</Col>
            <Col xs={2}>
                <Badge pill variant="danger"
                       onClick={() => {onCancel(id)}}
                       className="status-flag"
                >
                    x
                </Badge>
            </Col>
        </Row>
    );
};

export default FileListItem;
