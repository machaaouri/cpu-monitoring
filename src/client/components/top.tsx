import {Dropdown} from "react-bootstrap"
import * as React from 'react';
import { Thresholds } from "../common/types"


export type TopProps = {
    polling: number
    thresholds: Thresholds, 
}

export type TopActions = {
    setPolling: (polling: number) => void
    setTime:(time: number) => void
    setLoad:(load: number) => void
}

const load = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]

export const Top = (props: TopProps & TopActions) => {

    return (
        <div className="cpu-top">
            <span>CPU monitoring web application</span>

            <div className="drop-down">
                {/* Polling interval */}
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {`CPU load information every ${props.polling} s`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => props.setPolling(1)}>1 second</Dropdown.Item>
                        <Dropdown.Item onClick={() => props.setPolling(5)}>5 seconds</Dropdown.Item>
                        <Dropdown.Item onClick={() => props.setPolling(10)}>10 seconds</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                
                {/* Time */}
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {`Time threshold ${props.thresholds.time} s`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => props.setTime(1)}>1 second</Dropdown.Item>
                        <Dropdown.Item onClick={() => props.setTime(2)}>2 seconds</Dropdown.Item>
                        <Dropdown.Item onClick={() => props.setTime(60)}>1 minute</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Load */}
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {`Load threshold ${props.thresholds.load}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {load.map((l) => <Dropdown.Item onClick={() => props.setLoad(l)}>{l}</Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}