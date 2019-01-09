import React, {Component,PureComponent} from 'react';
import './App.css'
import List from './List';
import _ from 'underscore';

const table={
    rowHeight: 40
};
class Line extends PureComponent {
    render() {
        const {i,n,text}=this.props;
        return <div style={{top:table.rowHeight*i}} className={"row" + (i%2 ? ' row-gray': '')} >
            {_.map(_.range(n),j=><div className='w100' key={j.toString()}>{text} {i} {j}</div>)}
        </div>

    }
}
class App extends Component {
    _renderLeft=()=><div  className="head">
        {_.map(_.range(3),j=><div className='w100' key={j.toString()}>шапка {j}</div>)}
        </div>;
    _render=()=><div  className="head">
        {_.map(_.range(10),j=><div className='w100' key={j.toString()}>шапка {j}</div>)}
        </div>;
    _renderRight=()=><div  className="head">
        {_.map(_.range(2),j=><div className='w100' key={j.toString()}>шапка {j}</div>)}
        </div>;
    _renderRow=i=><Line n={10} i={i} text='num' key={i.toString()}/>;
    _renderRowLeft=i=><Line n={3} i={i} text='fixL' key={i.toString()+'left'}/>;
    _renderRowRight=i=><Line n={2} i={i} text='fixR' key={i.toString()+'right'}/>;
    render() {
        return (
            <div className='App'>
                <List
                    className={'list'}
                    rowCount={1000}
                    height={600}
                    rowHeight={40}
                    widthLeft={300}
                    width={1000}
                    widthRight={200}
                    renderRowLeft={this._renderRowLeft}
                    renderRow={this._renderRow}
                    renderRowRight={this._renderRowRight}
                    renderHeadLeft={this._renderLeft}
                    renderHead={this._render}
                    renderHeadRight={this._renderRight}
                    renderFootLeft={this._renderLeft}
                    renderFoot={this._render}
                    renderFootRight={this._renderRight}
                />
            </div>
        );
    }
}


export default App;