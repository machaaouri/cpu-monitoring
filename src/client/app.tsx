import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { CPU } from '../contract/types';
import { Linechart, margin } from './tiles/linechart';
import { useAlert } from './hooks/useAlert';
import { Thresholds } from './common/types';
import { Alerts } from './components/alerts';
import { Top } from './components/top';

const url = "http://localhost:3000/cpu"
const TEN_MINUTES = 600000; /* ms */


export const App = () => {
	// CPU info
	// I'm using a Ref instead of useState because this variable will be updated directly from setInterval(),
	// you can't set a state directly from setInterval() as it will always returns the same thing (snapshot of state the moment setInterval was triggered)
	const cpu = useRef<CPU[]>([])
	// Polling interval, default value 10 seconds
	const [pollingInterval, setPollingInterval] = useState(10)
	// chart area's dimension
	const [chartDim, setChartDim] = useState<{width: number, height: number}>({width:0, height:0})
	// Thresholds for high load and recovery
	const [thresholds, setThresholds] = useState<Thresholds>({load:1, time: 60})
	// Chart area ref
	const chartRef = useRef<HTMLDivElement>()
	// Only used to force a render with a simulated state change
	const [render, setRender] = useState<{}>({})

	// Fetch CPU information as soon as the component is mounted
	// ...this is called only one time
	// Get the chart area width & height
	useEffect(() => {
		getCpuInfo()
		dims()
		const interval = setInterval(cleanData, TEN_MINUTES)
		return () => {clearInterval(interval)}
	},[])

	// Fetch CPU information every `pollingInterval` seconds
	// clear `interval` everytime the user changes the pollingInterval
	useEffect(() => {
		const interval = setInterval(() => {
			getCpuInfo()
		}, pollingInterval * 1000);
		return () => clearInterval(interval);
	}, [pollingInterval]);

	// Get cpu alerts
	const alerts = useAlert({cpu: cpu.current[cpu.current.length - 1],t: thresholds})

	// Request CPU info and update state
	function getCpuInfo() {
		fetch(url)
			.then(response => response.json())
			.then(data => {
				cpu.current.push(data)
				setRender({})
			});
	}

	// Maintain a 10 minute window of historical CPU load information
	// ... delete daata older than 10 minutes
	const cleanData = () => {
		const tenMinutesAgo = Date.now() - TEN_MINUTES;
		const data = cpu.current.filter(c => c.date > tenMinutesAgo)
		cpu.current = data
	}

	// Compute linechart's width & height
	const dims = () => {
		if(chartRef.current) {
			const {width, height} = chartRef.current.getBoundingClientRect()
			setChartDim({width, height: height - margin.bottom})
		}
	}

	const cpuInfo = cpu.current ? cpu.current : []

	return (
		<div className="cpu-container">
			<div className="cpu-side">
				<Alerts alerts={alerts} />
			</div>
			<div className="cpu-monitoring">
				<Top
					polling={pollingInterval}
					setPolling={(polling) => setPollingInterval(polling)}
					thresholds={thresholds}
					setTime={(time) => setThresholds({...thresholds, time})}
					setLoad={(load) => setThresholds({...thresholds, load})}
				/>
				<div className="cpu-chart" ref={chartRef}>
					{cpuInfo.length ? <Linechart 
						width={chartDim.width}
						height={chartDim.height}
						xAxisLength={600}
						y={cpuInfo[cpuInfo.length-1].usage}/> : null}
				</div>
			</div>
		</div>
	)
}