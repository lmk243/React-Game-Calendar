//require('babel-polyfill');
var Slider = require('react-slick');
import React from 'react';
import ReactDOM from 'react-dom';
import EventCalendar from 'react-event-calendar/dist/react-event-calendar.js';
import Popover from 'react-bootstrap/lib/PopOver';
import Overlay from 'react-bootstrap/lib/Overlay';
import Label from 'react-bootstrap/lib/Label';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Modal from 'react-bootstrap/lib/Modal';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Icon from 'react-moodycons';
import {Card, CardImage, Text, Heading } from 'rebass';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProgressBar from 'react-progress-bar-battlenet-style';

var DatePicker = require('react-datepicker');
var moment = require('moment');
var myStorage = localStorage.getItem('eventsList')==null ? [] : JSON.parse(localStorage.getItem('eventsList'));
var myFaves = localStorage.getItem('favesList')==null ? [] : JSON.parse(localStorage.getItem('favesList'));
var myToDo = localStorage.getItem('toDoList')==null ? [] : JSON.parse(localStorage.getItem('toDoList'));
var myToDo2 = localStorage.getItem('toDoList2')==null ? [] : JSON.parse(localStorage.getItem('toDoList2'));
var myTitle = localStorage.getItem('listTitle')==null ? [] : JSON.parse(localStorage.getItem('listTitle'));
var myTitle2 = localStorage.getItem('listTitle2')==null ? [] : JSON.parse(localStorage.getItem('listTitle2'));
var myNote1 = localStorage.getItem('note1')==null ? [] : JSON.parse(localStorage.getItem('note1'));
var myNote2 = localStorage.getItem('note2')==null ? [] : JSON.parse(localStorage.getItem('note2'));
var myNote3 = localStorage.getItem('note3')==null ? [] : JSON.parse(localStorage.getItem('note3'));
var themeColor = localStorage.getItem('theme')==null ? ['themeColorDef'] : JSON.parse(localStorage.getItem('theme'));

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
            <div className="inputs animated slideInUp">
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
            
                    <input type="text" ref="description" className="eventDesc" maxLength="30" placeholder="Enter a Description (Optional)" />
                    <p>Max Length: 30 characters including spaces</p>
            
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
            games: myFaves,
            showModal: false
        };
        this.handleClickView = this.handleClickView.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.open = this.open.bind(this);
        this.cancel = this.cancel.bind(this);
        this.clear = this.clear.bind(this);
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
    
    clear() {
        this.setState({ showModal: false });
        delete localStorage['favesList'];
        window.location.reload();
      }
    
    cancel() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }
    
    closeDrawer() {
        this.setState({drawerClass: 'closed animated slideOutDown'});
    }
    
    render() {
        return (
            <div className="faveForm">
            <h3>Forgetting Something? List Your Favorites</h3>
            <p>Know there's an event coming up but can't remember for what game?  Create a list of favorites.  Perhaps that'll jump start your memory.  Recommended number of entries: 16 or less</p>            

            <input type="text" ref="faveName" className="faveName" placeholder="Favorite" onChange={this.checkInput} />
            <div className="faveButtons">
            <button onClick={this.handleClick} disabled={this.state.disabled} className={this.state.classes}>
                <Glyphicon glyph="plus" /> Add Favorite
                </button>
            <button onClick={this.open} className={this.state.classesList} disabled={this.state.disabledList}><Glyphicon glyph='warning-sign' /> Delete Favorites</button>
            
            <Modal className="resetBox" show={this.state.showModal} bsSize="small" onHide={this.cancel}>          
          <Modal.Body>
            <p className="modalText">
                Are you sure you wish to clear your favorites?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.clear}>Confirm</button>
            <button onClick={this.cancel}>Cancel</button>
          </Modal.Footer>
        </Modal>
            
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
        var warning = "";
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
                
                if (now == myStorage[i].start && wholePart == 0) {
                    decimalPart = "0 hours";
                }
                
                if(myStorage[i].title.toLowerCase().indexOf(" end") >= 0 || myStorage[i].title.toLowerCase().indexOf(" ends") >= 0 || myStorage[i].title.toLowerCase().indexOf(" ending") >= 0) {
                    if (wholePart <= 1 ) {
                        warning = "HURRY!  This event ends soon!";
                    }
                } else {
                    warning = "";
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
                eventList.push(myStorage[i].description + " " + warning);
                
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
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }
    
    handleClick() {
        
        var month = ReactDOM.findDOMNode(this.refs.month).value;
        this.props.switchHandler(month);
        
    }
    
    next() {
        
        this.props.nextHandler();
        
    }
    
    prev() {
        
        this.props.prevHandler();
        
    }
    
    render() {
        return (
            <div className="Arrow">
            <button onClick={this.prev} type="button" className="arrowBtn2"><Glyphicon glyph="menu-left" /></button>
            
            <button onClick={this.next} type="button" className="arrowBtn"><Glyphicon glyph="menu-right" /></button>
            
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
            
            </div>
        );
    }
}


class GameSlider extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            showModal: false,
            showModal2: false,
            showModal3: false
        }
        
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.open2 = this.open2.bind(this);
        this.close2 = this.close2.bind(this);
        this.open3 = this.open3.bind(this);
        this.close3 = this.close3.bind(this);
    }
    
    close() {
        this.setState({ showModal: false });
      }

    open() {
        this.setState({ showModal: true });
    }
    
    close3() {
        this.setState({ showModal3: false });
      }

    open3() {
        this.setState({ showModal3: true });
    }
    
    close2() {
        this.setState({ showModal2: false });
      }

    open2() {
        this.setState({ showModal2: true });
    }
    
    render() {
            var settings = {
          dots: true,
          dotsClass: 'dots',
          draggable: false,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 8000,
          speed: 500,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1
        };
        return (
        <div className="slider">
            
            <Modal show={this.state.showModal} bsSize="small" onHide={this.close}>          
              <Modal.Body>
                <Card
                  rounded
                  width={256}
                >
                 <div className="cardContainer">
                     <CardImage src="img/tekken-7.jpg" />
                </div>
                  <Heading
                    level={2}
                    size={3}
                  >
                    Tekken 7
                  </Heading>
                  <Text>
                    <u>Platform(s)</u>: PS4/Xbox/PC<br />
                    <u>Release Date</u>: June 2, 2017
                  </Text>
                </Card>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={this.close}>Close</button>
              </Modal.Footer>
            </Modal>
            
            <Modal show={this.state.showModal2} bsSize="small" onHide={this.close2}>          
              <Modal.Body>
                <Card
                  rounded
                  width={256}
                >
                 <div className="cardContainer">
                     <CardImage src="img/Crash-Bandicoot.jpg" />
                </div>
                  <Heading
                    level={2}
                    size={3}
                  >
                    Crash Bandicoot Remastered
                  </Heading>
                  <Text>
                    <u>Platform(s)</u>: PS4<br />
                    <u>Release Date</u>: June 30, 2017
                  </Text>
                </Card>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={this.close2}>Close</button>
              </Modal.Footer>
            </Modal>
            
            <Modal show={this.state.showModal3} bsSize="small" onHide={this.close3}>          
              <Modal.Body>
                <Card
                  rounded
                  width={256}
                >
                 <div className="cardContainer">
                     <CardImage src="img/ESO-morrowind.jpg" />
                </div>
                  <Heading
                    level={2}
                    size={3}
                  >
                    ESO: Morrowind
                  </Heading>
                  <Text>
                    <u>Platform(s)</u>: PC/XBOX/PS4<br />
                    <u>Release Date</u>: June 6, 2017
                  </Text>
                </Card>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={this.close3}>Close</button>
              </Modal.Footer>
            </Modal>
            
        <span className="stitle">New and Upcoming Titles</span>
        <Slider {...settings}>
        <div><div className="game game1" onClick={this.open}><span>Tekken 7</span></div></div>
        <div><div className="game game2" onClick={this.open2}><span>Crash Bandicoot Remastered</span></div></div>
        <div><div className="game game3" onClick={this.open3}><span>ESO: Morrowind</span></div></div>
      </Slider>
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
        this.cancel = this.cancel.bind(this);
        this.clear = this.clear.bind(this);
    
    }
    
    clear() {
        this.setState({ showModal: false });
        delete localStorage['eventsList'];
        window.location.reload();
      }
    
    cancel() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }
    
  render() {
    return (
            <div>
        <button type="button" id="reset" onClick={this.open} disabled={this.state.disabled}><span><Glyphicon glyph='warning-sign' /> Clear Calendar</span></button>
        
        
        <Modal className="resetBox" show={this.state.showModal} bsSize="small" onHide={this.cancel}>          
          <Modal.Body>
            <p className="modalText">
                Are you sure you wish to clear your calendar?  This will also clear your statistics.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.clear}>Confirm</button>
            <button onClick={this.cancel}>Cancel</button>
          </Modal.Footer>
        </Modal>
        
        </div>
      );
    }
}


class Note1 extends React.Component {
    
constructor(props) {
        super(props);
    
    if (localStorage.note1 == undefined) {
            var makeDisabled = false;
            var delDisabled = true;
        } else {
            var makeDisabled = true;
            var delDisabled = false;
        }
    
        this.state = {
               note: myNote1,
               disableMake: makeDisabled,
               disableDelete: delDisabled
            };
    
        this.delete = this.delete.bind(this);
        this.make = this.make.bind(this);
    
    }
    
    delete() {
        delete localStorage['note1'];
        
        this.setState({
            disableMake: false,
            disableDelete: true
        });
        
        window.location.reload();
      }
    
    make() {
        
        var text = ReactDOM.findDOMNode(this.refs.text).value; 
        var header = ReactDOM.findDOMNode(this.refs.header).value; 
        var feeling = ReactDOM.findDOMNode(this.refs.mood).value; 
        
        var arr = this.state.note;
        
        arr.push ({
            title: header,
            text: text,
            feel: feeling
        });
        
        localStorage.setItem( 'note1', JSON.stringify(this.state.note));  
        
        this.setState({
            note: arr,
            disableMake: true,
            disableDelete: false
        });
        
        ReactDOM.findDOMNode(this.refs.text).value = "";
        ReactDOM.findDOMNode(this.refs.header).value = "";
        
    }
    
  render() {
    return (
        <div className="noteContain">
        
        {this.state.note.map(function(item, index){
                return <div><h3 key={index}>{item.title}</h3><p>{item.text}</p><div className="smiley"><p>Feeling: </p><Icon name={item.feel} /></div></div>;
            }, this)}
        
            <div className="noteInput">
                <div className="instructNote" disabled={this.state.disableMake}><p>Create a new note using the form below</p></div>
                <input ref="header" type="text" disabled={this.state.disableMake} placeholder="Heading" />
                <input ref="text" type="text" disabled={this.state.disableMake} placeholder="Note" />
                <select ref="mood" disabled={this.state.disableMake}>
                                <option value="grinning">Excited</option>
                                <option value="dying">Dying</option>
                                <option value="heartEyes">Love</option>
                                <option value="happy">Happy</option>
                                <option value="relieved">Relieved</option>
                                <option value="disheartened">Disheartened</option>
                                <option value="tearDrop">Sad</option>
                                <option value="angry">Angry</option>
                                <option value="unhappy">Unhappy</option>
                                <option value="devastated">Devastated</option>
                            </select>
                <button onClick={this.make} disabled={this.state.disableMake}>Create</button>
                <button onClick={this.delete} disabled={this.state.disableDelete}><Glyphicon glyph='warning-sign' /> Delete</button>
            </div>
        </div>
      );
    }
}


class Note2 extends React.Component {
    
constructor(props) {
        super(props);
    
    if (localStorage.note2 == undefined) {
            var makeDisabled = false;
            var delDisabled = true;
        } else {
            var makeDisabled = true;
            var delDisabled = false;
        }
    
        this.state = {
               note: myNote2,
               disableMake: makeDisabled,
               disableDelete: delDisabled
            };
    
        this.delete = this.delete.bind(this);
        this.make = this.make.bind(this);
    
    }
    
    delete() {
        delete localStorage['note2'];
        
        this.setState({
            disableMake: false,
            disableDelete: true
        });
        
        window.location.reload();
      }
    
    make() {
        
        var text = ReactDOM.findDOMNode(this.refs.text).value; 
        var header = ReactDOM.findDOMNode(this.refs.header).value; 
        var feeling = ReactDOM.findDOMNode(this.refs.mood).value; 
        
        var arr = this.state.note;
        
        arr.push ({
            title: header,
            text: text,
            feel: feeling
        });
        
        localStorage.setItem( 'note2', JSON.stringify(this.state.note));  
        
        this.setState({
            note: arr,
            disableMake: true,
            disableDelete: false
        });
        
        ReactDOM.findDOMNode(this.refs.text).value = "";
        ReactDOM.findDOMNode(this.refs.header).value = "";
        
    }
    
  render() {
    return (
        <div className="noteContain">
        
        {this.state.note.map(function(item, index){
                return <div><h3 key={index}>{item.title}</h3><p>{item.text}</p><div className="smiley"><p>Feeling: </p><Icon name={item.feel} /></div></div>;
            }, this)}
        
            <div className="noteInput">
                <div className="instructNote" disabled={this.state.disableMake}><p>Create a new note using the form below</p></div>
                <input ref="header" type="text" disabled={this.state.disableMake} placeholder="Heading" />
                <input ref="text" type="text" disabled={this.state.disableMake} placeholder="Note" />
                <select ref="mood" disabled={this.state.disableMake}>
                                <option value="grinning">Excited</option>
                                <option value="dying">Dying</option>
                                <option value="heartEyes">Love</option>
                                <option value="happy">Happy</option>
                                <option value="relieved">Relieved</option>
                                <option value="disheartened">Disheartened</option>
                                <option value="tearDrop">Sad</option>
                                <option value="angry">Angry</option>
                                <option value="unhappy">Unhappy</option>
                                <option value="devastated">Devastated</option>
                            </select>
                <button onClick={this.make} disabled={this.state.disableMake}>Create</button>
                <button onClick={this.delete} disabled={this.state.disableDelete}><Glyphicon glyph='warning-sign' /> Delete</button>
            </div>
        </div>
      );
    }
}


class Note3 extends React.Component {
    
constructor(props) {
        super(props);
    
    if (localStorage.note3 == undefined) {
            var makeDisabled = false;
            var delDisabled = true;
        } else {
            var makeDisabled = true;
            var delDisabled = false;
        }
    
        this.state = {
               note: myNote3,
               disableMake: makeDisabled,
               disableDelete: delDisabled
            };
    
        this.delete = this.delete.bind(this);
        this.make = this.make.bind(this);
    
    }
    
    delete() {
        delete localStorage['note3'];
        
        this.setState({
            disableMake: false,
            disableDelete: true
        });
        
        window.location.reload();
      }
    
    make() {
        
        var text = ReactDOM.findDOMNode(this.refs.text).value; 
        var header = ReactDOM.findDOMNode(this.refs.header).value; 
        var feeling = ReactDOM.findDOMNode(this.refs.mood).value; 
        
        var arr = this.state.note;
        
        arr.push ({
            title: header,
            text: text,
            feel: feeling
        });
        
        localStorage.setItem( 'note3', JSON.stringify(this.state.note));  
        
        this.setState({
            note: arr,
            disableMake: true,
            disableDelete: false
        });
        
        ReactDOM.findDOMNode(this.refs.text).value = "";
        ReactDOM.findDOMNode(this.refs.header).value = "";
        
    }
    
  render() {
    return (
        <div className="noteContain">
        
        {this.state.note.map(function(item, index){
                return <div><h3 key={index}>{item.title}</h3><p>{item.text}</p><div className="smiley"><p>Feeling: </p><Icon name={item.feel} /></div></div>;
            }, this)}
        
            <div className="noteInput">
                <div className="instructNote" disabled={this.state.disableMake}><p>Create a new note using the form below</p></div>
                <input ref="header" type="text" disabled={this.state.disableMake} placeholder="Heading" />
                <input ref="text" type="text" disabled={this.state.disableMake} placeholder="Note" />
                <select ref="mood" disabled={this.state.disableMake}>
                                <option value="grinning">Excited</option>
                                <option value="dying">Dying</option>
                                <option value="heartEyes">Love</option>
                                <option value="happy">Happy</option>
                                <option value="relieved">Relieved</option>
                                <option value="disheartened">Disheartened</option>
                                <option value="tearDrop">Sad</option>
                                <option value="angry">Angry</option>
                                <option value="unhappy">Unhappy</option>
                                <option value="devastated">Devastated</option>
                            </select>
                <button onClick={this.make} disabled={this.state.disableMake}>Create</button>
                <button onClick={this.delete} disabled={this.state.disableDelete}><Glyphicon glyph='warning-sign' /> Delete</button>
            </div>
        </div>
      );
    }
}


class Navbar extends React.Component {
    
constructor(props) {
        super(props);
}
  render() {
    return (
        <div className="navBar">
        <div className="inner">
        <Nav bsStyle="pills">
            <NavItem eventKey={1} href="#notes" className="orange">Notes</NavItem>
            <NavItem eventKey={2} href="#nu" className="red">New/Upcoming</NavItem>
            <NavItem eventKey={3} href="#calendar" className="green">Calendar</NavItem>
            <NavItem eventKey={4} href="#stats" className="blue">Statistics</NavItem>
            <NavItem eventKey={5} href="#add" className="orange">Add Event</NavItem>
            <NavItem eventKey={6} href="#favorites" className="red">Favorites</NavItem>
            <NavItem eventKey={7} href="#todos" className="green">To Do Lists</NavItem>
            <NavItem eventKey={8} href="#top" className="blue"><Glyphicon glyph="menu-up" />Top</NavItem>
          </Nav>
        </div>
        </div>
      );
    }
}


class ToDo1 extends React.Component {
    
constructor(props) {
        super(props);
    
        if (localStorage.toDoList == undefined) {
            var itemDisabled = true;
        } else {
            var itemDisabled = false;
        }
    
    var total = 0;
    var complete = 0; 
    var percent = 0;
    
    for (let i = 0; i < myToDo.length; i++) {
        total = total + 1;
        
        if (myToDo[i].classes == "completed") {
            complete = complete + 1;
        }
    }
    
    if ((complete/total) == 1) {         
        percent = 100;
    } else if((complete/total) == 0) {
        percent = 0;
    } else {
        percent = (complete/total).toFixed(2).substring(2,4)
    }
    
    if(percent == "N") {
            percent = 0;
        }
      
        this.state = {
            disabled: true,
            disabledTitle: true,
            classes: '',
            classesTitle: '',
            classesList : 'incomplete',
            disabledList: itemDisabled,
            list: myToDo,
            title: myTitle,
            total: total,
            done: complete,
            percentage: percent
            };
    
        this.check = this.check.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.checkInputTitle = this.checkInputTitle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickTitle = this.handleClickTitle.bind(this);
        this.open = this.open.bind(this);
        this.cancel = this.cancel.bind(this);
        this.clear = this.clear.bind(this);
    
    }
    
    clear() {
        this.setState({ showModal: false });
        delete localStorage['listTitle'];
        delete localStorage['toDoList'];
        window.location.reload();
      }
    
    cancel() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }
    
    check(e) {
        for (let i = 0; i < myToDo.length; i++) {
            if(myToDo[i].title == e.target.innerHTML){
                if(e.target.className == "incomplete") {
                    var tempTitle = myToDo[i].title;
                    var tempPriority = myToDo[i].priority;
                    var newList = myToDo.slice();
                    newList.splice (i, 1, {
                        title: tempTitle,
                        classes: 'completed',
                        priority: tempPriority
                    });
                    this.setState({list: newList});
                    localStorage.setItem( 'toDoList', JSON.stringify(newList));
                    myToDo = localStorage.getItem('toDoList')==null ? [] : JSON.parse(localStorage.getItem('toDoList'));
                }
                
                if(e.target.className == "completed") {
                    var tempTitle = myToDo[i].title;
                    var tempPriority = myToDo[i].priority;
                    var newList = myToDo.slice();
                    newList.splice (i, 1, {
                        title: tempTitle,
                        classes: 'incomplete',
                        priority: tempPriority
                    });
                    this.setState({list: newList});
                    localStorage.setItem( 'toDoList', JSON.stringify(newList));
                    myToDo = localStorage.getItem('toDoList')==null ? [] : JSON.parse(localStorage.getItem('toDoList'));
                }
            }
        }
            
            var total = 0, complete = 0;
    
            for (let i = 0; i < myToDo.length; i++) {
                total = total + 1;

                if (myToDo[i].classes == "completed") {
                    complete = complete + 1;
                }
            }
        
            if ((complete/total) == 1) {
                this.setState({percentage: 100, total: total, done: complete});
            } else if((complete/total) == 0) {
                this.setState({percentage: 0, total: total, done: complete});
            } else {
                this.setState({percentage: (complete/total).toFixed(2).substring(2,4), total: total, done: complete});
            }
    }
    
    handleClick() {
        var listItem = ReactDOM.findDOMNode(this.refs.listItem).value; 
        
        var arr = this.state.list;
        
        if(document.getElementById("priority").checked == true) {
            var priorityLevel = "highPriority";
        } else {
            var priorityLevel = "noPriority";
        }
        
        arr.push ({
            title: listItem,
            classes: 'incomplete',
            priority: priorityLevel
        });
        
        this.setState({
            list: arr,
            disabled: true,
            disabledList: false,
            classesList: 'animated rubberBand'
        });
        
        document.getElementById("priority").checked = false;
        
        localStorage.setItem( 'toDoList', JSON.stringify(this.state.list));  
        
        ReactDOM.findDOMNode(this.refs.listItem).value = "";
        
        var total = 0, complete = 0;
    
            for (let i = 0; i < myToDo.length; i++) {
                total = total + 1;

                if (myToDo[i].classes == "completed") {
                    complete = complete + 1;
                }
            }
            if ((complete/total) == 1) {
                this.setState({percentage: 100, total: total, done: complete});
            } else if((complete/total) == 0) {
                this.setState({percentage: 0, total: total, done: complete});
            } else {
                this.setState({percentage: (complete/total).toFixed(2).substring(2,4), total: total, done: complete});
            }
    }
    
    handleClickTitle() {
        var newTitle = ReactDOM.findDOMNode(this.refs.title).value; 
        
        this.setState({
            title: newTitle,
            disabledTitle: true,
            classesTitle: ''
        });
        
        delete localStorage['listTitle'];
        localStorage.setItem( 'listTitle', JSON.stringify(newTitle));  
        myTitle = localStorage.getItem('listTitle')==null ? [] : JSON.parse(localStorage.getItem('listTitle'));
        
        ReactDOM.findDOMNode(this.refs.title).value = "";
    }
    
    checkInput() {
        if (ReactDOM.findDOMNode(this.refs.listItem).value.length != 0) {
            this.setState({disabled: false, classes: 'animated rubberBand'});
        } else {
            this.setState({disabled: true, classes: ''});
        }
    }
    
    checkInputTitle() {
        if (ReactDOM.findDOMNode(this.refs.title).value.length != 0) {
            this.setState({disabledTitle: false, classesTitle: 'animated rubberBand'});
        } else {
            this.setState({disabledTitle: true, classesTitle: ''});
        }
    }
    
  render() {
    return (
        <div className="toDoList1">
        <h4>{this.state.title}</h4>
        <div className="list">
            {this.state.list.map(function(item, index){
                return <div><p key={index} onClick={this.check} className={item.classes} ref={item.title}>{item.title}</p><span className={item.priority}></span></div>;
            }, this)}
    </div>
    <div className="bottom">
    <div className="progressList">
            <span className="fraction"> - {this.state.done} / {this.state.total}</span>
            <div className="arrow-up"></div>
            <ProgressBar completed={this.state.percentage} />
        </div>
        <div className="itemButtons">
            <input type="text" ref="listItem" className="listItem" placeholder="Add Item" onChange={this.checkInput} />
                <button onClick={this.handleClick} disabled={this.state.disabled} className={this.state.classes}>
                    <Glyphicon glyph="plus" /> Add Item
                    </button>
                  
            </div>  
                    
                    <div className="priorityCheck">
                    <input id="priority" type="checkbox" name="priority" value="first" className={this.state.classes} disabled={this.state.disabled} /> First priority ⚝
                        </div>
                    
                <div className="createTitle">
                    <input type="text" ref="title" className="" onChange={this.checkInputTitle} placeholder="List Title" />
                    <button disabled={this.state.disabledTitle} onClick={this.handleClickTitle} className={this.state.classesTitle}>Create Title</button>
                </div>
                    
                <button onClick={this.open} className={this.state.disabledList} disabled={this.state.disabledList}><Glyphicon glyph='warning-sign' /> Delete List</button>
        </div>  
            <Modal className="resetBox" show={this.state.showModal} bsSize="small" onHide={this.cancel}>          
                <Modal.Body>
                    <p className="modalText">
                        Are you sure you wish to clear your first list?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.clear}>Confirm</button>
                    <button onClick={this.cancel}>Cancel</button>
                </Modal.Footer>
            </Modal>
        </div>
      );
    }
}


class ToDo2 extends React.Component {
    
constructor(props) {
        super(props);
    
        if (localStorage.toDoList2 == undefined) {
            var itemDisabled = true;
        } else {
            var itemDisabled = false;
        }
                        
        var total = 0;
        var complete = 0; 
        var percent = 0;

        for (let i = 0; i < myToDo2.length; i++) {
            total = total + 1;

            if (myToDo2[i].classes == "completed") {
                complete = complete + 1;
            }
        }
                        
        if ((complete/total) == 1) {         
            percent = 100;
        } else if((complete/total) == 0) {
            percent = 0;
        } else {
            percent = (complete/total).toFixed(2).substring(2,4)
        }
                        
        if(percent == "N") {
            percent = 0;
        }
                        
        this.state = {
            disabled: true,
            disabledTitle: true,
            classes: '',
            classesTitle: '',
            classesList : 'incomplete',
            disabledList: itemDisabled,
            list: myToDo2,
            title: myTitle2,
            total: total,
            done: complete,
            percentage: percent
            };
    
        this.check = this.check.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.checkInputTitle = this.checkInputTitle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickTitle = this.handleClickTitle.bind(this);
        this.open = this.open.bind(this);
        this.cancel = this.cancel.bind(this);
        this.clear = this.clear.bind(this);
    }
    
    clear() {
        this.setState({ showModal: false });
        delete localStorage['listTitle2'];
        delete localStorage['toDoList2'];
        window.location.reload();
      }
    
    cancel() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }
    
    check(e) {
        for (let i = 0; i < myToDo2.length; i++) {
            if(myToDo2[i].title == e.target.innerHTML){
                if(e.target.className == "incomplete") {
                    var tempTitle = myToDo2[i].title;
                    var tempPriority = myToDo2[i].priority;
                    var newList = myToDo2.slice();
                    newList.splice (i, 1, {
                        title: tempTitle,
                        classes: 'completed',
                        priority: tempPriority
                    });
                    this.setState({list: newList});
                    localStorage.setItem( 'toDoList2', JSON.stringify(newList));
                    myToDo2 = localStorage.getItem('toDoList2')==null ? [] : JSON.parse(localStorage.getItem('toDoList2'));
                }
                
                if(e.target.className == "completed") {
                    var tempTitle = myToDo2[i].title;
                    var tempPriority = myToDo2[i].priority;
                    var newList = myToDo2.slice();
                    newList.splice (i, 1, {
                        title: tempTitle,
                        classes: 'incomplete',
                        priority: tempPriority
                    });
                    this.setState({list: newList});
                    localStorage.setItem( 'toDoList2', JSON.stringify(newList));
                    myToDo2 = localStorage.getItem('toDoList2')==null ? [] : JSON.parse(localStorage.getItem('toDoList2'));
                }
            }
        }
            var total = 0, complete = 0;
    
            for (let i = 0; i < myToDo2.length; i++) {
                total = total + 1;

                if (myToDo2[i].classes == "completed") {
                    complete = complete + 1;
                }
            }
            if ((complete/total) == 1) {
                this.setState({percentage: 100, total: total, done: complete});
            } else if((complete/total) == 0) {
                this.setState({percentage: 0, total: total, done: complete});
            } else {
                this.setState({percentage: (complete/total).toFixed(2).substring(2,4), total: total, done: complete});
            }
        
    }
    
    handleClick() {
        var listItem = ReactDOM.findDOMNode(this.refs.listItem2).value; 
        
        var arr = this.state.list;
        
        if(document.getElementById("priority2").checked == true) {
            var priorityLevel = "highPriority";
        } else {
            var priorityLevel = "noPriority";
        }
        
        arr.push ({
            title: listItem,
            classes: 'incomplete',
            priority: priorityLevel
        });
        
        this.setState({
            list: arr,
            disabled: true,
            disabledList: false,
            classesList: 'animated rubberBand'
        });
        
        document.getElementById("priority2").checked = false;
        
        localStorage.setItem( 'toDoList2', JSON.stringify(this.state.list));  
        
        ReactDOM.findDOMNode(this.refs.listItem2).value = "";
        
        var total = 0, complete = 0;
    
            for (let i = 0; i < myToDo2.length; i++) {
                total = total + 1;

                if (myToDo2[i].classes == "completed") {
                    complete = complete + 1;
                }
            }
            if ((complete/total) == 1) {
                this.setState({percentage: 100, total: total, done: complete});
            } else if((complete/total) == 0) {
                this.setState({percentage: 0, total: total, done: complete});
            } else {
                this.setState({percentage: (complete/total).toFixed(2).substring(2,4), total: total, done: complete});
            }
    }


     handleClickTitle() {
        var newTitle = ReactDOM.findDOMNode(this.refs.title2).value; 
        
        this.setState({
            title: newTitle,
            disabledTitle: true,
            classesTitle: ''
        });
        
        delete localStorage['listTitle2'];
        localStorage.setItem( 'listTitle2', JSON.stringify(newTitle));  
        myTitle2 = localStorage.getItem('listTitle2')==null ? [] : JSON.parse(localStorage.getItem('listTitle2'));
        
        ReactDOM.findDOMNode(this.refs.title2).value = "";
    }
    
    checkInput() {
        if (ReactDOM.findDOMNode(this.refs.listItem2).value.length != 0) {
            this.setState({disabled: false, classes: 'animated rubberBand'});
        } else {
            this.setState({disabled: true, classes: ''});
        }
    }

    checkInputTitle() {
        if (ReactDOM.findDOMNode(this.refs.title2).value.length != 0) {
            this.setState({disabledTitle: false, classesTitle: 'animated rubberBand'});
        } else {
            this.setState({disabledTitle: true, classesTitle: ''});
        }
    }
    
  render() {
    return (
        <div className="toDoList2">
        <h4>{this.state.title}</h4>
            <div className="list">
        {this.state.list.map(function(item, index){
                return <div><p key={index} onClick={this.check} className={item.classes} ref={item.title}>{item.title}</p><span className={item.priority}></span></div>;
            }, this)}
        </div>
    <div className="bottom">    
        <div className="progressList">
            <div className="arrow-up"></div>
            <span className="fraction"> - {this.state.done} / {this.state.total}</span>
            <ProgressBar completed={this.state.percentage} />
        </div>
            <div className="itemButtons">
            <input type="text" ref="listItem2" className="listItem" placeholder="Add Item" onChange={this.checkInput} />
                <button onClick={this.handleClick} disabled={this.state.disabled} className={this.state.classes}>
                    <Glyphicon glyph="plus" /> Add Item
                    </button>
                  
            </div>  
                    
                    <div className="priorityCheck">
                    <input id="priority2" type="checkbox" name="priority" value="first" disabled={this.state.disabled} className={this.state.classes} /> First priority ⚝
                        </div>
                    
                <div className="createTitle">
                    <input type="text" ref="title2" className="" onChange={this.checkInputTitle} placeholder="List Title" />
                    <button disabled={this.state.disabledTitle} onClick={this.handleClickTitle} className={this.state.classesTitle}>Create Title</button>
                </div>
                    
                <button onClick={this.open} className={this.state.disabledList} disabled={this.state.disabledList}><Glyphicon glyph='warning-sign' /> Delete List</button>
        </div> 
            <Modal className="resetBox" show={this.state.showModal} bsSize="small" onHide={this.cancel}>          
                <Modal.Body>
                    <p className="modalText">
                        Are you sure you wish to clear your second list?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.clear}>Confirm</button>
                    <button onClick={this.cancel}>Cancel</button>
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
                        <li>Notes section <Label bsStyle="success">New</Label></li>
                        <li>New/Upcoming games carousel <Label bsStyle="success">New</Label></li>
                        <li>Added two to do lists with delete and titles <Label bsStyle="success">New</Label></li>
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
                        <li>Adding a to do item after checking one off will not allow to check new item or update progress bar until page refresh <Label bsStyle="danger">Bug</Label></li>
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
                    No support currently for Internet Explorer.  NOT Mobile friendly.  Have a reliable internet connection for the best experience.
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
            avatarClass: 'eventAvatar',
            showPopover: false,
            linkState: 'links closed first',
            showModal: false,
            showModal2: false,
            overlayTitle: null,
            overlayDesc: null,
            overlayImg: null,
            popoverTarget: null,
            color: themeColor,
            list: myStorage,
            month: Number(d.getMonth()),
            year: d.getFullYear(),
            header: monthNames[d.getMonth()]
        }
        this.addEvent = this.addEvent.bind(this);
        this.switchEvent = this.switchEvent.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        this.handleEventMouseOver = this.handleEventMouseOver.bind(this);
        this.handleEventMouseOut = this.handleEventMouseOut.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.open2 = this.open2.bind(this);
        this.close2 = this.close2.bind(this);
        this.openLinks = this.openLinks.bind(this);
        this.checkInputColor = this.checkInputColor.bind(this);
    }
    
    handleEventMouseOver(target, eventData, day) {
        this.setState({
            showPopover: true,
            popoverTarget: () => ReactDOM.findDOMNode(target),
                overlayTitle: eventData.title,
                overlayDesc: eventData.description,
                overlayImg: eventData.image
        });
        if(eventData.image == "img/spacer.gif") {
                this.setState({
                avatarClass: 'eventAvatar emptyAvatar'
            });
        } else {
            this.setState({
                avatarClass: 'eventAvatar'
            });
        }
    }

    checkInputColor(e) {
        delete localStorage['theme'];
        
        if(e.target.value == 'default') {
            var newColor = 'themeColorDef';
        }
        if(e.target.value == 'red') {
            var newColor = 'themeColor1';
        }
        if(e.target.value == 'orange') {
            var newColor = 'themeColor2';
        }
        if(e.target.value == 'green') {
            var newColor = 'themeColor3';
        }
        if(e.target.value == 'blue') {
            var newColor = 'themeColor4';
        }
        
        this.setState({
            color: newColor
        });
        
        localStorage.setItem( 'theme', JSON.stringify(newColor));  
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
    
    openLinks() {
        if((this.state.linkState == 'links closed') || (this.state.linkState == 'links closed first')) {
            this.setState({
            linkState: 'links open'
        });
        }
        
        if(this.state.linkState == 'links open') {
            this.setState({
            linkState: 'links closed'
        });
        }
    }
    
    nextMonth() {
        
        var nextMonth = this.state.month + 1;
        var newYear = this.state.year;
        
        if (nextMonth == 12) {
            nextMonth = 0;
            newYear = newYear + 1;
        }
        
        this.setState({
            month: nextMonth,
            header: monthNames[nextMonth],
            year: newYear
        });
    }
    
    prevMonth() {
        var prevMonth = this.state.month - 1;
        var newYear = this.state.year;
        
        if (prevMonth == -1) {
            prevMonth = 11;
            newYear = newYear - 1;
        }
        
        this.setState({
            month: prevMonth,
            header: monthNames[prevMonth],
            year: newYear
        });
    }

    render() {
        
        var divStyle = { backgroundImage: 'url(' + this.state.overlayImg + ')' };
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
                        <div className="hoverInfo">
                            <div className={this.state.avatarClass} style={divStyle}></div>
                            <p>{this.state.overlayDesc}</p>
                        </div>
                    </div>
                    </Popover>
                </Overlay>
                 
                <div className={this.state.color}>
                <Navbar />
                </div>            
                    
                <div className={this.state.color}>
                <div className={this.state.linkState}  onClick={this.openLinks}>
                   
                <h4 className="linkTab">Links</h4>
                    
                <div className="linkBox">
                
                    <p>ESO</p>
                    <ul>
                        <li><a href="http://www.elderscrollsonline.com/en-us/news" target="_blank">News</a></li>
                        <li><a href="https://forums.elderscrollsonline.com/en" target="_blank">Forum</a></li>
                    </ul>
                    <p>Smite</p>
                    <ul>
                        <li><a href="https://www.smitegame.com/" target="_blank">Main Site</a></li>
                        <li><a href="https://www.smitegame.com/category/patch-notes/" target="_blank">Patch Notes</a></li>
                        <li><a href="https://www.reddit.com/r/Smite/" target="_blank">Reddit</a></li>
                    </ul>
                </div>
                
                </div>
                        
                </div>
                                
                <a name="top"></a> 
                <div className={this.state.color}>
                <Intro />
                </div>
                
                <div className={this.state.color}>
                    <div className="colors">
                        <p>Choose a theme color: </p>
                        <select id="colorDrop" onChange={this.checkInputColor}>
                            <option value="0" >Color</option>
                            <option value="default" className="themeColorDef">Default Grey</option>
                            <option value="red" className="themeColor1">Mobile Red</option>
                            <option value="orange" className="themeColor2">PC Orange</option>
                            <option value="green" className="themeColor3">Xbox Green</option>
                            <option value="blue" className="themeColor4">Playstation Blue</option>
                        </select>
                    </div>
                </div>
                
                <div className={this.state.color}>
                <Features />
                </div>
                
                
                <a name="nu"></a> 
                
                <div className={this.state.color}>
                <GameSlider />
                </div>
                
                <a name="calendar"></a> 
                
                <div className={this.state.color}>
                <div className="monthInfo">
                    <h2>{this.state.header}</h2>
                    <Month month={this.state.month} switchHandler={this.switchEvent} nextHandler={this.nextMonth} prevHandler={this.prevMonth} />
                </div>
                    
                <EventCalendar month={this.state.month} year={this.state.year} events={this.state.list} onEventClick={this.onEventClick} onEventMouseOver={this.handleEventMouseOver} onEventMouseOut={this.handleEventMouseOut} />
                </div>
                
                <div className={this.state.color}>
                <Legend />
                </div>
                
                    <a name="stats"></a> 
                    <div className={this.state.color}>
                    <Tabs>
					<TabList>
                        <Tab>Upcoming Events</Tab>
						<Tab>Platform Distribution</Tab>
						<Tab>Event Summary</Tab>
					</TabList>
                    <TabPanel>
                            <div className="tabsIntro animated slideInLeft">
                                <a name="add"></a> 
                                <p className="eventsCount"><u>Your number of upcoming events is</u>: <strong>{this.state.total}</strong></p>
                            <p>Use the other tabs to find out the distribution of these upcoming events per platform as well as a summary list containing each.</p>
                            </div>
                    </TabPanel>
					<TabPanel>
						<Percentages />
					</TabPanel>
					<TabPanel>
						<Summary />
					</TabPanel>					
				</Tabs>
                </div>
                
                <div className={this.state.color}>
                <Addition events={this.state.list} addEventHandler={this.addEvent} />
                </div>
                
                <a name="favorites"></a> 
                
                <div className={this.state.color}>
                <Favorites />
                </div>
                    
                <div className={this.state.color}>
                    <div className="toDoOuter">
                        <a name="todos"></a> 
                        <h3>To Do Lists</h3>
                        <p>Keeping track of collectibles or items? Store your thoughts here.  Any entries with the same name will be checked at the same time (NOTE: See bugs log for to do list issues)  Check the priority box to add a red star to goals that take precedence.</p>
                        <div className="toDoLists">
                            <ToDo1 />
                            <ToDo2 />
                        </div>
                        </div>
                    </div>
                        
                  <a name="notes"></a>  
                  
                <div className={this.state.color}>
                <div className="notes">
                    <div className="ribbon-wrapper-color"><div className="ribbon-color">NEW</div></div>
                    <h3>Notes</h3>
                    <p>Need a place to store your thoughts?  Perhaps a reminder for a DLC or event that has no date yet?  Write it here!  Currently limited to 3 notes.</p>
                    <hr />
                    <Note1 />
                    <hr />
                    <Note2 />
                    <hr />
                    <Note3 />
                    </div>
                    </div>
                
                <div className={this.state.color}>
                <div className="smileLeg">
                        
                    <div className="smiley">
                        <Icon name="grinning" /><br />
                        <p>Excited</p>
                    </div>
                    <div className="smiley">
                        <Icon name="dying" /><br />
                        <p>Dying</p>
                    </div>
                    <div className="smiley">
                        <Icon name="heartEyes" /><br />
                        <p>Love</p>
                    </div>
                    <div className="smiley">
                        <Icon name="happy" /><br />
                        <p>Happy</p>
                    </div>
                    <div className="smiley">
                        <Icon name="relieved" /><br />
                        <p>Relieved</p>
                    </div>
                    <div className="smiley">
                        <Icon name="disheartened" /><br />
                        <p>Disheartened</p>
                    </div>
                    <div className="smiley">
                        <Icon name="tearDrop" /><br />
                        <p>Sad</p>
                    </div>
                    <div className="smiley">
                        <Icon name="angry" /><br />
                        <p>Angry</p>
                    </div>
                    <div className="smiley">
                        <Icon name="unhappy" /><br />
                        <p>Unhappy</p>
                    </div>
                    <div className="smiley">
                        <Icon name="devastated" /><br />
                        <p>Devastated</p>
                    </div>
                        
                </div>
                    </div>
                    
                <Reset />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));