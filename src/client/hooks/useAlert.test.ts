import { CPU } from "../../contract/types";
import { Thresholds } from "../common/types";
import { isThereNewAlert, AlertHook } from "./useAlert";

// Simulate heavy load for more than 1 minute
describe('Alert when CPU has been under heavy load for more than one minute', () => {
    it('It shoud return a heavy load alert', () => {

        const date = Date.now()
        const heavy: AlertHook = {usage:1, date:  date - 65000, flagged: false}
         // Update, new info from server 
        const cpu_2: CPU = {usage:1, date: date}
        const threshold: Thresholds = {load:1, time: 60}
        expect(isThereNewAlert(heavy, undefined, cpu_2, threshold))
        .toEqual({
            alert: {type:"Heavy load", date: new Date(date - 65000)},
            heavy: {...heavy, flagged: true},
            recovery: undefined

        })
    })
})


// Simulate recovery
describe('Alert when CPU has recovered', () => {
    it('It shoud return a recovery alert', () => {

        const date = Date.now()
        const recovery: AlertHook = {usage:0.1, date:  date - 65000, flagged: false}
         // Update, new info from server 
        const cpu_2: CPU = {usage:0.1, date: date}
        const threshold: Thresholds = {load:1, time: 60}
        expect(isThereNewAlert(undefined, recovery, cpu_2, threshold))
        .toEqual({
            alert: {type:"Recovery", date: new Date(date - 65000)},
            heavy: undefined,
            recovery: {...recovery, flagged: true}

        })
    })
})