export type Thresholds = {
    // Thresholds for high load [0, 1]
    load: number
    // Thresholds for high load time (in seconds)
    time: number
}

export type AlertType = "Heavy load" | "Recovery"

export type Alert = {
	type: AlertType
    date: Date
}
