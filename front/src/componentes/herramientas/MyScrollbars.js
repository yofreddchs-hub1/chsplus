import React, { Component } from 'react';
import { Scrollbars} from 'rc-scrollbars';


export default class MyScrollbars extends Component {  

  constructor(props) {
    super(props); 
    this.scrollbars = React.createRef(); 
    this.state = {
      props: this.props,
      scrollbars: this.scrollbars
    } 
    this.renderView = this.renderView.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
    this.renderTrack = this.renderTrack.bind(this);    
  }
  
  componentDidMount() {
    const {fin} = this.props;
    if (fin)
      this.scrollbars.current.scrollToBottom()

  };
  static getDerivedStateFromProps(props, state) {

    if (props !== state.props) {
      const {fin} = props;
      if (fin)
        state.scrollbars.current.scrollToBottom()
      return {
        props
      };
    }
    // No state update necessary
    return null;
  }
/*
  componentWillUnmount() {
    this.springSystem.deregisterSpring(this.spring);
    this.springSystem.removeAllListeners();
    this.springSystem = undefined;
    this.spring.destroy();
    this.spring = undefined;
  };*/

  renderView = ({ style, ...props }) => {
    const viewStyle = this.props.Bodystyle ? this.props.Bodystyle : {
      padding: 5,
      paddingTop: 0,
      paddingRight: 10
      // backgroundColor: `rgb(255, 255, 255)`,           
    };    
    return <div className="box" style={{ ...style, ...viewStyle }} {...props}/>;
  };
   renderThumb = ({ style, ...props }) => {    
    const thumbStyle = this.props.Thumbstyle ? this.props.Thumbstyle :  {
      backgroundColor: `#D0C6C6`,       
      borderRadius: 'inherit',
    };
    return <div style={{ ...style, ...thumbStyle,  }} {...props} />;
  };
   renderTrack = ({ style, ...props}) =>{
    const trackStyle = this.props.Pistastyles ? this.props.Pistastyles : {
      // backgroundColor: `rgb(255, 255, 255)`,      
  };
      return <div style={{ ...style, ...trackStyle }} {...props} />;
  };

  render() {
    return (
      <Scrollbars
        ref={this.scrollbars}            
        renderView={this.renderView}        
        renderThumbVertical={this.renderThumb}         
        renderThumbHorizontal={this.renderThumb}  
        hideTracksWhenNotNeeded      
        renderTrackVertical={this.renderTrack} 
        renderTrackHorizontal={this.renderTrack}          
        {...this.props}
        
      />
    );
  }
}