import React, { Component } from 'react';

import 'semantic-ui-css/semantic.min.css';

import logo from './logo.svg';
import './App.css';

import agenda from './data/agenda.json';
import conference from './data/conference.json';
import meeting from './data/meeting.json';
import news from './data/news.json';
import people from './data/people.json';
import proposal from './data/proposal.json';
import question from './data/question.json';
import reference from './data/reference.json';
import subject from './data/subject.json';
import team from './data/team.json';
import topic from './data/topic.json';

class App extends Component {

  constructor (props) {

    super(props)

    this.state = {
    }

  }

  render() {

    let topicObject = {}

    topic.forEach((item, index) => {
      topicObject[item.id] = item
    })

    let teamObject = {}

    team.forEach((item, index) => {
      teamObject[item.id] = item
    })

    let agendaObject = {}

    agenda.forEach((item, index) => {
      agendaObject[item.id] = item
    })

    const menuJSX = team.map((item, index) => {
      return (
        <div className="item" key={index}>
          { item.name }
        </div>
      )
    })

    const proposalJSX = proposal.map((item, index) => {

      const classNames = {
        proposal: item.proposal === 'passed' ? 'completed' : ( item.proposal === 'revoked' ? 'failed' : 'disabled' ) ,
        discussion: item.discussion === 'done' ? 'completed' : ( item.proposal === 'null' ? 'failed' : 'disabled' ) ,
        vote4voting: item.vote4voting === 'passed' ? 'completed' : ( item.vote4voting === 'failed' ? 'failed' : 'disabled' ) ,
        voting: item.voting === 'passed' ? 'completed' : ( item.voting === 'failed' ? 'failed' : 'disabled' )
      }

      const description = {
        proposal: item.proposal === 'passed' ? '已通過' : ( item.proposal === 'revoked' ? '已撤銷' : '狀態不明' ) ,
        discussion: item.discussion === 'done' ? '已討論' : ( item.proposal === 'null' ? '未討論' : ( item.proposal === 'n/a' ? '不適用' : '狀態不明') ) ,
        vote4voting: item.vote4voting === 'passed' ? '已通過' : ( item.vote4voting === 'failed' ? '已否決' : '不適用' ) ,
        voting: item.voting === 'passed' ? '已通過' : ( item.voting === 'failed' ? '已否決' : '狀態不明' )
      }

      const metaJSX = item._topic.split('、').map((t, i) => {
        if (t.length > 0 && topicObject[t]) {
          return (
            <span className='ui horizontal label' key={i} style={{textAlign: 'left'}}>
              議題 { t }　{ topicObject[t].name }
            </span>
          )
        }
      })

      let teamJSX
      if ( item._team.toString().length > 0 && teamObject[item._team] ) {
        teamJSX = (
          <span className='ui horizontal label' style={{textAlign: 'left'}}>
            { teamObject[item._team].name }
          </span>
        )
      } 

      let agendaJSX
      if (topicObject[item._topic]) {
        agendaJSX = topicObject[item._topic]._agenda.split('、').map((a, i) => {
          if (agendaObject[a]) {
            return (
              <div className='item' key={i}>
                <i className='icon comments outline' />
                <div className='content'>
                  <p>
                    { agendaObject[a].name }
                  </p>
                  <p>
                    <span className='ui tiny horizontal basic label'>
                      會議 { agendaObject[a]._meeting }
                    </span>
                    <span className='ui tiny horizontal basic label'>
                      討論 { a }
                    </span>
                  </p>
                </div>
              </div>
            )
          }
        })
      }

      let status
      if (item.proposal === 'revoked' || item.voting === 'failed') {
        status = 'red'
      } else if (item.voting === 'passed') {
        status = 'green'
      }

      return (
        <div className='ui segments' key={ index }>
          <div className={`ui ${status} segment`}>
            <h2 className='ui medium header'>
              { item.content_proposal }
            </h2>
          </div>
          <div className={`ui left aligned segment`} style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
            <div className='ui fluid steps'>
              <div className={`step ${classNames.proposal}`}>
                <i className='icon text file outline' />
                <div className='content'>
                  <div className='title'>
                    提案
                  </div>
                  <div className='description'>
                    { description.proposal }
                  </div>
                </div>
              </div>
              <div className={`step ${classNames.discussion}`}>
                <i className='icon comments outline' />
                <div className='content'>
                  <div className='title'>
                    討論
                  </div>
                  <div className='description'>
                    { description.discussion }
                  </div>
                </div>
              </div>
              <div className={`step ${classNames.vote4voting}`}>
                <i className='icon hand rock' />
                <div className='content'>
                  <div className='title'>
                    程序表決
                  </div>
                  <div className='description'>
                    { description.vote4voting }
                  </div>
                </div>
              </div>
              <div className={`step ${classNames.voting}`}>
                <i className='icon hand paper' />
                <div className='content'>
                  <div className='title'>
                    內容表決
                  </div>
                  <div className='description'>
                    { description.voting }
                  </div>
                </div>
              </div>
            </div>
            <h3 className='ui small header'>
              相關組別與議題
            </h3>
            <div className='ui relaxed divided list'>
              <div className='item'>
              { teamJSX }
              { metaJSX }
              </div>
            </div>
            <h3 className='ui small header'>
              相關會議內容
            </h3>
            <div className='ui relaxed divided list'>
              { agendaJSX }
            </div>
          </div>
        </div>
      )
    })

    return (
      <div className='App'>
        <div className='App-header ui basic inverted segment'>
          <div className='ui container'>
              <img src={logo} className='App-logo' alt='logo' />
            <h1 className='ui inverted header'>
              司改國是 2017
              -
              提案闖天關
            </h1>
            <p className='App-intro'>
              An open data experiment trying to find out an operative way from the beginning of data input to the end of web services, taking Taiwan's National Affairs Conference on Judicial Reform (2017) as example.
            </p>
            <hr className='ui hidden divider' />
          </div>
        </div>
        <div className='ui container'>
          <div className='ui pagination menu'>
            { menuJSX }
          </div>
          { proposalJSX }
        </div>
      </div>
    );
  }
}

export default App;
