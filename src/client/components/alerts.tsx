import * as React from 'react';
import { Alert } from '../common/types';

export const Alerts = (p:{alerts: Alert[]}) => {

    const eventRenderer = (e: Alert, key: number) => {
        const cls = e.type == "Heavy load" ? "red" : ""
        return (
            <li className={cls} key={key}>{e.type} {e.date.toLocaleString()}</li>
        )
    } 

    return (
        <div className="alerts">
            <span>CPU alert logging (Heavy load and recovery)</span>
            <div className="alerts-list">
                <ul>{p.alerts.map(eventRenderer)}</ul>
            </div>
            <div className="stats">
                <span>Heavy load: {p.alerts.filter(a => a.type == "Heavy load").length}</span>
                <span>Recovery: {p.alerts.filter(a => a.type == "Recovery").length}</span>
            </div>
        </div>

    )
}