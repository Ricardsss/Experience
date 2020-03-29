import React from 'react';
import './App.css';
import Hatchways from '../../util/Hatchways';
import OrderList from '../OrderList/OrderList';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			workers: []
		};
		this.hatchwaysOrders = this.hatchwaysOrders.bind(this);
		this.hatchwaysWorkers = this.hatchwaysWorkers.bind(this);
	}
	
	hatchwaysOrders() {
		Hatchways.workOrders().then(orders => {
			this.setState({
				orders: orders
			});
		});
	}

	hatchwaysWorkers() {
		Hatchways.workers().then(workers => {
			this.setState({
				workers: workers
			});
		});
	}
  
	render() {
		if (this.state.orders.length === 0) {
			this.hatchwaysOrders();
		}
		if (this.state.workers.length === 0) {
			this.hatchwaysWorkers();
		}
		return (
			<div className="App">
				<OrderList orders={this.state.orders} workers={this.state.workers} />
			</div>
		);
	}
}

export default App;