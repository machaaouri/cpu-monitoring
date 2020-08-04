# cpu-monitoring
Load Monitoring Web Application

<img src="https://user-images.githubusercontent.com/24994800/89355908-d1c89280-d6bc-11ea-847a-b510e628cbf0.PNG" width="90%"></img> <img src="https://user-images.githubusercontent.com/24994800/89355911-d2612900-d6bc-11ea-9875-0c133d106641.PNG" width="90%"></img> <img src="https://user-images.githubusercontent.com/24994800/89355912-d2612900-d6bc-11ea-98d3-e2639567a964.PNG" width="90%"></img> 

## Running the project
1) clone repo
2) npm install
3) `npm run dev`, and the server will start on port 3000 (http://localhost:3000).

4) `npm test` to run tests

## Further improvements
### Easy (UI)
1. Allow users to change thresholds ( Done )
2. Allow users to change polling interval (Done)
3. Add a webhook to send alert notification (email)
4. Allow users to change background template (dark, light…)
5. Include more details about the CPU (how many cores, type , speed, frequency…)
6. Add the duration of each alert (heavy load, recovery ) in the logging aera
### Easy (Logic )
1. Improve the function that detects alerts (heavy load, recovery ) in fact, the code could shorten, more readable and self explanatory
2. More tests
### Medium (UI)
1. Enhance the linechart with more info about each point (value and the corresponding date)
2. Handle mouseover event on the line chart
3. Allow user to visualize data on different charts (linechart, historgam, table …)
### Medium ( Logic)
1. Separate the State, the Actions and the Entity that handles communication with the backend

And use redux to connect them.
```javascript
// state.ts
export type State = { … }
export function apply<TS extends State>(s: TS, a: Redux.Action): TS {
export const reducer = (state: State = initial, action: Redux.Action) => apply(state, action); 
```
```javascript
// actions.ts
// Define all the actions
export const setCpuInfo = factory<{ cpu: CPU }>("CPU_INFO");
```
```javascript
// Handle communication with the backend
// This class uses 
Const Remote = () : Action[] | Action => {….}
```
```javascript
// index.ts
const store = createStore(reducer, remote);
render(cpu(store), where);
```
### Little bit hard (UI)
1. Allo users to customize the dashboad (change colors, align text…) directly on the browser via and editor
Little bit hard (logic)
2. Code charts from scratch without using a third library like d3.js


