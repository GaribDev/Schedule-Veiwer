import React from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';
import moment from 'moment'

export default class Bonus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: [],
            totalOccurences: 0,
            frequency: null,
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }
    componentDidMount() {

    }

    async handleFormSubmit(event) {
        event.preventDefault();
        var startDate = event.target[0].value
        var endDate = event.target[1].value
        var arr = new Array()
        if (moment(startDate).isBefore(endDate) && moment(startDate).isValid() && moment(endDate).isValid()) {
            for (var i = 0; i < Object.keys(this.props.data).length; i++) {
                var currDate = this.props.data[i].item_date
                var currDateScheduleTime = this.props.data[i].schedule_time
                if (moment(currDate).isBetween(startDate, endDate, undefined, '[]')) {
                    var result = moment(currDate, 'YYYY-MM-DD').diff(moment(currDateScheduleTime, 'YYYY-MM-DD'), 'days')
                    if (result >= 0) {
                        arr.push(result)
                    }
                }
            }
            var frequency = arr.reduce(function (acc, curr) {
                return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
            }, {});
            await this.setState({ frequency: frequency })

            var keysArr = Object.keys(frequency)
            var valsArr = Object.values(frequency)
            var valsArrSum = 0
            var chartData = new Array()
            for (var i = 0; i < keysArr.length; i++) {
                chartData.push({
                    name: keysArr[i] + " Day(s) prior", value: valsArr[i]
                })
                valsArrSum += valsArr[i]
            }
            await this.setState({
                chartData: chartData,
                totalOccurences: valsArrSum
            })
        }
        else {
            alert("Please select valid dates")
        }
    }

    render() {
        return (
            <div className='mt-3'>
                <h1> Bonus Task </h1>
                <p>Veiw the percentage of bookings made on the same day, 1 day prior, 2 days prior and so on, between 2 dates.<br />
                    Select a start date and end date. A table and pie chart is drawn showing the information about Booking Dates</p>
                <div className="card">
                    <form className='p-2' onSubmit={this.handleFormSubmit}>
                        <div className='row w-75 mx-auto' >
                            <div className='col' >
                                <label>
                                    Start Date:<br />
                                    <input type="date" />
                                </label><br />
                            </div>
                            <div className='col' >
                                <label>
                                    End Date:<br />
                                    <input type="date" />
                                </label><br />
                            </div>
                        </div>
                        <input className='btn btn-primary mt-1' type="submit" value="Submit" />
                    </form>
                </div>
                <div className="card my-3">
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Boooking made</th>
                                    <th scope="col">Count</th>
                                    {/* <th scope="col">Percentage(%)</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.chartData.map(({ name, value }) => (
                                    <tr key={name}>
                                        <th>{name}</th>
                                        <th>{value}</th>
                                        {/* <th>{parseInt(value / this.state.totalOccurences * 100)}</th> */}
                                    </tr>
                                ))}
                                <tr >
                                    <th>Total:</th>
                                    <th>{this.state.totalOccurences}</th>
                                    {/* <th></th> */}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.state.totalOccurences != 0 && (
                    <div className="card my-3">
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Legend layout="horizontal" verticalAlign="top" align="center" />
                                    <Pie
                                        data={this.state.chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                            const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="white"
                                                    textAnchor={x > cx ? "start" : "end"}
                                                    dominantBaseline="central"
                                                >
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value">
                                        {this.state.chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    ["#0088FE", "#00C49F", "#FFBB28", "#FF8042",
                                                        "#cd5621", "#fa566c", "#c0203c", "	#6cb4ac",
                                                        "#cacea0", "#292549", "#ebc83d", "#badf55",
                                                        "#35b1c9", "#b06dad", "#e96060", "#d0427f",
                                                        "#f8a01f", "#528272", "#0275d8", "#5bc0de"][
                                                    index % ["#0088FE", "#00C49F", "#FFBB28", "#FF8042",
                                                        "#cd5621", "#fa566c", "#c0203c", "	#6cb4ac",
                                                        "#cacea0", "#292549", "#ebc83d", "#badf55",
                                                        "#35b1c9", "#b06dad", "#e96060", "#d0427f",
                                                        "#f8a01f", "#528272", "#0275d8", "#5bc0de"].length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div >
        )
    }
}