import React, { Component } from 'react';

import 'semantic-ui-css/semantic.min.css';

import logo from './logo.svg';
import './App.css';

import agenda from './data/agenda.json';
//import conference from './data/conference.json';
import meeting from './data/meeting.json';
//import news from './data/news.json';
//import people from './data/people.json';
import proposal from './data/proposal.json';
//import question from './data/question.json';
//import reference from './data/reference.json';
//import subject from './data/subject.json';
import team from './data/team.json';
import topic from './data/topic.json';

class App extends Component {

  constructor (props) {

    super(props)

    this.state = {
      teamfilter: 'all',
      statusfilter: 'all',
      pagefilter: '1'
    }

    this._filter = this._filter.bind(this)

  }

  componentWillMount () {

    this._staticData = {}

    this._staticData.about = [
      {
        url: 'https://etblue.github.io/jrpilot/',
        icon: 'globe',
        text: '範例'
      },
      {
        url: 'https://github.com/ETBlue/jrpilot',
        icon: 'github',
        text: '程式碼'
      },
      {
        url: 'https://docs.google.com/spreadsheets/d/1CTGZfJ55WJQEq6UexllrXZJvceVP3TRjzNGMgxE-I68/edit?usp=sharing',
        icon: 'table',
        text: '資料'
      },
      {
        url: 'https://docs.google.com/presentation/d/18QjhH784zyxAxGue7LKMwafGSZ1tqdc1tGSa_ZBTeOU/edit?usp=sharing',
        icon: 'tv',
        text: '實驗步驟'
      },
      {
        url: 'https://www.facebook.com/ETBlue/media_set?set=a.10210724638284792.1073741872.1014354995&type=3',
        icon: 'photo',
        text: '過程紀錄'
      }
    ]

    this._staticData.topicObject = {}
    topic.forEach((item, index) => {
      this._staticData.topicObject[item.id] = item
    })

    this._staticData.teamObject = {}
    team.forEach((item, index) => {
      this._staticData.teamObject[item.id] = item
    })

    this._staticData.agendaObject = {}
    agenda.forEach((item, index) => {
      this._staticData.agendaObject[item.id] = item
    })

    this._staticData.meetingObject = {}
    meeting.forEach((item, index) => {
      this._staticData.meetingObject[item.id] = item
    })

    this._staticData.menuCount = {
      'all': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    }

    this._staticData.statusCount = {}
    Object.keys(this._staticData.menuCount).forEach((key) => {
      this._staticData.statusCount[key] = {
        'all': {
          name: '所有狀態',
          count: 0,
          color: 'black',
          proposalIDs: []
        },
        'revoked': {
          name: '已撤案',
          count: 0,
          color: 'red',
          proposalIDs: []
        },
        'others': {
          name: '放置 play',
          count: 0,
          color: '',
          proposalIDs: []
        },
        'failed': {
          name: '不通過',
          count: 0,
          color: 'red',
          proposalIDs: []
        },
        'passed': {
          name: '通過',
          count: 0,
          color: 'green',
          proposalIDs: []
        }
      }
    })

    this._staticData.proposalData = proposal.map((item, index) => {

      item.teamID = item._team.toString()

      item.statusID = ''
      if (item.voting === 'passed' || item.voting === 'failed') {
        item.statusID = item.voting
      } else if (item.proposal === 'revoked') {
        item.statusID = item.proposal
      } else {
        item.statusID = 'others'
      }

      item.statusColor = ''
      if (item.statusID === 'revoked' || item.statusID === 'failed') {
        item.statusColor = 'red'
      } else if (item.statusID === 'passed') {
        item.statusColor = 'green'
      }

      if ( item.teamID.length > 0 && this._staticData.teamObject[item.teamID] ) {
        this._staticData.menuCount[item.teamID] += 1
      }
      this._staticData.menuCount.all += 1

      this._staticData.statusCount[item.teamID][item.statusID].proposalIDs.push(index)
      this._staticData.statusCount[item.teamID].all.proposalIDs.push(index)
      this._staticData.statusCount.all[item.statusID].proposalIDs.push(index)
      this._staticData.statusCount.all.all.proposalIDs.push(index)

      item.processClassNames = {
        proposal: item.proposal === 'passed' ? 'completed' : ( item.proposal === 'revoked' ? 'failed' : 'disabled' ) ,
        discussion: item.discussion === 'done' ? 'completed' : ( item.proposal === 'null' ? 'failed' : 'disabled' ) ,
        vote4voting: item.vote4voting === 'passed' ? 'completed' : ( item.vote4voting === 'failed' ? 'failed' : 'disabled' ) ,
        voting: item.voting === 'passed' ? 'completed' : ( item.voting === 'failed' ? 'failed' : 'disabled' )
      }

      item.processDescriptions = {
        proposal: item.proposal === 'passed' ? '已通過' : ( item.proposal === 'revoked' ? '已撤銷' : '狀態不明' ) ,
        discussion: item.discussion === 'done' ? '已討論' : ( item.proposal === 'null' ? '未討論' : ( item.proposal === 'n/a' ? '不適用' : '狀態不明') ) ,
        vote4voting: item.vote4voting === 'passed' ? '已通過' : ( item.vote4voting === 'failed' ? '已否決' : '不適用' ) ,
        voting: item.voting === 'passed' ? '已通過' : ( item.voting === 'failed' ? '已否決' : '狀態不明' )
      }

      return item

    })


  }

  _filter(event) {

    const teamfilter = event.target.getAttribute('data-teamfilter')
    const statusfilter = event.target.getAttribute('data-statusfilter')

    this.setState((prevState, props) => {
      prevState = {
        teamfilter: teamfilter || prevState.teamfilter ,
        statusfilter: statusfilter || prevState.statusfilter
      }
      return prevState
    })

  }

  render() {

    const {
      about,
      topicObject, 
      teamObject, 
      agendaObject, 
      meetingObject,
      menuCount,
      statusCount,
      proposalData
    } = this._staticData

    const aboutJSX = about.map((item, index) => {
      return (
        <a key={index} className='item' target='_blank' href={item.url}>
          <i className={`icon ${item.icon}`} />
          <span className='content'>
          {item.text}
          </span>
        </a>
      )
    })

    const menuJSX = Object.keys(menuCount).map((itemID, index) => {
      return (
        <div className={`item ${this.state.teamfilter === itemID ? 'active' : ''}`} key={index} data-teamfilter={ itemID } style={{cursor: 'pointer'}} onClick={this._filter}>
          { teamObject[itemID] ? teamObject[itemID].name : '所有組別' }
          <span className={`ui horizontal label ${this.state.teamfilter === itemID ? 'black' : ''}`} data-teamfilter={ itemID }>
            { menuCount[itemID] }
          </span>
        </div>
      )
    })

    const submenuJSX = Object.keys(statusCount[this.state.teamfilter]).map((key) => {
      return (
        <div className={`item ${this.state.statusfilter === key ? 'active' : ''}`} key={key} data-statusfilter={ key } style={{cursor: 'pointer'}} onClick={this._filter}>
          { statusCount[this.state.teamfilter][key].name }
          <span className={`ui horizontal ${statusCount[this.state.teamfilter][key].color} label`} data-statusfilter={ key }>
            { statusCount[this.state.teamfilter][key].proposalIDs.length }
          </span>
        </div>
      )
    })

    const proposalJSX = statusCount[this.state.teamfilter][this.state.statusfilter].proposalIDs.map((proposalID, index) => {

      const item = proposalData[proposalID]

      const {
        teamID, 
        statusID, 
        processClassNames, 
        processDescriptions,
        statusColor
      } = item

      let teamJSX
      if ( teamID.length > 0 && teamObject[teamID] ) {
        teamJSX = (
          <a className='ui horizontal teal label' style={{textAlign: 'left'}} href={teamObject[teamID].url} target='_blank'>
            <i className='icon linkify' />
            { teamObject[teamID].name }
          </a>
        )
      } 

      const topicJSX = item._topic.split('、').map((t, i) => {
        if (t.length > 0 && topicObject[t]) {
          return (
            <span className='ui horizontal label' key={i} style={{textAlign: 'left'}}>
              議題 { t }　{ topicObject[t].name }
            </span>
          )
        }
      })

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
                    <a className='ui horizontal teal label' href={ meetingObject[agendaObject[a]._meeting].url } target='_blank'>
                      <i className='icon linkify' />
                      會議 { agendaObject[a]._meeting }
                    </a>
                    <span className='ui horizontal label'>
                      討論 { a }
                    </span>
                  </p>
                </div>
              </div>
            )
          }
        })
      }

      return (
        <div className='ui segments' key={ index }>
          <div className={`ui ${statusColor} segment`}>
            <h2 className='ui medium header'>
              { item.content_proposal }
            </h2>
          </div>
          <div className={`ui left aligned segment`} style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
            <div className='ui fluid steps'>
              <div className={`step ${processClassNames.proposal}`}>
                <i className='icon text file outline' />
                <div className='content'>
                  <div className='title'>
                    提案
                  </div>
                  <div className='description'>
                    { processDescriptions.proposal }
                  </div>
                </div>
              </div>
              <div className={`step ${processClassNames.discussion}`}>
                <i className='icon comments outline' />
                <div className='content'>
                  <div className='title'>
                    討論
                  </div>
                  <div className='description'>
                    { processDescriptions.discussion }
                  </div>
                </div>
              </div>
              <div className={`step ${processClassNames.vote4voting}`}>
                <i className='icon hand rock' />
                <div className='content'>
                  <div className='title'>
                    程序表決
                  </div>
                  <div className='description'>
                    { processDescriptions.vote4voting }
                  </div>
                </div>
              </div>
              <div className={`step ${processClassNames.voting}`}>
                <i className='icon hand paper' />
                <div className='content'>
                  <div className='title'>
                    內容表決
                  </div>
                  <div className='description'>
                    { processDescriptions.voting }
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
              { topicJSX }
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
              一個 open data 結合公民審議的小實驗，以 2017 總統府司法改革國是會議為例，從上游的資料內容產生、到下游的衍生應用開發，藉由走過整個生產鏈，探索 open data 從理論到實做的過程中可能的瓶頸。本網頁《司改國是 2017 - 提案闖天關》是下游衍生應用的範例，未來的公民審議如果有從上游做結構化資料，那麼除了類似本頁的議題履歷之外，還可以發展出更多不同類型的有趣的衍生應用。詳細的實驗心得會另外寫在部落格（還沒寫 XD）
            </p>
            <div className='ui inverted horizontal link list'>
              { aboutJSX }
            </div>
            <hr className='ui hidden divider' />
          </div>
        </div>
        <div className='ui container'>
          <div className='ui six item secondary pointing menu'>
            { menuJSX }
          </div>
          <div className='ui five item secondary menu'>
            { submenuJSX }
          </div>
          { proposalJSX }
        </div>
        <hr className='ui hidden divider' />
      </div>
    );
  }
}

export default App;
