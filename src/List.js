import React, {Component, PureComponent} from 'react';

import _ from 'underscore';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 0,
            left: 0,
            limit: 4,
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
    _onScroll = (e) => {
        if (e.target === e.currentTarget) {
            this._onScrollThrottle(e.target)
        }
    };
    _onScrollThrottle = _.throttle((target) => {
        if (!target) {
            return
        }
        const scrollTop = target.scrollTop;
        const {rowHeight} = this.props;
        const {top, limit} = this.state;
        const _top = Math.floor(scrollTop / rowHeight);
        if (Math.abs(_top - top) >= limit / 2) {
            this.setState({
                top: _top
            })
        }

    }, 40, {leading: false});

    renderHead() {
        const {width, widthLeft, widthRight} = this.props;
        return <div style={styles.head}>
            <div style={{width: widthLeft, float: 'left'}}>
                {this.props.renderHeadLeft()}
            </div>
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
            <div style={{width: widthRight, float: 'left'}}>
                {this.props.renderHeadRight()}
            </div>
        </div>
    }

    renderFoot() {
        const {width, widthLeft, widthRight} = this.props;
        return <div style={styles.head}>
            <div style={{width: widthLeft, float: 'left'}}>
                {this.props.renderFootLeft()}
            </div>
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
                        {this.props.renderFoot()}
                    </div>
                </div>
            </div>
            <div style={{width: widthRight, float: 'left'}}>
                {this.props.renderFootRight()}
            </div>
        </div>
    }

    renderBody() {
        const {rowCount, height, rowHeight, width, widthLeft, widthRight} = this.props;
        const {top, limit} = this.state;
        const rows = Math.ceil(height / rowHeight) + 2 * limit;
        const _top = Math.max(top - limit, 0);
        const ids = _.range(_top, Math.min(_top + rows, rowCount));
        return <div style={styles.body}
                    onScroll={this._onScroll}
        >
            <div className="list-back" style={{
                overflow: 'hidden',
                height: rowCount * rowHeight
            }}>
                <div style={{
                    transform: `translateY(${_top * rowHeight}px)`
                }}>
                    <div style={{float: 'left', width: widthLeft}}>
                        {_.map(ids, this.props.renderRowLeft)}
                    </div>
                    <div
                        style={{
                            float: 'left',
                            boxSizing: 'border-box',
                            overflowY: 'hidden',
                            overflowX: 'scroll',
                            width: `calc(100% - ${widthLeft + widthRight}px)`
                        }}
                        onScroll={this._onScrollXBody}
                        ref={(body) => this.scrollBudy = body}>
                        <div style={{width}}>
                            {_.map(ids, this.props.renderRow)}
                        </div>
                    </div>
                    <div style={{float: 'left', width: widthRight}}>
                        {_.map(ids, this.props.renderRowRight)}
                    </div>
                </div>
            </div>
        </div>;
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

const styles = {
    head: {
        overflowY: 'scroll'
    },
    body: {
        overflowX: 'hidden',
        flex: 1,
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
