import { CPU } from "../../contract/types";
import { useState, useRef, useEffect } from "react";
import { Thresholds, Alert } from "../common/types";

/*
    this hook answers the following questins :

    Has my computer been under heavy CPU load ?
    When? 
    How many times?
    Has my computer recovered from heavy CPU load?
    When? 
    How many times?

*/

export type AlertHook = {
    flagged: boolean
} & CPU

export const useAlert = (props:{cpu: CPU, t: Thresholds}) => {

    const [alerts, setAlerts] = useState<Alert[]>([])
    // Remember the last heavy load
    const heavy = useRef<AlertHook>(undefined)
    /// Remember the last recovery
    const recovery = useRef<AlertHook>(undefined)


    useEffect(() => {
        if(props.cpu) {
            const a = isThereNewAlert(heavy.current, recovery.current, props.cpu, props.t)
            heavy.current = a.heavy 
            recovery.current = a.recovery
            if(a.alert)
                setAlerts([...alerts, a.alert])
        }
    }, [props])

    return alerts
}


// Extart the logic to detect if there is an alert so we can test it later
export const isThereNewAlert = (
    heavy: AlertHook,
    recovery: AlertHook,
    newCpuInfo: CPU, 
    t: Thresholds) : {
        heavy: AlertHook | undefined,
        recovery: AlertHook | undefined
        alert: Alert | undefined
    } => {

    const time = t.time * 1000

    // First call
    if(heavy == undefined && recovery == undefined) {
        return {
            heavy :  newCpuInfo.usage >= t.load ? {...newCpuInfo,flagged: true} : undefined,
            recovery: newCpuInfo.usage < t.load ? {...newCpuInfo,flagged: true} : undefined,
            alert: undefined
        }
    }
    
    if(newCpuInfo.usage >= t.load) {
        // Check if the CPU has been on under heavy load for more than `props.time`
        if(heavy != undefined) {
            if((newCpuInfo.date - heavy.date) > time && !heavy.flagged) {
                return {
                    heavy :{...heavy, flagged: true},
                    recovery: undefined,
                    alert: {type: "Heavy load", date: new Date(heavy.date)}
                }
            }
        }
        else {
            return {
                heavy : {...newCpuInfo, flagged: false},
                recovery: {...recovery, flagged: true},
                alert: undefined
            }
        }
    }


    if(newCpuInfo.usage < t.load) {
        // Check if the CPU has recovered from heavy load
        if(recovery != undefined) {
            if((newCpuInfo.date - recovery.date) > time && !recovery.flagged) {
                return {
                    heavy: undefined,
                    recovery: {...recovery, flagged: true},
                    alert: {type: "Recovery", date: new Date(recovery.date)}
                }
            }
        }
        else {
            return {
                heavy: {...heavy, flagged: true},
                recovery: {...newCpuInfo, flagged: false},
                alert: undefined
            }
        }
    }

    return {
        heavy,
        recovery,
        alert: undefined
    }
}