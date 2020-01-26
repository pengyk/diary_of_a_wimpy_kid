import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Modal,
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Form,
  TextArea,
  Loader
} from "semantic-ui-react";
import "./App.css";
import firebase from "./firebase";
import tempImg from "./img_avatar.png";
import SpotifyPlayer from "react-spotify-player";

const uuidv1 = require("uuid/v1");

const size = {
  width: "60%",
  height: 250
};

const view = "list";
const theme = "white";

// size may also be a plain string using the presets 'large' or 'compact'
// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
  const isSSR = typeof window === "undefined";

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

 

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <div
      className="logo-container"
      style={{
        marginTop: mobile ? "1.5em" : "3em"
      }}
    >
      <Image src="/logo-flat.png" size="medium" />
      <Header
        as="h1"
        content="MindBook"
        inverted
        style={{
          fontSize: mobile ? "2em" : "4em",
          fontWeight: "normal"
        }}
      />
    </div>
    <Header
      as="h2"
      content="Let your words speak for you"
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: mobile ? "0.5em" : "1.5em"
      }}
    />
    <Button primary size="huge" a href="#newEntry">
      Enter today's diary entry
      <Icon name="right arrow" />
    </Button>
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool
};

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 700, padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item position="right">
                  <Menu.Item a href="#newEntry">
                    New Entry
                  </Menu.Item>
                  <Menu.Item a href="#logs">
                    Logs
                  </Menu.Item>
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation="push"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item as="a" active>
            Home
          </Menu.Item>
          <Menu.Item as="a">Work</Menu.Item>
          <Menu.Item as="a">Company</Menu.Item>
          <Menu.Item as="a">Careers</Menu.Item>
          <Menu.Item as="a">New Entry</Menu.Item>
          <Menu.Item as="a">Sign Up</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 350, padding: "1em 0em" }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size="large">
                <Menu.Item position="right" a href="#newEntry">
                  New Entry
                </Menu.Item>

                <Menu.Item a href="#logs">
                  Logs
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      uuid: "",
      time: new Date().toLocaleString(),
      text: "",
      items: [],
      moods: "",
      prevUuid: "",
      modalDisplay: false,
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  getTime = () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading) {
      setTimeout(()=>{
        this.setState({loading: false})
      },3000)
    }

  }

  componentDidMount() {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    this.setState({ time: dateTime });
    console.log("var" + dateTime);
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          time: items[item].time,
          text: items[item].text,
          moods: items[item].moods
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleTime = event => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    this.setState({ time: dateTime });
    console.log("var" + dateTime);
  };

  musicPlayer = mood => {
    switch (mood) {
      case "Joy":
        return (
          <SpotifyPlayer
            uri="spotify:playlist:37i9dQZF1DXdPec7aLTmlC"
            size={size}
            view={view}
            theme={theme}
          />
        );
      case "Fear":
        return (
          <SpotifyPlayer
            uri="spotify:album:2dqn5yOQWdyGwOpOIi9O4x"
            size={size}
            view={view}
            theme={theme}
          />
        );
      case "Anger":
        return (
          <SpotifyPlayer
            uri="spotify:playlist:37i9dQZF1DX4WYpdgoIcn6"
            size={size}
            view={view}
            theme={theme}
          />
        );
      case "Sadness":
        return (
          <SpotifyPlayer
            uri="spotify:playlist:37i9dQZF1DX7qK8ma5wgG1"
            size={size}
            view={view}
            theme={theme}
          />
        );
      case "Analytical":
        return (
          <SpotifyPlayer
            uri="spotify:playlist:37i9dQZF1DWWEJlAGA9gs0"
            size={size}
            view={view}
            theme={theme}
          />
        );
      case "Confident":
        return (
          <SpotifyPlayer
            uri="spotify:playlist:37i9dQZF1DX1tyCD9QhIWF"
            size={size}
            view={view}
            theme={theme}
          />
        );
      case "Tentative":
        return (
          <SpotifyPlayer
            uri="spotify:playlist:37i9dQZF1DX1gRalH1mWrP"
            size={size}
            view={view}
            theme={theme}
          />
        );
    }
  };

  switchColors = mood => {
    switch (mood) {
      case "Anger" :
        return(
      <Image avatar style = {{backgroundColor: "red"}}/>);
      case "Fear" :
        return(
      <Image avatar style = {{backgroundColor: "black"}}/>);
      case "Joy" :
        return(
      <Image avatar style = {{backgroundColor: "yellow"}}/>);
      case "Sadness" :
        return(
      <Image avatar style = {{backgroundColor: "blue"}}/>);
      case "Tentative" :
        return(
      <Image avatar style = {{backgroundColor: "purple"}}/>);
      case "Confident" :
        return(
      <Image avatar style = {{backgroundColor: "green"}}/>);
      case "Analytical" :
        return(
      <Image avatar style = {{backgroundColor: "orange"}}/>);
      default:
        return(
          <Image avatar style = {{backgroundColor: "white", border: "white", borderSize: "5px"}}/>);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");

    const item = {
      uuid: this.state.uuid,
      time: this.state.time,
      text: this.state.text,
      moods: this.state.moods
    };
    itemsRef.push(item);
    fetch(
      `/api/greeting?uuid=${encodeURIComponent(
        this.state.uuid
      )}&text=${encodeURIComponent(this.state.text)}`
    ).then(response => console.log(response)); //response.json()
    this.setState({
      prevUuid: this.state.uuid,
      uuid: uuidv1(),
      text: "",
      time: new Date().toLocaleString()
    });
    this.setState({
      loading: true
    })
    // this.popUp();
  };

  // popUp = () => {
  //   if(this.state.items.find(item => item.uuid === this.state.prevUuid){
  //     return(
  //       <div>

  //       </div>
  //     )
  //   }
  // }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: "8em 0em 3em 0em" }} vertical id="newEntry">

          {/* <Dimmer active={this.state.loading}> */}
            <Loader active = {this.state.loading}/>
            <div className="music-player-container">
              <Header style={{fontSize: 30}}>
                What's on your mind right now?
              </Header>
            </div>
            <div className="paddingText">
              <Form>
                <TextArea
                  rows={16}
                  placeholder="Spill your heart out..."
                  style={{ minHeight: 200 }}
                  value={this.state.text}
                  onChange={this.handleChange}
                />
              </Form>
            </div>
  
            <Grid container stackable verticalAlign="middle">
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Button size="huge" onClick={this.handleSubmit}>
                    Submit daily entry
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          {/* </Dimmer> */}
        </Segment>

        <Segment style={{ padding: "0em" }} vertical id="logs">
          <Grid celled="internally" columns="equal" stackable>
            <Grid.Row textAlign="center">
              <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
                <List animated>
                  {this.state.items.map(item => {
                    return (
                      // <div className="entry-container">
                        <List.Item key={item.id}>
                          {this.switchColors(item.moods)}
                          <List.Content>
                            <List.Header>{item.time}</List.Header>
                            <List.Description>
                              Mood found: {item.moods}
                            </List.Description>
                            <br />
                            <Modal trigger={<Button>Show details</Button>}>
                              <Modal.Header>
                                <div className="modal-header-container">
                                  <div>Entry</div>{" "}
                                  <div>written on: {item.time}</div>
                                </div>
                              </Modal.Header>
                              <Modal.Content>
                                <Modal.Description>
                                  <Header>
                                    {" "}
                                    Mood on this day: {item.moods}{" "}
                                  </Header>
                                </Modal.Description>
                              </Modal.Content>
  
                              <Modal.Content image scrolling>
                                <Modal.Description>
                                  <Header>Details</Header>
                                  <p>{item.text}</p>
                                  <Header>Here are some songs you may like</Header>
                                  <div className="music-player-container">
                                    {this.musicPlayer(item.moods)}
                                  </div>
                                </Modal.Description>
                              </Modal.Content>
                              <Modal.Actions></Modal.Actions>
                            </Modal>
  
                            <Button onClick={() => this.removeItem(item.id)}>
                              Remove Item
                            </Button>
                          </List.Content>
                          <br />
                        </List.Item>
                      // </div>
                    );
                  })}
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment inverted vertical style={{ padding: "5em 0em" }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as="h4" content="Members" />
                  <List link inverted>
                    <List.Item as="a">Hong Kun, Tian</List.Item>
                    <List.Item as="a">Jia Rong, Shao</List.Item>
                    <List.Item as="a">Yun Kai, Peng</List.Item>
                    <List.Item as="a">Made w/ ❤️at ConUHacks V</List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </ResponsiveContainer>
    );
  }
}

export default App;
