import React from 'react';
import './Order.css';

class Order extends React.Component {
    timeToDate(seconds) {
        let date = new Date(1970, 0, 1);
        date.setSeconds(seconds);
        return date;
    }

    render() {
        return (
            <div className="Order">
                <h4 className="order-name">
                    {this.props.order.name}
                </h4>
                <p className="description">
                    {this.props.order.description}
                </p>
                <div className="imageContainer">
                        <img className="image" src={this.props.worker.image} alt="worker" />
                    </div>
                <div className="information-container">
                    <ul className="information info-list">
                        <li className="worker-name">
                            {this.props.worker.name}
                        </li>
                        <li className="company-name info">
                            {this.props.worker.companyName}
                        </li>
                        <li className="email info">
                            {this.props.worker.email}
                        </li>
                    </ul>
                </div>
                <div className="deadline-container">
                    <p className="deadline">
                        {this.timeToDate(this.props.order.deadline).toLocaleString()}
                    </p>
                </div>
            </div>
        )
    }

}

export default Order;