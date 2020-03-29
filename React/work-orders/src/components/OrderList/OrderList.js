import React from 'react';
import './OrderList.css';
import Order from '../Order/Order';

class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
        this.setChecked = this.setChecked.bind(this);
    }

    search() {
        let nameFilter = document.getElementById('name-input').value.toUpperCase();
        let workOrders = document.getElementsByClassName('Order');
        for (let i = 0; i < workOrders.length; i++) {
            let name = workOrders[i].getElementsByClassName('worker-name')[0].innerHTML.toUpperCase();
            if (name.indexOf(nameFilter) > -1) {
                workOrders[i].style.display = "";
            } else {
                workOrders[i].style.display = "none";
            }
        }
    }

    setChecked() {
        let toggleSwitch = document.getElementById('deadline-input');
        if (toggleSwitch.checked) {
            this.setState({
                checked: true
            });
        } else {
            this.setState({
                checked: false
            })
        }
    }

    sortOrders(orders, checked) {
        if (!checked) {
            orders.sort(function(a, b) {
                return a.deadline - b.deadline;
            });
        } else {
            orders.sort(function(a, b) {
                return b.deadline - a.deadline;
            });
        }
    }

    render() {
        let sorted = false;
        if (!sorted) {
            this.sortOrders(this.props.orders, this.state.checked);
            sorted = true;
        }
        
        return (
            <div className="OrderList">
                <input id="name-input" className="search" type="text" onKeyUp={this.search} placeholder="Filter by worker name..."></input>
                <div>
                    Earliest first
                    <label className="switch">
                        <input id="deadline-input" type="checkbox" onChange={this.setChecked}></input>
                        <span className="slider round"></span>
                        <span className="switch-label"></span>
                    </label>
                    Latest first
                </div>
                {
                    this.props.orders.map(order => {
                        var orderProp;
                        var workerProp;
                        this.props.workers.map(worker => {
                            if (order.workerId === worker.id) {
                                orderProp = order;
                                workerProp = worker;
                            }
                        });
                        if (orderProp && workerProp) {
                            return <Order order={orderProp} worker={workerProp} key={orderProp.id} />
                        }
                    })
                }
            </div>
        );
    }
}

export default OrderList;