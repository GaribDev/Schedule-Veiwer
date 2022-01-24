import React from 'react'
import Calendar from 'react-calendar'
import { Accordion } from "react-bootstrap";
import moment from 'moment'
import Bonus from '../components/js/bonus'

import 'react-calendar/dist/Calendar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
class Page extends React.Component {
    static async getInitialProps(ctx) {
        const res = await fetch('https://jsonkeeper.com/b/HU8U')
        const json = await res.json()
        return { api_data: json }
    }
    constructor(props) {
        super(props);
        this.state = {
            dateState: new Date(),
            dataFetched: false,
            api_data: null,
            bookingsDistribution: new Array(),
            prevDate2: {
                date: null,
                count: 0
            },
            prevDate1: {
                date: null,
                count: 0
            },
            selectedDate: {
                date: null,
                count: 0,
                bookings: new Array()
            },
            nextDate1: {
                date: null,
                count: 0
            },
            nextDate2: {
                date: null,
                count: 0
            },
        };
        this.changeDate = this.changeDate.bind(this);
        this.changeDateFromButton = this.changeDateFromButton.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.api_data) {
            this.setState({ dataFetched: true })
            this.setState({ api_data: this.props.api_data })
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        var fullDate = new Date()
        if (moment(event.target[0].value).isValid()) {
            fullDate = moment(moment(event.target[0].value)).toDate();
            this.changeDate(fullDate)
            console.log(fullDate);
        }
        else {
            alert("Please enter the date in valid format")
        }
    }

    changeDateFromButton(date) {
        var fullDate = new Date()
        fullDate = moment(date).toDate();
        this.changeDate(fullDate)
    }

    async changeDate(date) {
        var prevDate2 = new Date()
        prevDate2.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() - 2)
        prevDate2 = moment(prevDate2).format('YYYY-MM-DD')
        var prevDate1 = new Date()
        prevDate1.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() - 1)
        prevDate1 = moment(prevDate1).format('YYYY-MM-DD')
        var selectedDate = moment(date).format('YYYY-MM-DD')
        var nextDate1 = new Date()
        nextDate1.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        nextDate1 = moment(nextDate1).format('YYYY-MM-DD')
        var nextDate2 = new Date()
        nextDate2.setFullYear(date.getFullYear(), date.getMonth(), date.getDate() + 2)
        nextDate2 = moment(nextDate2).format('YYYY-MM-DD')

        var cntOfPrevDate2, cntOfPrevDate1, cntOfSelectedDate, cntOfNextDate1, cntOfNextDate2
        cntOfPrevDate2 = cntOfPrevDate1 = cntOfSelectedDate = cntOfNextDate1 = cntOfNextDate2 = 0

        if (this.state.api_data) {
            var bookings = new Array()
            var uniqueBookings = new Set()
            var bookingsDistribution = new Array()
            for (var i = 0; i < Object.keys(this.state.api_data).length; i++) {
                switch (this.state.api_data[i].item_date) {
                    case selectedDate:
                        this.state.api_data[i].id = cntOfSelectedDate
                        bookings.push(this.state.api_data[i])
                        uniqueBookings.add(moment(this.state.api_data[i].schedule_time).format('YYYY-MM-DD'))
                        cntOfSelectedDate += 1
                        break
                    case prevDate2:
                        cntOfPrevDate2 += 1
                        break
                    case prevDate1:
                        cntOfPrevDate1 += 1
                        break
                    case nextDate1:
                        cntOfNextDate1 += 1
                        break
                    case nextDate2:
                        cntOfNextDate2 += 1
                        break
                    default:
                        break
                }
            }
            var count = 0
            for (var elem of uniqueBookings) {
                var cnt1, cnt2, cnt3, cnt4
                cnt1 = cnt2 = cnt3 = cnt4 = 0
                for (var i = 0; i < bookings.length; i++) {
                    if (moment(bookings[i].schedule_time).isSame(elem, 'day')) {
                        var bookingTime = moment(bookings[i].schedule_time).format('HH:mm:ss')
                        console.log(bookings[i].schedule_time, bookingTime);
                        if (moment(bookingTime, 'HH:mm:ss').isBetween(moment('00:00:00', 'HH:mm:ss'), moment('06:00:00', 'HH:mm:ss'), undefined, '[)')) {

                            cnt1 += 1
                        } else if (moment(bookingTime, 'HH:mm:ss').isBetween(moment('06:00:00', 'HH:mm:ss'), moment('12:00:00', 'HH:mm:ss'), undefined, '[)')) {
                            cnt2 += 1
                        }
                        else if (moment(bookingTime, 'HH:mm:ss').isBetween(moment('12:00:00', 'HH:mm:ss'), moment('18:00:00', 'HH:mm:ss'), undefined, '[)')) {
                            cnt3 += 1
                        }
                        else {
                            cnt4 += 1
                        }
                    }
                }
                count += 1
                var temp = {
                    id: count,
                    name: elem,
                    values: {
                        0: {
                            time: '00:00:00 -> 06:00:00',
                            count: cnt1
                        },
                        1: {
                            time: '06:00:00 -> 12:00:00',
                            count: cnt2
                        },
                        2: {
                            time: '12:00:00 -> 18:00:00',
                            count: cnt3
                        },
                        3: {
                            time: '18:00:00 -> 23:59:59',
                            count: cnt4
                        },
                    }
                }
                bookingsDistribution.push(temp);
                this.setState({ bookingsDistribution: bookingsDistribution })
            }
        }
        this.setState({
            dateState: date,
            prevDate2: {
                date: prevDate2,
                count: cntOfPrevDate2
            },
            prevDate1: {
                date: prevDate1,
                count: cntOfPrevDate1
            },
            selectedDate: {
                date: selectedDate,
                count: cntOfSelectedDate,
                bookings: bookings
            },
            nextDate1: {
                date: nextDate1,
                count: cntOfNextDate1
            },
            nextDate2: {
                date: nextDate2,
                count: cntOfNextDate2
            },
        })
    }

    render() {
        console.log(this.props.api_data);
        return (

            <div className="container text-center">
                {!this.state.dataFetched && (
                    <div className='mt-5 pt-5'>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h3>Fetching Data<br />Please Wait ...</h3>
                    </div>
                )}
                {this.state.dataFetched && (
                    <div>
                        <div className="row mt-2">
                            <h3>Schedule Veiwer</h3>
                            <p>View the booking details for selected dates.<br /> You can provide the date by selecting it on the calender or by entering it in the text input.</p>
                        </div>
                        <div className="row border w-75 mx-auto">
                            <div className="col border-end">
                                <Calendar
                                    className="mx-auto"
                                    value={this.state.dateState}
                                    onChange={this.changeDate} />
                            </div>
                            <div className="col my-auto">
                                <form onSubmit={this.handleFormSubmit}>
                                    <label>
                                        Date (YYYY-MM-DD):<br />
                                        <input type="text" defaultValue={moment(this.state.dateState).format('YYYY-MM-DD')} />
                                    </label><br />
                                    <input className='btn btn-primary mt-1' type="submit" value="Submit" />
                                </form>
                            </div>

                        </div>
                        <div className="row ">
                            <div className="btn-group w-75 mx-auto mt-3" role="group">
                                <button type="button" className="btn btn-secondary" onClick={() => this.changeDateFromButton(this.state.prevDate2.date)}>
                                    {this.state.prevDate2.date}<br />
                                    No. of Bookings: {this.state.prevDate2.count}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => this.changeDateFromButton(this.state.prevDate1.date)}>
                                    {this.state.prevDate1.date}<br />
                                    No. of Bookings: {this.state.prevDate1.count}
                                </button>
                                <button type="button" className="btn btn-primary">
                                    {this.state.selectedDate.date}<br />
                                    No. of Bookings: {this.state.selectedDate.count}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => this.changeDateFromButton(this.state.nextDate1.date)}>
                                    {this.state.nextDate1.date}<br />
                                    No. of Bookings: {this.state.nextDate1.count}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => this.changeDateFromButton(this.state.nextDate2.date)}>
                                    {this.state.nextDate2.date}<br />
                                    No. of Bookings: {this.state.nextDate2.count}
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h4>Booking Details</h4>
                                    <div className='text-start'>
                                        <p>Date: <b>{moment(this.state.selectedDate.date).format('MMMM Do YYYY')}</b></p>
                                        <p >Number of Bookings: <b>{this.state.selectedDate.count}</b></p>
                                    </div>
                                    {this.state.bookingsDistribution && (
                                        <div className="" >
                                            <Accordion alwaysOpen>
                                                {this.state.bookingsDistribution.map(({ id, name, values }) => (
                                                    <Accordion.Item key={id} eventKey={id}>
                                                        <Accordion.Header>{name}</Accordion.Header>
                                                        <Accordion.Body>
                                                            <table className="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Schedule Time (Booked At)</th>
                                                                        <th scope="col">Count</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.values(values).map(({ time, count }) => (
                                                                        <tr key={time}>
                                                                            <th>{time}</th>
                                                                            <th>{count}</th>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                ))}
                                            </Accordion>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Bonus data={this.state.api_data} />
                    </div>)}
            </div >
        )
    }
}
export default Page