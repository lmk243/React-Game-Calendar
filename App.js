require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import EventCalendar from 'react-event-calendar/dist/react-event-calendar.js';
import Popover from 'react-bootstrap/lib/PopOver';
import Overlay from 'react-bootstrap/lib/Overlay';
import Label from 'react-bootstrap/lib/Label';
import Modal from 'react-bootstrap/lib/Modal';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Icon from 'react-geomicons';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProgressBar from 'react-progress-bar-battlenet-style';

var DatePicker = require('react-datepicker');
var moment = require('moment');

var myStorage = localStorage.getItem('eventsList')==null ? [] : JSON.parse(localStorage.getItem('eventsList'));
var myFaves = localStorage.getItem('favesList')==null ? [] : JSON.parse(localStorage.getItem('favesList'));

var d = new Date();

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]; 

class Addition extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.events,
            title: '',
            start: moment(),
            end: moment(),
            description: 'No Description',
            eventClasses: '',
            disabled: true,
            classes: '',
            image: 'img/spacer.gif'
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.checkInput = this.checkInput.bind(this);
    }
    
    handleChangeStart(date) {
        this.setState({start: date});
    }
    
    handleChangeEnd(date) {
        this.setState({end: date});
    }
    
    checkInput() {
        if (ReactDOM.findDOMNode(this.refs.name).value.length != 0) {
            this.setState({disabled: false, classes: 'animated rubberBand'});
        } else {
            this.setState({disabled: true, classes: ''});
        }
    }
    
    handleClick() {
        var title = ReactDOM.findDOMNode(this.refs.name).value;
        var start = this.state.start.format("YYYY-MM-DD");
        var end = this.state.end.format("YYYY-MM-DD");
        var eventClasses = ReactDOM.findDOMNode(this.refs.platform).value;
        if (ReactDOM.findDOMNode(this.refs.description).value.length == 0) {
            var description = this.state.description;
        } else {
            var description = ReactDOM.findDOMNode(this.refs.description).value;
        }
        
        if (ReactDOM.findDOMNode(this.refs.image).value.length == 0) {
            var image = this.state.image;
        } else {
            var image = ReactDOM.findDOMNode(this.refs.image).value;
        }
            this.props.addEventHandler(title, start, end, description, image, eventClasses);        
    }
    
    render() {
        return (
            <div>
            <Accordion>
            <Panel header="Click to Add an Event" eventKey="1">
            <div className="inputs">
                    <input type="text" ref="name" className="eventName" placeholder="Event Name (Required)" onChange={this.checkInput} />
                    <label>Start:</label>
                    <DatePicker selected={this.state.start} onChange={this.handleChangeStart} />
                    <label>End:</label>
                    <DatePicker selected={this.state.end} onChange={this.handleChangeEnd} />
            
                    <select ref="platform" className="eventPlatform">
                            <option value="pc">PC</option>
                            <option value="xbox">Xbox</option>
                            <option value="ps4">PS4</option>
                            <option value="mobile">Mobile</option>
                    </select>    
            
                    <input type="text" ref="description" className="eventDesc" placeholder="Enter a Description (Optional)" />
            
                    <input type="text" ref="image" className="eventDesc" placeholder="Image URL (Optional)" />
                    <p>Only supports hosted images.  No local file select. Ex: http://site.com/image.jpg</p>
            
                </div>
            
                <button onClick={this.handleClick} disabled={this.state.disabled} className={this.state.classes}>
                <Glyphicon glyph="plus" /> Add Event
                </button>
                
            </Panel>
            </Accordion>
            </div>
        );
    }
}


class Favorites extends React.Component {
    
    constructor(props) {
        super(props);
        
        if (localStorage.favesList == undefined) {
            var faveDisabled = true;
        } else {
            var faveDisabled = false;
        }
        
        this.state = {
            disabled: true,
            disabledList: faveDisabled,
            classes: '',
            classesList : '',
            drawerClass: 'closed',
            games: myFaves
        };
        this.handleClickView = this.handleClickView.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.deleteFavorites = this.deleteFavorites.bind(this);
    }
    
    checkInput() {
        if (ReactDOM.findDOMNode(this.refs.faveName).value.length != 0) {
            this.setState({disabled: false, classes: 'animated rubberBand'});
        } else {
            this.setState({disabled: true, classes: ''});
        }
    }
    
    handleClick() {
        var game = ReactDOM.findDOMNode(this.refs.faveName).value; 
        
        var arr = this.state.games;
        
        arr.push(game);
        
        this.setState({
            games: arr,
            disabledList: false,
            classesList: 'animated rubberBand'
        });
        
        localStorage.setItem( 'favesList', JSON.stringify(this.state.games));  
        
        ReactDOM.findDOMNode(this.refs.faveName).value = "";
    }
    
    handleClickView() {
        this.setState({drawerClass: 'open animated slideInUp'});
    }
    
    deleteFavorites() {
        delete localStorage['favesList'];
        window.location.reload();
    }
    
    closeDrawer() {
        this.setState({drawerClass: 'closed animated slideOutDown'});
    }
    
    render() {
        return (
            <div className="faveForm">
            <h3>Forgetting Something?</h3>
            <p>Know there's an event coming up but can't remember for what game?  Create a list of favorites.  Perhaps that'll jump start your memory.  Recommended number of entries: 16 or less</p>            

            <input type="text" ref="faveName" className="faveName" placeholder="Favorite" onChange={this.checkInput} />
            <div className="faveButtons">
            <button onClick={this.handleClick} disabled={this.state.disabled} className={this.state.classes}>
                <Glyphicon glyph="plus" /> Add Favorite
                </button>
            <button onClick={this.deleteFavorites} className={this.state.classesList} disabled={this.state.disabledList}><Icon name='warning' /> Delete Favorites</button>
                <button onClick={this.handleClickView} className={this.state.classesList} disabled={this.state.disabledList}><Glyphicon glyph="eye-open" /> View Favorites</button>
            </div>
            
            <div id="drawer" className={this.state.drawerClass}>
            <h5>My Favorites</h5>
            <ul className="Games">
                    {this.state.games.map(function(game, index){
                        return <li key={index} className={index}>{game}</li>;
                    })}
                </ul>   
            <button onClick={this.closeDrawer}>Close</button>
            </div>
            
            </div>

        );
    }
}


class Summary extends React.Component {
    
    constructor(props) {
        super(props);
        var now = moment(new Date()).format("YYYY-MM-DD");
        let eventList = [];
        let imageList = [];
        for (let i = 0; i < myStorage.length; i++) {
            if(now <= myStorage[i].start) {
                var yr1   = parseInt(myStorage[i].start.substring(0,4));
                var mon1  = parseInt(myStorage[i].start.substring(5,7));
                var dt1   = parseInt(myStorage[i].start.substring(8,10));
                var dayLength = 24*60*60*1000; // hours*minutes*seconds*milliseconds

                var currentDate = new Date();
                var eventDate = new Date(yr1, mon1-1, dt1);

                var timeLeft = Math.round(100 * Math.abs((currentDate.getTime() - eventDate.getTime())/(dayLength)))/100;
                var wholePart = Math.floor(timeLeft);
                var decimalPart = (timeLeft - wholePart);
                if (decimalPart <= 0.04) {
                    decimalPart = "less than 1 hour";
                } else if(decimalPart >= 0.04 && decimalPart < 0.08) {
                    decimalPart = "1 hour";
                } else if(decimalPart >= 0.08 && decimalPart < 0.13) {
                    decimalPart = "2 hours";
                } else if(decimalPart >= 0.13 && decimalPart < 0.17) {
                    decimalPart = "3 hours";
                } else if(decimalPart >= 0.17 && decimalPart < 0.21) {
                    decimalPart = "4 hours";
                } else if(decimalPart >= 0.21 && decimalPart < 0.25) {
                    decimalPart = "5 hours";
                } else if(decimalPart >= 0.25 && decimalPart < 0.29) {
                    decimalPart = "6 hours";
                } else if(decimalPart >= 0.29 && decimalPart < 0.33) {
                    decimalPart = "7 hours";
                } else if(decimalPart >= 0.33 && decimalPart < 0.38) {
                    decimalPart = "8 hours";
                } else if(decimalPart >= 0.38 && decimalPart < 0.42) {
                    decimalPart = "9 hours";
                } else if(decimalPart >= 0.42 && decimalPart < 0.46) {
                    decimalPart = "10 hours";
                } else if(decimalPart >= 0.46 && decimalPart < 0.50) {
                    decimalPart = "11 hours";
                } else if(decimalPart >= 0.50 && decimalPart < 0.54) {
                    decimalPart = "12 hours";
                } else if(decimalPart >= 0.54 && decimalPart < 0.58) {
                    decimalPart = "13 hours";
                } else if(decimalPart >= 0.58 && decimalPart < 0.63) {
                    decimalPart = "14 hours";
                } else if(decimalPart >= 0.63 && decimalPart < 0.67) {
                    decimalPart = "15 hours";
                } else if(decimalPart >= 0.67 && decimalPart < 0.71) {
                    decimalPart = "16 hours";
                } else if(decimalPart >= 0.71 && decimalPart < 0.75) {
                    decimalPart = "17 hours";
                } else if(decimalPart >= 0.75 && decimalPart < 0.79) {
                    decimalPart = "18 hours";
                } else if(decimalPart >= 0.79 && decimalPart < 0.83) {
                    decimalPart = "19 hours";
                } else if(decimalPart >= 0.83 && decimalPart < 0.88) {
                    decimalPart = "20 hours";
                } else if(decimalPart >= 0.88 && decimalPart < 0.92) {
                    decimalPart = "21 hours";
                } else if(decimalPart >= 0.92 && decimalPart < 0.96) {
                    decimalPart = "22 hours";
                } else if(decimalPart >= 0.96 && decimalPart < 0.99) {
                    decimalPart = "23 hours";
                } else {
                    decimalPart = "Error";
                }
                
                if (wholePart < 1) {
                    decimalPart = "0 hours";
                }
                
                if (wholePart > 1 || wholePart < 1) {
                    wholePart = wholePart + " days"
                } else {
                    wholePart = wholePart + " day"
                }
                
                var newDate = monthNames[mon1-1] + " " + dt1 + ", " + yr1;
                
                eventList.push(myStorage[i].title);
                eventList.push("Starts: " + newDate + " - " + wholePart + " and approx. " + decimalPart + " left");
                eventList.push("Platform: " + myStorage[i].eventClasses.toUpperCase());
                eventList.push(myStorage[i].description);
                
                imageList.push(myStorage[i].image);
            }
        }
        
        if(eventList.length == 0) {
            eventList.push("There Are No Upcoming Events");
            eventList.push("", "");
            eventList.push("Add an event for today or in the future to see it here.");
            var isEmpty = 'empty'
        };
        
        this.state = {
            events: eventList,
            images: imageList,
            classNames: isEmpty
        };
        
    }
    
    render() {
        return (
            <div className={this.state.classNames}>
                <div className="Summary animated slideInLeft">
                    <ul className="Names">
                        {this.state.events.map(function(event, index){
                            return <li key={index} className={index}>{event}</li>;
                        })}
                    </ul>  
                        {this.state.images.map(function(image, index){
                            return <div className="imageContainer"><img src={image} key={index} className="eventImage" /></div>;
                        })}
                </div>
            </div>
        );
    }
}


class Month extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            month: this.props.month
        };
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        
        var month = ReactDOM.findDOMNode(this.refs.month).value;
        this.props.switchHandler(month);
        
    }
    
    render() {
        return (
            <div className="Months">
                <select ref="month" className="monthSelect">
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>
            <button type="button" onClick={this.handleClick} className="switchBtn"><Glyphicon glyph="calendar" /> Switch Month</button>
            </div>
        );
    }
}


class Reset extends React.Component {
    
constructor(props) {
        super(props);
    
        if (localStorage.eventsList == undefined) {
            var eventsDisabled = true;
        } else {
            var eventsDisabled = false;
        }
    
        this.state = {
                showModal: false,
                disabled: eventsDisabled
            };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    
    }
    
    close() {
        this.setState({ showModal: false });
         window.location.reload();
      }

    open() {
        delete localStorage['eventsList'];
        this.setState({ showModal: true });
    }
    
  render() {
    return (
            <div>
        <button type="button" id="reset" onClick={this.open} disabled={this.state.disabled}><span><Icon name='warning' /> Clear Calendar</span></button>
        
        
        <Modal show={this.state.showModal} bsSize="small" onHide={this.close}>          
          <Modal.Body>
            <p className="modalText">
                Your calendar has been cleared
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.close}>Close</button>
          </Modal.Footer>
        </Modal>
        
        </div>
      );
    }
}


class Features extends React.Component {
    
  render() {
    return (
        <div className="features">
            <div className="new">
                <h3>New Features</h3>
                <ul>
                        <li>Wire favorites into localStorage and delete functionality <Label bsStyle="success">New</Label></li>
                        <li>Future Events Percentages and Summary <Label bsStyle="success">New</Label></li>
                </ul>
            </div>
            <div className="upcoming">
                <h3>Upcoming Features</h3>
                    <ul>                      
                        <li>TBA <Label bsStyle="default">To Do</Label></li>
                    </ul>
            </div>
        <div className="bugs">
                <h3>Known Bugs</h3>
                <ul>
                        <li>Events with same name may remove strangely <Label bsStyle="danger">Bug</Label></li>
                        <li>No calendar IE support <Label bsStyle="danger">Bug</Label></li>
                        <li>Trying to create an event that spans into a day that has one already overlaps that event <Label bsStyle="danger">Bug</Label></li>
                </ul>
            </div>
        </div>
      );
    }
}


class Intro extends React.Component {
    
  render() {
    return (
        <div className="intro">
            <img src="./img/favicon.png" id="logo" className="animated rollIn" />
            <div className="introText">
                <h1 className="animated bounce"><span className="color2">P</span><span className="color1">l</span><span className="color3">a</span><span className="color4">n</span> <span className="color2">W</span><span className="color1">i</span><span className="color3">t</span><span className="color4">h</span> <span className="color2">R</span><span className="color1">e</span><span className="color3">a</span><span className="color4">c</span><span className="color2">t</span><span className="color1">!</span></h1>
                <p>
                    Welcome to the React Game Calendar where you can keep notes on all your upcoming game releases.  Never forget another dlc, game or patch again!  Simply add an event with the day it begins and ends using the date fields below and a new entry will be stored on the associated day(s).  The calendar stores information using your browser's local storage which means if you try using a different browser other than what you started with, your entries will not carry over.  <strong><u>Click an event to remove it.</u></strong>
                    <br /> <br />
                    No support currently for Internet Explorer.  NOT Mobile friendly.  Have a reliable internet connection for optimal user experience.
                </p>
            </div>
        
            <h3>Plan for these Platforms</h3>
            <div className="devices">
                <div className="pcImg"><span>PC</span></div>
                <div className="xboxImg"><span>Xbox</span></div>
                <div className="ps4Img"><span>PS4</span></div>
                <div className="mobileImg"><span>Mobile</span></div>
            </div>
        </div>
      );
    }
}


class Legend extends React.Component {
    
  render() {
    return (
        <div className="legend">
            <div id="pc">
                <div className="colorSwatch3"></div>
                <p>PC</p>
            </div>
            <div id="xbox">
                <div className="colorSwatch1"></div>
                <p>Xbox</p>
            </div>
            <div id="ps4">
                <div className="colorSwatch2"></div>
                <p>PS4</p>
            </div>
            <div id="mobile">
                <div className="colorSwatch4"></div>
                <p>Mobile</p>
            </div>
    </div>
      );
    }
}


class Percentages extends React.Component {
    
    constructor(props) {
        super(props);
        var xCount = 0, pcCount = 0, psCount = 0, mCount = 0, totCount = 0;
        var now = moment(new Date()).format("YYYY-MM-DD");
        let i;
        
        for (i = 0; i < myStorage.length; i++) {
            if(now <= myStorage[i].start) {
                totCount++;
                if (myStorage[i].eventClasses == 'xbox') {
                    xCount++;
                } else if(myStorage[i].eventClasses == 'pc') {
                    pcCount++;
                } else if(myStorage[i].eventClasses == 'ps4') {
                    psCount++;
                } else {
                    mCount++;
                }
            }
        }
        
        if(totCount == 0) {
            var xPerc = 0;
            var pcPerc = 0;
            var psPerc = 0;
            var mPerc = 0;
        } else {
            var xPerc = xCount/totCount;
            var pcPerc = pcCount/totCount;
            var psPerc = psCount/totCount;
            var mPerc = mCount/totCount;
        }
        
        var roundX = Math.round(xPerc * 100);
        var roundPc = Math.round(pcPerc * 100);
        var roundPs = Math.round(psPerc * 100);
        var roundM = Math.round(mPerc * 100);
        
        this.state = {
            total: totCount,
            percentX: xPerc,
            percentPc: pcPerc,
            percentPs: psPerc,
            percentM: mPerc,
            xTotal: xCount,
            pcTotal: pcCount,
            psTotal: psCount,
            mTotal: mCount,
            roundedX: roundX,
            roundedPc: roundPc,
            roundedPs: roundPs,
            roundedM: roundM
        };
    }
    
   render() {
     return (
        <div className="percentages animated slideInLeft">
            <div className="pcBar">
                <span className="fraction"> - {this.state.pcTotal} / {this.state.total}</span>
                <ProgressBar completed={this.state.roundedPc} />
            </div>
            <div className="xBar">
                <span className="fraction"> - {this.state.xTotal} / {this.state.total}</span>
                <ProgressBar completed={this.state.roundedX} />
            </div>
            <div className="psBar">
                <span className="fraction"> - {this.state.psTotal} / {this.state.total}</span>
                <ProgressBar completed={this.state.roundedPs} />
            </div>
            <div className="mBar">
                <span className="fraction"> - {this.state.mTotal} / {this.state.total}</span>
                <ProgressBar completed={this.state.roundedM} />
            </div>                 
                
        </div>
      );
    }
}


class App extends React.Component {
    
    constructor(props) {
        super(props);
        var totCount = 0;
        var now = moment(new Date()).format("YYYY-MM-DD");
        let i;
        
        for (i = 0; i < myStorage.length; i++) {
            if(now <= myStorage[i].start) {
                totCount++;
            }
        }
        this.state = {
            total: totCount,
            showPopover: false,
            showModal: false,
            showModal2: false,
            overlayTitle: null,
            overlayDesc: null,
            popoverTarget: null,
            list: myStorage,
            month: Number(d.getMonth()),
            year: d.getFullYear(),
            header: monthNames[d.getMonth()]
        }
        this.addEvent = this.addEvent.bind(this);
        this.switchEvent = this.switchEvent.bind(this);
        this.handleEventMouseOver = this.handleEventMouseOver.bind(this);
        this.handleEventMouseOut = this.handleEventMouseOut.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.open2 = this.open2.bind(this);
        this.close2 = this.close2.bind(this);
    }
    
    handleEventMouseOver(target, eventData, day) {
        this.setState({
            showPopover: true,
            popoverTarget: () => ReactDOM.findDOMNode(target),
                overlayTitle: eventData.title,
                overlayDesc: eventData.description
        });
    }

    handleEventMouseOut(target, eventData, day) {
        this.setState({
            showPopover: false,
        });
    }
    
    close() {
        this.setState({ showModal: false });
        window.location.reload();
      }

    open() {
        this.setState({ showModal: true });
    }
    
    close2() {
        this.setState({ showModal2: false });
        window.location.reload();
      }

    open2() {
        this.setState({ showModal2: true });
    }
    
    onEventClick(target, eventData, day) {      
        let i;
        let title = eventData.title;
        for (i=0; i< myStorage.length; i++) {
            if (myStorage[i].title === eventData.title) {
                var newList = this.state.list.slice();
                newList.splice(i, 1);
                this.setState({list: newList});
                localStorage.setItem( 'eventsList', JSON.stringify(newList));
            }
        }
        this.open();
    }
    
    
    addEvent(title, start, end, description, image, eventClasses) {
        
        var arr = this.state.list;
        
        arr.push ({
            title: title,
            start: start,
            end: end,
            description: description,
            image: image,
            eventClasses: eventClasses
        });
        
        this.setState({
            list: arr
        });
        
        localStorage.setItem( 'eventsList', JSON.stringify(this.state.list));
        this.open2();   
    }
    
    switchEvent(month) {
                
        this.setState({
            month: Number(month),
            header: monthNames[month]
        });
        
    }

    render() {       
        
        return (
            <div>
            
            <Modal show={this.state.showModal} bsSize="small" onHide={this.close}>          
              <Modal.Body>
                <p className="modalText">
                    Event successfully removed.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={this.close}>Close</button>
              </Modal.Footer>
            </Modal>
            
            <Modal show={this.state.showModal2} bsSize="small" onHide={this.close2}>          
              <Modal.Body>
                <p className="modalText">
                    Event added successfully.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={this.close}>Close</button>
              </Modal.Footer>
            </Modal>
            
                <Overlay show={this.state.showPopover} rootClose onHide = {()=>this.setState({showPopover: false, })} placement="top" container={this} target={this.state.popoverTarget}>
                    <Popover id="event">
                    <div>
                        <h1>{this.state.overlayTitle}</h1>
                        <p>{this.state.overlayDesc}</p>
                    </div>
                    </Popover>
                </Overlay>
                <Intro />
                <Features />
                <div className="monthInfo">
                    <h2>{this.state.header}</h2>
                    <Month month={this.state.month} switchHandler={this.switchEvent} />
                </div>
                <EventCalendar month={this.state.month} year={this.state.year} events={this.state.list} onEventClick={this.onEventClick} onEventMouseOver={this.handleEventMouseOver} onEventMouseOut={this.handleEventMouseOut} />
                <Legend />
                    <Tabs>
					<TabList>
                        <Tab>Upcoming Events</Tab>
						<Tab>Platform Distribution</Tab>
						<Tab>Event Summary</Tab>
					</TabList>
                    <TabPanel>
                            <div className="tabsIntro animated slideInLeft">
                                <p className="eventsCount"><u>Your number of upcoming events is</u>: <strong>{this.state.total}</strong></p>
                            <p>Use the other tabs to find out the distribution of these upcoming events per platform as well as a summary list/image (if applicable) containing each.</p>
                            </div>
                    </TabPanel>
					<TabPanel>
						<Percentages />
					</TabPanel>
					<TabPanel>
						<Summary />
					</TabPanel>					
				</Tabs>
                <Addition events={this.state.list} addEventHandler={this.addEvent} />
                <Favorites />
                <Reset />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));