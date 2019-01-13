import React, {PureComponent} from 'react';

import _ from 'underscore';

class ListBody extends PureComponent {
    constructor(props) {
        super(props);
        this._top = 0;
        this._fast = false;
        this._fastT = 0;
        this.state = {
            top: 0,
            left: 0,
            limit: 5,
            rows: 1,
        };
        this.scrollLeft = 0;
    }

    componentDidMount() {
        this.body.addEventListener('scroll', this._onScroll, {
            passive: true,
        });
        const {rowHeight} = this.props;
        const rows = this.pBody.offsetHeight / rowHeight+1;
        this.body.style.height = this.pBody.offsetHeight+'px';
        // this.st.innerText = _.map(_.range(rows), i => `#row-${i}`).join(',') + '{display:block;}';
        this.setState({rows});
    }

    _onScroll = (e) => {
        if (e.target === e.currentTarget) {
            const {rowHeight} = this.props;
            const {rows} = this.state;
            if(e.target.scrollTop <0){
                e.target.scrollTop=0
            }
            const top = Math.floor(Math.max(e.target.scrollTop,0) / rowHeight);
            if (top !== this._top) {
                const fastT = new Date();
                const deltaT = fastT - this._fastT;
                const fast = deltaT >500 ? false : Math.abs(this._top-top)/deltaT>0.04;
                this._fastT = fastT;
                this._top = top;
                if(fast!==this._fast){
                    this._fast=fast;
                    this.st2.innerText = fast
                    ?   '.list-body{position:static!important;} .list-back{pointer-events:none;}.row{position:static;}'
                    :'';
                }
                // this.st.innerText = _.map(_.range(rows), i => `#row-${top + i}`).join(',') + '{display:block;}';
                this._onScrollThrottle(top)

            }
        }
    };
    _onScrollThrottle = _.throttle((_top) => {
        const {limit, top} = this.state;
        const calcTop = Math.max(_top - limit, 0);
        if (calcTop !== top) {
            this.setState({
                top: calcTop
            })
        }

    },40,{leading: false});

    render() {
        const {
            width, styleBodyCenter,
            styleBodyBack, styleBodyleft, styleBodyRight,
            renderRowLeft, renderRow, renderRowRight
        } = this.props;
        const {top, limit, rows} = this.state;
        const ids = _.range(top, top + rows + 2 * limit);
        return (<div ref={pBody => this.pBody = pBody} style={styles.pBody}>
            <div className="list-body"  ref={body => this.body = body} style={styles.body}
            >
                <style ref={st => this.st = st}></style>
                <style ref={st2 => this.st2 = st2}></style>
                {/*<style ref={st2 => this.st2 = st2}>{'.row{position:static}'}</style>*/}
                <div className="list-back" style={styleBodyBack}>
                    {renderRowLeft && <div style={styleBodyleft}>
                        {_.map(ids, renderRowLeft)}
                    </div>}
                    <div
                        style={styleBodyCenter}
                        // onScroll={this._onScrollXBody}
                        ref={(body) => this.scrollBudy = body}>
                        <div style={{width, position: 'relative'}}>
                            {_.map(ids, renderRow)}
                        </div>
                    </div>
                    {renderRowRight && <div style={styleBodyRight}>
                        {_.map(ids, renderRowRight)}
                    </div>}
                </div>
            </div>
        </div>);
    }
}

class List extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            top: 0,
            left: 0,
            limit: 2,
        };
        this.scrollLeft = 0;
    }

    _onScrollXBody = (e) => {
        if (e.target === e.currentTarget) {
            this.scrollLeft = e.target.scrollLeft;
            this.scrollFootScroll.scrollLeft = this.scrollLeft;
            this.scrollHead.style.transform = `translateX(${-this.scrollLeft}px`;
            this.scrollFoot.style.transform = `translateX(${-this.scrollLeft}px`;
        }

    };
    _onScrollX = (e) => {
        this.scrollLeft = e.target.scrollLeft;
        this.scrollBudy.scrollLeft = this.scrollLeft;
        this.scrollHead.style.transform = `translateX(${-this.scrollLeft}px`;
        this.scrollFoot.style.transform = `translateX(${-this.scrollLeft}px`;
    };

    renderHead() {
        const {
            width, widthLeft, widthRight,
            renderHeadLeft, renderHeadRight
        } = this.props;
        return <div style={styles.head}>
            {renderHeadLeft && <div style={{width: widthLeft, float: 'left'}}>
                {renderHeadLeft()}
            </div>}
            <div style={{
                width: `calc(100% - ${widthLeft + widthRight}px)`,
                float: 'left',
                overflow: 'hidden'
            }}>
                <div ref={(head) => this.scrollHead = head}
                     style={{
                         transform: `translateX(${-this.scrollLeft}px)`
                     }}>
                    <div style={{width}}>
                        {this.props.renderHead()}
                    </div>
                </div>
            </div>
            {renderHeadRight && <div style={{width: widthRight, float: 'left'}}>
                {renderHeadRight()}
            </div>}
        </div>
    }

    renderFoot() {
        const {
            width, widthLeft, widthRight,
            renderFootLeft, renderFoot, renderFootRight
        } = this.props;
        return <div style={styles.head}>
            {renderFootLeft && <div style={{width: widthLeft, float: 'left'}}>
                {renderFootLeft()}
            </div>}
            <div style={{
                width: `calc(100% - ${widthLeft + widthRight}px)`,
                float: 'left',
                overflow: 'hidden'
            }}>
                <div ref={(foot) => this.scrollFoot = foot}
                     style={{
                         transform: `translateX(${-this.scrollLeft}px)`
                     }}>
                    <div style={{width}}>
                        {renderFoot()}
                    </div>
                </div>
            </div>
            {renderFootRight && <div style={{width: widthRight, float: 'left'}}>
                {renderFootRight()}
            </div>}
        </div>
    }

    renderBody() {
        const {
            height, rowCount, width, rowHeight, widthLeft, widthRight,
            renderRowLeft, renderRowRight, renderRow
        } = this.props;
        const scrollHeight = rowCount * rowHeight;
        // const rows = Math.ceil(height / rowHeight);
        const styleBodyBack = {
            overflow: 'hidden',
            height: scrollHeight
        };
        const styleBodyRight = {position: 'absolute', right: 0, height: scrollHeight, width: widthRight};
        const styleBodyCenter = {
            position: 'absolute',
            boxSizing: 'border-box',
            overflowY: 'hidden',
            overflowX: 'scroll',
            left: widthLeft,
            right: widthRight,
            height: scrollHeight,
            width: `auto`
        };
        const styleBodyleft = {position: 'absolute', left: 0, height: scrollHeight, width: widthLeft};
        return <ListBody
            {...{
                rowCount, width, styleBodyCenter,
                rowHeight,
                styleBodyBack, styleBodyleft, styleBodyRight,
                renderRowLeft, renderRowRight, renderRow
            }}
        />
    }

    render() {
        const {height, className, width, widthLeft, widthRight} = this.props;
        return (
            <div className={className} style={{display: 'flex', flexDirection: 'column', height}}>
                {this.renderHead()}
                {this.renderBody()}
                {this.renderFoot()}
                <div
                    ref={(foot) => this.scrollFootScroll = foot}
                    onScroll={this._onScrollX}
                    style={styles.scrollX}>
                    <div
                        style={{
                            height: 1,
                            width: width,
                            paddingLeft: widthLeft + widthRight
                        }}></div>
                </div>
            </div>
        );
    }
}

List.defaultProps = {
    widthLeft: 0,
    widthRight: 0,
};
const styles = {
    head: {
        overflowY: 'scroll'
    },
    pBody: {
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
    },
    body: {
        overflowX: 'hidden',
        position: 'relative',
        // willChange: 'transform',
        overflowY: 'scroll'
    },
    group: {
        float: 'left'
    },
    scrollX: {
        float: 'left',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'scroll',

    }
};

export default List;
