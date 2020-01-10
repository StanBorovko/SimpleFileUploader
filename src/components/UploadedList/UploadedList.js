import React from "react";
import './UploadedList.css';
import ListGroup from "react-bootstrap/ListGroup";

const UploadedList = ({uploaded}) => {
    let ind = 0;
    return (
        <div className="mt-2">
            <h2 className="text-center">Files on server:</h2>
            <ListGroup>
                {
                    uploaded.map((item) => {
                    return <ListGroup.Item key={ind++}>{item}</ListGroup.Item>
                })}
            </ListGroup>
        </div>
    )
};

export default UploadedList;
